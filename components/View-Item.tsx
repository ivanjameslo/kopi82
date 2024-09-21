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
import { set } from 'react-hook-form';
import UpdateItem from './Update-Item';
import Link from 'next/link';
import { MdEdit, MdDelete } from "react-icons/md";

interface ItemData {
    item_id: number;
    item_name: string;
    description: string;
    unit: {
        unit_id: number;
        unit_name: string;
    }
    category: {
        category_id: number;
        category_name: string;
    }
};

const ViewItem = () => {
    
    const router = useRouter();

    const [data, setData] = useState<ItemData[]>([]);
    const [selectedItem, setSelectedItem] = useState<ItemData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    //READ
    const fetchItemData = async () => {
        const response = await fetch('/api/item', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        } 

        const data = await response.json();
        console.log(data);
        setData(data);
    }

    useEffect(() => {
        fetchItemData().catch(error => console.error(error));
    }, []);

    //UPDATE
    const handleEdit = (item: ItemData) => {
        setSelectedItem(item);
        setIsEditModalOpen(true);
    }

    const handleSaveEdit = (updatedItem: ItemData) => {
        setData(data.map(item => item.item_id === updatedItem.item_id ? updatedItem : item));
    }

    const handleCloseEdit = () => {
        setSelectedItem(null);
        setIsEditModalOpen(false);
    }

    //DELETE
    const handleDelete = async (item_id: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (!isConfirmed) {
            return;
        }
        try {
            await fetch(`/api/item/${item_id}`, {
                method: 'DELETE',
            });

            setData(data.filter(item => item.item_id !== item_id));
        } catch (error) {
            console.error('Failed to delete item', error);
        };
    }

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Items
            </p>

            <div className="flex justify-end mt-10 space-x-4">
                <Link href="./Item/Add-Item">
                    <Button>Add New Item</Button>
                </Link>
                <Link href="./Item/Add-Unit">
                    <Button>Manage Unit</Button>
                </Link>
                <Link href="./Item/Add-Category">
                    <Button>Manage Category</Button>
                </Link>
            </div>

            <div className="mt-10">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">Item Name</TableHead>
                    <TableHead className="text-center">Description</TableHead>
                    <TableHead className="text-center">Unit</TableHead>
                    <TableHead className="text-center">Category</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((items) => (
                    <TableRow key={items.item_id}>
                        <TableCell className="text-center">{items.item_id}</TableCell>
                        <TableCell className="text-center">{items.item_name}</TableCell>
                        <TableCell className="text-center">{items.description}</TableCell>
                        <TableCell className="text-center">{items.unit.unit_name}</TableCell>
                        <TableCell className="text-center">{items.category.category_name}</TableCell>
                        <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <MdEdit size={25} className="cursor-pointer" style={{color: '3d3130'}} onClick={() => handleEdit(items)} />
                            <MdDelete size={25} className="cursor-pointer" style={{color: 'd00000'}} onClick={() => handleDelete(items.item_id)} />
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>

            {isEditModalOpen && selectedItem && (
                <UpdateItem
                selectedItem={selectedItem}
                onSave={handleSaveEdit}
                onClose={handleCloseEdit}
                />
            )}
        </div>
    )
};

export default ViewItem;