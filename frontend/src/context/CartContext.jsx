import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'pm_cart';

const lineKey = (item) => `${item.id}::${item.color}::${item.size}`;

const init = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const item = action.payload;
      const key = lineKey(item);
      const existing = state.find((l) => l.key === key);
      if (existing) {
        return state.map((l) =>
          l.key === key ? { ...l, qty: Math.min(l.qty + item.qty, 20) } : l
        );
      }
      return [...state, { ...item, key }];
    }
    case 'SET_QTY':
      return state
        .map((l) => (l.key === action.key ? { ...l, qty: Math.max(0, action.qty) } : l))
        .filter((l) => l.qty > 0);
    case 'REMOVE':
      return state.filter((l) => l.key !== action.key);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, init);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((n, l) => n + l.qty * l.price, 0);
    const shipping = subtotal === 0 || subtotal >= 75 ? 0 : 6.95;
    return {
      items,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      addItem: (item) => {
        dispatch({ type: 'ADD', payload: item });
        setOpen(true);
      },
      setQty: (key, qty) => dispatch({ type: 'SET_QTY', key, qty }),
      removeItem: (key) => dispatch({ type: 'REMOVE', key }),
      clear: () => dispatch({ type: 'CLEAR' }),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
