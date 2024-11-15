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
import { MdDelete, MdEdit } from "react-icons/md";

interface UnitData {
    unit_id: number;
    unit_name: string;
    isUsed: boolean; // New field to check if the unit is used
}

interface AddUnitProps {
    onModalClose?: () => void;
}

const AddUnit = ({ onModalClose }: AddUnitProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [unitName, setUnitName] = useState<string>("");
    const [data, setData] = useState<UnitData[]>([]);
    const [selectedUnit, setSelectedUnit] = useState<UnitData | null>(null);

    useEffect(() => {
        if (isModalOpen) {
            fetchUnitData();
        }
    }, [isModalOpen]);

    const fetchUnitData = async () => {
        const response = await fetch("/api/unit", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUnitName(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (unitName.trim() === "") {
            toast.error("Unit name cannot be blank");
            return;
        }

        try {
            let response;
            if (selectedUnit) {
                response = await fetch(`/api/unit/${selectedUnit.unit_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ unit_name: unitName }),
                });
            } else {
                response = await fetch("/api/unit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ unit_name: unitName }),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "An error occurred while adding the unit."
                );
            }

            toast.success("Unit added successfully");
            fetchUnitData();
            setUnitName("");
            setSelectedUnit(null);

            if (onModalClose) onModalClose();
        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleEdit = (unit: UnitData) => {
        setSelectedUnit(unit);
        setUnitName(unit.unit_name);
        setIsModalOpen(true);
    };

    const handleDelete = async (unit_id: number) => {
        try {
            await fetch(`/api/unit/${unit_id}`, {
                method: "DELETE",
            });
            toast.success("Unit deleted successfully!");
            setData(data.filter((unit) => unit.unit_id !== unit_id));
        } catch (error) {
            toast.error("Failed to delete unit.");
        }
    };

    return (
        <div>
            <Button onClick={() => setIsModalOpen(true)}>Manage Unit</Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUnit ? "Edit Unit" : "Add Unit"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="unit_name"
                                value={unitName}
                                onChange={handleChange}
                                className={`peer border border-[#C4C4C4] rounded-lg h-10 pl-2 w-full 
                                    placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#6c757d] pt-4 pb-4`}
                            />
                            <label
                                htmlFor="unit_name"
                                className={`absolute left-2 text-gray-500 transition-all 
                                    ${unitName
                                        ? "-top-4 text-sm text-[#6c757d]"
                                        : "top-2 text-base text-gray-400"
                                    } 
                                    peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6c757d] bg-white px-1`}
                            >
                                Unit Name
                            </label>
                        </div>
                        <Button className="w-full bg-black text-white mt-4" type="submit">
                            {selectedUnit ? "Update Unit" : "Add Unit"}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-[#483C32] mb-4">
                            Current Units:
                        </h2>
                        {data.length === 0 ? (
                            <p>No units available.</p>
                        ) : (
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border-b text-center">Name</th>
                                        <th className="px-4 py-2 border-b text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((unit) => (
                                        <tr key={unit.unit_id}>
                                            <td className="px-4 py-2 border-b text-center">
                                                {unit.unit_name}
                                            </td>
                                            <td className="px-4 py-2 border-b flex justify-center items-center text-center">
                                                <MdEdit
                                                    size={25}
                                                    className="cursor-pointer mr-1"
                                                    style={{ color: "#3d3130" }}
                                                    onClick={() => handleEdit(unit)}
                                                />
                                                {!unit.isUsed && (
                                                    <MdDelete
                                                        size={25}
                                                        className="cursor-pointer ml-1"
                                                        style={{ color: "#d00000" }}
                                                        onClick={() => handleDelete(unit.unit_id)}
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddUnit;