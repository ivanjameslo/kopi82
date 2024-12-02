"use client";


import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartContext } from "../kopi82-app/context/cartContext";


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
                validateCustomerNameFinal(value);
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
        <div className="relative flex items-center justify-center min-h-screen h-screen w-screen bg-cover bg-center bg-no-repeat bg-[url('/background.png')]">
            <div className="absolute inset-0 bg-[#2D2424] bg-opacity-60 z-0"></div>
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
                <div className="bg-[#5C4033] bg-opacity-90 p-6 sm:p-8 md:p-12 rounded-lg text-[#DCD7C9] text-center w-full max-w-sm lg:w-[80%] lg:max-w-lg">
                    <div className="mb-6 text-center">
                        <img
                            src="/kopi.png"
                            alt="Kopi 82 Logo"
                            className="mx-auto mb-6 filter invert"
                            style={{ width: "80px", height: "80px" }}
                        />
                        <h1 className="text-3xl font-bold">KOPI 82</h1>
                    </div>
                    {uploading ? (
                        <div className="flex flex-col items-center mt-4">
                            <svg
                                className="animate-spin h-8 w-8 text-[#2D2424]"
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
                            <p className="text-[#2D2424] text-center mt-2">Submitting...</p>
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
                                    className="w-full p-4 rounded-md bg-transparent border border-[#DCD7C9] placeholder-[#DCD7C9] text-center"
                                />
                            </div>
                            <div className="mb-6">
                                <p className="text-[#DCD7C9] mb-4 font-bold text-lg">Service Type</p>
                                <div className="flex gap-4 justify-center mb-4 sm:gap-6 md:gap-8">
                                    <label
                                        className={`flex items-center justify-center w-32 h-12 rounded-md border transition-all duration-300 ${
                                            formData.service_type === "Dine-In"
                                                ? "bg-[#967969] border-[#C4A484] text-[#2D2424]"
                                                : "bg-transparent border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#967969] hover:text-[#2D2424]"
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
                                                ? "bg-[#967969] border-[#C4A484] text-[#2D2424]"
                                                : "bg-transparent border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#967969] hover:text-[#2D2424]"
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


                            <button
                                className="w-full py-3 bg-[#C4A484] text-[#2D2424] rounded-md hover:bg-[#967969] transition-all duration-300"
                                type="submit"
                                disabled={uploading}
                            >
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