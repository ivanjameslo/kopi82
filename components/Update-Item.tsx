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
    isUsed: boolean;
}

interface EditItemModalProps {
    selectedItem: ItemData;
    unitOptions: UnitData[];
    categoryOptions: CategoryData[];
    onClose: () => void;
    onSave: (updatedItem: ItemData) => Promise<void>;
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
        console.log(`Field changed: ${name}, New Value: ${value}`);
        setFormData({ ...formData, [name]: name === 'unit_id' || name === 'category_id' ? Number(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        console.log('Submitting form data:', formData);
    
        const updatedData: ItemData = {
            ...selectedItem,
            item_name: formData.item_name,
            description: formData.description,
            unit: { unit_id: formData.unit_id, unit_name: unitOptions.find(u => u.unit_id === formData.unit_id)?.unit_name || '' },
            category: { category_id: formData.category_id, category_name: categoryOptions.find(c => c.category_id === formData.category_id)?.category_name || '' },
        };
    
        onSave(updatedData);  
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
                            value={formData.unit_id}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                        <option value="" disabled>Select Unit</option>
                        {unitOptions.map((unit) => (
                            <option key={unit.unit_id} value={unit.unit_id}>
                            {unit.unit_name}
                            </option>
                        ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Category:</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="" disabled>Select Category</option>
                            {categoryOptions.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
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