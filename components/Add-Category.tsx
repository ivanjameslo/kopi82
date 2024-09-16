'use client'

import { useState, ChangeEvent, FormEvent, TextareaHTMLAttributes } from "react";
import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { set } from "react-hook-form";
import { toast } from "react-toastify";

const AddCategory = () => {

    const [categoryName, setCategoryName] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation for empty or whitespace input
        if (categoryName.trim() === "") {
            toast.error("Category name cannot be blank");
            return;  // Early return to prevent the API call
        }

        try {
            const response = await fetch('/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category_name: categoryName
                }),
            });

            // Check for errors in the response
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'An error occurred while adding the category.');
            }

            toast.success('Category added successfully');
            window.location.reload();
        } catch (error: any) {
            // Handle errors (e.g., duplicate category)
            toast.error(error.message);
        }
    }

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Add New Item Category
            </p>

            <div className="flex justify-end mt-10">
                <Link href="/Item">
                    <Button>Back</Button>
                </Link>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
                    <label className="text-lg font-bold text-[#483C32] mb-2">Category Name</label>
                    <input type="text" name="category_name" value={categoryName} onChange={handleChange} className="border border-[#C4C4C4] rounded-lg h-10 pl-2" />
                    <Button variant="outline" type="submit">
                        Add New Category
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default AddCategory