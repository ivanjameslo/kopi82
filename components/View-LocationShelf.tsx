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
import UpdateLocationShelf from './Update-LocationShelf';

interface LocationShelfData {
    ls_id: number;
    ls_name: string;
};

const ViewLocationShelf = () => {

    const router = useRouter();

    const [data, setData] = useState<LocationShelfData[]>([]);
    const [selectedItem, setSelectedItem] = useState<LocationShelfData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    //READ
    const fetchLocationShelfData = async () => {
        const response = await fetch('/api/location_shelf', {
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
        fetchLocationShelfData();
    }, []);

    //UPDATE
    const handleEdit = (ls: any) => {
        setSelectedItem(ls);
        setIsEditModalOpen(true);
    }

    const handleSaveEdit = (updatedLS: any) => {
        setData(data.map((ls) => (ls.ls_id === updatedLS.ls_id ? updatedLS : ls)));
    }

    const handleCloseEdit = () => {
        setIsEditModalOpen(false);
        setSelectedItem(null);
    }

    //DELETE
    const handleDelete = async (ls_id: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (!isConfirmed) {
            return;
        }
        try {
            const response = await fetch(`/api/location_shelf/${ls_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete unit');
            }

            setData(data.filter((ls) => ls.ls_id !== ls_id));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="mt-10">
            <div>
            <Table>
                <TableCaption>Unit</TableCaption>
                <TableHead>
                    <TableRow>
                        <TableHeader>ID</TableHeader>
                        <TableHeader>Location Name</TableHeader>
                        <TableHeader>Action</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((ls) => (
                        <TableRow key={ls.ls_id}>
                            <TableCell>{ls.ls_id}</TableCell>
                            <TableCell>{ls.ls_name}</TableCell>
                            <TableCell className="text-center">
                                <Button variant="outline" className="mx-1" onClick={() => handleEdit(ls)}>
                                    Edit
                                </Button>
                                <Button variant="outline" className="mx-1" onClick={() => handleDelete(ls.ls_id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            {isEditModalOpen && selectedItem && (
                <UpdateLocationShelf
                selectedItem={selectedItem}
                onSave={handleSaveEdit}
                onClose={handleCloseEdit}
                />
            )}
        </div>
    );
};

export default ViewLocationShelf;