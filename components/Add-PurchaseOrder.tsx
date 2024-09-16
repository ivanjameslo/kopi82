"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";


const AddPurchaseOrder = () => {
  const router = useRouter();

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    receipt_no: "",
    purchase_date: getCurrentDate(),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Custom validation to ensure input contains only numbers
    const isNumeric = /^\d+$/.test(formData.receipt_no);
    if (!isNumeric) {
      toast.error('Receipt number must contain only numbers!');
      return;
    }
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.receipt_no.trim() === "") {
      toast.error("Please enter the Receipt Number.");
      return;
    }

    // // Custom validation to ensure input contains only numbers
    // const isNumeric = /^\d+$/.test(formData.receipt_no);
    // if (!isNumeric) {
    //   toast.error('Receipt number must contain only numbers!');
    //   return;
    // }

    try {
      await fetch("/api/purchase_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receipt_no: formData.receipt_no,
          purchase_date: formData.purchase_date + "T00:00:00Z",
        }),
      });

      //Fetch the most recent po_id
      const response = await fetch("/api/get_recent_po_id");
      const data = await response.json();
      const recentPoId = data.po_id;

      //Redirect to the Add-PuchaseDetails page with the recent po_id
      router.push(`/PurchaseDetails`);
    } catch (error) {
      toast.error("Failed to create Purchase Order");
    }
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Purchase Order
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
          <label>Receipt Number: </label>

          <input
            type="int"
            id="receipt_no"
            name="receipt_no"
            value={formData.receipt_no}
            onChange={handleChange}
            // required
            className="mt-1 w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
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

export default AddPurchaseOrder;
