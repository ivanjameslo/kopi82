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

  const getExpiryDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const [formDataArray, setFormDataArray] = useState([{
    pd_id: uuidv4(),
    po_id: "",
    item_id: "",
    unit_id: "",
    quantity: "",
    price: "",
    expiry_date: getExpiryDate(), 
  }]);

  const [recentPoId, setRecentPoId] = useState<number | null>(null);
  const [items, setItems] = useState<{ item_name: any; unit_id: any; item_id: number }[]>([]);
  const [units, setUnits] = useState<{ unit_id: any; unit_name: string }[]>([]);

  useEffect(() => {
    const fetchRecentPoId = async () => {
      try {
        const response = await fetch("/api/get_recent_po_id");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRecentPoId(data.po_id);
        setFormDataArray([
          {
            pd_id: uuidv4(),
            po_id: data.po_id,
            item_id: "",
            unit_id: "",
            quantity: "",
            price: "",
            expiry_date: getExpiryDate(),
          },
        ]);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchItemsAndUnits = async () => {
      try {
        const [itemsResponse, unitsResponse] = await Promise.all([
          fetch("/api/item"),
          fetch("/api/unit"),
        ]);

        if (!itemsResponse.ok || !unitsResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const itemsData = await itemsResponse.json();
        const unitsData = await unitsResponse.json();

        setItems(itemsData);
        setUnits(unitsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecentPoId();
    fetchItemsAndUnits();
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFormDataArray = [...formDataArray];
    newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
    setFormDataArray(newFormDataArray);
  };

  const handleItemChange = (index: number, e: ChangeEvent<HTMLSelectElement>) => {
    const selectedItem = items.find(
      (item) => item.item_id === parseInt(e.target.value)
    );
    if (selectedItem) {
      const newFormDataArray = [...formDataArray];
      newFormDataArray[index] = {
        ...newFormDataArray[index],
        item_id: selectedItem.item_id.toString(),
        unit_id: selectedItem.unit_id ? selectedItem.unit_id.toString() : "",
      };
      setFormDataArray(newFormDataArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form data
    const isValid = formDataArray.every((formData) => formData.item_id && formData.unit_id);
    if (!isValid) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const formattedDataArray = formDataArray.map((formData) => ({
        po_id: parseInt(formData.po_id),
        item_id: parseInt(formData.item_id),
        unit_id: parseInt(formData.unit_id),
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null, // Convert to ISO string
      }));

      await fetch(`/api/purchase_details`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedDataArray),
      });
      router.push("/PurchaseOrder");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const addNewRow = () => {
    if (recentPoId !== null) {
      setFormDataArray([...formDataArray, {
        pd_id: uuidv4(),
        po_id: recentPoId.toString(),
        item_id: "",
        unit_id: "",
        quantity: "",
        price: "",
        expiry_date: getExpiryDate(),
      }]);
    } else {
      console.error('Recent PO ID is not available');
    }
  };

  const getUnitName = (unit_id: any) => {
    const unit = units.find((unit) => unit.unit_id === unit_id);
    return unit ? unit.unit_name : '';
  }

  const removeRow = (index: number) => {
    const newFormDataArray = formDataArray.filter((_, i) => i !== index);
    setFormDataArray(newFormDataArray);
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Purchase Details
      </p>
      <form onSubmit={handleSubmit}>
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-96">PO_ID</TableHead>
              <TableHead className="w-96">Item Name</TableHead>
              <TableHead className="w-96">Quantity</TableHead>
              <TableHead className="w-96">Unit</TableHead>
              <TableHead className="w-96">Price</TableHead>
              <TableHead className="w-96">Expiry Date</TableHead>
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
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                <select
                    name="item_id"
                    value={formData.item_id}
                    onChange={(e) => handleItemChange(index, e)}
                    className="w-full"
                  >
                    <option value="" disabled hidden>
                      Select Item
                    </option>
                    {items.map((item) => (
                      <option key={item.item_id} value={item.item_id}>
                        {item.item_name}
                      </option>
                    ))}
                  </select>
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                    <input
                      type="text"
                      name="unit"
                      value={getUnitName(parseInt(formData.unit_id))}
                      readOnly
                      className="w-full"
                    />
                </TableCell>
                <TableCell className="text-right">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" type="button" onClick={() => removeRow(index)} className="w-24">
                    Cancel
                  </Button>
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