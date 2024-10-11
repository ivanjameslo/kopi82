'use client';

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import React from 'react';
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
} from "@/components/ui/table";
import Link from 'next/link';
import { toast } from 'react-toastify';
import { MdCancel } from "react-icons/md";

const AddItem = () => {
    const router = useRouter();

    const [formDataArray, setFormDataArray] = useState([{
        item_id: uuidv4(),
        item_name: "",
        description: "",
        unit_id: "",
        category_id: "",
    }]);

    const [existingItems, setExistingItems] = useState<any[]>([]);

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newFormDataArray = [...formDataArray];
        newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
        setFormDataArray(newFormDataArray);
    };

    const checkForDuplicates = () => {
        const seen = new Set();
        const duplicates = [];
        for (const formData of formDataArray) {
            const identifier = `${formData.item_name}-${formData.description}-${formData.unit_id}-${formData.category_id}`;
            if (seen.has(identifier)) {
                duplicates.push(formData);
            }
            seen.add(identifier);
        }
        return duplicates;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Frontend validation for empty fields
        for (const formData of formDataArray) {
            if (!formData.item_name || !formData.description || !formData.unit_id || !formData.category_id) {
                toast.error("Please fill in all fields.");
                return;
            }
        }
    
        // Check for duplicate entries in the form data
        const duplicateEntries = checkForDuplicates();
        if (duplicateEntries.length > 0) {
            toast.error("Duplicate entries found. Please ensure all items are unique.");
            return;
        }
    
        const formDataArrayWithNumbers = formDataArray.map(formData => ({
            ...formData,
            unit_id: Number(formData.unit_id),
            category_id: Number(formData.category_id),
        }));
    
        try {
            const response = await fetch('/api/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataArrayWithNumbers),
            });
    
            const result = await response.json();
    
            // Check if the request was successful
            if (!response.ok) {
                toast.error(result.error || "Error creating items. Please try again.");
                return;
            }
    
            toast.success("Items created successfully.");
            setTimeout(() => {
                router.push('/Item');
            }, 1500);
        } catch (error) {
            toast.error("Error creating items. Please try again.");
        }
    };
    
    const addNewRow = () => {
        setFormDataArray([
            ...formDataArray,
            {
                item_id: uuidv4(),
                item_name: "",
                description: "",
                unit_id: "",
                category_id: "",
            }
        ]);
    };

    const removeRow = (index: number) => {
        const newFormDataArray = formDataArray.filter((_, i) => i !== index);
        setFormDataArray(newFormDataArray);
    };

    const [unitOptions, setUnitOptions] = useState<{ unit_id: number; unit_name: string }[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ category_id: number; category_name: string }[]>([]);

    const fetchOptions = async () => {
        try {
            const unitResponse = await fetch('/api/unit');
            const categoryResponse = await fetch('/api/category');

            const unitData = await unitResponse.json();
            const categoryData = await categoryResponse.json();

            setUnitOptions(unitData);
            setCategoryOptions(categoryData);
        } catch (error) {
            console.log("Error fetching data", error);
        }
    };

    const fetchExistingItems = async () => {
        try {
            const response = await fetch('/api/item');
            const data = await response.json();
            setExistingItems(data);
        } catch (error) {
            console.log("Error fetching existing items", error);
        }
    };

    useEffect(() => {
        fetchOptions().catch(error => console.log(error));
        fetchExistingItems().catch(error => console.log(error));
    }, []);


    const getUnitName = (unit_id: number) => {
        const unit = unitOptions.find(unit => unit.unit_id === unit_id);
        return unit ? unit.unit_name : '';
    };

    const getCategoryName = (category_id: number) => {
        const category = categoryOptions.find(category => category.category_id === category_id);
        return category ? category.category_name : '';
    };

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Add New Item
            </p>

            <div className="flex justify-end mt-10">
                <Link href="/Item">
                    <Button>Back</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Item Name</TableHead>
                            <TableHead className="text-center">Description</TableHead>
                            <TableHead className="text-center">Unit</TableHead>
                            <TableHead className="text-center">Category</TableHead>
                            <TableHead className="text-center"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formDataArray.map((formData, index) => (
                            <TableRow key={formData.item_id}>
                                <TableCell className="text-center">
                                    <input
                                        className="p-1"
                                        placeholder="Item Name"
                                        type="text"
                                        name="item_name"
                                        value={formData.item_name}
                                        onChange={(e) => handleChange(index, e)}
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <input
                                        className="p-1"
                                        placeholder="Brand, Size, etc."
                                        type="text"
                                        name="description"
                                        value={formData.description}
                                        onChange={(e) => handleChange(index, e)}
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <select className="p-1" name="unit_id" value={formData.unit_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden> Select Unit</option>
                                        {unitOptions.map((units: any) => (
                                            <option key={units.unit_id} value={units.unit_id}>
                                                {units.unit_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell className="text-center">
                                    <select className="p-1" name="category_id" value={formData.category_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden> Select Category</option>
                                        {categoryOptions.map((categories: any) => (
                                            <option key={categories.category_id} value={categories.category_id}>
                                                {categories.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell className="text-center">
                                    {formDataArray.length > 1 ? (
                                        <MdCancel type="button" size={25} style={{color: 'd00000', cursor: 'pointer'}} onClick={() => removeRow(index)} />
                                    ) : (
                                        <span style={{ display: 'inline-block', width: '25px', height: '25px' }}></span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex flex-row gap-3 justify-end">
                    <Button variant="outline" type="button" onClick={addNewRow}>Add Item</Button>
                    <Button variant="outline" type="submit">Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default AddItem;