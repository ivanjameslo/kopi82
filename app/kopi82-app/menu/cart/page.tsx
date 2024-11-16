"use client";

import { useCartContext } from "../../context/cartContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const CartPage = () => {
    const { cart, order_id, updateCart } = useCartContext();
    const router = useRouter();
    const [customerName, setCustomerName] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch customer name based on order_id
    const fetchCustomerName = async (order_id: number) => {
        try {
            const response = await fetch(`/api/orders/${order_id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch order details");
            }
            const data = await response.json();
            setCustomerName(data.customer_name); // Assuming `customer_name` is part of the response
        } catch (error) {
            console.error("Error fetching customer name:", error);
            setCustomerName("Unknown"); // Fallback in case of error
        }
    };

    // Use `useEffect` to fetch customer name when `order_id` is available
    useEffect(() => {
        if (order_id) {
            fetchCustomerName(order_id);
        }
    }, [order_id]);

    const cartItems = Object.values(cart); // Convert cart object to an array of items

    // Function to remove an item from the cart
    const removeItem = (productId: number) => {
        const updatedCart = { ...cart };
        delete updatedCart[productId];
        updateCart(updatedCart);
    };

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const formDataArray = Object.values(cart).map((item) => ({
                order_id: order_id,
                product_id: item.product_id,
                quantity: item.quantity,
                date: new Date(), // Current date
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
                    onClick={() => router.push("/kopi82-app/menu")} // Redirect to menu page
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="m-14">
            <h1 className="text-2xl font-bold">Cart</h1>
            <p className="text-gray-600 mt-2">
                Customer: {customerName || "Loading..."} {/* Display "Loading..." until fetched */}
            </p>
            <p className="text-gray-600">Order ID: {order_id}</p>

            <div className="mt-6">
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Product</th>
                            <th className="border border-gray-300 px-4 py-2">Quantity</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Total</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.product_id}>
                                <td className="border border-gray-300 px-4 py-2 flex items-center space-x-4">
                                    <Image
                                        src={`/path-to-image/${item.product_id}`} // Update path as needed
                                        alt={`Product ${item.product_id}`}
                                        width={50}
                                        height={50}
                                    />
                                    <span>Product {item.product_id}</span> {/* Replace with actual product name */}
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
                                        onClick={() => removeItem(item.product_id)}
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        ))}
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
                onClick={() => router.push("/kopi82-app/menu")} // Redirect to menu page
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
