"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { useCartContext } from "../kopi82-app/context/cartContext"
import "@/app/kopi82-app/kopi822.css"; // Importing the CSS file for styling

const Kopi82app = () => {
    const router = useRouter();
    const { setOrderId } = useCartContext(); // Access `setOrderId` from context

    const getCurrentDate = () => {
        const date = new Date();
        return date.toISOString().split("T")[0];
    }

    const [formData, setFormData] = useState({
        customer_name: "",
        service_type: "",
        date: getCurrentDate(),
    });
    const [uploading, setUploading] = useState(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);
    
        try {
            const response = await fetch("/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    customer_name: formData.customer_name,
                    service_type: formData.service_type,
                    date: formData.date + "T00:00:00Z",
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Failed to create order:', errorData);
                throw new Error(errorData.message || 'Unknown server error');
            }

            const responseData = await response.json();

            // Update the context with the new order_id
            setOrderId(responseData.order_id);

            router.push("/kopi82-app/menu");
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="background">
            <div className="squarebox">
                <div className="squarebox1">
                    <div className="mb-6">
                        <img
                            src="/kopi.png"
                            alt="Kopi 82 Logo"
                            className="mx-auto mb-6 filter invert"
                            style={{ width: '80px', height: '80px' }}
                        />
                        <h1 className="text-3xl font-bold">KOPI 82</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <input
                                placeholder="Customer Name"
                                onChange={handleChange}
                                value={formData.customer_name}
                                type="text"
                                name="customer_name"
                                className="w-full p-4 rounded-md bg-transparent border border-white placeholder-gray-300 text-center"
                            />
                        </div>
                        <div className="radio">
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    name="service_type" 
                                    value="Dine-In" 
                                    checked={formData.service_type === 'Dine-In'} 
                                    onChange={handleChange} 
                                    className="mr-2" 
                                /> 
                                Dine-In
                            </label>
                            <label className="flex items-center">
                                <input 
                                    type="radio" 
                                    name="service_type" 
                                    value="Takeout" 
                                    checked={formData.service_type === 'Takeout'} 
                                    onChange={handleChange} 
                                    className="mr-2" 
                                /> 
                                Takeout
                            </label>
                        </div>
                        <button className="button" type="submit" disabled={uploading}>
                            Proceed
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Kopi82app;
