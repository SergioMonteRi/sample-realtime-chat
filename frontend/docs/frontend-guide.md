# 📘 Front-End Engineering Guide

## React / React Native

------------------------------------------------------------------------

# 1. Estrutura de Componentes

Todo componente deve respeitar separação clara de responsabilidades
(Separation of Concerns).

## 1.1 Estrutura Base

Todo componente deve ser obrigatoriamente dividido em **3 arquivos separados**:

- **`index.tsx`** — UI (Renderização)
- **`use-<nome>.ts`** — Hook customizado (Lógica — quando necessário)
- **`styles.ts`** — Styles

Estilos **nunca** devem residir no mesmo arquivo da UI. Mesmo que o componente seja simples, o arquivo de styles deve ser separado.

### Estrutura de Pastas

```
home-card/
  index.tsx           # UI
  use-home-card.ts    # Hook customizado
  styles.ts           # Estilos
```

O arquivo principal do componente é sempre `index.tsx`. O nome da pasta deve estar em **kebab-case** e representar o nome do componente.

------------------------------------------------------------------------

## 1.2 UI (Camada de Apresentação)

Responsável exclusivamente por:

- Renderização JSX
- Receber props
- Disparar eventos
- Consumir dados do hook
- Compor outros componentes

### Não deve conter:

- Regras de negócio complexas
- Requisições diretas à API
- Transformações extensas de dados
- Múltiplos `useEffect` com lógica densa
- Definição de estilos (devem estar em `styles.ts`)
- Funções utilitárias (devem estar em arquivo próprio ou em `utils`)

A UI deve ser declarativa e legível.

------------------------------------------------------------------------

## 1.3 Custom Hook (Camada de Lógica)

Quando o componente possuir lógica relevante, esta deve ser extraída
para um hook com o mesmo nome base do componente.

### Responsabilidades:

- Gerenciamento de estado
- Regras de negócio
- Integração com APIs
- Transformação de dados
- Effects
- Memoizações

### Padrão de nome:

- `use-profile-card.ts` → exporta `useProfileCard`
- `use-auth.ts` → exporta `useAuth`
- `use-user-list.ts` → exporta `useUserList`

------------------------------------------------------------------------

## 1.4 Styles

Devem ser:

- Sempre em arquivo separado (`styles.ts`) — **nunca no mesmo arquivo da UI**
- Isolados
- Declarativos
- Sem lógica de negócio
- Sem dependência de estado externo

### React

- CSS Modules, Styled Components ou padrão definido no projeto.

### React Native

- `StyleSheet.create`
- Evitar inline styles (exceto casos extremamente simples)

------------------------------------------------------------------------

## 1.5 Funções Utilitárias em Componentes

Funções utilitárias **não devem ser declaradas dentro do arquivo de UI**. Devem ser extraídas para arquivos próprios seguindo a regra:

- **Reutilizável globalmente** → mover para `src/utils/`
- **Específica de um componente ou feature** → criar arquivo dedicado na mesma pasta

```
home-card/
  index.tsx
  use-home-card.ts
  styles.ts
  home-card.utils.ts    # utilitários específicos deste componente
```

Isso mantém o arquivo de UI enxuto e as funções facilmente testáveis de forma isolada.

------------------------------------------------------------------------

# 2. Estrutura de Componentes Compartilhados (Atomic Design)

A pasta `src/components` deve seguir os princípios do **Atomic Design**,
organizando os componentes em três níveis de complexidade crescente.

## 2.1 Estrutura de Pastas

```
src/
  components/
    atoms/
      base-text-input/
        index.tsx
        use-base-text-input.ts
        styles.ts
      base-button/
        index.tsx
        styles.ts
      base-text/
        index.tsx
        styles.ts
    molecules/
      form-field/
        index.tsx
        styles.ts
      search-bar/
        index.tsx
        use-search-bar.ts
        styles.ts
    organisms/
      product-card/
        index.tsx
        use-product-card.ts
        styles.ts
      header/
        index.tsx
        styles.ts
      auth-form/
        index.tsx
        use-auth-form.ts
        styles.ts
```

------------------------------------------------------------------------

## 2.2 Componentes Menores dentro de Screens e Pages

Componentes específicos de uma screen ou page não pertencem a
`src/components` — devem ficar dentro de uma pasta `components/` na
própria screen ou page.

Cada sub-componente deve seguir a mesma estrutura base: pasta em
kebab-case, arquivo principal `index.tsx`, hook separado e `styles.ts`
separado.

### React Native — `screens`:

