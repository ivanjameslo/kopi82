'use client'

import { useState, ChangeEvent, FormEvent, TextareaHTMLAttributes } from "react";
import React from 'react'
import { Button } from "@/components/ui/button";

const AddLocationShelf = () => {

    const [lsName, setLsName] = useState<string>("");

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLsName(e.target.value);
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await fetch('/api/location_shelf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lsName
                }),
            })
        } catch (error) {
            console.log("Error creating Unit", error);
        }
    }

    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Add New Shelf Location
            </p>

            <div className="flex justify-end mt-10">
                <link href="./Item">
                    <Button>Back</Button>
                </link>
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