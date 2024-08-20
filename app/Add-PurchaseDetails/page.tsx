'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import { set } from 'react-hook-form';

const addPurchaseDetails = () => {
    
    const router = useRouter();

    const [formData, setFormData] = useState({
        po_id: "",
        item_name: "",
        quantity: "",
        price: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await fetch('/api/purchase_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    po_id: formData.po_id,
                    item_name: formData.item_name,
                    quantity: formData.quantity,
                    price: formData.price,
                })
            })
            router.refresh();
        }catch(error){
            console.log(error);
        }

        setFormData({
            po_id: "",
            item_name: "",
            quantity: "",
            price: "",
        });
    };

    return (
        <div className="mt-20">
            <div>
                <h1 className="flex justify-center">Add Purchase Details</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 mt-5 flex flex-col items-center justify-center">

                    <div className="flex flex-col mb-4 w-full max-w-md">
                        <label className="mb-1">Purchase Order ID: </label>
                            <input type="int" name="po_id" value={formData.po_id} onChange={handleChange} 
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    </div>

                    <div className="flex flex-col mb-4 w-full max-w-md">
                        <label className="mb-1">Item Name: </label>
                            <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} 
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    </div>

                    <div className="flex flex-col mb-4 w-full max-w-md">
                        <label className="mb-1">Quantity: </label>
                            <input type="int" name="quantity" value={formData.quantity} onChange={handleChange} 
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    </div>

                    <div className="flex flex-col mb-4 w-full max-w-md">
                        <label className="mb-1">Price: </label>
                            <input type="decimal" name="price" value={formData.price} onChange={handleChange} 
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    </div>

                    <button type="submit" className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Submit
                    </button>
                    
                </div>
            </form>
        </div>
    );
}

export default addPurchaseDetails;