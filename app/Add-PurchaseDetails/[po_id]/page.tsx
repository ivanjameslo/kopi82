"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import { ChangeEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AddPurchaseDetails = () => {

  const router = useRouter();
  const searchParams = useSearchParams();
  const po_id = searchParams.get('po_id') || "";

  const [formDataArray, setFormDataArray] = useState([{
    pd_id: uuidv4(),
    po_id: po_id,
    item_name: "",
    quantity: "",
    unit: "",
    price: "",
  }]);

  useEffect(() => {
    setFormDataArray((prevFormDataArray) =>
      prevFormDataArray.map((formData) => ({ ...formData, po_id: po_id }))
    );
  }, [po_id]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFormDataArray = [...formDataArray];
   
    newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
    setFormDataArray(newFormDataArray);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLSelectElement>) => {
    e.preventDefault();
    try{
      await fetch(`/api/purchase_details/${po_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataArray)
      })
      router.push('/PurchaseOrder');
    } catch(error){
      console.log(error);
    }
  };

  const addNewRow = () => {
    setFormDataArray([...formDataArray, {
      pd_id: uuidv4(),
      po_id: po_id,
      item_name: "",
      quantity: "",
      unit: "",
      price: "",
    }]);
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Purchase Details
      </p>
      <form onSubmit={handleSubmit}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">PO_ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {formDataArray.map((formData, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <input
                    type="number"
                    name="po_id"
                    value={formData.po_id}
                    onChange={(e) => handleChange(index, e)}
                    readOnly
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={(e) => handleChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={(e) => handleChange(index, e)}
                  />
                </TableCell>
                <TableCell>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={(e) => handleChange(index, e)}
                  >
                    <option value="" disabled hidden> Select Unit of Measurement</option>
                    <option value="bag">Bag</option>
                    <option value="box">Box</option>
                    <option value="bottle">Bottle</option>
                    <option value="slice">Slice</option>
                    <option value="pack">Pack</option>
                  </select>
                </TableCell>
                <TableCell className="text-right">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={(e) => handleChange(index, e)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex flex-row gap-3 justify-end">
          <Button variant="outline" type="button" onClick={addNewRow}>
            Add Item
          </Button>
          <Button variant="outline" type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchaseDetails;
