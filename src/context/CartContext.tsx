import React, { createContext, useContext, useReducer } from 'react';
import type { CartItem, Product } from '../types';

type CartAction =
  | { type: 'ADD'; product: Product; quantity?: number }
  | { type: 'REMOVE'; sku: string }
  | { type: 'SET_QTY'; sku: string; quantity: number }
  | { type: 'CLEAR' };

interface CartState {
  items: CartItem[];
}

interface CartContextValue extends CartState {
  dispatch: React.Dispatch<CartAction>;
  totalItems: number;
  totalUnits: number;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const qty = action.quantity ?? 1;
      const existing = state.items.find(i => i.product.sku === action.product.sku);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.sku === action.product.sku
              ? { ...i, quantity: i.quantity + qty }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: qty }] };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.product.sku !== action.sku) };
    case 'SET_QTY': {
      if (action.quantity < 1) {
        return { items: state.items.filter(i => i.product.sku !== action.sku) };
      }
      return {
        items: state.items.map(i =>
          i.product.sku === action.sku ? { ...i, quantity: action.quantity } : i
        ),
      };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const totalItems = state.items.length;
  const totalUnits = state.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, dispatch, totalItems, totalUnits }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
