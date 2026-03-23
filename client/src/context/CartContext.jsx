import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      const { data } = await api.get("/cart");
      setCart({ ...data, items: Array.isArray(data?.items) ? data.items : [] });
    } catch {
      setCart({ items: [] });
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (item) => {
    if (!user) return { error: "Login required" };
    try {
      const { data } = await api.post("/cart", item);
      setCart({ ...data, items: Array.isArray(data?.items) ? data.items : [] });
      return data;
    } catch (err) {
      return { error: err.response?.data?.error || "Failed to add" };
    }
  };

  const updateQuantity = async (index, quantity) => {
    if (!user) return;
    try {
      const { data } = await api.put(`/cart/${index}`, { quantity });
      setCart({ ...data, items: Array.isArray(data?.items) ? data.items : [] });
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { data } = await api.delete("/cart");
      setCart(data && Array.isArray(data.items) ? data : { items: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const items = Array.isArray(cart?.items) ? cart.items : [];
  const cartCount = items.reduce((s, i) => s + (i.quantity || 0), 0);
  const cartTotal = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart: { ...cart, items },
        cartCount,
        cartTotal,
        addToCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
