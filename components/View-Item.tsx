'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MdEdit, MdDelete } from "react-icons/md";
import UpdateItemModal from '@/components/Update-Item'; // New component for the modal
import Link from 'next/link';
import AddUnit from '@/components/Add-Unit';
import AddCategory from '@/components/Add-Category';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "./ui/pagination";

interface ItemData {
    item_id: number;
    item_name: string;
    description: string;
    unit: {
        unit_id: number;
        unit_name: string;
    };
    category: {
        category_id: number;
        category_name: string;
    };
    isUsed: boolean;
}

interface UnitData {
    unit_id: number;
    unit_name: string;
}

interface CategoryData {
    category_id: number;
    category_name: string;
}

const ViewItem = () => {
    const [data, setData] = useState<ItemData[]>([]);
    const [unit, setUnit] = useState<UnitData[]>([]);
    const [category, setCategory] = useState<CategoryData[]>([]);
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Fetch Units
    const fetchUnit = async () => {
        try {
            const response = await fetch('/api/unit');
            const data = await response.json();
            setUnit(data);
        } catch (error) {
            console.error('Failed to fetch unit', error);
        }
    };

    // Fetch Categories
    const fetchCategory = async () => {
        try {
            const response = await fetch('/api/category');
            const data = await response.json();
            setCategory(data);
        } catch (error) {
            console.error('Failed to fetch category', error);
        }
    };

    // Fetch Items
    const fetchItemData = async () => {
        try {
            const response = await fetch('/api/item', { method: 'GET' });
            const data = await response.json();
            setData(data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        }
    };

    // Load initial data on mount
    useEffect(() => {
        fetchUnit();
        fetchCategory();
        fetchItemData();
    }, []);

    // Handle Edit
    const handleEdit = (item: ItemData) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    // Handle Save Edit
    const handleSaveEdit = async (updatedItem: ItemData) => {
        try {
            const updatedItemWithIsUsed = { ...updatedItem, isUsed: selectedItem?.isUsed || false };
            // Run multiple async tasks concurrently
            const [updateResponse, updatedUnits, updatedCategories] = await Promise.all([
                fetch(`/api/item/${updatedItem.item_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedItemWithIsUsed),
                }),
                fetch('/api/unit'), // Fetch the updated unit list
                fetch('/api/category'), // Fetch the updated category list
            ]);
    
            if (updateResponse.ok) {
                const updatedItemFromServer = await updateResponse.json();
    
                // Update local data
                setData(prevData =>
                    prevData.map(item => (item.item_id === updatedItemFromServer.item_id ? updatedItemFromServer : item))
                );
    
                // Optionally update units and categories if necessary
                setUnit(await updatedUnits.json());
                setCategory(await updatedCategories.json());
            } else {
                console.error('Failed to save updated item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
        setIsEditModalOpen(false); // Close the modal
    };


    // Handle Delete
    const handleDelete = async (item_id: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (!isConfirmed) return;

        try {
            await fetch(`/api/item/${item_id}`, { method: 'DELETE' });
            setData(prevData => prevData.filter(item => item.item_id !== item_id));
        } catch (error) {
            console.error('Failed to delete item', error);
        }
    };

    const findUnitNameById = (unit_id: number, units: UnitData[]): string => {
        const unit = units.find(u => u.unit_id === unit_id);
        return unit ? unit.unit_name : 'Unknown Unit';
    };

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
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">Items</p>

            <div className="flex justify-end mt-10 space-x-4">
                <Link href="./Item/Add-Item">
                    <Button>Add New Item</Button>
                </Link>
                <AddUnit onModalClose={() => { fetchUnit(); fetchItemData(); }} />
                <AddCategory onModalClose={() => { fetchCategory(); fetchItemData(); }} />
            </div>

            <div className="mt-10">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {/* <TableHead className="text-center">ID</TableHead> */}
                            <TableHead>Item Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData && paginatedData.map ? (
                            paginatedData.map((items) => (
                                <TableRow key={items.item_id}>
                                    {/* <TableCell className="text-center">{items.item_id}</TableCell> */}
                                    <TableCell>{items.item_name}</TableCell>
                                    <TableCell>{items.description}</TableCell>
                                    <TableCell>{findUnitNameById(items.unit.unit_id, unit)}</TableCell>
                                    <TableCell>{items.category.category_name}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <MdEdit size={25} style={{ color: "#3d3130" }} className="cursor-pointer" onClick={() => handleEdit(items)} />
                                            {!items.isUsed && (
                                                <MdDelete size={25} style={{ color: "#d00000" }} className="cursor-pointer" onClick={() => handleDelete(items.item_id)} />
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

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

            {isEditModalOpen && selectedItem && (
                <UpdateItemModal
                    selectedItem={selectedItem}
                    unitOptions={unit}
                    categoryOptions={category}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};

export default ViewItem;