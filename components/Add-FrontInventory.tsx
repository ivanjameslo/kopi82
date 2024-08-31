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
import { v4 as uuidv4 } from 'uuid';

const frontInventory = () => {
   
    const router = useRouter();

    const [formDataArray, setFormDataArray] = useState ([{
        fd_id: uuidv4(),
        bd_id: "",
        in_stock: "",
        unit: "",
        stock_used: "0",
        stock_damaged: "0",
        product_id: "0",
    }]);

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newFormDataArray = [...formDataArray];
       
        newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
        setFormDataArray(newFormDataArray);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLSelectElement>) => {
        e.preventDefault();
        console.log('Form Data:', formDataArray); // Log form data
        try {
            const response = await fetch('/api/front_inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataArray)
            });
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
            router.push('/FrontInventory');
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    const addNewRow = () => {
        setFormDataArray([...formDataArray, {
            fd_id: uuidv4(),
            bd_id: "",
            in_stock: "",
            unit: "",
            stock_used: "0",
            stock_damaged: "0",
            product_id: "0",
        }]);
    };

    //fetching for dropdowns (bd_id)
    const [bdItems, setbdItems] = useState([]);
    const fetchBD_ID = async () => {
        const response = await fetch('/api/back_inventory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        const data = await response.json();
        setbdItems(data);
    }

    useEffect(() => {
        fetchBD_ID().catch(error => console.log(error));
    }, []);

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Front Inventory
            </p>

            <form onSubmit={handleSubmit}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Back Inventory ID</TableHead>
                            <TableHead>In Stock</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Stock Used</TableHead>
                            <TableHead>Stock Damaged</TableHead>
                            <TableHead>Product ID</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {formDataArray.map((formData, index) => (
                            <TableRow key={formData.fd_id}>
                                <TableCell className="font-medium">
                                    <select name="bd_id" value={formData.bd_id} onChange={(e) => handleChange(index, e)}>
                                        <option value="" disabled hidden>Select Item</option>
                                        {bdItems.map((item: any) => (
                                            <option key={item.bd_id} value={item.bd_id}>
                                                {item.item_name}
                                            </option>
                                        ))}
                                    </select>
                                </TableCell>
                                <TableCell><input type="number" name="in_stock" value={formData.in_stock} onChange={(e) => handleChange(index, e)} /></TableCell>
                                <TableCell><select name="unit" value={formData.unit} onChange={(e) => handleChange(index, e)}>
                                    <option value="" disabled hidden> Select Unit of Measurement</option>
                                    <option value="Bag">Bag</option>
                                    <option value="Box">Box</option>
                                    <option value="Bottle">Bottle</option>
                                    <option value="Slice">Slice</option>
                                    <option value="Pack">Pack</option>
                                </select></TableCell>
                                <TableCell><input type="number" name="stock_used" value={formData.stock_used} onChange={(e) => handleChange(index, e)} /></TableCell>
                                <TableCell><input type="number" name="stock_damaged" value={formData.stock_damaged} onChange={(e) => handleChange(index, e)} /></TableCell>
                                <TableCell><input type="number" name="product_id" value={formData.product_id} onChange={(e) => handleChange(index, e)} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="flex flex-row gap-3 justify-end">
                    <Button variant="outline" onClick={addNewRow}>Add Item</Button>
                    <Button variant="outline" type="submit">Submit</Button>
                </div>
            </form>


        </div>
    );
}
export default frontInventory;