'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

const purchaseOrder = () => {

    const router = useRouter();

    const getCurrentDate = () => {
        const date = new Date();
        return date.toISOString().split('T')[0];
    };

    const [formData, setFormData] = useState({
        receipt_no: "",
        purchase_date: getCurrentDate(),
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await fetch('/api/purchase_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receipt_no: formData.receipt_no,
                    purchase_date: formData.purchase_date,
                })
            });

            //Fetch the most recent po_id
            const response = await fetch('/api/get_recent_po_id');
            const data = await response.json();
            const recentPoId = data.po_id;

            //Redirect to the Add-PuchaseDetails page with the recent po_id
            router.push(`/Add-PurchaseDetails/${recentPoId}`);

            // router.refresh();
        } catch(error){
            console.log(error);
        }
    };

    return (
        <div className="mt-20">

            <div>
                <h1 className="flex justify-center">Purchase Order</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
                    <label>Receipt Number: </label>
                    
                    <input type="int" 
                    id="receipt_no" 
                    name="receipt_no" 
                    value={formData.receipt_no} 
                    onChange={handleChange} 
                    required 
                    className="mt-1 w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                    
                    <button type="submit" className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Submit
                    </button>
                </div>
            </form>

        </div>
    );
}

export default purchaseOrder;