"use client"
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { order_details } from "@prisma/client";
import { supabase } from "@/lib/initSupabase";

type CartContextType = {
    cartTotalQty: number;
    cartTotalAmount: number;
    cartProducts: order_details[];
    handleAddProductToCart: (product: order_details) => void;
    handleRemoveProductFromCart: (product: order_details) => void;
    handleCartQtyIncrease: (product: order_details) => void;
    handleCartQtyDecrease: (product: order_details) => void;
    handleClearCart: () => void;
};

export const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider = (props: any) => {
    const [cartTotalAmount, setCartTotalAmount] = useState(0);
    const [cartTotalQty, setCartTotalQty] = useState(0);
    const [cartProducts, setCartProducts] = useState<order_details[]>([]); // Initialized as empty array
    const [loading, setLoading] = useState(false); // Loading state

    useEffect(() => {
        const fetchCartItems = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('cart')
                .select('*');
            setLoading(false);
            if (error) {
                toast.error('Failed to fetch cart items');
            } else {
                setCartProducts(data);
            }
        };

        fetchCartItems();
    }, []);

    useEffect(() => {
        const getTotals = () => {
            if (cartProducts.length > 0) {
                const { total, quantity } = cartProducts.reduce((acc, item) => {
                    const itemTotal = item.order_id * item.quantity; // Assuming price is a field in order_details
                    acc.total += itemTotal;
                    acc.quantity += item.quantity;
                    return acc;
                }, {
                    total: 0,
                    quantity: 0
                });
                setCartTotalQty(quantity);
                setCartTotalAmount(total);
            }
        };
        getTotals();
    }, [cartProducts]);

    const handleAddProductToCart = useCallback(async (product: order_details) => {
        const { data, error } = await supabase
            .from('cart')
            .insert([product]);

        if (error) {
            toast.error('Failed to add product to cart');
        } else {
            setCartProducts((prev) => [...prev, product]);
            toast.success('Product added to cart');
        }
    }, []);

    const handleRemoveProductFromCart = useCallback(async (product: order_details) => {
        const { error } = await supabase
            .from('cart')
            .delete()
            .match({ product_id: product.product_id });

        if (error) {
            toast.error('Failed to remove product from cart');
        } else {
            setCartProducts((prev) => prev.filter(item => item.product_id !== product.product_id));
            toast.success('Product removed from cart');
        }
    }, []);

    const updateCartQuantity = useCallback(async (product: order_details, change: number) => {
        const newQuantity = product.quantity + change;

        if (newQuantity < 1 || newQuantity > 999) {
            return toast.error('Quantity must be between 1 and 999');
        }

        const updatedCart = cartProducts.map(item =>
            item.product_id === product.product_id ? { ...item, quantity: newQuantity } : item
        );
        setCartProducts(updatedCart);

        const { error } = await supabase
            .from('cart')
            .update({ quantity: newQuantity })
            .match({ product_id: product.product_id });

        if (error) {
            toast.error('Failed to update quantity');
        }
    }, [cartProducts]);

    const handleCartQtyIncrease = (product: order_details) => updateCartQuantity(product, 1);
    const handleCartQtyDecrease = (product: order_details) => updateCartQuantity(product, -1);

    const handleClearCart = useCallback(async () => {
        const { error } = await supabase
            .from('cart')
            .delete();

        if (error) {
            toast.error('Failed to clear cart');
        } else {
            setCartProducts([]);
            setCartTotalQty(0);
            setCartTotalAmount(0);
            toast.success('Cart cleared successfully');
        }
    }, []);

    const value: CartContextType = {
        cartTotalQty,
        cartTotalAmount,
        cartProducts,
        handleAddProductToCart,
        handleRemoveProductFromCart,
        handleCartQtyIncrease,
        handleCartQtyDecrease,
        handleClearCart,
    };

    return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error('useCart must be used within a CartContextProvider');
    }
    return context;
};
