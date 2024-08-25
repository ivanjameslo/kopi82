"use client";

import React, { useState } from "react";
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
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';

const AddPurchaseDetails = () => {
  // Initial state with some dummy data
  // const [purchaseDetails, setPurchaseDetails] = useState([
  //   { id: "INV001", itemName: "Item 1", quantity: 1, price: 250.0 },
  // ]);

  // Function to add a new row
  // const addNewRow = () => {
  //   const newRow = {
  //     id: `INV${purchaseDetails.length + 1}`,
  //     itemName: "New Item",
  //     quantity: 1,
  //     price: 0.0,
  //   };
  //   setPurchaseDetails([...purchaseDetails, newRow]);
  // };

  const router = useRouter();

  const [formData, setFormData] = useState({
    po_id: "",
    item_name: "",
    quantity: "",
    unit: "",
    price: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLSelectElement>) => {
    e.preventDefault();
    try{
      await fetch('/api/purchase_details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          po_id: formData.po_id,
          item_name: formData.item_name,
          quantity: formData.quantity,
          unit: formData.unit,
          price: formData.price,
        })
      })
      router.refresh();
    } catch(error){
      console.log(error);
    }
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
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* {purchaseDetails.map((detail, index) => ( */}
              <TableRow>
                <TableCell className="font-medium"><input type="int" name="po_id" value={formData.po_id} onChange={handleChange} /></TableCell>
                <TableCell><input type="text" name="item_name" value={formData.item_name} onChange={handleChange} /></TableCell>
                <TableCell><input type="int" name="quantity" value={formData.quantity} onChange={handleChange} /></TableCell>
                <TableCell><select name="unit" value={formData.unit} onChange={handleChange}>
                  <option value="" disabled hidden> Select Unit of Measurement</option>
                  <option value="bag">Bag</option>
                  <option value="box">Box</option>
                  <option value="bottle">Bottle</option>
                  <option value="slice">Slice</option>
                  <option value="pack">Pack</option>
                  </select></TableCell>
                <TableCell className="text-right"><input type="float" name="price" value={formData.price} onChange={handleChange} /></TableCell>
              </TableRow>
            {/* ))} */}
          </TableBody>
        </Table>

        <div className="flex flex-row gap-3 justify-end">
          {/* <Button variant="outline" onClick={addNewRow}>
            Add Item
          </Button> */}
          <Button variant="outline" type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchaseDetails;
