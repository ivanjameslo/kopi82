"use client";

import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
// import { Input } from "@/components/ui/input";

interface DiscountData {
    discount_id: number;
    discount_name: string;
    discount_rate: number;
    status: string;
    isUsed: boolean; // New field to check if the category is in use
}

interface AddDiscountProps {
    onModalClose?: () => void;
}

const AddDiscount = ({ onModalClose }: AddDiscountProps) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [discountForm, setDiscountForm] = useState({
        discount_name: "",
        discount_rate: "",
        status: "",
    });
    const [isDiscountRateValid, setIsDiscountRateValid] = useState(false);
    const [discounts, setDiscounts] = useState<DiscountData[]>([]);
    const [loading, setLoading] = useState(false);
    const [toastShown, setToastShown] = useState(false);

    const handleDiscountChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDiscountForm({... discountForm, [name]: value });

        if (name === "discount_rate") {
            const isDiscountRateValid = /^\d*(\.\d{0,2})?$/.test(value);
            setIsDiscountRateValid(!isDiscountRateValid);
        }

        if (!isDiscountRateValid && !toastShown) {
            toast.error("Invalid Discount Rate");
            setToastShown(true);
        }

        if (isDiscountRateValid) {
            setIsDiscountRateValid(false);
        }
    }

    const handleDiscountSubmit = async () => {
        const { discount_name, discount_rate, status } = discountForm;

        if (!discount_name || !discount_rate || !status) {
            toast.error("Please fill in all fields");
            return;
        }

        const discountData = {
            discount_name,
            discount_rate: parseFloat(discount_rate), // Ensure discount_rate is a number
            status,
        };

        try {
            const response = await fetch("/api/discount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(discountData),
            });

            if (response.ok) {
                toast.success("Discount added successfully");
                setDiscountForm({
                    discount_name: "",
                    discount_rate: "",
                    status: "",
                });
                setDiscountForm({  discount_name: "", discount_rate: "", status: "" });
                if (onModalClose) {
                    onModalClose(); // Pass the new discount to the parent
                }
            } else {
                toast.error("Failed to add discount");
            }
        } catch (error) {
            toast.error("Failed to add discount");
        }
    }

    return (
        <div>
            <Button onClick={() => setIsModalOpen(true)}>
                Add Discount
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add Discount</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="relative w-full mb-4">
                            <label className="text-sm font-semibold text-gray-600">
                                Discount Name
                            </label>
                            <input
                                type="text"
                                name="discount_name"
                                placeholder="Enter Discount Name"
                                value={discountForm.discount_name}
                                onChange={handleDiscountChange} 
                                className="w-full p-2 border rounded-md"   
                            >
                            </input>
                        </div>
                        <div className="relative w-full mb-4">
                            <label className="text-sm font-semibold text-gray-600">
                                Discount Rate
                            </label>
                            <input
                                type="number"
                                name="discount_rate"
                                placeholder="Enter Discount Rate"
                                value={discountForm.discount_rate}
                                onChange={handleDiscountChange}   
                                className="w-full p-2 border rounded-md"
                                min="0"
                                max="100" 
                            >
                            </input>
                        </div>
                        <div className="relative w-full mb-4">
                            <label className="text-sm font-semibold text-gray-600">
                                Status
                            </label>
                            <select
                                name="status"
                                value={discountForm.status}
                                onChange={handleDiscountChange}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Select Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <Button onClick={() => setIsModalOpen(false)} variant="secondary">
                            Cancel
                        </Button>
                        <Button onClick={handleDiscountSubmit}>
                            Add Discount
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddDiscount;