"use client";


import React, { createContext, useContext, useEffect, useState } from "react";


interface CartItem {
  product_id: number;
  quantity: number;
  selectedPrice: number;
  order_id: number;
  price: number;
  hotPrice?: number; // Optional drink-specific prices
  icedPrice?: number;
  frappePrice?: number;
  singlePrice?: number;
}


interface CartContextType {
  cart: { [key: string]: CartItem }; // Use string keys to support uniqueKey
  order_id: number;
  updateCart: (newCart: { [key: string]: CartItem }) => void; // Update cart
  setOrderId: (id: number) => void; // Update order_id
}


const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({}); // Updated to string keys
  const [order_id, setOrderId] = useState<number>(0);


  // Initialize `cart` and `order_id` from `localStorage`
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedOrderId = localStorage.getItem("order_id");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    if (savedOrderId) {
      setOrderId(Number(savedOrderId));
    }
  }, []);


  // Update `localStorage` whenever `cart` changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);


  // Update `localStorage` whenever `order_id` changes
  useEffect(() => {
    if (order_id !== 0) {
      localStorage.setItem("order_id", order_id.toString());
    }
  }, [order_id]);


  const updateCart = (newCart: { [key: string]: CartItem }) => {
    setCart(newCart); // Update the cart directly with the new object
  };


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
