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
        setData(data);
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
                                <TableCell className="text-center">{item.fd_id}</TableCell>
                                <TableCell className="text-center">{item.bd_id}</TableCell>
                                <TableCell className="text-center">{item.in_stock}</TableCell>
                                <TableCell className="text-center">{item.unit}</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="outline" className="mx-1" onClick={() => handleViewDetails(item)}>
                                        View
                                    </Button>
                                    <Button variant="outline" className="mx-1" onClick={() => handleEditDetails(item)}>
                                        Edit
                                    </Button>
                                    <Button variant="outline" className="mx-1" onClick={() => handleDeleteItem(item.fd_id)}>
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
                    <div className="bg-white p-8 rounded-md shadow-md min-h-[50vh] max-h-[80vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Item Details</h2>
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">ID:</td>
                                    <td className="px-5 py-3 whitespace-nowrap">{selectedItem.fd_id}</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Back Inventory ID:</td>
                                    <td className="px-5 py-3 whitespace-nowrap">{selectedItem.bd_id}</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">In Stock:</td>
                                    <td className="px-5 py-3 whitespace-nowrap">{selectedItem.in_stock}</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Unit:</td>
                                    <td className="px-5 py-3 whitespace-nowrap">{selectedItem.unit}</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Stock Used:</td>
                                    <td className="px-5 py-3 whitespace-nowrap">{selectedItem.stock_used}</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Stock Damaged:</td>
                                    <td className="px-5 py-3 whitespace-nowrap">{selectedItem.stock_damaged}</td>
                                </tr>
                                <tr>
                                    <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Product ID:</td>
                                    <td className="px-5 py-3 whitespace-nowrap">{selectedItem.product_id}</td>
                                </tr>
                            </tbody>
                        </table>
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