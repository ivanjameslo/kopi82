"use client";

import { supabase } from "@/lib/initSupabase";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

const Kopi82app = () => {
    const router = useRouter(); // Initialize the router
    const [formData, setFormData] = useState({
        customer_name: "",
        service_type: "", // Default value
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
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/appMenu'); // Navigate to /appMenu
            } else {
                throw new Error('Failed to create product');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-[url('/kopimural3.jpg')] bg-cover bg-fixed min-h-screen flex justify-center items-center">
            <div className="bg-black bg-opacity-70 p-12 rounded-lg text-white text-center w-[90%] max-w-lg">
                <div className="border border-gray-200 p-10 rounded-md bg-transparent">
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
                                id="customerName"
                                className="w-full p-4 rounded-md bg-transparent border border-white placeholder-gray-300 text-center"
                            />
                        </div>
                        <div className="mb-6 flex justify-center space-x-6">
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
                        <button className="bg-white text-black px-6 py-2 rounded hover:bg-gray-300 transition" type="submit" disabled={uploading}>
                            Proceed
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Kopi82app;