```
src/
  screens/
    home/
      components/
        home-header/
          index.tsx
          use-home-header.ts
          styles.ts
        home-featured-banner/
          index.tsx
          styles.ts
      index.tsx
      use-home.ts
      styles.ts
```

### React Web — `pages`:

```
src/
  pages/
    home/
      components/
        home-header/
          index.tsx
          use-home-header.ts
          styles.ts
        home-featured-banner/
          index.tsx
          styles.ts
      index.tsx
      use-home.ts
      styles.ts
```

------------------------------------------------------------------------

## 2.3 Átomos

São os componentes **primitivos e indivisíveis** da aplicação. Não
dependem de outros componentes internos e representam elementos de UI
na sua forma mais simples.

Exemplos: `BaseTextInput`, `BaseButton`, `BaseText`, `BaseIcon`

------------------------------------------------------------------------

## 2.4 Moléculas

São composições de **dois ou mais átomos** que juntos formam uma unidade
funcional com responsabilidade bem definida.

Exemplos: `FormField` (label + input + mensagem de erro), `SearchBar` (input + botão)

------------------------------------------------------------------------

## 2.5 Organismos

São componentes mais complexos, formados pela composição de **moléculas
e/ou átomos**. Representam seções completas da interface com lógica e
estrutura próprias.

Exemplos: `Header`, `ProductCard`, `AuthForm`

------------------------------------------------------------------------

## 2.6 Regras

- Átomos nunca devem depender de moléculas ou organismos
- Moléculas nunca devem depender de organismos
- Componentes específicos de uma feature não pertencem a `components` — devem ficar dentro da própria `screen` ou `page`, na pasta `components/`
- Somente componentes verdadeiramente reutilizáveis devem residir em `src/components`
- Todo componente, independente do nível, deve ter `index.tsx`, `styles.ts` e hook separados

------------------------------------------------------------------------

## 2.7 Componentização de Primitivos

Componentes nativos como `TextInput` e `Button` devem ser encapsulados
em versões base reutilizáveis. Estilizar e configurar esses elementos
diretamente a cada uso é repetição desnecessária e fonte de
inconsistência visual.

### Exemplo — `BaseTextInput`

O átomo `BaseTextInput` deve encapsular o input nativo e já contemplar
os casos mais comuns de uso, como em formulários:

- **label opcional** — exibida acima do campo
- **errorMessage opcional** — exibida abaixo do campo, integrada com React Hook Form

```tsx
<BaseTextInput
  label="E-mail"
  errorMessage={errors.email?.message}
  {...register('email')}
/>
```

Dessa forma, nenhuma tela ou formulário precisa replicar estrutura de
layout, estilos ou lógica de exibição de erro — tudo já está resolvido
no átomo.

O mesmo princípio se aplica a `BaseButton`, `BaseCheckbox`,
`BaseSelect`, entre outros.

------------------------------------------------------------------------

## 2.8 Composition Pattern

Quando um componente possui muitas variações de estrutura ou
comportamento, **não se deve resolver isso com um número crescente de
props**. Em vez disso, deve-se utilizar o **Composition Pattern** —
mesma abordagem adotada por bibliotecas como Radix UI.

### Quando usar:

- O componente tem sub-partes independentes (header, body, footer, trigger)
- Diferentes contextos exigem combinações distintas das partes
- Uma única interface de props estaria ficando extensa e difícil de manter

### Exemplo — `Card` com Composition:

```tsx
// ❌ Controlado apenas por props — difícil de escalar
<Card title="Título" subtitle="Sub" footer={<Button />} hasImage imageUrl="..." />

// ✅ Composition Pattern — flexível e legível
<Card.Root>
  <Card.Image src="..." />
  <Card.Header>
    <Card.Title>Título</Card.Title>
    <Card.Subtitle>Sub</Card.Subtitle>
  </Card.Header>
  <Card.Footer>
    <BaseButton>Ação</BaseButton>
  </Card.Footer>
</Card.Root>
```

### Benefícios:

- Cada sub-componente tem responsabilidade única
- O consumidor monta apenas o que precisa
- Fácil de estender sem quebrar contratos existentes
- API expressiva e autodocumentada

------------------------------------------------------------------------

## 2.9 Barrel Exports (index.ts)

Sempre que possível, cada pasta deve conter um `index.ts` exportando
seus itens. Isso encurta os imports e centraliza o ponto de acesso.

> **Atenção:** o barrel export de uma pasta de componente (`index.ts`) é diferente do arquivo de UI do componente (`index.tsx`). O barrel fica na pasta pai, re-exportando os componentes filhos.

### Estrutura:

