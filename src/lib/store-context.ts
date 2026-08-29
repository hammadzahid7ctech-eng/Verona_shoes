import { createContext, useContext } from 'react';
import type { CartItem, Order } from '@/types';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface StoreContextValue {
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (productId: string, size: number, color: string, quantity: number) => void;
  removeFromCart: (productId: string, size: number, color: string) => void;
  clearCart: () => void;
  cartCount: number;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  // Orders
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrder: (id: string) => Order | undefined;
  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;
  // Navigation
  route: string;
  navigate: (to: string) => void;
}
