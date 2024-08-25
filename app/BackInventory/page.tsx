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
import { error } from 'console';
import EditBackInventory from '../Edit-BackInventory/page';

interface BackInventoryData {
  bd_id: number
  item_name: string;
  item_stocks: number;
  unit: string;
  category: string;
  location_shelf: string;
  stock_in_date: string;
  expiry_date: string;
  stock_damaged: number;
  po_id: number;
};

const backInventory = () => {

  const router = useRouter();

  const [data, setData] = useState<BackInventoryData[]>([]);
  const [selectedItem, setSelectedItem] = useState<BackInventoryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //READ BACK INVENTORY DATA
  const fetchBackInventoryData = async () => {
    const response = await fetch('/api/back_inventory', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    } 
    const data = await response.json();
    console.log(data);
  }

  useEffect(() => {
    fetchBackInventoryData().catch(error => console.error(error));
  }, []);

  //ADD NEW BACK INVENTORY PAGE
  const handleAddNewBackInventory = () => {
    router.push('/Add-BackInventory');
  };

  //VIEW MODAL
  const handleViewDetails = (item: BackInventoryData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  //EDIT MODAL
  const handleEditDetails = (item: BackInventoryData) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedItem: BackInventoryData) => {
    setData(data.map(item => item.bd_id === updatedItem.bd_id ? updatedItem : item));
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  //DELETE BACK INVENTORY
  const handleDeleteItem = async (bd_id: number) => {
    try {
      const response = await fetch(`/api/back_inventory/${bd_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setData(data.filter(item => item.bd_id !== bd_id));
    } catch (error) {
      console.error('Failed to delete item: ', error);
    }
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Back Inventory
      </p>

      <div className="flex justify-end mt-10">
        <Button onClick={handleAddNewBackInventory}>Add New Back Inventory</Button>
      </div>

      <div className="mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ID</TableHead>
              <TableHead className="text-center">Item Name</TableHead>
              <TableHead className="text-center">Item Stocks</TableHead>
              <TableHead className="text-center">Unit</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Location Shelf</TableHead>
              {/* <TableHead className="text-center">Stock In Date</TableHead> */}
              <TableHead className="text-center">Expiry Date</TableHead>
              {/* <TableHead className="text-center">Stock Damaged</TableHead>
              <TableHead className="text-center">PO ID</TableHead> */}
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.bd_id}>
                <TableCell>{item.bd_id}</TableCell>
                <TableCell>{item.item_stocks}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.item_name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.location_shelf}</TableCell>
                {/* <TableCell>{item.stock_in_date}</TableCell> */}
                <TableCell>{item.expiry_date}</TableCell>
                {/* <TableCell>{item.stock_damaged}</TableCell>
                <TableCell>{item.po_id}</TableCell> */}
                <TableCell>
                  <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleViewDetails(item)}>
                    View
                  </Button>
                  <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                  onClick={() => handleEditDetails(item)}>
                    Edit
                  </Button>
                  <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                  onClick={() => handleDeleteItem(item.bd_id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            </TableBody>
        </Table>

      {/* MODAL */}
      </div>
      {isModalOpen && selectedItem &&(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md">
          <h2 className="text-2xl font-bold mb-4">Item Details</h2>
              <p><strong>ID:</strong> {selectedItem.bd_id}</p>
              <p><strong>Item Name:</strong> {selectedItem.item_name}</p>
              <p><strong>Stocks:</strong> {selectedItem.item_stocks}</p>
              <p><strong>Category:</strong> {selectedItem.category}</p>
              <p><strong>Location Shelf:</strong> {selectedItem.location_shelf}</p>
              <p><strong>Stock-In Date:</strong> {selectedItem.stock_in_date}</p>
              <p><strong>Stock Damaged:</strong> {selectedItem.stock_damaged}</p>
              <p><strong>Recent PO ID:</strong> {selectedItem.po_id}</p>
              <Button onClick={handleCloseModal} className="mt-4">Close</Button>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedItem && (
        <EditBackInventory
          selectedItem={selectedItem}
          onSave={handleSaveEdit}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}
export default backInventory;