"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import AddSupplier from "@/components/Add-Supplier";

interface Supplier {
  supplier_id: string;
  supplier_name: string;
}

const AddPurchasedItem = () => {
  const router = useRouter();

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    receipt_no: "",
    purchase_date: getCurrentDate(),
    supplier_id: "",
  });

  const [receiptError, setReceiptError] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/supplier");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Suppliers data:", data); // Log response for debugging
      setSuppliers(data);
    } catch (err) {
      console.error("Error loading suppliers:", err);
      toast.error("Failed to load suppliers");
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "receipt_no") {
      const isReceiptNumeric = /^\d*$/.test(value);

      if (!isReceiptNumeric && !toastShown) {
        toast.error("Receipt number must contain only numbers!");
        setToastShown(true);
      }

      if (isReceiptNumeric && toastShown) {
        setToastShown(false);
      }

      setReceiptError(!isReceiptNumeric);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.receipt_no.trim() === "") {
      toast.error("Please enter the Receipt Number.");
      return;
    }

    const isNumeric = /^\d+$/.test(formData.receipt_no);
    if (!isNumeric) {
      toast.error("Receipt number must contain only numbers!");
      return;
    }

    try {
      await fetch("/api/purchased_item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receipt_no: formData.receipt_no,
          purchase_date: formData.purchase_date + "T00:00:00Z",
          supplier_id: formData.supplier_id,
        }),
      });

      const response = await fetch("/api/get_recent_pi_id");
      const data = await response.json();
      const recentPoId = data.pi_id;

      router.push(`/PurchasedDetail`);
    } catch (error) {
      toast.error("Failed to create Purchase Order");
    }
  };

  const handleSupplierAdded = () => {
    fetchSuppliers();
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Purchased Item
      </p>
      <div className="flex justify-end mt-4">
        <AddSupplier onSupplierAdded={handleSupplierAdded} />
      </div>
      <form onSubmit={handleSubmit}>
        {/* Flex container to ensure label and input alignment */}
        <div className="flex items-center justify-center space-x-4 mb-8 mt-9">
          {/* Receipt Number Input with floating placeholder */}
          <div className="relative flex-grow">
            <input
              type="text"
              id="receipt_no"
              name="receipt_no"
              value={formData.receipt_no}
              onChange={handleChange}
              className={`peer border ${receiptError ? 'border-red-500 focus:ring-[#dd5454]' : 'border-[#C4C4C4]'} rounded-lg h-10 pl-2 w-full 
              placeholder-transparent focus:outline-none focus:ring-2 focus:ring-[#6c757d] pt-4 pb-4`}
              placeholder="Receipt Number"
            />
            <label
              htmlFor="receipt_no"
              className={`absolute left-2 text-gray-500 transition-all 
                ${formData.receipt_no ? '-top-4 text-sm text-[#6c757d]' : 'top-2 text-base text-gray-400'} 
                peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6c757d] bg-white px-1`}
            >
              Receipt Number
            </label>
          </div>

          {/* Supplier Select Input with floating placeholder */}
          <div className="relative flex-grow">
            <select
              name="supplier_id"
              value={formData.supplier_id}
              onChange={handleChange}
              className="peer border border-[#C4C4C4] rounded-lg h-10 pl-2 w-full focus:outline-none focus:ring-2 focus:ring-[#6c757d] py-2"
            >
              <option value="" disabled hidden>
                Select Supplier
              </option>
              {suppliers.map((supplier) => (
                <option key={supplier.supplier_id} value={supplier.supplier_id}>
                  {supplier.supplier_name}
                </option>
              ))}
            </select>
            <label
              htmlFor="supplier_id"
              className={`absolute left-2 transition-all bg-white px-1 ${
                formData.supplier_id !== "" ? "-top-4 text-sm text-[#6c757d]" : "top-2 text-base text-gray-400"
              } peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#6c757d]`}
            >
              Select Supplier
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex">
            <Button
              type="submit"
              className="bg-black text-white hover:bg-slate-900 text-sm px-4 py-2"
              style={{ width: 'fit-content' }}
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddPurchasedItem;
