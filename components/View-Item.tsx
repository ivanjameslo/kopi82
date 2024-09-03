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

interface ItemData {
    item_id: number;
    item_name: string;
    unit: {
        unit_id: number;
        unit_name: string;
    }
    category: {
        category_id: number;
        category_name: string;
    }
    location_shelf: {
        ls_id: number;
        ls_name: string;
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
    });

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
            console.error('Fsiled to delete item', error);
        };
    }

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Items
            </p>

            <div className="flex justify-end mt-10 space-x-4">
                <link href="./Item/Add-Unit">
                    <Button>Add New Unit</Button>
                </link>
                <link href="./Item/Add-Category">
                    <Button>Add New Category</Button>
                </link>
                <link href="./Item/Add-Location-Shelf">
                    <Button>Add New Location Shelf</Button>
                </link>
            </div>

            <div className="mt-10">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="text-center">ID</TableHead>
                    <TableHead className="text-center">Item Name</TableHead>
                    <TableHead className="text-center">Unit</TableHead>
                    <TableHead className="text-center">Category</TableHead>
                    <TableHead className="text-center">Shelf Location</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((items) => (
                    <TableRow key={items.item_id}>
                        <TableCell className="text-center">{items.item_id}</TableCell>
                        <TableCell className="text-center">{items.item_name}</TableCell>
                        <TableCell className="text-center">{items.unit.unit_name}</TableCell>
                        <TableCell className="text-center">{items.category.category_name}</TableCell>
                        <TableCell className="text-center">{items.location_shelf.ls_name}</TableCell>
                        <TableCell className="text-center">
                        <Button variant="outline" className="mx-1" onClick={() => handleEdit(items)}>
                            Edit
                        </Button>
                        <Button variant="outline" className="mx-1" onClick={() => handleDelete(items.item_id)}>
                            Delete
                        </Button>
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