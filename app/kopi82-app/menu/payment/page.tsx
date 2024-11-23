"use client";


import { useCartContext } from "../../context/cartContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import crypto from "crypto";

interface PaymentData {
    payment_method: string;
    payment_status: string;
    reference_no: string;
    account_number: string;
    account_name: string;
    cvv: string;
    expiry_date: string;
    generated_code: string;
    discount_id: number;
    createdAt: string;
    order: OrderData;
    discount: DiscountData;
}

interface OrderData {
    order_id: number;
    customer_name: string;
    service_type: string;
    order_details: {
        product_id: number;
        product_name: string;
        image_url: string;
    }[]
}

interface DiscountData {
    discount_id: number;
    discount_name: string;
    discount_rate: number;
    status: string;
}

const PaymentPage = () => {
    const { cart, order_id } = useCartContext();
    const [orderDetails, setOrderDetails] = useState<any[]>([]);
    const [discounts, setDiscounts] = useState<DiscountData[]>([]);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [payment, setPayment] = useState<PaymentData>({
        payment_method: "",
        payment_status: "",
        reference_no: "",
        account_number: "",
        account_name: "",
        cvv: "",
        expiry_date: "",
        generated_code: "",
        discount_id: 0,
        createdAt: "",
        order: { order_id: 0, customer_name: "", service_type: "", order_details: [{ product_id: 0, product_name: "", image_url: "" }] },
        discount: { discount_id: 0, discount_name: "", discount_rate: 0, status: "" },
    });
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetails = async () => {
        if (!order_id) {
            console.error("order_id is missing. Cannot fetch order details.");
            setError("Order ID is missing. Please try again.");
            return;
        }
    
        setLoading(true);
        try {
            const response = await fetch(`/api/order_details/${order_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response from server:", errorData);
                throw new Error("Failed to fetch order details");
            }
    
            const data = await response.json();
            setOrderDetails(data);
        } catch (err: any) {
            console.error("Error fetching order details:", err.message);
            setError("Failed to fetch order details.");
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        if (!order_id) {
          console.error("order_id is undefined or null");
          return;
        }
        fetchOrderDetails();
      }, [order_id]);

    const fetchDiscounts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/discount`, {
                method: "GET", // Specify HTTP method
            });
            if (!response.ok) throw new Error("Failed to fetch discounts");
            const data = await response.json();
            setDiscounts(data); // Update discounts state
        } catch (err: any) {
            console.error("Error fetching discounts:", err.message);
            setError(err.message || "Failed to fetch discounts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, [])

    const handleDiscountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        const selectedDiscount = discounts.find((d) => d.discount_id === selectedId);
        if (selectedDiscount) {
          setDiscountPercentage(selectedDiscount.discount_rate);
          setPayment((prev) => ({ ...prev, discount_id: selectedDiscount.discount_id }));
        }
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPayment((prev) => ({ ...prev, [name]: value }));
    };    

    // Calculate subtotal
    const calculateSubtotal = () => {
        return orderDetails.reduce((subtotal, item) => {
            return subtotal + item.quantity * item.price;
        }, 0).toFixed(2);
    };
    
    // Calculate total after discount
    const calculateTotal = () => {
        const subtotal = parseFloat(calculateSubtotal());
    
        let discountAmount = 0;
    
        if (payment.discount_id === 1 || payment.discount_id === 2) {
            // Apply discount to only one product (e.g., the most expensive one)
            const mostExpensiveProduct = orderDetails.reduce((max, item) =>
                item.price > max.price ? item : max
            );
    
            if (mostExpensiveProduct) {
                discountAmount =
                    mostExpensiveProduct.price * (discountPercentage / 100);
            }
        } else {
            // Apply discount to the entire order
            discountAmount = subtotal * (discountPercentage / 100);
        }
    
        const total = subtotal - discountAmount;
        return total > 0 ? total.toFixed(2) : "0.00";
    };
    

    const handleSubmit = async () => {
        try {
            // Ensure a payment method is selected
            if (!paymentMethod) {
                toast.error("Please select a payment method.");
                return;
            }

            const generatedCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    
            // Prepare the payment data
            let paymentData: any = {
                payment_method: paymentMethod,
                payment_status: "pending", // Default status
                order_id,
                discount_id: discounts.find((d) => d.discount_rate === discountPercentage)?.discount_id || null, // Match the discount
                generated_code: generatedCode,
            };
    
            // Validate and collect data based on the payment method
            switch (paymentMethod) {
                case "gcash":
                case "paymaya":
                    if (!payment.reference_no) {
                        toast.error("Please enter a reference number for e-wallet payment.");
                        return;
                    }
                    paymentData.reference_no = payment.reference_no;
                    break;
    
                case "card":
                    if (
                        !payment.account_number ||
                        !payment.account_name ||
                        !payment.cvv ||
                        !payment.expiry_date
                    ) {
                        toast.error("Please fill in all card details.");
                        return;
                    }
                    paymentData.account_number = payment.account_number;
                    paymentData.account_name = payment.account_name;
                    paymentData.cvv = payment.cvv;
                    paymentData.expiry_date = payment.expiry_date;
                    break;
    
                case "otc":
                    // No additional data needed for OTC
                    break;
    
                default:
                    toast.error("Invalid payment method selected.");
                    return;
            }
    
            // Send the payment data to the server
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            });
    
            if (!response.ok) {
                throw new Error("Failed to process payment. Please try again.");
            }
    
            const result = await response.json();
            toast.success("Payment successfully processed!");
            console.log("Payment result:", result);

            setConfirmationCode(generatedCode);
    
            // Optional: Redirect or clear the form
        } catch (error: any) {
            console.error("Payment error:", error.message);
            toast.error(error.message || "An error occurred during payment.");
        }
    };

    const ConfirmationModal = ({ isOpen, onClose, code }: { isOpen: boolean; onClose: () => void; code: string | null }) => {
        if (!isOpen || !code) return null;
    
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-md shadow-md w-80 text-center">
                    <h2 className="text-lg font-bold mb-4">Confirmation Code</h2>
                    <p className="text-xl font-mono">{code}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    };

    const renderPaymentForm = () => {
        switch (paymentMethod) {
            case "card":
                return <CardForm />;
            case "gcash":
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">GCash Payment</h3>
                        <input
                            type="text"
                            placeholder="GCash Mobile Number"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                );
            case "paymaya":
                return (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold mb-2">PayMaya Payment</h3>
                        <input
                            type="text"
                            placeholder="PayMaya Account Number"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="m-14">
            <h1 className="text-2xl font-bold">Payment</h1>
            {loading ? (
                <p className="text-gray-600 mt-4">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div>
                    <p className="text-gray-600">Order ID: {order_id}</p>


                    <table className="w-full table-auto border-collapse border border-gray-300 mt-6">
                        <thead>
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Product</th>
                                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                <th className="border border-gray-300 px-4 py-2">Price</th>
                                <th className="border border-gray-300 px-4 py-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map((item, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 px-4 py-2 flex items-center space-x-4">
                                    <Image
                                        src={item.image_url || "/placeholder.png"}
                                        alt={item.product_name || "Product image"}
                                        width={50}
                                        height={50}
                                        className="rounded"
                                    />
                                        <span>{item.product_name}</span>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        {item.quantity || 0}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        ₱{item.price?.toFixed(2) || "0.00"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        ₱{(item.quantity * item.price).toFixed(2) || "0.00"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <div className="mt-6 text-right">
                        <p className="text-lg font-bold">Subtotal: ₱{calculateSubtotal()}</p>
                    </div>


                    <div className="mt-6">
                        <h2 className="text-lg font-bold">Discount</h2>
                        <select
                            className="w-full p-2 mt-2 border rounded"
                            value={payment.discount_id || ""}
                            name="discount_id"
                            onChange={(e) => {
                                const selectedDiscount = discounts.find(
                                    (discount) => discount.discount_id === parseInt(e.target.value)
                                );
                                if (selectedDiscount) {
                                    setDiscountPercentage(selectedDiscount.discount_rate || 0);
                                    setPayment((prev) => ({
                                        ...prev,
                                        discount_id: selectedDiscount.discount_id,
                                    }));
                                }
                            }}
                        >
                            <option value="">Select Discount</option>
                            {discounts.map((discount) => (
                                <option
                                    key={discount.discount_id}
                                    value={discount.discount_id}
                                >
                                    {discount.discount_name} - {discount.discount_rate}%
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-6 text-right">
                        <p className="text-lg font-bold">Total: ₱{calculateTotal()}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                    <div className="mt-6">
                        <h2 className="text-lg font-bold">Select Payment Method</h2>
                        <select
                            className="w-full p-2 mt-2 border rounded"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="card">Card/Debit</option>
                            <option value="gcash">GCash</option>
                            <option value="paymaya">PayMaya</option>
                        </select>
                    </div>


                    {renderPaymentForm()}


                    <button
                        type="submit"
                        className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Confirm Payment
                    </button>

                    {confirmationCode && (
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Show Confirmation Code
                    </button>
                    )}

                    <ConfirmationModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        code={confirmationCode}
                    />

                </form>
                </div>
            )}
        </div>
    );
};

const CardForm = () => {
    return (
        <div className="mt-4">
            <h3 className="text-lg font-bold mb-2">Card Payment</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">CVV</label>
                        <input
                            type="text"
                            placeholder="123"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                    <input
                        type="text"
                        placeholder="Taylor Swift"
                        className="w-full p-2 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};


export default PaymentPage;