```
src/
  components/
    atoms/
      base-text-input/
        index.tsx       # componente UI
        styles.ts
      base-button/
        index.tsx
        styles.ts
      index.ts          # export * from './base-text-input'
                        # export * from './base-button'
    molecules/
      index.ts
    organisms/
      index.ts
    index.ts            # export * from './atoms'
                        # export * from './molecules'
                        # export * from './organisms'
```

### Resultado — imports curtos e limpos:

```ts
// ❌ Sem barrel export
import { BaseButton } from '../../components/atoms/base-button'

// ✅ Com barrel export
import { BaseButton } from '@/components'
```

O mesmo padrão deve ser aplicado a outras pastas do projeto como
`utils`, `services`, `constants` e `hooks`.

------------------------------------------------------------------------

## 2.10 ESLint e Prettier

O projeto deve ter ESLint e Prettier configurados e integrados entre si. O Prettier é a fonte de verdade para formatação — o ESLint não deve conflitar com suas regras.

### Configuração do Prettier

```js
// prettier.config.js
export default {
  singleQuote: true,
  semi: false,
  trailingComma: 'all',
}
```

### Integração ESLint + Prettier

```bash
npm install --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

```bash
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

```js
// eslint.config.js
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      prettier,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off', // desativado em favor da versão TypeScript
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-expressions': 'error',
      'no-undef': 'off', // desativado — o TypeScript já cobre isso
    },
  },
  eslintConfigPrettier,
]
```

### Regras de Formatação

- **Aspas simples** em todo o projeto (`singleQuote: true`)
- **Sem ponto e vírgula** (`semi: false`)
- Trailing comma em objetos e arrays multilinha (`trailingComma: 'all'`)
- **Imports não utilizados** geram erro (`no-unused-vars`)
- **Variáveis não utilizadas** geram erro (`no-unused-vars`)

Essas regras devem ser respeitadas em todo o código. O Prettier deve ser executado automaticamente no save (configurar no editor) e como check no CI.

------------------------------------------------------------------------

## 2.11 Organização de Imports com ESLint

Para manter os imports consistentes e organizados em todo o projeto,
deve-se utilizar o plugin **`eslint-plugin-simple-import-sort`**.

### Instalação:

```bash
npm install --save-dev eslint-plugin-simple-import-sort
```

### Configuração no ESLint:

```js
// eslint.config.js
import simpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
]
```

### Benefícios:

- Imports agrupados e ordenados automaticamente
- Redução de conflitos em code review causados por ordenação inconsistente
- Padronização sem esforço manual

------------------------------------------------------------------------

# 3. Responsabilidade Única (SRP)

Um componente deve fazer apenas **uma única coisa bem definida**.

### Sinais de alerta:

- Arquivo com mais de 200 linhas
- Muitas props complexas
- Múltiplos estados interdependentes
- JSX difícil de entender rapidamente

Se ocorrer:

- Quebrar em subcomponentes (dentro de `components/` na própria screen/page)
- Extrair lógica para hooks
- Extrair funções utilitárias para `*.utils.ts` ou `src/utils/`
- Separar estilos em `styles.ts`

------------------------------------------------------------------------

# 4. Convenção de Nomeação

Consistência é obrigatória.

## 4.1 Componentes

- Devem usar **PascalCase**
- Exemplo: `ProfileCard`, `UserList`, `LoginScreen`

## 4.2 Hooks

- Devem usar **camelCase** iniciando com `use`
- Exemplo: `useProfileCard`, `useAuth`, `useUserList`

## 4.3 Arquivos e Pastas

- Devem usar **kebab-case**
- Exemplo: `profile-card/`, `use-profile-card.ts`, `styles.ts`
- O arquivo principal de todo componente é sempre `index.tsx`

## 4.4 Handlers

- Devem iniciar com `handle`
- Exemplo: `handleSubmit`, `handleLogin`

## 4.5 Booleanos

Devem representar perguntas:

- `isLoading`
- `hasError`
- `canSubmit`
- `shouldShowModal`

------------------------------------------------------------------------

# 5. Arquitetura de Conexão com Back-End

## 5.1 Ferramentas Padrão

A comunicação com o back-end deve ser feita utilizando:

- **Axios** para chamadas HTTP
- **TanStack Query** para gerenciamento de estado de servidor
- **Optimistic Update** quando necessário para melhorar UX

------------------------------------------------------------------------

## 5.2 Regras Arquiteturais

- Nunca chamar Axios diretamente dentro de componentes
- Nunca usar `useEffect` para buscar dados de API
- Estado de servidor não deve ser tratado com `useState`
- Service layer não deve depender de React
- Hooks são a ponte entre UI e Service

------------------------------------------------------------------------

## 5.3 Estrutura de Pastas (Feature-First)

Organização por domínio:

```
src/
  services/
    http/
      api-client.ts
      http-error.ts          # normaliza qualquer erro em um formato estável
      query-meta.d.ts        # tipagem do `meta` de queries e mutations

    products/
      product.schemas.ts       # schemas Zod + transform para o domínio
      product.types.ts         # tipos derivados dos schemas (z.infer)
      product.service.ts       # apenas Axios + parse do schema
      product.queries.ts       # queryOptions() e a fábrica de queryKeys
      product.mutations.ts     # mutationOptions()
      use-products-query.ts    # hook fino sobre product.queries
      use-create-product-mutation.ts
      use-delete-product-mutation.ts
```

Quatro arquivos de definição e um hook por operação. Os hooks continuam sendo
a fronteira que a UI enxerga — quem consome nunca importa `queryOptions`
diretamente.

------------------------------------------------------------------------

## 5.4 Service Layer

`product.service.ts` deve:

- Conter apenas chamadas Axios e o `parse` do schema da resposta
- Não importar React
- Não importar TanStack Query
- Não conter regra de negócio
- Ser responsável apenas por comunicação com API

### Validação de contrato com Zod

A resposta da API deve ser validada na fronteira, e não confiada às cegas.
O schema é a **única** descrição do contrato: os tipos saem dele por
inferência, e o `transform` converte snake_case em camelCase — dispensando um
arquivo de mapper separado.

```ts
// product.schemas.ts
const productApiSchema = z.object({
  id: z.string(),
  unit_price: z.coerce.number(), // aceita "12.90" vindo de um Decimal
  is_active: z.boolean(),
})

export const productSchema = productApiSchema.transform((product) => ({
  id: product.id,
  unitPrice: product.unit_price,
  isActive: product.is_active,
}))

// product.types.ts
export type Product = z.infer<typeof productSchema>
```

Quando o back-end muda de formato, o erro aparece na fronteira com a mensagem
do Zod — e não como `NaN` ou `undefined` três camadas acima. O normalizador de
erros deve tratar `ZodError` como uma categoria própria (`contract`), distinta
de falha de rede.

------------------------------------------------------------------------

## 5.5 Queries e Mutations

### Definições com `queryOptions` / `mutationOptions`

Toda query e mutation deve ser declarada com os helpers `queryOptions()` e
`mutationOptions()` do TanStack Query, e não montada inline dentro do hook.
Eles amarram `queryKey` e `queryFn` no mesmo objeto, então a chave passa a
**carregar o tipo do dado**: `setQueryData` infere sozinho, sem repetir
genéricos à mão, e as duas pontas não têm como divergir.

```ts
// product.queries.ts
export const productKeys = {
  all: ['products'] as const,
  detail: (productId: string) => [...productKeys.all, productId] as const,
}

export const productQueries = {
  detail: (productId: string) =>
    queryOptions({
      queryKey: productKeys.detail(productId),
      queryFn: () => productService.getProduct(productId),
    }),
}

// use-product-query.ts — o hook fica fino
export const useProductQuery = (productId: string) =>
  useQuery(productQueries.detail(productId))

// em qualquer lugar: tipado, sem genérico manual
queryClient.setQueryData(productQueries.detail(id).queryKey, next)
```

Mutations que precisam mexer no cache recebem o `QueryClient` como parâmetro
da fábrica, mantendo o hook com uma linha só.

### Queries

- Devem utilizar `useQuery` sobre um `queryOptions`
- Devem possuir `queryKey` vinda de uma fábrica de chaves centralizada
- Devem ter chave isolada quando necessário

### Mutations

- Devem utilizar `useMutation` sobre um `mutationOptions`
- Devem aplicar optimistic update quando apropriado
- Devem invalidar queries relacionadas após sucesso

### Feedback de erro via `meta`

Não se deve criar um wrapper genérico sobre `useMutation` que receba
`onSuccess` e `onError` por parâmetro. Além de duplicar a API da biblioteca,
esse wrapper perde `onMutate`, `onSettled`, `retry`, `mutationKey` e o tipo do
contexto de rollback — e cresce em número de props a cada nova necessidade,
exatamente o que a seção 2.8 condena.

O feedback deve ser centralizado no `QueryCache` / `MutationCache` do
`QueryClient`. Cada query ou mutation apenas **declara** a chave de tradução
em `meta`, e o toast acontece em um lugar só:

```ts
// query-client.ts
new QueryClient({
  mutationCache: new MutationCache({
    onError: (_error, _vars, _onMutateResult, mutation) =>
      notifyError(mutation.meta?.errorMessageKey),
  }),
})

// na definição da mutation
meta: { errorMessageKey: 'products:errors.createFailed' }
```

O `meta` deve ser tipado por module augmentation, para que a chave não vire
uma string solta:

```ts
declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: { errorMessageKey?: string }
    mutationMeta: { errorMessageKey?: string; successMessageKey?: string }
  }
}
```

Telas que mostram o erro **inline** (dentro do próprio card, por exemplo)
simplesmente não declaram `meta`, evitando toast duplicado.

------------------------------------------------------------------------

# 6. Centralização de Constantes

Para evitar repetição, inconsistência e valores "hardcoded", o projeto
deve possuir arquivos dedicados para constantes.

## 6.1 Arquivo de Constantes Globais

```
src/
  constants/
    app.constants.ts
    routes.constants.ts
    storage.constants.ts
```

Nunca repetir strings mágicas ao longo do código.

------------------------------------------------------------------------

## 6.2 Centralização de Assets

Imagens, ícones e outros assets estáticos devem ser centralizados em
uma pasta dedicada e exportados através de constantes nomeadas. Paths
de assets nunca devem ser declarados inline nos componentes.

### Estrutura:

```
src/
  assets/
    images/
      logo.png
      onboarding-bg.png
      empty-state.png
    icons/
      arrow-right.svg
      close.svg
    index.ts
```

### Exemplo — `assets/index.ts`:

```ts
import logo from './images/logo.png'
import onboardingBg from './images/onboarding-bg.png'
import emptyState from './images/empty-state.png'

export const IMAGES = {
  logo,
  onboardingBg,
  emptyState,
}

import arrowRight from './icons/arrow-right.svg'
import close from './icons/close.svg'

export const ICONS = {
  arrowRight,
  close,
}
```

### Uso nos componentes:

```tsx
import { IMAGES, ICONS } from '@/assets'

<Image source={IMAGES.logo} />
```

------------------------------------------------------------------------

## 6.3 Centralização de Regex

Regex reutilizáveis devem ser centralizadas.

```
src/
  constants/
    regex.constants.ts
```

------------------------------------------------------------------------

# 7. Padrão para Formulários

Para tratamento de formulários, o projeto deve utilizar:

- **React Hook Form** para gerenciamento de formulário
- **Zod** para validação e schema

------------------------------------------------------------------------

## 7.1 Regras para Formulários

- Nunca usar `useState` para controlar campos individualmente
- Toda validação deve ser baseada em schema
- O schema deve ser a única fonte de verdade da validação
- Tipagem do formulário deve ser derivada do schema (inferência automática)

------------------------------------------------------------------------

## 7.2 Organização Recomendada

**React Native** — usar `screens`:

```
src/
  screens/
    auth/
      login/
        components/         # sub-componentes específicos desta screen
          login-form/
            index.tsx
            use-login-form.ts
            styles.ts
        index.tsx
        use-login.ts
        styles.ts
        login.schema.ts
```

**React Web** — usar `pages`:

```
src/
  pages/
    auth/
      login/
        components/
          login-form/
            index.tsx
            use-login-form.ts
            styles.ts
        index.tsx
        use-login.ts
        styles.ts
        login.schema.ts
```

------------------------------------------------------------------------

## 7.3 Benefícios

- Performance superior (menos re-renders)
- Validação consistente
- Tipagem automática e segura
- Código previsível e escalável

------------------------------------------------------------------------

# 8. Internacionalização (i18n)

Todo texto visível ao usuário deve ser tratado através de
internacionalização. Strings hardcoded na UI são proibidas.

## 8.1 Ferramenta Padrão

O projeto deve utilizar **i18next** em conjunto com
**react-i18next** para gerenciamento de traduções.

------------------------------------------------------------------------

## 8.2 Regras

- Nenhum texto visível ao usuário deve estar hardcoded no JSX
- Toda string deve ser referenciada por uma chave de tradução
- As chaves devem ser organizadas por domínio/feature para facilitar manutenção
- O idioma padrão (fallback) deve ser sempre definido na configuração

------------------------------------------------------------------------

## 8.3 Estrutura de Pastas

```
src/
  i18n/
    index.ts
    locales/
      pt-BR/
        common.json
        auth.json
        products.json
      en-US/
        common.json
        auth.json
        products.json
```

------------------------------------------------------------------------

## 8.4 Organização das Chaves

As chaves devem refletir a hierarquia e o contexto de uso:

