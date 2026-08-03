import { useToast as usePrimeToast } from 'primevue/usetoast'
import type { ToastMessageOptions } from 'primevue/toast'

type Severity = NonNullable<ToastMessageOptions['severity']>

type ToastDefaults = {
  life?: number
}

type VariantOptions = Omit<ToastMessageOptions, 'severity' | 'detail' | 'summary' | 'life'> & {
  summary?: string
  life?: number
}

const addWithSeverity = (
  add: (message: ToastMessageOptions) => unknown,
  severity: Severity,
  detail: string,
  defaultLife: number,
  options?: VariantOptions,
  defaults?: ToastDefaults,
) => {
  return add({
    severity,
    summary: options?.summary,
    detail,
    life: options?.life ?? defaults?.life ?? defaultLife,
    ...options,
  })
}

export const useToast = (defaults?: ToastDefaults) => {
  const toast = usePrimeToast()

  return {
    raw: toast,

    show(message: ToastMessageOptions) {
      return toast.add({
        life: message.life ?? defaults?.life ?? 3000,
        ...message,
      })
    },

    error(message: string, options?: VariantOptions) {
      return addWithSeverity(toast.add, 'error', message, 5000, { summary: 'Ошибка', ...options }, defaults)
    },

    success(message: string, options?: VariantOptions) {
      return addWithSeverity(toast.add, 'success', message, 3000, { summary: 'Успех', ...options }, defaults)
    },

    info(message: string, options?: VariantOptions) {
      return addWithSeverity(toast.add, 'info', message, 3000, { summary: 'Информация', ...options }, defaults)
    },

    warning(message: string, options?: VariantOptions) {
      return addWithSeverity(toast.add, 'warn', message, 3000, { summary: 'Предупреждение', ...options }, defaults)
    },
  }
}

export const useErrorToast = (message: string) => {
  return useToast().error(message)
}

export const useSuccessToast = (message: string) => {
  return useToast().success(message)
}

export const useInfoToast = (message: string) => {
  return useToast().info(message)
}

export const useWarningToast = (message: string) => {
  return useToast().warning(message)
}