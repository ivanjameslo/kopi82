"use client";

import { useCartContext } from "../../context/cartContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import CardForm from "./cardForm/page";
import "react-toastify/dist/ReactToastify.css";

import "./payment.css";

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
    const router = useRouter();
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
    const [toastActive, setToastActive] = useState(false);

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
            const mostExpensiveProduct = orderDetails.reduce((max, item) =>
                item.price > max.price ? item : max
            );
            if (mostExpensiveProduct) {
                discountAmount =
                    mostExpensiveProduct.price * (discountPercentage / 100);
            }
        } else {
            discountAmount = subtotal * (discountPercentage / 100);
        }

        const total = subtotal - discountAmount;
        return total > 0 ? total.toFixed(2) : "0.00";
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Calculate the total amount
        const totalAmount = calculateTotal();

        try {
            // Validate order_id
            if (!order_id) {
                toast.error("Order ID is missing.");
                return;
            }

            // Validate payment method
            if (!paymentMethod) {
                toast.error("Please select a payment method.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,

                });
                return;
            }


            ;

            // Construct the payment data
            const generatedCode = crypto.randomBytes(4).toString("hex").toUpperCase();
            const discountId = discounts.find((d) => d.discount_rate === discountPercentage)?.discount_id ?? null;

            const paymentData: any = {
                payment_method: paymentMethod,
                payment_status: "pending",
                order_id,
                discount_id: discountId,
                generated_code: generatedCode,
                createdAt: new Date(),
                amount: totalAmount,
            };



            paymentData.payment_method = paymentMethod;
            if (!paymentMethod) {
                toast.error("Please select a payment method.");
                return;
            }
            paymentData.amount = totalAmount; // Persist total amount here

            // Log the payment data for debugging
            console.log("Payment Data Sent:", paymentData);

            // Send the PATCH request
            const response = await fetch(`/api/payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentData),
            });

            if (!response.ok) {
                let errorMessage = "Failed to update payment.";
                try {
                    const errorResponse = await response.json();
                    console.error("Error Response from Server:", errorResponse);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (err) {
                    console.error("Non-JSON error response:", response);
                }
                throw new Error(errorMessage);
            }


            const result = await response.json();
            console.log("Payment updated successfully:", result);

            // Trigger stock-out using the stock_out_payment API
            // const stockOutResponse = await fetch(`/api/stock_out_payment`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ payment_id: result.payment_id }),
            // });

            // if (!stockOutResponse.ok) {
            //     const stockOutError = await stockOutResponse.json();
            //     console.error("Stock-out API error:", stockOutError);
            //     toast.error("Payment succeeded, but stock-out process failed.");
            // } else {
            //     const stockOutResult = await stockOutResponse.json();
            //     console.log("Stock-out processed successfully:", stockOutResult);
            //     toast.success("Payment and stock-out processed successfully!");
            // }

            toast.success("Payment successfully processed!");
            router.push(`/kopi82-app/menu/payment/generatecode/${generatedCode}`);
            setConfirmationCode(generatedCode);
        } catch (error: any) {
            console.error("Payment error:", error.message);
            toast.error(error.message || "An error occurred during payment.");
        }
    };

    // const renderPaymentForm = () => {
    //     switch (paymentMethod) {
    //         case "card":
    //             return <CardForm payment={payment} handleChange={handleChange} />;
    //         case "gcash":
    //             return (
    //                 <div className="payment-method-gcash">
    //                     <h3 className="payment-method-title">GCash Payment</h3>
    //                     <input
    //                         type="text"
    //                         name="reference_no"
    //                         value={payment.reference_no}
    //                         onChange={handleChange}
    //                         placeholder="GCash Reference Number"
    //                         className="payment-method-input"
    //                     />
    //                 </div>
    //             );
    //         case "paymaya":
    //             return (
    //                 <div className="payment-method-paymaya">
    //                     <h3 className="payment-method-title">PayMaya Payment</h3>
    //                     <input
    //                         type="text"
    //                         name="reference_no"
    //                         value={payment.reference_no}
    //                         onChange={handleChange}
    //                         placeholder="PayMaya Reference Number"
    //                         className="payment-method-input"
    //                     />
    //                 </div>
    //             );
    //         default:
    //             return null;
    //     }
    // };



    return (
        <div className="page-wrapper">
            <h1 className="page-header">Payment</h1>
            {loading ? (
                <p className="loading-message">Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                <div>
                    <p className="order-id">Order ID: {order_id}</p>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="table-header">Product</th>
                                <th className="table-header">Drink Preference</th>
                                <th className="table-header">Quantity</th>
                                <th className="table-header">Price</th>
                                <th className="table-header">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderDetails.map((item, index) => {
                                // Determine the drink preference based on selectedPrice
                                let drinkPreference = "N/A";
                                if (item.hotPrice === item.price) drinkPreference = "Hot";
                                else if (item.icedPrice === item.price) drinkPreference = "Iced";
                                else if (item.frappePrice === item.price) drinkPreference = "Frappe";
                                else if (item.singlePrice === item.price) drinkPreference = "Single";

                                return (
                                    <tr key={index}>
                                        <td className="table-cell">
                                            <div className="product-info">
                                                <Image
                                                    src={item.image_url || "/placeholder.png"}
                                                    alt={item.product_name || "Product image"}
                                                    width={50}
                                                    height={50}
                                                    className="rounded"
                                                />
                                                <span>{item.product_name}</span>
                                            </div>

                                        </td>
                                        <td className="table-cell">
                                            {drinkPreference}
                                        </td>
                                        <td className="table-cell">
                                            {item.quantity || 0}
                                        </td>
                                        <td className="table-cell">
                                            ₱{item.price?.toFixed(2) || "0.00"}
                                        </td>
                                        <td className="table-cell">
                                            ₱{(item.quantity * item.price).toFixed(2) || "0.00"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="discount-section">
                        <p className="subtotal">Subtotal: ₱{calculateSubtotal()}</p>

                        <h2 className="discount-title">Discount</h2>
                        <select
                            className="discount-dropdown"
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

                    <div className="totals">
                        <p className="subtotal">Total: ₱{calculateTotal()}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="mt-6">
                            <h2 className="payment-title">Select Payment Method</h2>
                            <select
                                className="payment-method-select"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <option value="">Select Payment Method</option>
                                <option value="otc">Over-the-Counter</option>
                                <option value="card">Card/Debit</option>
                                <option value="gcash">GCash</option>
                                <option value="paymaya">PayMaya</option>
                            </select>
                        </div>


                        {/* {renderPaymentForm()} */}
                        <button
                            type="submit"
                            className="submit-button"

                        >
                            Confirm Payment
                        </button>
                    </form>
                </div>
            )}
            <ToastContainer
                position="top-center"
            />

        </div>
    );
};

export default PaymentPage;