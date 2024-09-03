'use client'

import { useState, ChangeEvent, FormEvent, TextareaHTMLAttributes } from "react";
import React from 'react'
import { Button } from "@/components/ui/button";

const AddCategory = () => {

    const [categoryName, setCategoryName] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await fetch('/api/category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    categoryName
                }),
            })
        } catch (error) {
            console.log("Error creating Category", error);
        }
    }

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Add New Item Category
            </p>

            <div className="flex justify-end mt-10">
                <link href="./Item">
                    <Button>Back</Button>
                </link>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
                    <label className="text-lg font-bold text-[#483C32] mb-2">Category Name</label>
                    <input type="text" name="unit_name" value={categoryName} onChange={handleChange} className="border border-[#C4C4C4] rounded-lg h-10 pl-2" />
                    <Button variant="outline" type="submit">
                        Add New Category
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default AddCategory