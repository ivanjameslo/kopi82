"use client";

import React, { useState } from "react";
import { EmployeeData } from "@/components/View-Employee"; // Import EmployeeData interface
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const employeeSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.string(),
    last_name: z.string(),
    first_name: z.string(),
    middle_name: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface UpdateEmployeeModalProps {
    employee: EmployeeData | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EmployeeData) => void;
}

const UpdateEmployeeModal: React.FC<UpdateEmployeeModalProps> = ({ employee, isOpen, onClose, onSave }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: employee || {} // Prefill form with employee data if available
    });

    const onSubmit = (data: EmployeeFormData) => {
        if (employee) {
            const updatedEmployee = { ...employee, ...data };
            onSave(updatedEmployee);
        }
    };

    if (!isOpen || !employee) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-2xl font-bold mb-4">Update Employee</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full px-3 py-2 border rounded"
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <select
                            {...register("role")}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="">Select Role</option>
                            <option value="Super Admin">Super Admin</option>
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                        </select>
                        {errors.role && <p className="text-red-500">{errors.role.message}</p>}
                    </div>

                    <div className="flex space-x-4 mb-4">
                        <div className="w-1/3">
                            <label className="block text-gray-700">Last Name</label>
                            <input
                            type="text"
                            {...register("last_name")}
                            className="w-full px-3 py-2 border rounded"
                            />
                            {errors.last_name && <p className="text-red-500">{errors.last_name.message}</p>}
                        </div>
                        <div className="w-1/3">
                            <label className="block text-gray-700">First Name</label>
                            <input
                            type="text"
                            {...register("first_name")}
                            className="w-full px-3 py-2 border rounded"
                            />
                            {errors.first_name && <p className="text-red-500">{errors.first_name.message}</p>}
                        </div>
                        <div className="w-1/3">
                            <label className="block text-gray-700">Middle Name</label>
                            <input
                            type="text"
                            {...register("middle_name")}
                            className="w-full px-3 py-2 border rounded"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 rounded"
                        >
                            {loading ? "Updating..." : "Update Record"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateEmployeeModal;
