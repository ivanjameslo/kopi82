'use client'

import { useState, ChangeEvent, FormEvent } from "react";
import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { toast } from "react-toastify";

const AddUnit = () => {

    const [unitName, setUnitName] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUnitName(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation for empty or whitespace input
        if (unitName.trim() === "") {
            toast.error("Unit name cannot be blank");
            return;  // Early return to prevent the API call
        }

        try {
            const response = await fetch('/api/unit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unit_name: unitName
                }),
            });

            // Check for errors in the response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred while adding the unit.');
            }

            toast.success('Unit added successfully');
            setTimeout(() => {
                window.location.reload(); // Redirect to the desired page
            }, 1500);
        } catch (error: any) {
            // Handle errors (e.g., duplicate category)
            toast.error(error.message);
        }
    }

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Add New Unit of Measurement
            </p>

            <div className="flex justify-end mt-10">
                <Link href="/Item">
                    <Button>Back</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
                    <label className="text-lg font-bold text-[#483C32] mb-2">Unit Name</label>
                    <input type="text" name="unit_name" value={unitName} onChange={handleChange} className="border border-[#C4C4C4] rounded-lg h-10 pl-2" />
                    <Button variant="outline" type="submit">
                        Add New Unit
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AddUnit;