```json
{
  "login": {
    "title": "Entrar na sua conta",
    "emailLabel": "E-mail",
    "passwordLabel": "Senha",
    "submitButton": "Entrar",
    "errors": {
      "invalidCredentials": "E-mail ou senha inválidos"
    }
  }
}
```

------------------------------------------------------------------------

## 8.5 Uso nos Componentes

```tsx
import { useTranslation } from 'react-i18next'

export function LoginForm() {
  const { t } = useTranslation('auth')

  return <Text>{t('login.title')}</Text>
}
```

------------------------------------------------------------------------

# 9. Utils

Funções utilitárias reutilizáveis ao longo do projeto devem ser
centralizadas na pasta `utils`, evitando duplicação de lógica.

## 9.1 Regras

- Toda função pura e reutilizável globalmente deve residir em `src/utils`
- Funções utilitárias específicas de um componente devem ficar em um arquivo `*.utils.ts` na pasta do próprio componente
- Funções de `utils` não devem depender de React (sem hooks, sem JSX)
- Cada arquivo deve agrupar funções de um mesmo domínio
- Funções de `utils` devem ser facilmente testáveis de forma isolada

------------------------------------------------------------------------

## 9.2 Estrutura de Pastas

```
src/
  utils/
    date.utils.ts
    string.utils.ts
    number.utils.ts
    mask.utils.ts
    storage.utils.ts
```

------------------------------------------------------------------------

## 9.3 Exemplos de Uso

Funções que pertencem a `src/utils`: formatação de datas (`formatDate`, `parseDate`),
formatação de valores monetários (`formatCurrency`), aplicação de máscaras
(`maskPhone`, `maskCPF`), manipulação de strings (`capitalize`, `truncate`)
e cálculos genéricos reutilizáveis.

Funções que pertencem ao `*.utils.ts` do componente: transformações de dados
específicas daquele componente, formatações exclusivas de um domínio pontual,
helpers que não fazem sentido fora daquele contexto.

------------------------------------------------------------------------

## 9.4 O que não pertence a utils

- Lógica de negócio específica de uma feature → deve ir no hook da feature
- Chamadas de API → devem ir no service layer
- Transformações fortemente acopladas a um domínio → devem ficar próximas ao domínio

------------------------------------------------------------------------

# 10. Path Aliases

Caminhos relativos longos dificultam a leitura e tornam refatorações
custosas. O projeto deve configurar **path aliases** para que os imports
sejam sempre absolutos e legíveis.

## 10.1 Configuração

### `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### React Native — `babel.config.js`:

```js
module.exports = {
  plugins: [
    ['module-resolver', {
      root: ['./src'],
      alias: { '@': './src' }
    }]
  ]
}
```

### React (Vite) — `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  }
})
```

------------------------------------------------------------------------

## 10.2 Uso

```ts
// ❌ Caminho relativo
import { BaseButton } from '../../../components/atoms/base-button'

// ✅ Path alias
import { BaseButton } from '@/components'
```

------------------------------------------------------------------------

# 11. Variáveis de Ambiente

Configurações sensíveis ou que variam por ambiente nunca devem ser
hardcoded no código-fonte.

## 11.1 Regras

- Toda variável de ambiente deve ser declarada em `.env`
- O arquivo `.env` nunca deve ser commitado — adicionar ao `.gitignore`
- Um arquivo `.env.example` deve ser mantido no repositório com as chaves necessárias (sem valores)
- Variáveis de ambiente devem ser acessadas através de um arquivo centralizado com tipagem

------------------------------------------------------------------------

## 11.2 Estrutura

```
.env                  # ignorado pelo git
.env.example          # commitado, sem valores sensíveis
```

------------------------------------------------------------------------

## 11.3 Centralização e Tipagem

Nunca acessar `process.env` ou `import.meta.env` diretamente nos
componentes ou services. Centralizar em um arquivo dedicado:

```ts
// src/config/env.ts
export const ENV = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
  appEnv: import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production',
}
```

Uso:

```ts
import { ENV } from '@/config/env'

apiClient.defaults.baseURL = ENV.apiBaseUrl
```

------------------------------------------------------------------------

# 12. Commit Conventions

O projeto deve seguir o padrão **Conventional Commits** para manter um
histórico legível, facilitar geração de changelogs e tornar o propósito
de cada commit imediatamente claro.

## 12.1 Formato

```
<tipo>(escopo opcional): descrição curta

corpo opcional

