import { toast as hotToast } from 'react-hot-toast'

type ToastType = 'success' | 'error' | 'loading' | 'custom'

interface Toast {
  success: (message: string | React.ReactNode) => void
  error: (message: string | React.ReactNode) => void
  loading: (message: string | React.ReactNode) => void
  custom: (component: React.ReactNode, options?: { duration?: number }) => void
  dismiss: (toastId?: string) => void
}

const toast: Toast = {
  success: (message) => hotToast.success(message),
  error: (message) => hotToast.error(message),
  loading: (message) => hotToast.loading(message),
  custom: (component, options) => hotToast.custom(component, options),
  dismiss: (toastId) => hotToast.dismiss(toastId),
}

export default toast
