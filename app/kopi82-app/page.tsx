"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartContext } from "../kopi82-app/context/cartContext";
import "@/app/kopi82-app/kopi822.css"; // Importing the CSS file for styling

const Kopi82app = () => {
    const router = useRouter();
    const { setOrderId } = useCartContext(); // Access `setOrderId` from context

    const getCurrentDate = () => {
        const date = new Date();
        return date.toISOString().split("T")[0];
    };

    const [formData, setFormData] = useState({
        customer_name: "",
        service_type: "",
        date: getCurrentDate(),
    });
    const [uploading, setUploading] = useState(false);
    const [toastActive, setToastActive] = useState(false); // Tracks if a toast is already being displayed

    const validateCustomerNameRealTime = (name: string): boolean => {
        if (name.length > 20) {
            if (!toastActive) {
                toast.error("Customer name cannot exceed 20 characters!");
                setToastActive(true);
                setTimeout(() => setToastActive(false), 3000); // Reset after 3 seconds
            }
            return false;
        }

        if (/\d/.test(name)) {
            if (!toastActive) {
                toast.error("Customer name cannot contain numbers!");
                setToastActive(true);
                setTimeout(() => setToastActive(false), 3000); // Reset after 3 seconds
            }
            return false;
        }

        if (/[^a-zA-Z\s]/.test(name)) {
            if (!toastActive) {
                toast.error("Customer name cannot contain special characters!");
                setToastActive(true);
                setTimeout(() => setToastActive(false), 3000); // Reset after 3 seconds
            }
            return false;
        }

        return true;
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        // Real-time validation for customer_name
        if (name === "customer_name") {
            if (value.trim() === "") {
                if (!toastActive) {
                    toast.error("Customer name is required!");
                    setToastActive(true);
                    setTimeout(() => setToastActive(false), 3000); // Reset after 3 seconds
                }
            } else {
                validateCustomerNameRealTime(value);
            }
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateCustomerNameFinal = (name: string): boolean => {
        if (!name.trim()) {
            toast.error("Customer name is required!");
            return false;
        }

        if (name.length > 20) {
            toast.error("Customer name cannot exceed 20 characters!");
            return false;
        }

        if (/\d/.test(name)) {
            toast.error("Customer name cannot contain numbers!");
            return false;
        }

        if (/[^a-zA-Z\s]/.test(name)) {
            toast.error("Customer name cannot contain special characters!");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateCustomerNameFinal(formData.customer_name)) {
            return; // Do not proceed if validation fails
        }

        if (!formData.service_type) {
            toast.error("Please select a service type!");
            return;
        }

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
                console.error("Failed to create order:", errorData);
                throw new Error(errorData.message || "Unknown server error");
            }

            const responseData = await response.json();

            // Update the context with the new order_id
            setOrderId(responseData.order_id);

            // toast.success("Order created successfully!");
            router.push("/kopi82-app/menu");
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to create order. Please try again.");
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
                            style={{ width: "80px", height: "80px" }}
                        />
                        <h1 className="text-3xl font-bold">KOPI 82</h1>
                    </div>
                    {uploading ? (
                        <div className="loading-spinner mt-4">
                            <svg
                                className="animate-spin h-8 w-8 text-white mx-auto"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.614 1.053 5 2.745 6.71l1.255-1.42z"
                                ></path>
                            </svg>
                            <p className="text-white text-center mt-2">Submitting...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <input
                                    placeholder="Customer Name"
                                    onChange={handleChange}
                                    value={formData.customer_name}
                                    type="text"
                                    name="customer_name"
                                    aria-label="Customer Name"
                                    className="w-full p-4 rounded-md bg-transparent border border-white placeholder-gray-300 text-center"
                                />
                            </div>
                            <div className="mb-6">
                                <p className="text-[#DCD7C9] mb-4 font-bold text-lg">Service Type</p>
                                <div className="flex gap-4">
                                    <label
                                        className={`flex items-center justify-center w-32 h-12 rounded-md border transition-all duration-300 ${
                                            formData.service_type === "Dine-In"
                                                ? "bg-[#C4A484] border-[#DCD7C9] text-[#2D2424]"
                                                : "bg-transparent border-[#967969] text-[#DCD7C9] hover:bg-[#967969] hover:text-white"
                                        } cursor-pointer`}
                                        htmlFor="dine-in"
                                    >
                                        <input
                                            id="dine-in"
                                            type="radio"
                                            name="service_type"
                                            value="Dine-In"
                                            checked={formData.service_type === "Dine-In"}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        Dine-In
                                    </label>

                                    <label
                                        className={`flex items-center justify-center w-32 h-12 rounded-md border transition-all duration-300 ${
                                            formData.service_type === "Takeout"
                                                ? "bg-[#C4A484] border-[#DCD7C9] text-[#2D2424]"
                                                : "bg-transparent border-[#967969] text-[#DCD7C9] hover:bg-[#967969] hover:text-white"
                                        } cursor-pointer`}
                                        htmlFor="takeout"
                                    >
                                        <input
                                            id="takeout"
                                            type="radio"
                                            name="service_type"
                                            value="Takeout"
                                            checked={formData.service_type === "Takeout"}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        Takeout
                                    </label>
                                </div>
                            </div>

                            <button className="button" type="submit" disabled={uploading}>
                                {uploading ? "Loading..." : "Proceed"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Kopi82app;