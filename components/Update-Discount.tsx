import React, { useState, ChangeEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface DiscountData {
    discount_id: number;
    discount_name: string;
    discount_rate: number;
    status: string;
    isUsed: boolean; // New field to check if the category is in use
}

interface EditDiscountModalProps {
    selectedDiscount: DiscountData;
    onClose: () => void;
    onSave: (updatedDiscount: DiscountData) => Promise<void>;
}

const UpdateDiscountModal: React.FC<EditDiscountModalProps> = ({ selectedDiscount, onClose, onSave }) => {
    const [formData, setFormData] = useState(selectedDiscount);

    useEffect(() => {
        setFormData(selectedDiscount);
    }, [selectedDiscount]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'discount_rate' ? (value === "" ? "" : Number(value)) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.discount_name.trim()) {
            alert("Discount name cannot be empty.");
            return;
        }
        if (!formData.discount_rate || formData.discount_rate < 0 || formData.discount_rate > 100) {
            alert("Please enter a valid discount rate between 0 and 100.");
            return;
        }
        if (!formData.status) {
            alert("Please select a status.");
            return;
        }
    
        console.log('Submitting form data:', formData);
    
        // const updatedData: DiscountData = {
        //     ...selectedDiscount,
        //     discount_name: formData.discount_name,
        //     discount_rate: formData.discount_rate,
        //     status: formData.status,
        // };
    
        await onSave(formData);
    };
    
    
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-md shadow-md max-h-[70vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Edit Discount</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Discount Name:</label>
                        <input
                            type="text"
                            name="discount_name"
                            value={formData.discount_name}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Discount Rate:</label>
                        <input
                            type="number"
                            name="discount_rate"
                            value={formData.discount_rate}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Status:</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                        <option value="" disabled>Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
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

export default UpdateDiscountModal;