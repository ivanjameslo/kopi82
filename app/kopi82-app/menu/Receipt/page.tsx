"use client";

import { useParams } from "next/navigation";
import { useRef } from "react";
import { toJpeg } from "html-to-image";
import "./receipt.css";

const GenerateCodePage = () => {
    const { code } = useParams(); // Dynamically access the route parameter
    const receiptRef = useRef<HTMLDivElement>(null);

    const receiptData = {
        companyName: "Kopi82 Coffee Shop",
        address: "123 Coffee Street, Bean City, 45678",
        phone: "(123) 456-7890",
        email: "info@kopi82.com",
        orderId: 12345, // Example data, replace with dynamic data
        customerName: "John Doe",
        date: new Date().toLocaleDateString(),
        paymentMethod: "Credit Card",
        amount: 1250.75,
        discount: "Senior Citizen (20%)",
        status: "Successful",
    };

    const downloadReceipt = () => {
        if (receiptRef.current) {
            toJpeg(receiptRef.current, { quality: 0.95 })
                .then((dataUrl) => {
                    const link = document.createElement("a");
                    link.href = dataUrl;
                    link.download = `receipt-${receiptData.orderId}.jpg`;
                    link.click();
                })
                .catch((error) => {
                    console.error("Could not generate receipt image", error);
                });
        }
    };

    return (
        <div className="page-container">
            {/* Receipt */}
            <div ref={receiptRef} className="receipt-container">
                <h2 className="receipt-title">Payment Receipt</h2>

                {/* Company Information */}
                <div className="company-info">
                    <p>{receiptData.companyName}</p>
                    <p>{receiptData.address}</p>
                    <p>Phone: {receiptData.phone}</p>
                    <p>Email: {receiptData.email}</p>
                </div>

                <hr className="divider" />

                {/* Receipt Details */}
                <div className="receipt-details">
                    <p>
                        <strong>Order ID:</strong> {receiptData.orderId}
                    </p>
                    <p>
                        <strong>Customer Name:</strong> {receiptData.customerName}
                    </p>
                    <p>
                        <strong>Date:</strong> {receiptData.date}
                    </p>
                    <p>
                        <strong>Payment Method:</strong> {receiptData.paymentMethod}
                    </p>
                    <p>
                        <strong>Amount:</strong>{" "}
                        <span className="receipt-amount">
                            ₱{receiptData.amount.toFixed(2)}
                        </span>
                    </p>
                    <p>
                        <strong>Discount:</strong> {receiptData.discount}
                    </p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span
                            className={`receipt-status ${
                                receiptData.status === "Successful"
                                    ? "text-green"
                                    : "text-pending"
                            }`}
                        >
                            {receiptData.status}
                        </span>
                    </p>
                </div>

                <hr className="divider" />

                {/* Footer */}
                <div className="receipt-footer">
                    <p>Thank you for your payment!</p>
                    <p>Visit us again!</p>
                </div>
            </div>

            {/* Download Button */}
            <button onClick={downloadReceipt} className="download-button">
                Download Receipt
            </button>
        </div>
    );
};

export default GenerateCodePage;
