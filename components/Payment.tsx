'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
    };
    order: {
        order_id: number;
        customer_name: string;
        service_type: string;
        date: string;
    };
    createdAt: string;
}

const Payment = () => {
    const [data, setData] = useState<PaymentData[]>([]);
    const [isVerificationVisible, setIsVerificationVisible] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchPayment = async () => {
        try {
            const response = await fetch('/api/payment', { method: 'GET' });
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    useEffect(() => {
        fetchPayment();
    }, []);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    const handleVerificationSubmit = () => {
        alert(`Verification code submitted: ${verificationCode}`);
        setVerificationCode('');
    };

    return (
        <div className="relative mt-12 mx-auto max-w-7xl">
            <p className="text-3xl text-[#483C32] font-bold text-center mb-6">Payments</p>

            <div className="flex">
                {/* Table Section */}
                <div
                    className={`transition-all duration-500 ${
                        isVerificationVisible ? 'w-[70%] pr-10' : 'w-full'
                    }`}
                >
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
                                paginatedData.map((payments) => (
                                    <TableRow key={payments.payment_id}>
                                        <TableCell>{payments.order.order_id}</TableCell>
                                        <TableCell>{payments.payment_method}</TableCell>
                                        <TableCell>{payments.amount}</TableCell>
                                        <TableCell>{payments.discount.discount_name}</TableCell>
                                        <TableCell>{payments.payment_status}</TableCell>
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
                </div>

                {/* Verification Section */}
                <div
                    className={`transition-all duration-500 ${
                        isVerificationVisible ? 'w-[30%] bg-gray-800 text-white' : 'w-0'
                    } flex flex-col justify-center items-center h-screen fixed top-0 right-0`}
                >
                    {isVerificationVisible && (
                        <div className="w-full p-8">
                            <h2 className="text-lg font-semibold mb-6">Enter Verification Code</h2>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="w-full px-4 py-2 border rounded mb-4 text-black"
                                placeholder="Enter code"
                            />
                            <Button
                                variant="default"
                                onClick={handleVerificationSubmit}
                                className="w-full"
                            >
                                Check Verification Code
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Arrow */}
            <div
                className={`fixed top-1/2 transform -translate-y-1/2 z-10 ${
                    isVerificationVisible ? 'right-[30%]' : 'right-0'
                }`}
            >
                {isVerificationVisible ? (
                    <IoIosArrowDroprightCircle
                        size={40}
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => setIsVerificationVisible(!isVerificationVisible)}
                    />
                ) : (
                    <IoIosArrowDropleftCircle
                        size={40}
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => setIsVerificationVisible(!isVerificationVisible)}
                    />
                )}
            </div>
        </div>
    );
};

export default Payment;
