'use client'

import { useState, ChangeEvent, FormEvent } from "react";
import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Modal from './Modal'; 

const AddUnit = () => {
    const router = useRouter();

    const [unitName, setUnitName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUnitName(e.target.value);
        setError("");
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const checkResponse = await fetch(`/api/unit?unit_name=${unitName}`);
            const checkData = await checkResponse.json();

            if (checkData.exists) {
                setIsModalOpen(true);
                return;
            }

            const response = await fetch('/api/unit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    unit_name: unitName
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unit name already exists.');
            }

            window.location.reload();
        } catch (error: any) {
            setError(error.message);
            setIsModalOpen(true);
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
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
            <Modal isOpen={isModalOpen} onClose={closeModal} title="Error">
                <p>{error}</p>
            </Modal>
        </div>
    );
}

export default AddUnit;