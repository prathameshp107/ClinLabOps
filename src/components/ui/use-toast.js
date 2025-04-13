import { useEffect, useState } from "react"

// Unique ID for toast
const generateId = () => Math.random().toString(36).substring(2, 9)

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, action, variant = "default", duration = 5000 }) => {
    const id = generateId()
    const newToast = {
      id,
      title,
      description,
      action,
      variant,
      duration
    }
    
    setToasts(prevToasts => [...prevToasts, newToast])
    
    return id
  }

  const dismiss = (toastId) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== toastId))
  }

  const update = (toastId, data) => {
    setToasts(prevToasts => 
      prevToasts.map(toast => 
        toast.id === toastId ? { ...toast, ...data } : toast
      )
    )
  }

  return {
    toast,
    dismiss,
    update,
    toasts
  }
}