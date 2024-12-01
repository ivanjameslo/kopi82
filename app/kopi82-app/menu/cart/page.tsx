"use client";

import { useCartContext } from "../../context/cartContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./cart.css";
import { toast, ToastContainer } from "react-toastify";

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
            };
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
        updateCart(updatedCart);
    };

    

    const handleQuantityChange = (uniqueKey: string, increment: boolean) => {
      const updatedCart = { ...cart };
      if (increment) {
        if (updatedCart[uniqueKey].quantity < 10) {
          updatedCart[uniqueKey].quantity += 1;
        } else {
          toast.error("Quantity cannot exceed 1000");
        }
      } else if (updatedCart[uniqueKey].quantity > 1) {
        updatedCart[uniqueKey].quantity -= 1;
      }
      updateCart(updatedCart);
    };

    const handleQuantityInputChange = (uniqueKey: string, value: string) => {
      const updatedCart = { ...cart };
      const quantity = parseInt(value, 10);
      if (!isNaN(quantity) && quantity > 0 && quantity <= 1000) {
      updatedCart[uniqueKey].quantity = quantity;
      } else {
      toast.error("Please enter a valid quantity between 1 and 1000");
      }
      updateCart(updatedCart);
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
            router.push("/kopi82-app/menu/payment");
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Failed to save order details. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container">
                <h1 className="heading">Cart</h1>
                <p className="text-muted">Your cart is empty.</p>
                <button
                    className="button button-back"
                    onClick={() => router.push("/kopi82-app/menu")}
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="container">
  <h1 className="heading">Cart</h1>
  <div className="cart-grid">
    {Object.entries(cart).map(([key, item]) => {
      const product = productDetails[item.product_id] || {
        product_name: "Loading...",
        image_url: "/placeholder.png",
      };

      let drinkPreference = "N/A";
      if (product.hotPrice === item.selectedPrice) drinkPreference = "Hot";
      else if (product.icedPrice === item.selectedPrice) drinkPreference = "Iced";
      else if (product.frappePrice === item.selectedPrice) drinkPreference = "Frappe";
      else if (product.singlePrice === item.selectedPrice) drinkPreference = "Single";

      return (
        <div className="cart-item">
  <img src={product.image_url} alt={product.product_name} />
  <div className="cart-item-content">
    <div>
      <div className="cart-item-name">{product.product_name}</div>
      <div className="cart-item-details">Preference: {drinkPreference}</div>
      <div className="cart-item-price-total">
        <div className="cart-item-price">
          <span>Price:</span>
          <span>{item.selectedPrice.toFixed(2)}</span>
        </div>
        <div className="cart-item-total">
          <span>Total:</span>
          <span>{(item.quantity * item.selectedPrice).toFixed(2)}</span>
        </div>
      </div>
    </div>
    <div className="cart-item-controls">
      <div className="quantity-controls">
        <button
          className="quantity-button"
          onClick={() => handleQuantityChange(key, false)}
        >
          -
        </button>
        <div>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityInputChange(key, e.target.value)}
            min="1"
            max="1000"
            className="quantity-input"
          />
        </div>
        <button
          className="quantity-button"
          onClick={() => handleQuantityChange(key, true)}
        >
          +
        </button>
      </div>
      <button
        className="button-remove"
        onClick={() => removeItem(key)}
      >
        Remove
      </button>
    </div>
  </div>
</div>

      );
    })}
  </div>
  <div className="footer-total">
    Total:{" "}
    {cartItems
      .reduce((total, item) => total + item.quantity * item.selectedPrice, 0)
      .toFixed(2)}
  </div>
  <button className="button button-back" onClick={() => router.push("/kopi82-app/menu")}>
    Back to Menu
  </button>
  <button className="button button-checkout" onClick={handleCheckout} disabled={loading}>
    {loading ? "Processing..." : "Checkout"}
  </button>
  <ToastContainer />
</div>

      
    );
};

export default CartPage;
