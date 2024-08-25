import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";

interface EditBackInventoryProps {
    selectedItem: any;
    onClose: () => void;
    onSave: (updatedItem: any) => void;
}

const EditBackInventory: React.FC<EditBackInventoryProps> = ({ selectedItem, onClose, onSave }) => {
    const [formData, setFormData] = useState(selectedItem);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Format the date fields to include the time portion
            const formattedData = {
                ...formData,
                stock_in_date: formData.stock_in_date ? formData.stock_in_date + 'T00:00:00Z' : '',
                expiry_date: formData.expiry_date ? formData.expiry_date + 'T00:00:00Z' : '',
            };
    
            const response = await fetch(`/api/back_inventory/${selectedItem.bd_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });
            if (!response.ok) {
                throw new Error('Failed to update Front Inventory');
            }
            const updatedItem = await response.json();
            onSave(updatedItem);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md">
                <h2 className="text-2xl font-bold mb-4">Edit Back Inventory</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>Item Name:</label>
                        <input
                            type="text"
                            name="item_name"
                            value={formData.item_name}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Stocks:</label>
                        <input
                            type="number"
                            name="item_stocks"
                            value={formData.stock_in_date}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Unit:</label>
                        <select
                            name="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="" disabled hidden> Select Unit of Measurement</option>
                            <option value="bag">Bag</option>
                            <option value="box">Box</option>
                            <option value="bottle">Bottle</option>
                            <option value="slice">Slice</option>
                            <option value="pack">Pack</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label>Category:</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="" disabled hidden> Select Category</option>
                            <option value="syrup">Syrup</option>
                            <option value="pasta">Pasta</option>
                            <option value="coffee beans">Coffee Beans</option>
                            <option value="pastries">Pastries</option>
                            <option value="alcohol">Alcohol</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label>Shelf Location:</label>
                        <input
                            type="date"
                            name="location_shelf"
                            value={formData.location_shelf}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Stock-In Date:</label>
                        <input
                            type="date"
                            name="stock_in_date"
                            value={formData.stock_in_date}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Expiry Date:</label>
                        <input
                            type="text"
                            name="expiry_date"
                            value={formData.expiry_date}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Stock Damaged:</label>
                        <input
                            type="text"
                            name="stock_damaged"
                            value={formData.stock_damaged}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Recent PO ID:</label>
                        <input
                            type="text"
                            name="po_id"
                            value={formData.po_id}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <Button type="submit" className="mt-4">Save</Button>
                    <Button onClick={onClose} className="mt-4 ml-2">Cancel</Button>
                </form>
            </div>
        </div>
    );
};

export default EditBackInventory;