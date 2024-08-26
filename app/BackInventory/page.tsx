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
    setData(data);
    console.log(data);

    const formattedData = data.map((item: any) => {
      const [stockInDate, stockInTime] = item.stock_in_date.split('T');
      const [expiryDate, expiryTime] = item.expiry_date.split('T');
      return {
          ...item,
          stock_in_date: stockInDate,
          stock_in_time: stockInTime.split('Z')[0],
          expiry_date: expiryDate,
          expiry_time: expiryTime.split('Z')[0],
      };
  });
  setData(formattedData);
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
                <TableCell className="text-center">{item.bd_id}</TableCell>
                <TableCell className="text-center">{item.item_name}</TableCell>
                <TableCell className="text-center">{item.item_stocks}</TableCell>
                <TableCell className="text-center">{item.unit}</TableCell>
                <TableCell className="text-center">{item.category}</TableCell>
                <TableCell className="text-center">{item.location_shelf}</TableCell>
                <TableCell className="text-center">{item.expiry_date}</TableCell>
                <TableCell className="text-center">
                  <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-2"
                    onClick={() => handleViewDetails(item)}>
                    View
                  </Button>
                  <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-2" 
                  onClick={() => handleEditDetails(item)}>
                    Edit
                  </Button>
                  <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-2" 
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
        <div className="bg-white p-8 rounded-md shadow-md min-h-[50vh] max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">Item Details</h2>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">ID:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.bd_id}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Item Name:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.item_name}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Stocks:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.item_stocks}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Unit:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.unit}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Category:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.category}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Location Shelf:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.location_shelf}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Stock-In Date:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.stock_in_date}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Expiry Date:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.expiry_date}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Stock Damaged:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.stock_damaged}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Recent PO ID:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.po_id}</td>
              </tr>
            </tbody>
          </table>
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