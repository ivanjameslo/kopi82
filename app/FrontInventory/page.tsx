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

    const[data, setData] = useState<FrontInventoryData[]>([]);

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

    const handleAddNewFrontInventory = () => {
        router.push('/Add-FrontInventory');
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
                            <TableHead className="text-center">Stock Used</TableHead>
                            <TableHead className="text-center">Stock Damaged</TableHead>
                            <TableHead className="text-center">Product ID</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((data, index) => (
                            <TableRow key={index}>
                                <TableCell>{data.fd_id}</TableCell>
                                <TableCell>{data.bd_id}</TableCell>
                                <TableCell>{data.in_stock}</TableCell>
                                <TableCell>{data.unit}</TableCell>
                                <TableCell>{data.stock_used}</TableCell>
                                <TableCell>{data.stock_damaged}</TableCell>
                                <TableCell>{data.product_id}</TableCell>
                                <TableCell>
                                    <Button>View</Button>
                                    <Button>Edit</Button>
                                    <Button>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
export default frontInventory;