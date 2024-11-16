"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  product_id: number;
  quantity: number;
  selectedPrice: number;
  order_id: number;
}

interface CartContextType {
  cart: { [key: string]: CartItem };
  order_id: number;
  updateCart: (newCart: { [key: number]: CartItem }) => void; // Updated to accept the entire cart object
  setOrderId: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<{ [key: string]: CartItem }>({});
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

  const updateCart = (newCart: { [key: number]: CartItem }) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
  
      Object.values(newCart).forEach((newItem) => {
        // Generate a unique key for each item (product_id + selectedPrice)
        const uniqueKey = `${newItem.product_id}-${newItem.selectedPrice}`;
  
        if (updatedCart[uniqueKey]) {
          // If the same product and type exist, increment the quantity
          updatedCart[uniqueKey].quantity += newItem.quantity;
        } else {
          // If it's a new product/type, add it to the cart
          updatedCart[uniqueKey] = newItem;
        }
      });
  
      return updatedCart;
    });
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
