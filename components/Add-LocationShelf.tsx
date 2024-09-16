'use client'

import { useState, ChangeEvent, FormEvent } from "react";
import React from 'react'
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from "react-toastify";

const AddLocationShelf = () => {

    const [lsName, setLsName] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLsName(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation for empty or whitespace input
        if (lsName.trim() === "") {
            toast.error("Location Shelf name cannot be blank");
            return;  // Early return to prevent the API call
        }

        try {
            const response = await fetch('/api/location_shelf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ls_name: lsName
                }),
            });

            // Check for errors in the response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred while adding the location shelf.');
            }

            toast.success('Location Shelf added successfully');
            window.location.reload();
        } catch (error: any) {
            // Handle errors (e.g., duplicate category)
            toast.error(error.message);
        }
    }

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Add New Shelf Location
            </p>

            <div className="flex justify-end mt-10">
                <Link href="/Item">
                    <Button>Back</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
                    <label className="text-lg font-bold text-[#483C32] mb-2">Shelf Location</label>
                    <input type="text" name="ls_name" value={lsName} onChange={handleChange} className="border border-[#C4C4C4] rounded-lg h-10 pl-2" />
                    <Button variant="outline" type="submit">
                        Add New Shelf Location
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default AddLocationShelf