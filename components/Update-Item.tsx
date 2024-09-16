import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface EditItemProps {
    selectedItem: any;
    onClose: () => void;
    onSave: (updatedItem: any) => void;
}

const EditItem: React.FC<EditItemProps> = ({ selectedItem, onClose, onSave }) => {
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
            const response = await fetch(`/api/item/${selectedItem.item_id}`, {
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

    //FETCHING OF DATA
    const [unitOptions, setUnitOptions] = useState<string[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [shelfLocationOptions, setShelfLocationOptions] = useState<string[]>([]);

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
    }

    useEffect(() => {
        fetchOptions().catch(error => console.log(error));
    });

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md max-h-[70vh] overflow-y-auto">
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
                        <label>Unit:</label>
                        <select name="unit_id" value={formData.unit_id} onChange={handleChange}>
                            <option value="" disabled hidden> Select Unit</option>
                            {unitOptions.map((units: any) => (
                                <option key={units.unit_id} value={units.unit_id}>
                                    {units.unit_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label>Category:</label>
                        <select name="category_id" value={formData.category_id} onChange={handleChange}>
                            <option value="" disabled hidden> Select Category</option>
                            {categoryOptions.map((categories: any) => (
                                <option key={categories.category_id} value={categories.category_id}>
                                    {categories.category_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label>Shelf Location:</label>
                        <select name="ls_id" value={formData.ls_id} onChange={handleChange}>
                            <option value="" disabled hidden> Select Shelf Location</option>
                            {shelfLocationOptions.map((shelfLocation: any) => (
                                <option key={shelfLocation.ls_id} value={shelfLocation.ls_id}>
                                    {shelfLocation.ls_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button type="submit" className="mt-4">Save</Button>
                    <Button onClick={onClose} className="mt-4 ml-2">Cancel</Button>
                </form>
            </div>
        </div>
    );
};

export default EditItem;