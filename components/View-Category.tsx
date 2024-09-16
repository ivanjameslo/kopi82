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
import UpdateCategory from './Update-Category';

interface CategoryData {
    category_id: number;
    category_name: string;
};

const ViewCategory = () => {

    const router = useRouter();

    const [data, setData] = useState<CategoryData[]>([]);
    const [selectedItem, setSelectedItem] = useState<CategoryData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    //READ
    const fetchCategoryData = async () => {
        const response = await fetch('/api/category', {
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
        fetchCategoryData();
    }, []);

    //UPDATE
    const handleEdit = (category: any) => {
        setSelectedItem(category);
        setIsEditModalOpen(true);
    }

    const handleSaveEdit = (updatedCategory: any) => {
        setData(data.map((category) => (category.category_id === updatedCategory.category_id ? updatedCategory : category)));
    }

    const handleCloseEdit = () => {
        setIsEditModalOpen(false);
        setSelectedItem(null);
    }

    //DELETE
    const handleDelete = async (category_id: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (!isConfirmed) {
            return;
        }
        try {
            const response = await fetch(`/api/category/${category_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete category');
            }

            setData(data.filter((category) => category.category_id !== category_id));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mt-10 mx-auto max-w-7xl px-4">
            <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">ID</TableHead>
                        <TableHead className="text-center">Category Name</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((category) => (
                        <TableRow key={category.category_id}>
                            <TableCell className="text-center">{category.category_id}</TableCell>
                            <TableCell className="text-center">{category.category_name}</TableCell>
                            <TableCell className="text-center">
                                <Button variant="outline" className="mx-1" onClick={() => handleEdit(category)}>
                                    Edit
                                </Button>
                                <Button variant="outline" className="mx-1" onClick={() => handleDelete(category.category_id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            {isEditModalOpen && selectedItem && (
                <UpdateCategory
                selectedItem={selectedItem}
                onSave={handleSaveEdit}
                onClose={handleCloseEdit}
                />
            )}
        </div>
    );
};

export default ViewCategory;