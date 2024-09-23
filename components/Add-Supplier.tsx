"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MdEdit, MdDelete } from "react-icons/md";

interface SupplierData {
  supplier_id: number;
  supplier_name: string;
  contact_no: number;
  address: string;
}

const AddSupplier = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    supplier_name: "",
    contact_no: "",
    address: "",
  });
  const [suppliers, setSuppliers] = useState<SupplierData[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierData | null>(null); // For edit mode

  // Fetch suppliers when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchSuppliers(); // Load suppliers when the modal opens
    }
  }, [isModalOpen]);

  // Fetch the suppliers from the API
  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/supplier", {
        method: "GET",  // Specify the GET method explicitly
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch suppliers");
      }
  
      const data = await response.json();
      setSuppliers(data);
    } catch (err) {
      toast.error("Failed to load suppliers");
    }
  };

  // Handle supplier form changes
  const handleSupplierChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSupplierForm({ ...supplierForm, [name]: value });

    if (name === "contact_number") {
      const isContactNumeric = /^\d*$/.test(value);
      if (!isContactNumeric) {
        toast.error("Contact number must contain only numbers!");
      }
    }
  };

  // Add or Update Supplier
  const handleSupplierSubmit = async () => {
    const { contact_no, supplier_name, address } = supplierForm;
  
    if (!supplier_name || !contact_no || !address) {
      toast.error("All fields are required!");
      return;
    }
  
    try {
      let response;
      if (selectedSupplier) {
        // Update supplier
        response = await fetch(`/api/supplier/${selectedSupplier.supplier_id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supplierForm),
        });
      } else {
        // Add new supplier
        response = await fetch("/api/supplier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(supplierForm),
        });
      }
  
      // Check if the response is OK
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData); // Log detailed error from API
        throw new Error(errorData.error || "Failed to save supplier");
      }
  
      // Success handling
      toast.success(selectedSupplier ? "Supplier updated successfully!" : "Supplier added successfully!");
      fetchSuppliers();
      setSupplierForm({ supplier_name: "", contact_no: "", address: "" });
      setSelectedSupplier(null); // Reset after editing
    } catch (error: any) {
      console.error("Error saving supplier:", error.message); // Log the exact error
      toast.error(`Error: ${error.message}`);
    }
  };
  
  // Edit Supplier
  const handleEdit = (supplier: SupplierData) => {
    setSelectedSupplier(supplier); // Set supplier for editing
    setSupplierForm({
      supplier_name: supplier.supplier_name,
      contact_no: String(supplier.contact_no),
      address: supplier.address,
    });
    setIsModalOpen(true); // Open modal for editing
  };

  // Delete Supplier
  const handleDelete = async (supplier_id: number) => {
    try {
      await fetch(`/api/supplier/${supplier_id}`, {
        method: "DELETE",
      });

      toast.success("Supplier deleted successfully!");
      setSuppliers(suppliers.filter((s) => s.supplier_id !== supplier_id)); // Remove supplier from list
    } catch (error) {
      toast.error("Failed to delete supplier");
    }
  };

  return (
    <>
      <Button
        style={{ backgroundColor: "#6c757d", color: "white" }}
        onClick={() => setIsModalOpen(true)}
      >
        Manage Suppliers
      </Button>

      {/* Supplier Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedSupplier ? "Edit Supplier" : "Manage Suppliers"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="text"
              name="supplier_name"
              placeholder="Supplier Name"
              value={supplierForm.supplier_name}
              onChange={handleSupplierChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="contact_no"
              placeholder="Contact Number"
              value={supplierForm.contact_no}
              onChange={handleSupplierChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={supplierForm.address}
              onChange={handleSupplierChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <Button className="w-full bg-black text-white" onClick={handleSupplierSubmit}>
              {selectedSupplier ? "Update Supplier" : "Add Supplier"}
            </Button>
          </div>

          {/* Mini Table for Existing Suppliers */}
          <div className="mt-6">
            <table className="min-w-full border border-gray-300">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b text-center">Name</th>
                  <th className="px-4 py-2 border-b text-center">Contact</th>
                  <th className="px-4 py-2 border-b text-center">Address</th>
                  <th className="px-4 py-2 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.length > 0 ? (
                  suppliers.map((supplier) => (
                    <tr key={supplier.supplier_id}>
                      <td className="px-4 py-2 border-b text-center">{supplier.supplier_name}</td>
                      <td className="px-4 py-2 border-b text-center">{supplier.contact_no}</td>
                      <td className="px-4 py-2 border-b text-center">{supplier.address}</td>
                      <td className="px-4 py-2 border-b flex justify-center items-center text-center">
                        <MdEdit
                          size={25}
                          className="cursor-pointer"
                          style={{ color: "#3d3130" }}
                          onClick={() => handleEdit(supplier)}
                        />
                        <MdDelete
                          size={25}
                          className="cursor-pointer"
                          style={{ color: "#d00000" }}
                          onClick={() => handleDelete(supplier.supplier_id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No suppliers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddSupplier;
