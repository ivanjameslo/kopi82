"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  product_id: number;
  quantity: number;
  selectedPrice: number;
  order_id: number;
}

interface CartContextType {
  cart: { [key: number]: CartItem };
  order_id: number;
  updateCart: (item: CartItem) => void;
  setOrderId: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<{ [key: number]: CartItem }>({});
  const [order_id, setOrderId] = useState<number>(0);

  // Initialize `order_id` from `localStorage` only on the client side
  useEffect(() => {
    const savedOrderId = localStorage.getItem("order_id");
    if (savedOrderId) {
      setOrderId(Number(savedOrderId));
    }
  }, []);

  // Update `localStorage` whenever `order_id` changes
  useEffect(() => {
    if (order_id !== 0) {
      localStorage.setItem("order_id", order_id.toString());
    }
  }, [order_id]);

  const updateCart = (item: CartItem) => {
    setCart((prev) => ({ ...prev, [item.product_id]: item }));
  };

  const initializeOrderId = async () => {
    if (order_id === 0) {
      try {
        const response = await fetch("/api/order/latest");
        const data = await response.json();
        const latestOrderId = data.order_id || 1; // Default to 1 if no order exists
        setOrderId(latestOrderId);
      } catch (error) {
        console.error("Failed to fetch the latest order ID", error);
      }
    }
  };

  useEffect(() => {
    initializeOrderId();
  }, []);

  return (
    <CartContext.Provider value={{ cart, order_id, updateCart, setOrderId }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
