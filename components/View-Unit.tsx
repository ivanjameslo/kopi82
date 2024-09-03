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
import UpdateUnit from './Update-Unit';

interface UnitData {
    unit_id: number;
    unit_name: string;
};

const ViewUnit = () => {

    const router = useRouter();

    const [data, setData] = useState<UnitData[]>([]);
    const [selectedItem, setSelectedItem] = useState<UnitData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    //READ
    const fetchUnitData = async () => {
        const response = await fetch('/api/unit', {
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
        fetchUnitData();
    }, []);

    //UPDATE
    const handleEdit = (unit: any) => {
        setSelectedItem(unit);
        setIsEditModalOpen(true);
    }

    const handleSaveEdit = (updatedUnit: any) => {
        setData(data.map((unit) => (unit.unit_id === updatedUnit.unit_id ? updatedUnit : unit)));
    }

    const handleCloseEdit = () => {
        setIsEditModalOpen(false);
        setSelectedItem(null);
    }

    //DELETE
    const handleDelete = async (unit_id: number) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this item?");
        if (!isConfirmed) {
            return;
        }
        try {
            const response = await fetch(`/api/unit/${unit_id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete unit');
            }

            setData(data.filter((unit) => unit.unit_id !== unit_id));
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
                        <TableHeader>Unit ID</TableHeader>
                        <TableHeader>Unit Name</TableHeader>
                        <TableHeader>Action</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((unit) => (
                        <TableRow key={unit.unit_id}>
                            <TableCell>{unit.unit_id}</TableCell>
                            <TableCell>{unit.unit_name}</TableCell>
                            <TableCell className="text-center">
                                <Button variant="outline" className="mx-1" onClick={() => handleEdit(unit)}>
                                    Edit
                                </Button>
                                <Button variant="outline" className="mx-1" onClick={() => handleDelete(unit.unit_id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            {isEditModalOpen && selectedItem && (
                <UpdateUnit
                selectedItem={selectedItem}
                onSave={handleSaveEdit}
                onClose={handleCloseEdit}
                />
            )}
        </div>
    );
};

export default ViewUnit;