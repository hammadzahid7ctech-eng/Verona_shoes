import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, Order } from '@/types';
import { clamp, uid } from '@/lib/format';
import type { StoreContextValue, Toast } from '@/lib/store-context';

const StoreContext = createContext<StoreContextValue | null>(null);

const CART_KEY = 'verona_cart_v1';
const WISH_KEY = 'verona_wishlist_v1';
const ORDERS_KEY = 'verona_orders_v1';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

function readRoute(): string {
  const h = window.location.hash.replace(/^#/, '');
  return h || '/';
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load(CART_KEY, []));
  const [wishlist, setWishlist] = useState<string[]>(() => load(WISH_KEY, []));
  const [orders, setOrders] = useState<Order[]>(() => load(ORDERS_KEY, []));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [route, setRoute] = useState<string>(readRoute);

  useEffect(() => save(CART_KEY, cart), [cart]);
  useEffect(() => save(WISH_KEY, wishlist), [wishlist]);
  useEffect(() => save(ORDERS_KEY, orders), [orders]);

  // Hash-based routing
  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.location.hash = '/';
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = useCallback((to: string) => {
    if (readRoute() === to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.location.hash = to;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'success') => {
      const id = uid('t');
      setToasts((prev) => [...prev, { id, message, type }]);
      window.setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );

  const addToCart = useCallback(
    (item: CartItem) => {
      setCart((prev) => {
        const existing = prev.find(
          (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
        );
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId && i.size === item.size && i.color === item.color
              ? { ...i, quantity: clamp(i.quantity + item.quantity, 1, 99) }
              : i,
          );
        }
        return [...prev, item];
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, size: number, color: string, quantity: number) => {
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId && i.size === size && i.color === color
            ? { ...i, quantity: clamp(quantity, 1, 99) }
            : i,
        ),
      );
    },
    [],
  );

  const removeFromCart = useCallback((productId: string, size: number, color: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size && i.color === color)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) {
          showToast('Removed from wishlist', 'info');
          return prev.filter((id) => id !== productId);
        }
        showToast('Added to wishlist', 'success');
        return [...prev, productId];
      });
    },
    [showToast],
  );

  const isWishlisted = useCallback((productId: string) => wishlist.includes(productId), [wishlist]);

  const addOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const cartCount = useMemo(() => cart.reduce((n, i) => n + i.quantity, 0), [cart]);

  const value: StoreContextValue = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    wishlist,
    toggleWishlist,
    isWishlisted,
    orders,
    addOrder,
    getOrder,
    toasts,
    showToast,
    dismissToast,
    route,
    navigate,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
