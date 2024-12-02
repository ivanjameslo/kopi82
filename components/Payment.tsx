"use client";


import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "./ui/pagination";
import { useReceipt } from "@/lib/hooks/use-receipts";
import ReceiptPDFButton from "./Receipts-PDF-button";
interface PaymentData {
    payment_id: number;
    payment_method: string;
    payment_status: string;
    amount: number;
    subtotal: number;
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
    const itemsPerPage = 10;
    const [discounts, setDiscounts] = useState<DiscountData[]>([]);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [paymentId, setPaymentId] = useState<number | null>(null);
    const { receiptData } = useReceipt(paymentId ?? 0); // Provide default value of 0
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
            const response = await fetch(`/api/payment/${code}`, {
                method: "GET",
            });

            const result = await response.json();
            const { payment_id, payment_method, payment_status, amount, order, discount } = result;

            if (response.ok && result) {
                setVerifiedDetails(result);
                setPaymentId(payment_id); // This will trigger useReceipt to fetch new data
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



    const handleSubmit = async () => {
        if (verifiedDetails.payment_method === "gcash" && !verifiedDetails.referenceNumber) {
            toast.error("Please enter a reference number.");
            return;
        }

        if (verifiedDetails.payment_method === "otc" && verifiedDetails.change === undefined) {
            toast.error("Please enter the amount paid.");
            return;
        }

        try {
            const patchData =
                verifiedDetails.payment_method === "gcash" || verifiedDetails.payment_method === "paymaya" || verifiedDetails.payment_method === "card"
                    ? {
                        reference_no: verifiedDetails.referenceNumber,
                        payment_status: "Verified"
                    }
                    : {
                        amount_paid: verifiedDetails.amount_paid,
                        change: verifiedDetails.change,
                        payment_status: "Verified"
                    };


            const response = await fetch(`/api/payment/${verifiedDetails.payment_id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patchData),
            });

            if (response.ok) {
                toast.success("Payment data updated successfully!");
                // Refresh the payment data
                fetchPayment();
            } else {
                const result = await response.json();
                toast.error(result.message || "Failed to update payment.");
            }
        } catch (error) {
            console.error("Error submitting payment:", error);
            toast.error("Error submitting payment.");
        }
    };

    useEffect(() => {
        fetchPayment();
        fetchOrder();
    }, []);

    useEffect(() => {
        console.log("Receipt Data:", receiptData);
    }, [receiptData]);

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
                if (payment.discount?.discount_name === "PWD" || payment.discount?.discount_name === "Senior Citizen") {
                    if (isLegitimate) {
                        setVerifiedDetails({
                            ...verifiedDetails,
                            amount: payment.amount // Keep original amount
                        });
                    } else {
                        setVerifiedDetails({
                            ...verifiedDetails,
                            amount: payment.subtotal // Set to subtotal
                        });
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
                                <TableCell className="text-right">
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
            <div className="flex justify-center mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={currentPage === 1 ? undefined : () => currentPage > 1 && goToPage(currentPage - 1)}
                                style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1 }}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            goToPage(page);
                                        }}
                                        isActive={page === currentPage}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}
                        {totalPages > 5 && <PaginationEllipsis />}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                                style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto', opacity: currentPage === totalPages ? 0.5 : 1 }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            {isSidebarVisible && (
                <div
                    className={`fixed top-0 right-0 w-[30%] bg-gray-100 h-full shadow-lg transition-transform transform ${isSidebarVisible ? "translate-x-0" : "translate-x-full"
                        }`}
                    style={{
                        height: '100vh', // Make sure it takes the full height of the viewport
                        overflowY: 'auto', // Enable vertical scrolling when content overflows
                    }}
                >
                    <div className="p-6">
                        <h2 className="text-xl text-center font-semibold mb-4">Enter Verification Code</h2>
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
                                <p><strong>Date:</strong> {verifiedDetails.order?.date ? new Date(verifiedDetails.order?.date).toLocaleDateString() : "N/A"}</p> {/* Format the date */}
                                <p><strong>Payment Method:</strong> {verifiedDetails.payment_method}</p>
                                <p><strong>Total Amount:</strong> ₱{verifiedDetails.amount?.toFixed(2)}</p>
                                <p><strong>Status:</strong> {verifiedDetails.payment_status}</p>
                                <p><strong>Discount:</strong> {verifiedDetails.discount?.discount_name || "No Discount"}</p>

                                {receiptData && (
                                    <div className="mb-4">
                                        <ReceiptPDFButton receipt={receiptData} />
                                    </div>
                                )}
                                {verifiedDetails.discount?.discount_name === "PWD" ||
                                    verifiedDetails.discount?.discount_name === "Senior Citizen" ? (
                                    <div className="mt-4 flex space-x-2">
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                applyDiscountWithValidation(
                                                    verifiedDetails.payment_id,
                                                    true // Legitimate
                                                );
                                                toast.success("Legitimacy confirmed.");
                                            }}
                                            className="w-full bg-green-700"
                                        >
                                            Confirm Legitimate
                                        </Button>
                                        <Button
                                            variant="default"
                                            onClick={() => {
                                                applyDiscountWithValidation(
                                                    verifiedDetails.payment_id,
                                                    false // Not legitimate
                                                );
                                                toast.warn("Not legitimate. Discount will be removed.");
                                                const updatedPayment = data.find(payment => payment.payment_id === verifiedDetails.payment_id);
                                                if (updatedPayment) {
                                                    setVerifiedDetails({
                                                        ...verifiedDetails,
                                                        amount: updatedPayment.subtotal
                                                    });
                                                }
                                            }}
                                            className="w-full bg-red-700 text-white"
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
                                            onChange={(e) => setVerifiedDetails({ ...verifiedDetails, referenceNumber: e.target.value })}
                                        />
                                        <div>
                                            {receiptData && <ReceiptPDFButton receipt={receiptData} />}
                                            <Button
                                                variant="default"
                                                onClick={handleSubmit}
                                                className="w-full mt-4"
                                            >
                                                Submit
                                            </Button>
                                        </div>
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
                                                onChange={(e) => setVerifiedDetails({ ...verifiedDetails, referenceNumber: e.target.value })}
                                            />
                                            <div>
                                                <Button
                                                    variant="default"
                                                    onClick={handleSubmit}
                                                    className="w-full mt-4"
                                                >
                                                    Submit
                                                </Button>
                                            </div>
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
                                                const newAmount = parseFloat(e.target.value);

                                                if (!isNaN(newAmount)) {
                                                    const change = newAmount - (verifiedDetails.amount || 0);
                                                    setVerifiedDetails({
                                                        ...verifiedDetails,
                                                        amount_paid: newAmount >= 0 ? newAmount : 0, // Ensure non-negative value
                                                        change: change >= 0 ? change : 0, // Ensure non-negative change
                                                    });
                                                }
                                            }}
                                        />
                                        <p className="mt-2">
                                            <strong>Change:</strong> ₱
                                            {verifiedDetails.change?.toFixed(2) || "0.00"}
                                        </p>
                                        <div>
                                            <Button
                                                variant="default"
                                                onClick={handleSubmit}
                                                className="w-full mt-4"
                                            >
                                                Submit
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div
                className={`fixed top-1/2 transform -translate-y-1/2 z-10 ${isSidebarVisible ? "right-[30%]" : "right-0"
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