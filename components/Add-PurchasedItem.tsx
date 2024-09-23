"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import AddSupplier from "@/components/Add-Supplier";

const AddPurchasedItem = () => {
  const router = useRouter();

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    receipt_no: "",
    purchase_date: getCurrentDate(),
  });

  const [receiptError, setReceiptError] = useState(false);
  const [toastShown, setToastShown] = useState(false);

  // Supplier modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [supplierForm, setSupplierForm] = useState({
    supplier_name: "",
    contact_number: "",
    address: "",
  });
  const [suppliers, setSuppliers] = useState([]);

  // Fetch suppliers when modal opens
  useEffect(() => {
    if (isModalOpen) {
      // Fetch supplier data from the API
      fetch("/api/get_suppliers")
        .then((res) => res.json())
        .then((data) => setSuppliers(data))
        .catch((err) => toast.error("Failed to load suppliers"));
    }
  }, [isModalOpen]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "receipt_no") {
      const isReceiptNumeric = /^\d*$/.test(value); // Allow empty input (user can delete input)
      
      if (!isReceiptNumeric && !toastShown) {
        toast.error("Receipt number must contain only numbers!");
        setToastShown(true);
      }
      
      // If user corrects the input, reset the toast
      if (isReceiptNumeric && toastShown) {
        setToastShown(false);
      }

      setReceiptError(!isReceiptNumeric); // Set error state if input is not numeric
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
      toast.error('Receipt number must contain only numbers!');
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
        }),
      });

      //Fetch the most recent pi_id
      const response = await fetch("/api/get_recent_pi_id");
      const data = await response.json();
      const recentPoId = data.pi_id;

      //Redirect to the Add-PuchaseDetails page with the recent pi_id
      router.push(`/PurchaseDetails`);
    } catch (error) {
      toast.error("Failed to create Purchase Order");
    }
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Purchased Item
      </p>
      <div className="flex justify-end mt-4">
      <AddSupplier />
       
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
          <label>Receipt Number: </label>

          <input
            type="text"
            id="receipt_no"
            name="receipt_no"
            value={formData.receipt_no}
            onChange={handleChange}
            className={`mt-1 w-1/2 px-3 py-2 border ${
              receiptError ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none sm:text-sm`}
          />

          <Button
            type="submit"
            className="bg-black text-white hover:bg-slate-900"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchasedItem;
