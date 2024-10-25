"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

type CartProduct = {
    id: number;
    name: string;
    quantity: number;
    price: number;
};

type CartContextType = {
    cartProducts: CartProduct[];
    setCartProducts: React.Dispatch<React.SetStateAction<CartProduct[]>>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

    return (
        <CartContext.Provider value={{ cartProducts, setCartProducts }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
};