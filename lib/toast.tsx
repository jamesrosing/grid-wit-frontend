import { toast } from '@/components/ui/use-toast'

export function showToast(title: string, description: string) {
  toast({
    title,
    description,
  })
}

export function showErrorToast(title: string, description: string) {
  toast({
    title,
    description,
    variant: "destructive",
  })
}

export function showSuccessToast(title: string, description: string) {
  toast({
    title,
    description,
    variant: "default",
  })
}
