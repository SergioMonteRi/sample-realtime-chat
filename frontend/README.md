# Sala — front-end

Interface de conversas diretas sobre a API Flask deste repositório (`../backend`).
Construída com **React 19 + Vite + TypeScript**, seguindo o
[guia de engenharia](./docs/frontend-guide.md).

> **Escopo desta fase:** apenas REST. Não há Socket.IO, WebSocket nem qualquer
> mecanismo de tempo real — a arquitetura foi preparada para recebê-lo depois
> (ver [Onde o tempo real entra](#onde-o-tempo-real-entra)).

---

## Como rodar

```bash
cp .env.example .env   # já vem apontando para o proxy do Vite
npm install
npm run dev            # http://localhost:5173
```

Com o backend no ar em `http://localhost:5001`.

| Script               | O que faz                      |
| -------------------- | ------------------------------ |
| `npm run dev`        | servidor de desenvolvimento    |
| `npm run build`      | type-check + build de produção |
| `npm run lint`       | ESLint (Prettier como regra)   |
| `npm run type-check` | apenas o TypeScript            |
| `npm run format`     | Prettier em `src`              |

---

## Decisões que o backend impôs

O contrato atual tem três lacunas que moldaram a arquitetura. Todas estão
resolvidas no front sem gambiarra, e todas somem sozinhas se o backend crescer.

**1. Não existe `GET /auth/me`.**
O login responde só `{ "message": ... }` e a sessão vive em um cookie httpOnly
do flask-login, invisível para o JavaScript. Então o front guarda apenas o
e-mail digitado (`services/auth/auth.session.ts`) para exibir na interface — a
autorização continua inteiramente do lado do servidor, e qualquer `401` limpa
essa identidade local (`providers/auth-provider`).

**2. Não se sabe o próprio `user_id`.**
Sem ele, não dá para comparar `sender_id` e decidir o lado do balão. Como um
chat aqui tem exatamente dois participantes, a regra vira _"quem não é o
contato sou eu"_ — `isOutgoingMessage(message, peerId)` em
`services/messages/message.utils.ts`.

**3. Não existe `GET /chats`.**
A lista de conversas é a lista de contatos (`GET /users`, que já exclui o
usuário logado). O id do chat é resolvido pelo `POST /chat`, que é idempotente
por contrato — o `ChatService.create_chat` devolve a conversa existente quando
ela já existe. Por se comportar como leitura, ele cabe em uma query
(`chatQueries.withUser`), o que mantém a resolução fora de `useEffect` e faz o
link `/conversas/:userId` abrir direto.

**O cookie de sessão exige dois cuidados.**
O axios chama o Flask direto (`VITE_API_BASE_URL`) com `withCredentials`. Para
o navegador aceitar e reenviar o cookie do flask-login:

- o backend precisa liberar a origem **com credenciais** —
  `CORS(app, origins=["http://localhost:5173"], supports_credentials=True)`.
  Sem `supports_credentials`, o login responde `200` e o cookie é descartado;
- a URL deve usar `localhost:5001`, e não `127.0.0.1:5001`. O cookie nasce
  `SameSite=Lax`, que trava em requisições cross-site: porta diferente é o
  mesmo site, host diferente não é.

---

## Onde o tempo real entra

O caminho está pronto e documentado em `src/services/realtime/`:

- `realtime.contract.ts` — nomes dos eventos do backend e a interface
  `RealtimeGateway`, a única fronteira que a aplicação enxerga do canal;
- `realtime-gateway.ts` — implementação inerte (null object) e
  `setRealtimeGateway()`, o ponto de troca;
- `services/messages/message.cache.ts` — `applyIncomingMessage()`, que escreve
  uma mensagem na mesma `queryKey` que a tela já observa.

Integrar é: instalar `socket.io-client`, implementar o gateway, chamá-lo no
bootstrap e ligar o evento `new-message` a `applyIncomingMessage`. Nenhum
componente muda, porque nenhum componente fala com o socket.

Enquanto isso, o histórico é revalidado ao voltar o foco para a janela e pelo
botão de atualizar do cabeçalho da conversa. Não há polling em segundo plano —
esse é exatamente o buraco que o canal preenche.

---

## Estrutura

```
src/
  components/        atoms · molecules · organisms (cada um com index.tsx + styles.ts + hook)
  config/            leitura tipada das variáveis de ambiente
  constants/         rotas, chaves de storage, limites, regex
  i18n/              pt-BR e en-US (common · auth · chat · errors)
  pages/             auth/login · auth/register · chat · not-found
  providers/         query client, tema, i18n, sessão, toasts
  routes/            rotas + guardas de sessão
  services/          http · auth · users · chats · messages · realtime
  styles/            tema, global, mixins, animações
  utils/             data, string, storage
```

Cada domínio de `services` segue o mesmo desenho: `*.schemas.ts` (Zod valida a
resposta na fronteira e converte snake_case em camelCase), `*.types.ts`
(inferidos do schema), `*.service.ts` (só axios), `*.queries.ts` /
`*.mutations.ts` (`queryOptions` / `mutationOptions` com fábrica de chaves) e um
hook fino por operação — o que a UI importa.

Feedback de erro é centralizado no `QueryClient`: cada chamada declara
`meta.errorMessageKey` e o toast acontece em um lugar só. As telas de login e
cadastro não declaram `meta` porque mostram o erro dentro do próprio cartão.

O envio de mensagem usa **optimistic update**: o balão aparece no mesmo frame do
clique marcado como "enviando", é trocado pela mensagem do servidor quando ela
volta e, se a chamada falhar, some — com o texto devolvido ao campo.
