import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';

interface EditBackInventoryProps {
    selectedItem: any;
    onClose: () => void;
    onSave: (updatedItem: any) => void;
}

const EditBackInventory: React.FC<EditBackInventoryProps> = ({ selectedItem, onClose, onSave }) => {
    const [formData, setFormData] = useState({ stock_damaged: 0 });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: parseInt(value, 10),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newItemStocks = selectedItem.item_stocks - formData.stock_damaged;
            
            if (newItemStocks < 0) {
                toast.error('Stock damaged cannot exceed available item stocks.');
                return;
            }

            const response = await fetch(`/api/back_inventory/${selectedItem.bd_id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    stock_damaged: formData.stock_damaged,
                    item_stocks: newItemStocks,
                    stock_out_date: new Date().toISOString(), // current date and time
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update Back Inventory');
            }
            const updatedItem = await response.json();
            console.log('Updated item:', updatedItem);

            onSave(updatedItem);
            onClose();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md max-h-[70vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Back Inventory</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>Stock Damaged:</label>
                        <input
                            type="number"
                            name="stock_damaged"
                            value={formData.stock_damaged}
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