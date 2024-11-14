"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import UpdateEmployee from '@/components/Update-Employee'; // New component for the modal
import Link from 'next/link';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "./ui/pagination";
import { toast } from 'react-toastify';
import AddBackInventory from '@/components/Add-BackInventory';

export interface EmployeeData {
    id: number;
    email: string;
    role: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    status: string;
}

const ViewEmployee = () => {
    const [data, setData] = useState<EmployeeData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const employeePerPage = 5;

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/employee");
            const employees = await response.json();
            setData(Array.isArray(employees) ? employees : []);
        } catch (error) {
            console.error("Failed to fetch employees:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleEdit = (employee: EmployeeData) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    }

    const handleSaveEdit = async (employee: EmployeeData) => {
        try {
            const response = await fetch(`/api/employee/${employee.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employee),
            });

            if (!response.ok) {
                throw new Error("Failed to update employee");
            }

            const updatedEmployee = await response.json();
            const updatedData = data.map((emp) => emp.id === updatedEmployee.id ? updatedEmployee : emp);
            setData(updatedData);
            setIsEditModalOpen(false);
        } catch (error) {
            toast.error("Failed to update employee");
        }
    }

    const totalPages = Math.ceil(data.length / employeePerPage);

    const paginatedData = data.slice(
        (currentPage - 1) * employeePerPage,
        currentPage * employeePerPage
    );

    const goToPage = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="mt-12 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">Employee</p>

            <div className="flex justify-end mt-10 space-x-4">
                <Link href="./Employee/Register">
                    <Button>Register Employee</Button>
                </Link>
            </div>

            <div className="mt-10">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>First Name</TableHead>
                            <TableHead>Middle Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Edit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((employee) => (
                                <TableRow key={employee.id}>
                                    <TableCell>{employee.id}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.role}</TableCell>
                                    <TableCell>{employee.last_name}</TableCell>
                                    <TableCell>{employee.first_name}</TableCell>
                                    <TableCell>{employee.middle_name}</TableCell>
                                    <TableCell>{employee.status}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleEdit(employee)}>
                                            <MdEdit />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center">No employees found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-4">
                <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={currentPage === 1 ? undefined : () => currentPage > 1 && goToPage(currentPage - 1)}
                        style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1 }}
                    />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                        <PaginationItem key={page}>
                        <PaginationLink
                            href="#"
                            onClick={(e) => {
                            e.preventDefault();
                            goToPage(page);
                            }}
                            isActive={page === currentPage}
                        >
                            {page}
                        </PaginationLink>
                        </PaginationItem>
                    );
                    })}
                    {totalPages > 5 && <PaginationEllipsis />}
                    <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                        style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto', opacity: currentPage === totalPages ? 0.5 : 1 }}
                    />
                    </PaginationItem>
                </PaginationContent>
                </Pagination>
            </div>

            <UpdateEmployee
                employee={selectedEmployee}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveEdit}
            />

        </div>
    )
}

export default ViewEmployee;