import { zodResolver } from '@hookform/resolvers/zod'
import type { BaseSyntheticEvent, KeyboardEvent } from 'react'
import { useRef } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { resizeTextarea } from '@/components/atoms'
import { APP } from '@/constants'
import { useCreateChatMutation } from '@/services/chats'
import { useSendMessageMutation } from '@/services/messages'

import type { MessageComposerFormData } from './message-composer.schema'
import { messageComposerSchema } from './message-composer.schema'

const COMPOSER_MAX_ROWS = 6

interface UseMessageComposerParams {
  /** Ausente enquanto a conversa nao existe — ela nasce no primeiro envio. */
  chatId: string | undefined
  /** Ausente enquanto `GET /me` nao respondeu: e o remetente do balao otimista. */
  senderId: string | undefined
  /** Com quem a conversa e criada, quando ainda nao ha `chatId`. */
  peerId: string
}

export const useMessageComposer = ({
  chatId,
  senderId,
  peerId,
}: UseMessageComposerParams) => {
  const { t } = useTranslation('chat')

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const { register, handleSubmit, formState, reset, control } =
    useForm<MessageComposerFormData>({
      resolver: zodResolver(messageComposerSchema),
      defaultValues: { content: '' },
      mode: 'onSubmit',
    })

  const { mutate: sendMessage, isPending: isSending } = useSendMessageMutation({
    senderId: senderId ?? '',
  })

  const { mutateAsync: createChat, isPending: isCreatingChat } =
    useCreateChatMutation()

  const { ref: registerRef, ...contentField } = register('content')

  /* Duas mãos no mesmo elemento: a do React Hook Form e a nossa, que mede a altura. */
  const handleContentRef = (element: HTMLTextAreaElement | null) => {
    registerRef(element)
    textareaRef.current = element
  }

  /**
   * Habilitar o botao exige conhecer o rascunho, e isso custa um render por
   * tecla — restrito a este componente, que e pequeno. O resto do formulario
   * segue nao controlado.
   */
  const content = useWatch({ control, name: 'content' })

  /* `reset` mexe no valor sem disparar `input`, entao a altura vai junto na mao. */
  const setDraft = (draft: string) => {
    reset({ content: draft })
    resizeTextarea(textareaRef.current, COMPOSER_MAX_ROWS)
  }

  const handleSend = async ({ content: draft }: MessageComposerFormData) => {
    if (!senderId) return

    /* O campo esvazia na hora; o balao otimista assume o lugar do texto. */
    setDraft('')

    try {
      /**
       * Abrir a conversa nao escreve nada: e aqui, no primeiro envio, que
       * ela passa a existir. Numa conversa que ja existe o `chatId` veio de
       * `GET /chats` e nao ha `POST /chat` nenhum.
       */
      const targetChatId =
        chatId ?? (await createChat({ receiverId: peerId })).chatId

      sendMessage(
        { chatId: targetChatId, content: draft.trim() },
        { onError: () => setDraft(draft) },
      )
    } catch {
      /* O toast vem do QueryClient; aqui so devolvemos o texto ao campo. */
      setDraft(draft)
    }
  }

  /* O submit e montado dentro do handler: nada le a ref durante o render. */
  const handleSubmitForm = (event?: BaseSyntheticEvent) => {
    void handleSubmit(handleSend)(event)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) return

    event.preventDefault()
    void handleSubmitForm()
  }

  const errorKey = formState.errors.content?.message

  return {
    contentField: { ...contentField, ref: handleContentRef },
    maxRows: COMPOSER_MAX_ROWS,
    errorMessage: errorKey
      ? t(errorKey, { count: APP.messageMaxLength })
      : undefined,
    /* Da para escrever numa conversa que ainda nao existe; falta so o "quem". */
    isDisabled: !senderId,
    isSending: isSending || isCreatingChat,
    canSend: Boolean(senderId) && content.trim().length > 0,
    handleSubmitForm,
    handleKeyDown,
  }
}
