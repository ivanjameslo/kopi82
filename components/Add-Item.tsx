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
import Modal from './Modal'; // Assuming you have a modal component

const AddItem = () => {
    const router = useRouter();

    const [formDataArray, setFormDataArray] = useState([{
        item_id: uuidv4(),
        item_name: "",
        unit_id: "",
        category_id: "",
        ls_id: "",
    }]);

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [existingItems, setExistingItems] = useState<any[]>([]);
    const [duplicateItems, setDuplicateItems] = useState<any[]>([]);

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newFormDataArray = [...formDataArray];
        newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
        setFormDataArray(newFormDataArray);
    };

    const checkForDuplicates = () => {
        const seen = new Set();
        const duplicates = [];
        for (const formData of formDataArray) {
            const identifier = `${formData.item_name}-${formData.unit_id}-${formData.category_id}-${formData.ls_id}`;
            console.log(`Checking identifier: ${identifier}`); // Debugging statement
            if (seen.has(identifier)) {
                console.log(`Duplicate found: ${identifier}`); // Debugging statement
                duplicates.push(formData);
            }
            seen.add(identifier);
        }
        return duplicates;
    };

    const checkForDatabaseDuplicates = () => {
        const duplicates = [];
        for (const formData of formDataArray) {
            const identifier = `${formData.item_name}-${formData.unit_id}-${formData.category_id}-${formData.ls_id}`;
            for (const item of existingItems) {
                const existingIdentifier = `${item.item_name}-${item.unit_id}-${item.category_id}-${item.ls_id}`;
                if (identifier === existingIdentifier) {
                    console.log(`Database duplicate found: ${identifier}`); // Debugging statement
                    duplicates.push(formData);
                }
            }
        }
        return duplicates;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to submit this form?");
        if (!isConfirmed) {
            return;
        }

        for (const formData of formDataArray) {
            if (!formData.item_name || !formData.unit_id || !formData.category_id || !formData.ls_id) {
                setErrorMessage("Please fill in all fields.");
                setIsModalOpen(true);
                console.log("Validation failed: Please fill in all fields."); // Debugging statement
                return;
            }
        }

        const duplicateEntries = checkForDuplicates();
        const databaseDuplicates = checkForDatabaseDuplicates();

        if (duplicateEntries.length > 0 || databaseDuplicates.length > 0) {
            setErrorMessage("Duplicate entries found. Please ensure all items are unique.");
            setDuplicateItems([...duplicateEntries, ...databaseDuplicates]);
            setIsModalOpen(true);
            console.log("Validation failed: Duplicate entries found."); // Debugging statement
            return;
        }

        const formDataArrayWithNumbers = formDataArray.map(formData => ({
            ...formData,
            unit_id: Number(formData.unit_id),
            category_id: Number(formData.category_id),
            ls_id: Number(formData.ls_id),
        }));

        try {
            await fetch('/api/item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataArrayWithNumbers),
            });
            setIsSuccess(true);
            setErrorMessage("Item created successfully.");
            setIsModalOpen(true);
            console.log("Item created successfully."); // Debugging statement
        } catch (error) {
            console.log("Error creating Item", error);
            setErrorMessage("Error creating Item. Please try again.");
            setIsModalOpen(true);
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

    const removeRow = (index: number) => {
        const newFormDataArray = formDataArray.filter((_, i) => i !== index);
        setFormDataArray(newFormDataArray);
    };

    const [unitOptions, setUnitOptions] = useState<{ unit_id: number; unit_name: string }[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ category_id: number; category_name: string }[]>([]);
    const [shelfLocationOptions, setShelfLocationOptions] = useState<{ ls_id: number; ls_name: string }[]>([]);

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

    const handleCloseModal = () => {
        setIsModalOpen(false);
        if (isSuccess) {
            router.push('/Item');
        }
    };

    const getUnitName = (unit_id: number) => {
        const unit = unitOptions.find(unit => unit.unit_id === unit_id);
        return unit ? unit.unit_name : '';
    };

    const getCategoryName = (category_id: number) => {
        const category = categoryOptions.find(category => category.category_id === category_id);
        return category ? category.category_name : '';
    };

    const getShelfLocationName = (ls_id: number) => {
        const shelfLocation = shelfLocationOptions.find(shelfLocation => shelfLocation.ls_id === ls_id);
        return shelfLocation ? shelfLocation.ls_name : '';
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
                            <TableHead className="text-center">Unit</TableHead>
                            <TableHead className="text-center">Category</TableHead>
                            <TableHead className="text-center">Shelf Location</TableHead>
                            <TableHead className="text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {formDataArray.map((formData, index) => (
                            <TableRow key={formData.item_id}>
                                <TableCell className="text-center">
                                    <input
                                        type="text"
                                        name="item_name"
                                        value={formData.item_name}
                                        onChange={(e) => handleChange(index, e)}
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <select name="unit_id" value={formData.unit_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden> Select Unit</option>
                                        {unitOptions.map((units: any) => (
                                            <option key={units.unit_id} value={units.unit_id}>
                                                {units.unit_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell className="text-center">
                                    <select name="category_id" value={formData.category_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden> Select Category</option>
                                        {categoryOptions.map((categories: any) => (
                                            <option key={categories.category_id} value={categories.category_id}>
                                                {categories.category_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell className="text-center">
                                    <select name="ls_id" value={formData.ls_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden> Select Shelf Location</option>
                                        {shelfLocationOptions.map((shelfLocation: any) => (
                                            <option key={shelfLocation.ls_id} value={shelfLocation.ls_id}>
                                                {shelfLocation.ls_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Button variant="outline" type="button" onClick={() => removeRow(index)}>Cancel</Button>
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

            {isModalOpen && (
                <Modal isOpen={isModalOpen} title={isSuccess ? "Success" : "Error"} onClose={handleCloseModal}>
                    <div className="p-4">
                        <p className="font-bold">{errorMessage}</p>
                        <br></br>
                        {duplicateItems.length > 0 && (
                            <div>
                                <h3 className="font-bold">Duplicate Items:</h3>
                                <ul>
                                    {duplicateItems.map((item, index) => (
                                        <li key={index}>
                                            {item.item_name} - {item.unit_id} - {item.category_id} - {item.ls_id}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AddItem;