// Cart utilities en types

export interface CartItemWithService {
  id: string
  quantity: number
  service: {
    id: string
    name: string
    description: string
    price: number
    slug: string
    image: string | null
  }
}

export function calculateCartTotal(items: CartItemWithService[]): number {
  return items.reduce((total, item) => total + (item.service.price * item.quantity), 0)
}

export function getCartItemCount(items: CartItemWithService[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

