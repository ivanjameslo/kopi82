"use client";


import { useCartContext } from "../../context/cartContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


const CartPage = () => {
    const { cart, order_id, updateCart } = useCartContext();
    const router = useRouter();
    const [customerName, setCustomerName] = useState<string | null>(null);
    const [serviceType, setServiceType] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const [productDetails, setProductDetails] = useState<{ [key: number]: {
        hotPrice: number;
        icedPrice: number;
        frappePrice: number;
        singlePrice: number; 
        product_name: string;
        image_url: string;
} }>({});

    // Fetch customer name based on order_id
    const fetchOrderDetails = async (order_id: number) => {
        try {
            const response = await fetch(`/api/orders/${order_id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch order details for order_id: ${order_id}`);
            }
            const data = await response.json();
            setCustomerName(data.customer_name || "Unknown");
            setServiceType(data.service_type || "Unknown");
        } catch (error) {
            console.error("Error fetching order details:", error);
            setCustomerName("Unknown");
            setServiceType("Unknown");
        }
    };
    // Fetch product details based on product_id
    const fetchProductDetails = async (productId: number) => {
        try {
            const response = await fetch(`/api/product/${productId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch product details");
            }
            const product = await response.json();
            return {
                ...product,
                hotPrice: product.hotPrice || 0,
                icedPrice: product.icedPrice || 0,
                frappePrice: product.frappePrice || 0,
                singlePrice: product.singlePrice || 0,
            }; // Ensure all properties are included
        } catch (error) {
            console.error("Error fetching product details:", error);
            return { product_name: "Unknown", image_url: "/placeholder.png" };
        }
    };

    useEffect(() => {
        if (order_id) {
            fetchOrderDetails(order_id);
        }
    }, [order_id]);

    useEffect(() => {
        const fetchDetails = async () => {
            const details: { [key: number]: {
                hotPrice: number;
                icedPrice: number;
                frappePrice: number;
                singlePrice: number;
                product_name: string;
                image_url: string;
            } } = {};
    
            for (const item of Object.values(cart)) {
                if (!productDetails[item.product_id]) {
                    const product = await fetchProductDetails(item.product_id);
                    details[item.product_id] = product;
                }
            }
    
            setProductDetails((prev) => ({ ...prev, ...details }));
        };
    
        fetchDetails();
    }, [cart]);
    
    const cartItems = Object.values(cart);

    const removeItem = (uniqueKey: string) => {
        const updatedCart = { ...cart };
        delete updatedCart[uniqueKey];
        updateCart(updatedCart); // Update the cart context with the modified cart
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const formDataArray = Object.values(cart).map((item) => ({
                order_id: order_id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.selectedPrice,
                date: new Date(),
            }));

            const response = await fetch("/api/order_details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formDataArray),
            });

            if (!response.ok) {
                throw new Error("Failed to save order details.");
            }

            const result = await response.json();
            alert(`Order details saved successfully. Items saved: ${result.createdCount}`);
            router.push("/kopi82-app/menu/payment")
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Failed to save order details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="m-14">
                <h1 className="text-2xl font-bold">Cart</h1>
                <p className="text-gray-500 mt-4">Your cart is empty.</p>
                <button
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => router.push("/kopi82-app/menu")}
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="m-14">
            <h1 className="text-2xl font-bold">Cart</h1>
            {/* <p className="text-gray-600 mt-2">
                Customer: {customerName || "Loading..."}
            </p>
            <p className="text-gray-600 mt-2">
                Service Type: {serviceType || "Loading..."}
            </p> */}
            <p className="text-gray-600">Order ID: {order_id}</p>

            <div className="mt-6">
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Product</th>
                            <th className="border border-gray-300 px-4 py-2">Drink Preference</th>
                            <th className="border border-gray-300 px-4 py-2">Quantity</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Total</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(cart).map(([key, item]) => {
                            const product = productDetails[item.product_id] || {
                                product_name: "Loading...",
                                image_url: "/placeholder.png",
                            };

                            // Determine the drink preference based on selectedPrice
                            let drinkPreference = "N/A";
                            if (product.hotPrice === item.selectedPrice) drinkPreference = "Hot";
                            else if (product.icedPrice === item.selectedPrice) drinkPreference = "Iced";
                            else if (product.frappePrice === item.selectedPrice) drinkPreference = "Frappe";
                            else if (product.singlePrice === item.selectedPrice) drinkPreference = "Single";

                            return (
                                <tr key={key}>
                                    <td className="border border-gray-300 px-4 py-2 flex items-center space-x-4">
                                        <Image
                                            src={product.image_url}
                                            alt={product.product_name}
                                            width={50}
                                            height={50}
                                        />
                                        <span>{product.product_name}</span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {drinkPreference}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {item.quantity}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {item.selectedPrice.toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {(item.quantity * item.selectedPrice).toFixed(2)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            onClick={() => removeItem(key)}
                                        >
                                            X
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-right">
                <p className="text-lg font-bold">
                    Total:{" "}
                    {cartItems
                        .reduce(
                            (total, item) => total + item.quantity * item.selectedPrice,
                            0
                        )
                        .toFixed(2)}
                </p>
            </div>


            <button
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => router.push("/kopi82-app/menu")}
            >
                Back to Menu
            </button>


            <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleCheckout}
                disabled={loading}
            >
                {loading ? "Processing..." : "Checkout"}
            </button>
        </div>
    );
};


export default CartPage;