import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface EditCategoryProps {
    selectedItem: any;
    onClose: () => void;
    onSave: (updatedItem: any) => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ selectedItem, onClose, onSave }) => {
    const [formData, setFormData] = useState(selectedItem);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isConfirmed = window.confirm("Are you sure you want to submit this form?");
        if (!isConfirmed) {
            return;
        }
        try {
            const response = await fetch(`/api/category/${selectedItem.category_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update Item');
            }
            let updatedItem = await response.json();
            console.log('Updated item:', updatedItem);

            updatedItem = {
                ...updatedItem,
            };

            onSave(updatedItem);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md max-h-[70vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Category</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label>Category Name:</label>
                        <input
                            type="text"
                            name="category_name"
                            value={formData.category_name}
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

export default EditCategory;