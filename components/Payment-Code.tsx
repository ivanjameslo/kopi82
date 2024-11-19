'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MdEdit, MdDelete } from "react-icons/md";
import Link from 'next/link';
import PaymentCode from '@/components/Payment-Code';
// import AddCategory from '@/components/Add-Category';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "./ui/pagination";

interface PaymentData {
    
}

const Payment = () => {
    const [data, setData] = useState<PaymentData[]>([]);
    // const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch Items
    const fetchPayment = async () => {
        try {
            const response = await fetch('/api/payment', { method: 'GET' });
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    // Load initial data on mount
    useEffect(() => {
        fetchPayment();
    }, []);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Slice data to show only the items for the current page
    const paginatedData = data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="mt-12 ml-40 mr-40">

        </div>
    );
};

export default Payment;




