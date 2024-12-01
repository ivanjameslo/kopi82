"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";

interface PaymentData {
    payment_id: number;
    payment_method: string;
    payment_status: string;
    amount: number;
    transaction_id: number;
    discount: {
        discount_id: number;
        discount_name: string;
        discount_rate: number;
        status: string;
    } | null;
    order: {
        order_id: number;
        customer_name: string;
        service_type: string;
        date: string;
        details: {
            price: number;
        }[];
    } | null;
    createdAt: string;
}

interface DiscountData {
    discount_id: number;
    discount_name: string;
    discount_rate: number;
    status: string;
}

const PaymentAndVerifyWithSidebar = () => {
    const [data, setData] = useState<PaymentData[]>([]);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [code, setCode] = useState<string>("");
    const [verifiedDetails, setVerifiedDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [discounts, setDiscounts] = useState<DiscountData[]>([]);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);

    const fetchPayment = async () => {
        try {
            const response = await fetch('/api/payment', { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch payment data.');


            const data = await response.json();
            console.log("Fetched Payment Data:", data); // Debugging log
            setData(data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
            toast.error('Failed to load payments. Please try again later.');
        }
    };

    const fetchOrder = async () => {
        try {
            const response = await fetch('/api/order', { method: 'GET' });
            if (!response.ok) throw new Error('Failed to fetch payment data.');

            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Failed to fetch items:', error);
            toast.error('Failed to load payments. Please try again later.');
        }
    };    

    const handleVerify = async () => {
        if (!code) {
            toast.error("Please enter a code to verify.");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/payment', {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            const result = await response.json();

            if (response.ok) {
                setVerifiedDetails(result.verifiedDetails);
                toast.success("Code is valid");
            } else {
                toast.error(result.message || "Invalid code");
            }
        } catch (error: any) {
            console.error("Verification error:", error.message);
            toast.error(error.message || "Failed to verify the code.");
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchPayment();
        fetchOrder();
    }, []);


    const totalPages = Math.ceil(data.length / itemsPerPage);


    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

   
    const applyDiscountWithValidation = (paymentId: number, isLegitimate: boolean) => {
        const updatedData = data.map((payment) => {
            if (payment.payment_id === paymentId) {
                if (
                    payment.discount?.discount_name === "PWD" ||
                    payment.discount?.discount_name === "Senior Citizen"
                ) {
                    if (!isLegitimate) {
                        // Deduct 20% from the most expensive product
                        const mostExpensiveProduct = payment.order?.details?.reduce(
                            (max, item) => (item.price > max.price ? item : max),
                            { price: 0 }
                        );
   
                        if (mostExpensiveProduct && mostExpensiveProduct.price > 0) {
                            const discountAmount =
                                mostExpensiveProduct.price * 0.2; // 20% discount
                            return {
                                ...payment,
                                amount: payment.amount - discountAmount,
                            };
                        }
                    }
                }
            }
            return payment;
        });
   
        setData(updatedData);
    };
   
    return (
        <div className="relative mt-12 mx-auto max-w-7xl">
            <p className="text-3xl text-[#483C32] font-bold text-center mb-6">Payments & Verify Code</p>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Discount Availed</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.length > 0 ? (
                        paginatedData.map((payment) => (
                            <TableRow key={payment.payment_id}>
                                <TableCell>{payment.order?.order_id ?? "N/A"}</TableCell>
                                <TableCell>{payment.payment_method}</TableCell>
                                <TableCell>
                                    {payment.amount != null ? `₱${payment.amount.toFixed(2)}` : "N/A"}
                                </TableCell>
                                <TableCell>{payment.discount?.discount_name || "No Discount"}</TableCell>
                                <TableCell>{payment.payment_status}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>


            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
                {currentPage > 1 && (
                    <Button variant="outline" onClick={() => goToPage(currentPage - 1)}>
                        Previous
                    </Button>
                )}
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index}
                        variant={currentPage === index + 1 ? 'default' : 'outline'}
                        onClick={() => goToPage(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                {currentPage < totalPages && (
                    <Button variant="outline" onClick={() => goToPage(currentPage + 1)}>
                        Next
                    </Button>
                )}
            </div>


            {isSidebarVisible && (
    <div
        className={`fixed top-0 right-0 w-[30%] bg-gray-100 h-full shadow-lg transition-transform transform ${
            isSidebarVisible ? "translate-x-0" : "translate-x-full"
        }`}
    >
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Enter Verification Code</h2>
            <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2 border rounded text-black mb-4"
                placeholder="Enter code"
            />
            <Button
                variant="default"
                onClick={handleVerify}
                disabled={loading}
                className="w-full"
            >
                {loading ? "Verifying..." : "Verify Code"}
            </Button>
            {verifiedDetails && (
                <div className="mt-6 space-y-4">
                    <p><strong>Order ID:</strong> {verifiedDetails.order?.order_id || "N/A"}</p>
                    <p><strong>Customer Name:</strong> {verifiedDetails.order?.customer_name || "N/A"}</p>
                    <p><strong>Service Type:</strong> {verifiedDetails.order?.service_type || "N/A"}</p>
                    <p><strong>Date:</strong> {verifiedDetails.order?.date || "N/A"}</p>
                    <p><strong>Payment Method:</strong> {verifiedDetails.payment_method}</p>
                    <p><strong>Total Amount:</strong> ₱{verifiedDetails.amount?.toFixed(2)}</p>
                    <p><strong>Status:</strong> {verifiedDetails.payment_status}</p>
                    <p><strong>Discount:</strong> {verifiedDetails.discount?.discount_name || "No Discount"}</p>
                   
                    {verifiedDetails.discount?.discount_name === "PWD" ||
                    verifiedDetails.discount?.discount_name === "Senior Citizen" ? (
                        <div className="mt-4 space-y-2">
                            <Button
                                variant="default"
                                onClick={() => {
                                    applyDiscountWithValidation(
                                        verifiedDetails.payment_id,
                                        true // Legitimate
                                    );
                                    toast.success("Legitimacy confirmed. No discount applied.");
                                }}
                                className="w-full"
                            >
                                Confirm Legitimate
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    applyDiscountWithValidation(
                                        verifiedDetails.payment_id,
                                        false // Not legitimate
                                    );
                                    toast.warn("Not legitimate. 20% discount applied.");
                                    const updatedPayment = data.find(payment => payment.payment_id === verifiedDetails.payment_id);
                                    if (updatedPayment) {
                                        setVerifiedDetails({
                                            ...verifiedDetails,
                                            amount: updatedPayment.amount
                                        });
                                    }
                                }}
                                className="w-full"
                            >
                                Deny Legitimate
                            </Button>
                        </div>
                    ) : null}


                    {verifiedDetails.payment_method === "card" && (
                        <div>
                            <label className="block font-medium mb-2">Reference Number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded text-black"
                                placeholder="Enter reference number"
                            />
                        </div>
                    )}


                    {(verifiedDetails.payment_method === "gcash" ||
                        verifiedDetails.payment_method === "paymaya") && (
                        <div>
                            <label className="block font-medium mb-2">Reference Number</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border rounded text-black"
                                placeholder="Enter reference number"
                            />
                        </div>
                    )}


                    {verifiedDetails.payment_method === "otc" && (
                        <div>
                            <label className="block font-medium mb-2">Amount Paid</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border rounded text-black"
                                placeholder="Enter amount paid"
                                onChange={(e) => {
                                    const change =
                                        parseFloat(e.target.value) -
                                        (verifiedDetails.amount || 0);
                                    setVerifiedDetails({
                                        ...verifiedDetails,
                                        change: change >= 0 ? change : 0,
                                    });
                                }}
                            />
                            <p className="mt-2">
                                <strong>Change:</strong> ₱
                                {verifiedDetails.change?.toFixed(2) || "0.00"}
                            </p>
                        </div>
                    )}
                </div>
            )}
            <Button
                variant="outline"
                onClick={() => setIsSidebarVisible(false)}
                className="mt-4 w-full"
            >
                Close
            </Button>
        </div>
    </div>
)}


{isSidebarVisible && (
    <div
        className={`fixed top-0 right-0 w-[30%] bg-white h-full shadow-lg transition-transform transform ${
            isSidebarVisible ? "translate-x-0" : "translate-x-full"
        }`}
    >
        <div className="p-6 space-y-6">
            {/* Header */}
            <h2 className="text-xl font-semibold text-center border-b pb-4">
                Payment Verification
            </h2>


            {/* Verification Code Section */}
            <div>
                <h3 className="text-lg font-medium">Enter Verification Code</h3>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
                    placeholder="Verification code"
                />
                <Button
                    variant="default"
                    onClick={handleVerify}
                    disabled={loading}
                    className="w-full mt-2"
                >
                    {loading ? "Verifying..." : "Verify"}
                </Button>
            </div>


            {/* Verified Details */}
            {verifiedDetails && (
                <div className="space-y-6">
                    {/* Collapsible: Order Information */}
                    <div className="space-y-2">
                        <details open>
                            <summary className="text-lg font-medium cursor-pointer">
                                Order Information
                            </summary>
                            <div className="pl-4 mt-2 text-sm space-y-1">
                                <p><strong>Order ID:</strong> {verifiedDetails?.order?.order_id || "N/A"}</p>
                                <p><strong>Customer:</strong> {verifiedDetails?.order?.customer_name || "N/A"}</p>
                                <p><strong>Date:</strong> {verifiedDetails?.order?.date || "N/A"}</p>
                            </div>
                        </details>
                    </div>


                    {/* Collapsible: Payment Information */}
                    <div className="space-y-2">
                        <details open>
                            <summary className="text-lg font-medium cursor-pointer">
                                Payment Information
                            </summary>
                            <div className="pl-4 mt-2 text-sm space-y-1">
                                <p>
                                    <strong>Method:</strong> {verifiedDetails?.payment_method}
                                </p>
                                <p>
                                    <strong>Amount:</strong>{" "}
                                    <span className="text-lg font-semibold text-green-600">
                                        ₱{verifiedDetails?.amount?.toFixed(2) || "0.00"}
                                    </span>
                                </p>
                                <p>
                                    <strong>Discount:</strong>{" "}
                                    {verifiedDetails?.discount?.discount_name || "No Discount"}
                                </p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span
                                        className={`font-bold ${
                                            verifiedDetails?.payment_status === "Successful"
                                                ? "text-green-600"
                                                : "text-gray-600"
                                        }`}
                                    >
                                        {verifiedDetails?.payment_status || "Pending"}
                                    </span>
                                </p>
                            </div>
                        </details>
                    </div>


                    {/* Discount Validation (if applicable) */}
                    {(verifiedDetails?.discount?.discount_name === "PWD" ||
                        verifiedDetails?.discount?.discount_name === "Senior Citizen") &&
                        verifiedDetails?.payment_status !== "Successful" && (
                            <div>
                                <h3 className="text-lg font-medium">Discount Validation</h3>
                                <div className="flex justify-between mt-2 space-x-4">
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            applyDiscountWithValidation(
                                                verifiedDetails.payment_id,
                                                true // Legitimate
                                            );
                                            toast.success("Legitimacy confirmed. No discount applied.");
                                        }}
                                        className="flex-1"
                                    >
                                        Confirm Legitimate
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            applyDiscountWithValidation(
                                                verifiedDetails.payment_id,
                                                false // Not legitimate
                                            );
                                            toast.warn("Not legitimate. 20% discount applied.");
                                            const updatedPayment = data.find(
                                                payment =>
                                                    payment.payment_id === verifiedDetails.payment_id
                                            );
                                            if (updatedPayment) {
                                                setVerifiedDetails({
                                                    ...verifiedDetails,
                                                    amount: updatedPayment.amount,
                                                });
                                            }
                                        }}
                                        className="flex-1"
                                    >
                                        Deny Legitimate
                                    </Button>
                                </div>
                            </div>
                        )}


                    {/* Finalize Payment */}
                    {verifiedDetails?.payment_status !== "Successful" && (
                        <Button
                            variant="default"
                            onClick={() => {
                                if (window.confirm("Are you sure? This cannot be undone.")) {
                                    setData((prevData) =>
                                        prevData.map((payment) =>
                                            payment.payment_id === verifiedDetails.payment_id
                                                ? { ...payment, payment_status: "Successful" }
                                                : payment
                                        )
                                    );
                                    setVerifiedDetails({
                                        ...verifiedDetails,
                                        payment_status: "Successful",
                                    });
                                    toast.success("Payment marked as successful.");
                                }
                            }}
                            className="w-full"
                        >
                            Finalize Payment
                        </Button>
                    )}
                </div>
            )}


            {/* Close Sidebar */}
            <Button
                variant="outline"
                onClick={() => setIsSidebarVisible(false)}
                className="w-full"
            >
                Close
            </Button>
        </div>
    </div>
)}


            <div
                className={`fixed top-1/2 transform -translate-y-1/2 z-10 ${
                    isSidebarVisible ? "right-[30%]" : "right-0"
                }`}
            >
                {isSidebarVisible ? (
                    <IoIosArrowDroprightCircle
                        size={40}
                        className="text-gray-600 hover:text-gray-800 cursor-pointer"
                        onClick={() => setIsSidebarVisible(false)}
                    />
                ) : (
                    <IoIosArrowDropleftCircle
                        size={40}
                        className="text-gray-600 hover:text-gray-800 cursor-pointer"
                        onClick={() => setIsSidebarVisible(true)}
                    />
                )}
            </div>
        </div>
    );
};


export default PaymentAndVerifyWithSidebar;
