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

const AddPurchaseDetails = () => {
  // Initial state with some dummy data
  const [purchaseDetails, setPurchaseDetails] = useState([
    { id: "INV001", itemName: "Item 1", quantity: 1, price: 250.0 },
  ]);

  // Function to add a new row
  const addNewRow = () => {
    const newRow = {
      id: `INV${purchaseDetails.length + 1}`,
      itemName: "New Item",
      quantity: 1,
      price: 0.0,
    };
    setPurchaseDetails([...purchaseDetails, newRow]);
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Purchase Details
      </p>
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
          {purchaseDetails.map((detail, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{detail.id}</TableCell>
              <TableCell>{detail.itemName}</TableCell>
              <TableCell>{detail.quantity}</TableCell>
              <TableCell className="text-right">
                ${detail.price.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-row gap-3 justify-end">
        <Button variant="outline" onClick={addNewRow}>
          Add Item
        </Button>
        <Button variant="outline">Submit</Button>
      </div>
    </div>
  );
};

export default AddPurchaseDetails;
