'use client'

import { useState, ChangeEvent, FormEvent, TextareaHTMLAttributes, use, useEffect } from "react";
import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
    TableCaption,
  } from "@/components/ui/table";

const AddItem = () => {

    const router = useRouter();

    const [formDataArray, setFormDataArray] = useState([{
        item_id: uuidv4(),
        item_name: "",
        unit_id: "",
        category_id: "",
        ls_id: "",
    }]);

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newFormDataArray = [...formDataArray];
        newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
        setFormDataArray(newFormDataArray);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to submit this form?");
        if (!isConfirmed) {
            return;
        }
        try {
            await fetch('/api/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataArray),
            })
            router.push('/Item');
        } catch (error) {
            console.log("Error creating Unit", error);
        }
    };

    const addNewRow = () => {
        setFormDataArray([
            ...formDataArray,
            {
                item_id: uuidv4(),
                item_name: "",
                unit_id: "",
                category_id: "",
                ls_id: "",
            }
        ]);
    };

    
    //FETCHING OF DATA
    const [unitOptions, setUnitOptions] = useState<string[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [shelfLocationOptions, setShelfLocationOptions] = useState<string[]>([]);

    const fetchOptions = async () => {
        try {
            const unitResponse = await fetch('/api/unit');
            const categoryResponse = await fetch('/api/category');
            const shelfLocationResponse = await fetch('/api/location_shelf');

            const unitData = await unitResponse.json();
            const categoryData = await categoryResponse.json();
            const shelfLocationData = await shelfLocationResponse.json();

            setUnitOptions(unitData);
            setCategoryOptions(categoryData);
            setShelfLocationOptions(shelfLocationData);
        } catch (error) {
            console.log("Error fetching data", error);
        }
    }

    useEffect(() => {
        fetchOptions().catch(error => console.log(error));
    });

    return (
        <div className="mt-24 ml-40 mr-40 fixed inset-0 flex items-center justify-center z-50">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Add New Shelf Location
            </p>
            <form onSubmit={handleSubmit}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeader>Item Name</TableHeader>
                            <TableHeader>Unit</TableHeader>
                            <TableHeader>Category</TableHeader>
                            <TableHeader>Shelf Location</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {formDataArray.map((formData, index) => (
                            <TableRow key={formData.item_id}>
                                <TableCell>
                                    <input
                                        type="text"
                                        name="item_name"
                                        value={formData.item_name}
                                        onChange={(e) => handleChange(index, e)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <select name="unit_id" value={formData.unit_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden> Select Unit</option>
                                        {unitOptions.map((units: any) => (
                                            <option key={units.unit_id} value={units.unit_id}>
                                                {units.unit_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell>
                                    <select name="category_id" value={formData.category_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden> Select Category</option>
                                        {categoryOptions.map((categories: any) => (
                                            <option key={categories.category_id} value={categories.category_id}>
                                                {categories.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell>
                                    <select name="ls_id" value={formData.ls_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden> Select Shelf Location</option>
                                        {shelfLocationOptions.map((shelfLocation: any) => (
                                            <option key={shelfLocation.ls_id} value={shelfLocation.ls_id}>
                                                {shelfLocation.ls_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex flex-row gap-3 justify-end">
                    <Button variant="outline" type="button" onClick={addNewRow}>Add Item</Button>
                    <Button variant="outline" type="submit">Add New Item</Button>
                </div>
                
            </form>
        </div>
    )

}

export default AddItem;