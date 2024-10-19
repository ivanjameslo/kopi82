"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import { MdCancel } from "react-icons/md";

const AddPurchaseDetails = () => {

  const router = useRouter();

  const getExpiryDate = (noExpiry: boolean = false) => {
    if (noExpiry) {
      return "NA";
    }
  
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  const [formDataArray, setFormDataArray] = useState<Array<{
    pd_id: string;
    pi_id: string;
    item_id: string;
    unit_id: string;
    category_id: string;
    quantity: string;
    price: string;
    expiry_date: string | null; 
    noExpiry: boolean;
  }>>([{
    pd_id: uuidv4(),
    pi_id: "",
    item_id: "",
    unit_id: "",
    category_id: "",
    quantity: "",
    price: "",
    expiry_date: getExpiryDate(false), 
    noExpiry: false,
  }]);

  const [recentPiId, setRecentPiId] = useState<number | null>(null);
  const [items, setItems] = useState<{
    description: any; item_name: any; unit_id: any; item_id: number; category_id: any;
  }[]>([]);
  const [units, setUnits] = useState<{ unit_id: any; unit_name: string }[]>([]);
  const [categories, setCategories] = useState<{ category_id: any; category_name: string }[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchRecentPoId = async () => {
      try {
        const response = await fetch("/api/get_recent_pi_id");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRecentPiId(data.pi_id);
        setFormDataArray([
          {
            pd_id: uuidv4(),
            pi_id: data.pi_id,
            item_id: "",
            unit_id: "",
            category_id: "",
            quantity: "",
            price: "",
            expiry_date: getExpiryDate(),
            noExpiry: false,
          },
        ]);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchItemDeets = async () => {
      try {
        const [itemsResponse, unitsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/item"),
          fetch("/api/unit"),
          fetch("/api/category"),
        ]);

        if (!itemsResponse.ok || !unitsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const itemsData = await itemsResponse.json();
        const unitsData = await unitsResponse.json();
        const categoryData = await categoriesResponse.json();

        const newItems = itemsData.map((item: any) => ({
          description: item.description,
          item_name: item.item_name,
          unit_id: item.unit.unit_id,
          item_id: item.item_id,
          category_id: item.category.category_id,
        }));
        
        setItems(newItems);
        console.log("Items: ", items)
        setUnits(unitsData);
        setCategories(categoryData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecentPoId();
    fetchItemDeets();
  }, []);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFormDataArray = [...formDataArray];
    newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
    setFormDataArray(newFormDataArray);
    setError("");
  };

  const handleExpiryToggle = (index: number) => {
    const newFormDataArray = [...formDataArray];
    newFormDataArray[index] = {
      ...newFormDataArray[index],
      noExpiry: !newFormDataArray[index].noExpiry,
      expiry_date: !newFormDataArray[index].noExpiry ? "NA" : getExpiryDate(false), // Set to null when no expiry
    };
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
        category_id: selectedItem.category_id ? selectedItem.category_id.toString() : "",
      };
      setFormDataArray(newFormDataArray);
      console.log(formDataArray)
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Frontend validation for empty fields
    for (const formData of formDataArray) {
      if (!formData.item_id || !formData.unit_id || !formData.quantity || !formData.price || !formData.category_id) {
          toast.error("Please fill in all fields.");
          return;
      }
    }
    
    const isConfirmed = window.confirm("Are you sure the details are correct? Once saved, they cannot be edited.");
    if (!isConfirmed) {
      return; 
    }

    try {
      const formattedDataArray = formDataArray.map((formData) => ({
        pi_id: Number(formData.pi_id),
        item_id: Number(formData.item_id),
        unit_id: Number(formData.unit_id),
        category_id: Number(formData.category_id),
        quantity: Number(formData.quantity),
        price: parseFloat(formData.price),
        expiry_date: formData.noExpiry ? null : new Date(formData.expiry_date as string).toISOString(),
      }));

      const response = await fetch(`/api/purchased_detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedDataArray),
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.error || 'Failed to add purchase details.');
      }

      toast.success('Purchase details added successfully!');
      router.push("/PurchasedItem");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const addNewRow = () => {
    if (recentPiId !== null) {
      setFormDataArray([...formDataArray, {
        pd_id: uuidv4(),
        pi_id: recentPiId.toString(),
        item_id: "",
        unit_id: "",
        category_id: "",
        quantity: "",
        price: "",
        expiry_date: getExpiryDate(false),
        noExpiry: false,
      }]);
    } else {
      console.error('Recent PO ID is not available');
    }
  };

  const getUnitName = (unit_id: any) => {
    const unit = units.find((unit) => unit.unit_id === unit_id);
    return unit ? unit.unit_name : '';
  }

  const getCategoryName = (category_id: any) => {
    const category = categories.find((category) => category.category_id === category_id);
    return category ? category.category_name : '';
  }

  const removeRow = (index: number) => {
    const newFormDataArray = formDataArray.filter((_, i) => i !== index);
    setFormDataArray(newFormDataArray);
  };

  return (
    <div className="mt-24 ml-16 mr-16">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Purchased Item Details
      </p>
      
      <form onSubmit={handleSubmit}>
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead className="w-96">Item Name</TableHead>
              <TableHead className="w-40">Quantity</TableHead>
              <TableHead className="w-40">Unit</TableHead>
              <TableHead className="w-40">Category</TableHead>
              <TableHead className="w-40">Price</TableHead>
              <TableHead className="w-40">Expiry Date</TableHead>
              <TableHead className="w-20">No Expiry?</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {formDataArray.map((formData, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  <input
                    type="number"
                    name="pi_id"
                    value={formData.pi_id}
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
                    className="w-full p-0.5"
                  >
                    <option value="" disabled hidden>
                      Select Item
                    </option>
                    {items.map((item) => (
                      <option key={item.item_id} value={item.item_id}>
                        {item.item_name + "\n" + item.description}
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
                    className="w-full p-0.5"
                  />
                </TableCell>
                <TableCell>
                    <input
                      type="text"
                      name="unit"
                      value={getUnitName(parseInt(formData.unit_id))}
                      readOnly
                      className="w-full p-0.5"
                    />
                </TableCell>
                <TableCell>
                    <input
                      type="text"
                      name="category"
                      value={getCategoryName(parseInt(formData.category_id))}
                      readOnly
                      className="w-full p-0.5"
                    />
                </TableCell>
                <TableCell className="text-right">
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-0.5"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date || ''}
                    onChange={(e) => handleChange(index, e)}
                    className="w-full p-0.5"
                    disabled={formData.noExpiry}
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={formData.noExpiry}
                    onChange={() => handleExpiryToggle(index)}  // Toggle expiry on checkbox change
                  />
                </TableCell>
                <TableCell className="text-center">
                    {formDataArray.length > 1 ? (
                        <MdCancel type="button" size={25} style={{color: 'd00000', cursor: 'pointer'}} onClick={() => removeRow(index)} />
                    ) : (
                        <span style={{ display: 'inline-block', width: '25px', height: '25px' }}></span>
                    )}
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