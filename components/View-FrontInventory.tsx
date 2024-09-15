'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StockInFrontInventory from './Stock-In-FrontInventory';
import StockOutFrontInventory from './Stock-Out-FrontInventory';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FrontInventoryData {
    fd_id: number;
    bd_id: number;
    item_id: number;
    in_stock: number;
    unit_id: number;
    stock_used: number;
    stock_damaged: number;
    stock_in_date: string | null;
    stock_out_date: string | null;
    product_id: number | null;
};

interface BackInventoryData {
    bd_id: number;
    item_id: number;
    unit_id: number;
}

interface ItemData {
    item_id: number;
    item_name: string;
}

interface UnitData {
    unit_id: number;
    unit_name: string;
}

const FrontInventory = () => {
    
    const router = useRouter();

    const [data, setFrontInventoryData] = useState<FrontInventoryData[]>([]);
    const [backInventoryData, setBackInventoryData] = useState<BackInventoryData[]>([]);
    const [items, setItems] = useState<ItemData[]>([]);
    const [units, setUnits] = useState<UnitData[]>([]);
    
    const [selectedItem, setSelectedItem] = useState<FrontInventoryData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStockInModalOpen, setIsStockInModalOpen] = useState(false);
    const [isStockOutModalOpen, setIsStockOutModalOpen] = useState(false);

    //READ DATA FROM VARIOUS ENDPOINTS
    const fetchData = async (endpoint: string) => {
        const response = await fetch(endpoint, { method: 'GET' });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    };

    const fetchAllData = async () => {
        try {
            const [frontInventoryData, backInventoryData, itemsData, unitsData] = await Promise.all([
                fetchData('/api/front_inventory'),
                fetchData('/api/back_inventory'),
                fetchData('/api/item'),
                fetchData('/api/unit'),
            ]);
            setFrontInventoryData(frontInventoryData);
            setBackInventoryData(backInventoryData);
            setItems(itemsData);
            setUnits(unitsData);
        } catch (error) {
            console.error('Failed to fetch data: ', error);
        }
    }

    // Fetch data on page load
    useEffect(() => {
        fetchAllData().catch(error => console.error(error));
    }, []);

    // ADD ALL BACK INVENTORY ITEMS TO FRONT INVENTORY
    const handleAddAllBackInventoryToFront = async () => {
        try {
            const existingBDIds = data.map(item => item.bd_id);
            const newBackInv = backInventoryData.filter(item => !existingBDIds.includes(item.bd_id));

            if (newBackInv.length === 0) {
                console.error('No new back inventory items to add to front inventory');
                return;
            }

            const newFrontInventory = newBackInv.map(item => ({
                bd_id: item.bd_id,
                in_stock: 0,
                stock_used: 0,
                stock_damaged: 0,
                stock_in_date: "N/A",
                stock_out_date: "N/A",
                product_id: null,
            }));

            const response = await fetch('/api/front_inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newFrontInventory),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const newFrontInventoryData = await response.json();
            setFrontInventoryData([...data, ...newFrontInventoryData]);

            router.refresh();
        } catch (error) {
            console.error('Failed to add back inventory items to front inventory: ', error);
        }
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

    //STOCK IN MODAL
    const handleStockIn = (item: FrontInventoryData) => {
        setSelectedItem(item);
        setIsStockInModalOpen(true);
    };

    const handleSaveStockIn = (updatedItem: FrontInventoryData) => {
        setFrontInventoryData(data.map(item => item.fd_id === updatedItem.fd_id ? updatedItem : item));
    };

    const handleCloseStockIn = () => {
        setIsStockInModalOpen(false);
        setSelectedItem(null);
    };

    //STOCK OUT MODAL
    const handleStockOut = (item: FrontInventoryData) => {
        setSelectedItem(item);
        setIsStockOutModalOpen(true);
    };

    const handleSaveStockOut = (updatedItem: FrontInventoryData) => {
        setFrontInventoryData(data.map(item => item.fd_id === updatedItem.fd_id ? updatedItem : item));
    };

    const handleCloseStockOut = () => {
        setIsStockOutModalOpen(false);
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
            setFrontInventoryData(data.filter(item => item.fd_id !== fd_id));
        } catch (error) {
            console.error('Failed to delete item: ', error);
        }
    };

    // Helper functions to get names from Back Inventory IDs
    const getItemNameFromBackInventory = (bd_id: number) => {
        // Find the corresponding back inventory entry by bd_id
        const backInvEntry = backInventoryData.find(backInv => backInv.bd_id === bd_id);
        console.log('Looking up item for bd_id:', bd_id, 'Back Inventory Entry:', backInvEntry);
        
        if (backInvEntry) {
            // Now get the corresponding item by item_id
            const item = items.find(item => item.item_id === backInvEntry.item_id);
            console.log('Item found for item_id:', backInvEntry.item_id, 'Item:', item);
            return item ? item.item_name : 'Unknown Item';
        } else {
            console.warn('No matching Back Inventory entry found for bd_id:', bd_id);
        }
        return 'Unknown Item';
    };
    
    const getUnitNameFromBackInventory = (bd_id: number) => {
        // Find the corresponding back inventory entry by bd_id
        const backInvEntry = backInventoryData.find(backInv => backInv.bd_id === bd_id);
        console.log('Looking up unit for bd_id:', bd_id, 'Back Inventory Entry:', backInvEntry);
        
        if (backInvEntry) {
            // Now get the corresponding unit by unit_id
            const unit = units.find(unit => unit.unit_id === backInvEntry.unit_id);
            console.log('Unit found for unit_id:', backInvEntry.unit_id, 'Unit:', unit);
            return unit ? unit.unit_name : 'Unknown Unit';
        } else {
            console.warn('No matching Back Inventory entry found for bd_id:', bd_id);
        }
        return 'Unknown Unit';
    };

    return (
        <div className="mt-24 ml-40 mr-40">

            <ToastContainer 
                position="bottom-right" 
                autoClose={5000} 
                hideProgressBar={false} 
                newestOnTop={false} 
                closeOnClick rtl={false} 
                pauseOnFocusLoss 
                draggable 
                pauseOnHover 
                style={{ zIndex: 9999 }} />

            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Front Inventory
            </p>
            <div className="flex justify-end mt-10">
                <Button onClick={handleAddAllBackInventoryToFront} className="ml-2">Set Front Inventory</Button>
            </div>
            <div className="mt-10">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">ID</TableHead>
                            <TableHead className="text-center">Back Inventory ID</TableHead>
                            <TableHead className="text-center">Item Name</TableHead>
                            <TableHead className="text-center">In Stock</TableHead>
                            <TableHead className="text-center">Unit</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.fd_id}>
                                <TableCell className="text-center">{item.fd_id}</TableCell>
                                <TableCell className="text-center">{item.bd_id}</TableCell>
                                <TableCell className="text-center">{getItemNameFromBackInventory(item.bd_id)}</TableCell>
                                <TableCell className="text-center">{item.in_stock}</TableCell>
                                <TableCell className="text-center">{getUnitNameFromBackInventory(item.bd_id)}</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="outline" className="mx-1" onClick={() => handleViewDetails(item)}>
                                        View
                                    </Button>
                                    <Button variant="outline" className="mx-1" onClick={() => handleStockIn(item)}>
                                        Stock In
                                    </Button>
                                    <Button variant="outline" className="mx-1" onClick={() => handleStockOut(item)}>
                                        Stock Out
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
                                    <td className="px-5 py-3 whitespace-nowrap">{getUnitNameFromBackInventory(selectedItem.bd_id)}</td>
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

            {isStockInModalOpen && selectedItem && (
                <StockInFrontInventory
                    selectedItem={selectedItem}
                    onClose={handleCloseStockIn}
                    onSave={handleSaveStockIn}
                />
            )}

            {isStockOutModalOpen && selectedItem && (
                <StockOutFrontInventory
                    selectedItem={selectedItem}
                    onClose={handleCloseStockOut}
                    onSave={handleSaveStockOut}
                />
            )}
        </div>
    );
};
export default FrontInventory;