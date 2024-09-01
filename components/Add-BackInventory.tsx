'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
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
import { v4 as uuidv4 } from 'uuid';
import { get } from 'http';

const backInventory = () => {

  const router = useRouter();

  const getstockInDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  const getExpiryDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  const [formDataArray, setFormDataArray] = useState ([{
    bd_id: uuidv4(),
    item_name: "",
    item_stocks: "",
    unit: "",
    category: "",
    location_shelf: "",
    stock_in_date: getstockInDate(),
    expiry_date: getExpiryDate(),
    stock_damaged: "",
    po_id: "",
  }]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newFormDataArray = [...formDataArray];
   
    newFormDataArray[index] = { ...newFormDataArray[index], [e.target.name]: e.target.value };
    setFormDataArray(newFormDataArray);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement | HTMLSelectElement>) => {
    e.preventDefault();
    try{

      const formattedDataArray = formDataArray.map(formData => ({
        ...formData,
        stock_in_date: formData.stock_in_date ? formData.stock_in_date + 'T00:00:00Z' : '',
        expiry_date: formData.expiry_date ? formData.expiry_date + 'T00:00:00Z' : '',
      }));

        await fetch('/api/back_inventory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedDataArray)
        })
        router.push('./BackInventory');
    } catch(error){
        console.log(error);
    }
  };

  const addNewRow = () => {
    setFormDataArray([...formDataArray, {
      bd_id: uuidv4(),
      item_name: "",
      item_stocks: "",
      unit: "",
      category: "",
      location_shelf: "",
      stock_in_date: getstockInDate(),
      expiry_date: getExpiryDate(),
      stock_damaged: "",
      po_id: "",
    }]);
  }

  //FETCHING ITEM NAMES FROM PURCHASE DETAILS
    const [itemName, setItemName] = useState<string[]>([]);
    const fetchItemName = async () => {
      const response = await fetch('/api/purchase_details', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });
      if (!response.ok) {
          throw new Error('Something went wrong');
      }
      const data = await response.json();
  
      // Use a Set to filter out duplicate item names
      const uniqueItemNames = Array.from(new Set(data.map((item: any) => item.item_name))) as string[];
  
      setItemName(uniqueItemNames);
  }
  
  useEffect(() => {
      fetchItemName().catch(error => console.log(error));
  }, []);

  //FETCHING PO_ID FROM PURCHASE ORDER
  const [poItems, setpoItems] = useState([]);
    const fetchPO_ID = async () => {
        const response = await fetch('/api/purchase_order', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Something went wrong');
        }
        const data = await response.json();
        setpoItems(data);
    }

    useEffect(() => {
        fetchPO_ID().catch(error => console.log(error));
    }, []);

  
  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Back Inventory
      </p>
      <form onSubmit={handleSubmit}>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Item Name</TableHead>
                    <TableHead>Stocks</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Shelf Location</TableHead>
                    <TableHead>Stock-In Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Recent PO ID</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
              {formDataArray.map((formData, index) => (
                <TableRow key={formData.bd_id}>
                    <TableCell className="font-medium">
                      <select name="item_name" value={formData.item_name} onChange={(e) => handleChange(index, e)}>
                        <option value="" disabled hidden> Select Item</option>
                        {itemName.map((item: string) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell><input type="number" name="item_stocks" value={formData.item_stocks} onChange={(e) => handleChange(index, e)} /></TableCell>
                    <TableCell><select name="unit" value={formData.unit} onChange={(e) => handleChange(index, e)}>
                        <option value="" disabled hidden> Select Unit of Measurement</option>
                        <option value="Bag">Bag</option>
                        <option value="Box">Box</option>
                        <option value="Bottle">Bottle</option>
                        <option value="Slice">Slice</option>
                        <option value="Pack">Pack</option>
                    </select></TableCell>
                    <TableCell><select name="category" value={formData.category} onChange={(e) => handleChange(index, e)}>
                        <option value="" disabled hidden> Select Category</option>
                        <option value="Poultry">Poultry</option>
                        <option value="Meat">Meat</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Condiments">Condiments</option>
                        <option value="Seasoning">Seasoning</option>
                    </select></TableCell>
                    <TableCell><input type="text" name="location_shelf" value={formData.location_shelf} onChange={(e) => handleChange(index, e)} /></TableCell>
                    <TableCell><input type="date" name="stock_in_date" value={formData.stock_in_date} onChange={(e) => handleChange(index, e)} /></TableCell>
                    <TableCell><input type="date" name="expiry_date" value={formData.expiry_date} onChange={(e) => handleChange(index, e)} /></TableCell>
                    <TableCell>
                    <select name="po_id" value={formData.po_id} onChange={(e) => handleChange(index, e)}>
                        <option value="" disabled hidden>Select Item</option>
                        {poItems.map((item: any) => (
                            <option key={item.po_id} value={item.po_id}>
                                {item.po_id}
                            </option>
                        ))}
                    </select>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
        <div className="flex flex-row gap-3 justify-end">
          <Button variant="outline" type="button" onClick={addNewRow}>Add Item</Button>
          <Button variant="outline" type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
export default backInventory;