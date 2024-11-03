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

interface CategoryData {
    category_id: number;
    category_name: string;
    isUsed: boolean; // New field to check if the category is in use
}

interface AddCategoryProps {
    onModalClose?: () => void;
}

const AddCategory = ({ onModalClose }: AddCategoryProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState<string>("");
    const [data, setData] = useState<CategoryData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);

    useEffect(() => {
        if (isModalOpen) {
            fetchCategoryData();
        }
    }, [isModalOpen]);

    const fetchCategoryData = async () => {
        const response = await fetch("/api/category", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setData(data);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCategoryName(e.target.value);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (categoryName.trim() === "") {
            toast.error("Category name cannot be blank");
            return;
        }

        try {
            let response;
            if (selectedCategory) {
                response = await fetch(`/api/category/${selectedCategory.category_id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ category_name: categoryName }),
                });
            } else {
                response = await fetch("/api/category", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ category_name: categoryName }),
                });
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "An error occurred while adding the category."
                );
            }

            toast.success("Category added successfully");
            fetchCategoryData();
            setCategoryName("");
            setSelectedCategory(null);

            if (onModalClose) onModalClose();
        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleEdit = (category: CategoryData) => {
        setSelectedCategory(category);
        setCategoryName(category.category_name);
        setIsModalOpen(true);
    };

    const handleDelete = async (category_id: number) => {
        try {
            await fetch(`/api/category/${category_id}`, {
                method: "DELETE",
            });
            toast.success("Category deleted successfully!");
            setData(data.filter((category) => category.category_id !== category_id));
        } catch (error) {
            toast.error("Failed to delete category.");
        }
    };

    return (
        <div>
            <Button onClick={() => setIsModalOpen(true)}>Manage Category</Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCategory ? "Edit Category" : "Add Category"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="category_name"
                                value={categoryName}
                                onChange={handleChange}
                                className={`peer border border-[#C4C4C4] rounded-lg h-10 pl-2 w-full 
                                    placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#6c757d] pt-4 pb-4`}
                            />
                            <label
                                htmlFor="category_name"
                                className={`absolute left-2 text-gray-500 transition-all 
                                    ${categoryName
                                        ? "-top-4 text-sm text-[#6c757d]"
                                        : "top-2 text-base text-gray-400"
                                    } 
                                    peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6c757d] bg-white px-1`}
                            >
                                Category Name
                            </label>
                        </div>
                        <Button className="w-full bg-black text-white mt-4" type="submit">
                            {selectedCategory ? "Update Category" : "Add Category"}
                        </Button>
                    </form>

                    <div className="mt-6">
                        <h2 className="text-xl font-bold text-[#483C32] mb-4">
                            Current Categories:
                        </h2>
                        {data.length === 0 ? (
                            <p>No categories available.</p>
                        ) : (
                            <table className="table-auto w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 border-b text-center">Name</th>
                                        <th className="px-4 py-2 border-b text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((category) => (
                                        <tr key={category.category_id}>
                                            <td className="px-4 py-2 border-b text-center">
                                                {category.category_name}
                                            </td>
                                            <td className="px-4 py-2 border-b flex justify-center items-center text-center">
                                                <MdEdit
                                                    size={25}
                                                    className="cursor-pointer mr-1"
                                                    style={{ color: "#3d3130" }}
                                                    onClick={() => handleEdit(category)}
                                                />
                                                {!category.isUsed && (
                                                    <MdDelete
                                                        size={25}
                                                        className="cursor-pointer ml-1"
                                                        style={{ color: "#d00000" }}
                                                        onClick={() => handleDelete(category.category_id)}
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

export default AddCategory;