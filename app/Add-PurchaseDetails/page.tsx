"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

const AddPurchaseDetails = () => {
  const router = useRouter();

  const [formDataArray, setFormDataArray] = useState([{
    pd_id: uuidv4(),
    po_id: "",
    item_name: "",
    quantity: "",
    unit: "",
    price: "",
  }]);

  const [recentPoId, setRecentPoId] = useState<number | null>(null);
  useEffect(() => {
    const fetchRecentPoId = async () => {
      try {
        const response = await fetch("/api/get_recent_po_id");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRecentPoId(data.po_id);
        setFormDataArray([{
            pd_id: uuidv4(),
            po_id: data.po_id,
            item_name: "",
            quantity: "",
            unit: "",
            price: "",
          }]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecentPoId();
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFormDataArray = [...formDataArray];
    newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
    setFormDataArray(newFormDataArray);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formDataArray);
      await fetch(`/api/purchase_details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataArray)
      });
      router.push('/PurchaseOrder');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addNewRow = () => {
    if (recentPoId !== null) {
      setFormDataArray([...formDataArray, {
        pd_id: uuidv4(),
        po_id: recentPoId.toString(),
        item_name: "",
        quantity: "",
        unit: "",
        price: "",
      }]);
    } else {
      console.error('Recent PO ID is not available');
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