rodapé opcional (ex: BREAKING CHANGE)
```

------------------------------------------------------------------------

## 12.2 Tipos Principais

- `feat`: nova funcionalidade
- `fix`: correção de bug
- `chore`: tarefas de manutenção, configuração, dependências
- `refactor`: refatoração sem mudança de comportamento
- `style`: formatação, espaçamento (sem mudança de lógica)
- `test`: adição ou correção de testes
- `docs`: alterações em documentação
- `perf`: melhorias de performance
- `ci`: mudanças em pipelines de CI/CD

------------------------------------------------------------------------

## 12.3 Exemplos

```
feat(auth): add forgot password screen
fix(product-list): fix empty state not showing on error
chore: update dependencies
refactor(use-cart): extract price calculation to utils
test(base-button): add unit tests for disabled state
```

------------------------------------------------------------------------

## 12.4 Ferramentas Recomendadas

- **Commitlint** para validar o padrão automaticamente
- **Husky** para rodar o commitlint como git hook no `commit-msg`

------------------------------------------------------------------------

# 13. Estratégia de Testes

Testes são parte do código, não um extra. O projeto deve ter uma
estratégia clara sobre o que, como e onde testar.

## 13.1 Ferramentas

- **Jest** para testes unitários
- **React Testing Library** (ou **React Native Testing Library**) para testes de componentes
- **MSW (Mock Service Worker)** para mock de requisições HTTP nos testes

------------------------------------------------------------------------

## 13.2 O que Testar

- Funções de `utils` — sempre, pois são puras e isoladas
- Custom hooks com lógica relevante de negócio
- Componentes críticos (fluxos de autenticação, formulários, feedbacks de erro)
- Mutations e queries com comportamento de side-effect importante

------------------------------------------------------------------------

## 13.3 O que Não Testar

- Componentes puramente de apresentação sem lógica
- Detalhes de implementação (testar comportamento, não estrutura interna)
- Bibliotecas de terceiros

------------------------------------------------------------------------

## 13.4 Onde os Testes Devem Ficar

Os arquivos de teste devem ficar **ao lado do arquivo testado**,
com o sufixo `.test.ts` ou `.spec.ts`:

```
src/
  utils/
    date.utils.ts
    date.utils.test.ts
  components/
    atoms/
      base-button/
        index.tsx
        index.test.tsx
        styles.ts
  screens/
    home/
      components/
        home-header/
          index.tsx
          index.test.tsx
          styles.ts
```

------------------------------------------------------------------------

## 13.5 Regras Gerais

- Testes devem ser determinísticos — nunca dependem de ordem de execução
- Evitar `setTimeout` ou esperas arbitrárias nos testes
- Preferir `userEvent` ao `fireEvent` para simular interações reais
- Testar o que o usuário vê e faz, não detalhes internos do componente

------------------------------------------------------------------------

# 14. Regras de TypeScript

TypeScript só agrega valor quando usado com rigor. Tipagem fraca é pior
do que ausência de tipagem, pois cria uma falsa sensação de segurança.

## 14.1 Regras Obrigatórias

- **Proibido usar `any`** — usar `unknown` quando o tipo for realmente desconhecido
- Funções exportadas devem ter tipagem explícita de retorno
- Props de componentes devem ser tipadas com `type` ou `interface` dedicados
- Nunca usar type assertion (`as X`) sem justificativa clara
- Ativar `strict: true` no `tsconfig.json`

------------------------------------------------------------------------

## 14.2 `type` vs `interface`

- Usar **`type`** para props de componentes, tipos utilitários e unions
- Usar **`interface`** para contratos de objetos que possam ser estendidos

```ts
// Props de componente — type
type BaseButtonProps = {
  label: string
  onPress: () => void
  isDisabled?: boolean
}

// Contrato de entidade — interface
interface Product {
  id: string
  name: string
  price: number
}
```

------------------------------------------------------------------------

## 14.3 Inferência Automática

Aproveitar a inferência do TypeScript onde ela é segura e clara.
Tipagem redundante polui o código:

```ts
// ❌ Redundante
const isLoading: boolean = false

