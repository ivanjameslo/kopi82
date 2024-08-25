'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { error } from 'console';
import { set } from 'react-hook-form';
import EditFrontInventory from '../Edit-FrontInventory/page';

interface FrontInventoryData {
    fd_id: number;
    bd_id: number;
    in_stock: number;
    unit: string;
    stock_used: number;
    stock_damaged: number;
    product_id: number;
};

const frontInventory = () => {
    
    const router = useRouter();

    const [data, setData] = useState<FrontInventoryData[]>([]);
    const [selectedItem, setSelectedItem] = useState<FrontInventoryData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    //READ FRONT INVENTORY DATA
    const fetchFrontInventoryData = async () => {
        const response = await fetch('/api/front_inventory', {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    };

    useEffect(() => {
        fetchFrontInventoryData().catch(error => console.error(error));
    }, []);

    //ADD NEW FRONT INVENTORY PAGE
    const handleAddNewFrontInventory = () => {
        router.push('/Add-FrontInventory');
    };

    //VIEW MODAL
    const handleViewDetails = (item: FrontInventoryData) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    //EDIT MODAL
    const handleEditDetails = (item: FrontInventoryData) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = (updatedItem: FrontInventoryData) => {
        setData(data.map(item => item.fd_id === updatedItem.fd_id ? updatedItem : item));
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedItem(null);
    };

    //DELETE FRONT INVENTORY
    const handleDeleteItem = async (fd_id: number) => {
        try {
            const response = await fetch(`/api/front_inventory/${fd_id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setData(data.filter(item => item.fd_id !== fd_id));
        } catch (error) {
            console.error('Failed to delete item: ', error);
        }
    };

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Front Inventory
            </p>
            <div className="flex justify-end mt-10">
                <Button onClick={handleAddNewFrontInventory}>Add New Front Inventory</Button>
            </div>
            <div className="mt-10">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">ID</TableHead>
                            <TableHead className="text-center">Back Inventory ID</TableHead>
                            <TableHead className="text-center">In Stock</TableHead>
                            <TableHead className="text-center">Unit</TableHead>
                            {/* <TableHead className="text-center">Stock Used</TableHead>
                            <TableHead className="text-center">Stock Damaged</TableHead>
                            <TableHead className="text-center">Product ID</TableHead> */}
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.fd_id}>
                                <TableCell>{item.fd_id}</TableCell>
                                <TableCell>{item.bd_id}</TableCell>
                                <TableCell>{item.in_stock}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                {/* <TableCell>{data.stock_used}</TableCell>
                                <TableCell>{data.stock_damaged}</TableCell>
                                <TableCell>{data.product_id}</TableCell> */}
                                <TableCell>
                                    <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => handleViewDetails(item)}>
                                        View
                                    </Button>
                                    <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={() => handleEditDetails(item)}>
                                        Edit
                                    </Button>
                                    <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                                    onClick={() => handleDeleteItem(item.fd_id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            
            {/* MODAL */}
            </div>
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded-md shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Item Details</h2>
                        <p><strong>ID:</strong> {selectedItem.fd_id}</p>
                        <p><strong>Back Inventory ID:</strong> {selectedItem.bd_id}</p>
                        <p><strong>In Stock:</strong> {selectedItem.in_stock}</p>
                        <p><strong>Unit:</strong> {selectedItem.unit}</p>
                        <p><strong>Stock Used:</strong> {selectedItem.stock_used}</p>
                        <p><strong>Stock Damaged:</strong> {selectedItem.stock_damaged}</p>
                        <p><strong>Product ID:</strong> {selectedItem.product_id}</p>
                        <Button onClick={handleCloseModal} className="mt-4">Close</Button>
                    </div>
                </div>
            )}

            {isEditModalOpen && selectedItem && (
                <EditFrontInventory
                    selectedItem={selectedItem}
                    onClose={handleCloseEditModal}
                    onSave={handleSaveEdit}
                />
            )}
        </div>
    );
};
export default frontInventory;