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
      setCart(data);
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
      setCart(data);
      return data;
    } catch (err) {
      return { error: err.response?.data?.error || "Failed to add" };
    }
  };

  const updateQuantity = async (index, quantity) => {
    if (!user) return;
    try {
      const { data } = await api.put(`/cart/${index}`, { quantity });
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { data } = await api.delete("/cart");
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
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