// ✅ Inferido
const isLoading = false
```

------------------------------------------------------------------------

# 15. useMemo e useCallback

Memoização prematura adiciona complexidade sem benefício. Estas
ferramentas devem ser usadas com critério, não por padrão.

## 15.1 Quando Usar `useMemo`

Apenas quando o custo computacional da operação for mensurável e o
re-render frequente:

```ts
// ✅ Justificado — transformação custosa sobre lista grande
const sortedProducts = useMemo(() =>
  products.sort((a, b) => a.price - b.price),
[products])
```

Não usar `useMemo` para valores primitivos, objetos simples ou operações
triviais.

------------------------------------------------------------------------

## 15.2 Quando Usar `useCallback`

Quando uma função é passada como prop para um componente filho
memoizado com `React.memo`, ou como dependência de outro hook:

```ts
// ✅ Justificado — passada como prop para componente memoizado
const handleSelect = useCallback((id: string) => {
  setSelectedId(id)
}, [])
```

Não usar `useCallback` em handlers que não são passados como prop.

------------------------------------------------------------------------

## 15.3 Regra Geral

Medir antes de otimizar. Usar React DevTools Profiler para identificar
gargalos reais antes de adicionar memoização.

------------------------------------------------------------------------

# 16. Tratamento de Erros

Erros devem ser tratados de forma explícita, previsível e nunca
silenciados.

## 16.1 Regras Gerais

- **Nunca deixar um `catch` vazio** — todo erro capturado deve ser tratado ou relançado
- Erros de API devem gerar feedback visual ao usuário (toast, mensagem inline)
- Erros inesperados devem ser reportados a um serviço de monitoramento (ex: Sentry)
- Não expor detalhes técnicos de erros ao usuário final

------------------------------------------------------------------------

## 16.2 Erros de API

O tratamento de erros de API deve ser centralizado na camada de hook,
nunca espalhado nos componentes:

```ts
const { mutate } = useCreateProductMutation()

function handleSubmit(data: ProductFormData) {
  mutate(data, {
    onError: () => toast.error(t('products.errors.createFailed'))
  })
}
```

------------------------------------------------------------------------

## 16.3 Error Boundaries

Componentes críticos devem ser envolvidos por **Error Boundaries** para
evitar que erros de renderização derrubem toda a aplicação:

```tsx
<ErrorBoundary fallback={<ErrorScreen />}>
  <ProductList />
</ErrorBoundary>
```

Recomenda-se a biblioteca **`react-error-boundary`** para uma
implementação simples e flexível.

------------------------------------------------------------------------

## 16.4 Nunca Silenciar Erros

```ts
// ❌ Erro silenciado — jamais fazer isso
try {
  await deleteProduct(id)
} catch {}

// ✅ Erro tratado
try {
  await deleteProduct(id)
} catch (error) {
  toast.error(t('products.errors.deleteFailed'))
  reportError(error)
}
```

------------------------------------------------------------------------

# 17. Navegação (React Native)

## 17.1 Ferramenta Padrão

O projeto deve utilizar **React Navigation** como solução de navegação.

------------------------------------------------------------------------

## 17.2 Tipagem das Rotas

Todas as rotas devem ser tipadas para garantir segurança nos parâmetros
de navegação:

```ts
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined
  ProductDetail: { productId: string }
  Auth: NavigatorScreenParams<AuthStackParamList>
}
```

------------------------------------------------------------------------

## 17.3 Estrutura de Pastas

```
src/
  navigation/
    root.navigator.tsx
    auth.navigator.tsx
    app.navigator.tsx
    types.ts
```

------------------------------------------------------------------------

## 17.4 Regras

- Nunca usar strings literais para nomear rotas — centralizar os nomes em constantes ou enum
- Parâmetros de rota devem ser sempre tipados
- Lógica de redirecionamento (ex: usuário autenticado) deve ficar no navigator, não nos componentes

```ts
// src/constants/routes.constants.ts
export const ROUTES = {
  home: 'Home',
  productDetail: 'ProductDetail',
  login: 'Login',
} as const
```

------------------------------------------------------------------------

# 18. Boas Práticas Gerais

- Evitar otimizações prematuras
- Clareza sempre acima de "esperteza"
- Código deve ser previsível e testável
- Arquitetura deve escalar conforme o projeto cresce
- Evitar valores mágicos no código

------------------------------------------------------------------------

## 18.1 Handlers Inline

Funções com qualquer lógica — cálculos, navegação, transformações,
chamadas a hooks — nunca devem ser declaradas inline em props de evento.
A função deve ser extraída e nomeada seguindo a convenção `handle*`.

```tsx
// ❌ Lógica inline — ilegível e impossível de testar
<Button onPress={() => {
  const result = value * 2
  navigation.navigate('Result', { result })
}} />

// ✅ Função extraída e nomeada
function handleConfirm() {
  const result = value * 2
  navigation.navigate('Result', { result })
}

<Button onPress={handleConfirm} />
```

A única exceção aceitável é quando a prop recebe uma expressão de uma
única linha sem lógica alguma, como `onPress={() => setValue(true)}`.
Ainda assim, extrair é preferível quando o componente cresce.

------------------------------------------------------------------------

Documento vivo. Deve evoluir conforme o projeto e o time amadurecem.
