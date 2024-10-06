import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";

interface UnitData {
    unit_id: number;
    unit_name: string;
}

interface CategoryData {
    category_id: number;
    category_name: string;
}

interface ItemData {
    item_id: number;
    item_name: string;
    description: string;
    unit: UnitData;
    category: CategoryData;
}

interface EditItemModalProps {
    selectedItem: ItemData;
    unitOptions: UnitData[];
    categoryOptions: CategoryData[];
    onClose: () => void;
    onSave: (updatedItem: ItemData) => void;
}

const UpdateItemModal: React.FC<EditItemModalProps> = ({ selectedItem, unitOptions, categoryOptions, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        item_name: selectedItem.item_name,
        description: selectedItem.description,
        unit_id: selectedItem.unit.unit_id,
        category_id: selectedItem.category.category_id,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Build updated item object based on form data
        const updatedData = {
            ...selectedItem,
            item_name: formData.item_name,
            description: formData.description,
            unit: unitOptions.find(u => u.unit_id === parseInt(formData.unit_id.toString()))!, // Map back to unit object
            category: categoryOptions.find(c => c.category_id === parseInt(formData.category_id.toString()))!, // Map back to category object
        };

        onSave(updatedData);  // Pass updated item to parent component
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md max-h-[70vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Item</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Item Name:</label>
                        <input
                            type="text"
                            name="item_name"
                            value={formData.item_name}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Unit:</label>
                        <select
                            name="unit_id"
                            value={formData.unit_id.toString()}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled hidden>Select Unit</option>
                            {unitOptions.map((unit) => (
                                <option key={unit.unit_id} value={unit.unit_id.toString()}>
                                    {unit.unit_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Category:</label>
                        <select
                            name="category_id"
                            value={formData.category_id.toString()}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled hidden>Select Category</option>
                            {categoryOptions.map((category) => (
                                <option key={category.category_id} value={category.category_id.toString()}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <Button type="submit">Save</Button>
                        <Button onClick={onClose} type="button" variant="secondary">Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateItemModal;
