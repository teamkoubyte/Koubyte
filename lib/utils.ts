import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility om Tailwind classes samen te voegen
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatteer prijzen
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

// Formatteer datums
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('nl-NL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(d)
}

// Formatteer tijd
export function formatTime(time: string): string {
  return time
}

// Redirect naar WhatsApp
export function openWhatsApp(phone: string, message: string): void {
  const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

