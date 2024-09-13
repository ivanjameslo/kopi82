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
import UpdateBackInventory from "./Update-BackInventory";
import { format } from 'path';

interface BackInventoryData {
  bd_id: number;
  item_id: number;
  item_stocks: number;
  unit_id: number;
  category_id: number;
  ls_id: number;
  stock_in_date: string;
  stock_damaged: number;
  stock_out_date: string | null;
  po_id: number | null;
  expiry_date: string | null;
  pd_id: number | null;
};

interface ItemData {
  item_id: number;
  item_name: string;
}

interface UnitData {
  unit_id: number;
  unit_name: string;
}

interface CategoryData {
  category_id: number;
  category_name: string;
}

interface LocationShelfData {
  ls_id: number;
  ls_name: string;
}

interface PurchaseDetailsData {
  pd_id: number;
  item_id: number;
  quantity: number;
  expiry_date: string;
  po_id: number;
}

const backInventory = () => {

  const router = useRouter();

  const [data, setData] = useState<BackInventoryData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);
  const [units, setUnits] = useState<UnitData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [locationShelves, setLocationShelves] = useState<LocationShelfData[]>([]);

  const [selectedItem, setSelectedItem] = useState<BackInventoryData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  //READ DATA FROM VARIOUS ENDPOINTS
  const fetchData = async (endpoint: string) => {
    const response = await fetch(endpoint, { method: 'GET' });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const fetchAllData = async () => {
    try {
      const [backInventoryData, itemData, unitData, categoryData, locationShelfData] = await Promise.all([
        fetchData('/api/back_inventory'),
        fetchData('/api/item'),
        fetchData('/api/unit'),
        fetchData('/api/category'),
        fetchData('/api/location_shelf'),
      ]);
      setData(backInventoryData);
      setItems(itemData);
      setUnits(unitData);
      setCategories(categoryData);
      setLocationShelves(locationShelfData);
    } catch (error) {
      console.error('Failed to fetch data: ', error);
    }
  }

  useEffect(() => {
    fetchAllData().catch(error => console.error(error));
  }, []);

  //ADD NEW BACK INVENTORY
  const handleAddNewBackInventory = async () => {
    try {
      const existingItemsIds = data.map(item => item.item_id);
      const newItems = items.filter(item => !existingItemsIds.includes(item.item_id));

      if (newItems.length === 0) {
        console.error('No new items to add to back inventory');
        return;
      }

      const newBackInventoryItems = newItems.map(item => ({
        item_id: item.item_id,
        stock_in_date: null,
        expiry_date: null,
        stock_damaged: 0,
        stock_out_date: null,
        po_id: null,
      }));

      const response = await fetch('/api/back_inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBackInventoryItems),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newBackInventory = await response.json();
      setData([...data, ...newBackInventory]);
      
      router.refresh();
    } catch (error) {
      console.error('Failed to add new back inventory: ', error);
    }
  };

 // STOCK IN FEATURE
 const handleStockIn = async () => {
  try {
    const [purchaseDetails, backInventory] = await Promise.all([
      fetch('/api/purchase_details/latest', {
        method: 'GET',
      }).then(response => {
        if (!response.ok) throw new Error('Failed to fetch purchase details');
        return response.json();
      }),
      fetch('/api/back_inventory', {
        method: 'GET',
      }).then(response => {
        if (!response.ok) throw new Error('Failed to fetch back inventory');
        return response.json();
      }),
    ]);

    console.log('Fetched purchaseDetails:', purchaseDetails);
    console.log('Fetched backInventory:', backInventory);

    const now = new Date().getTime();

    const updatePromises = backInventory.map(async (item: BackInventoryData) => {
      const relevantPurchases = purchaseDetails.filter((pd: { item_id: any }) => pd.item_id === item.item_id);

      if (!relevantPurchases.length) {
        console.log(`No matching purchases for item_id: ${item.item_id}`);
        return;
      }

      // Iterate through relevant purchases
      for (const latestPurchase of relevantPurchases) {
        // Check if this purchase detail has already been processed
        const isAlreadyProcessed = await fetch(`/api/processed_purchase_details/${latestPurchase.id}`, {
          method: 'GET',
        }).then(res => res.ok);

        if (isAlreadyProcessed) {
          console.log(`PurchaseDetail ID ${latestPurchase.id} already processed`);
          continue; // Skip if already processed
        }

        const newItemStocks = item.item_stocks + (latestPurchase?.quantity || 0);

        // Perform the PATCH request to update the back inventory item
        const response = await fetch(`/api/back_inventory/${item.bd_id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stock_in_date: new Date().toISOString(),
            expiry_date: latestPurchase?.expiry_date || null,
            stock_damaged: 0,
            po_id: latestPurchase?.po_id || null,
            item_stocks: newItemStocks,
            pd_id: latestPurchase?.pd_id,
            stock_out_date: item.stock_out_date || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error updating back inventory item with ID:', item.bd_id, errorData);
          throw new Error(`Failed to update back inventory item with ID: ${item.bd_id}`);
        }

        // Mark this purchase detail as processed
        await fetch('/api/processed_purchase_details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ purchase_detail_id: latestPurchase.id }),
        });
      }
    });

    await Promise.all(updatePromises);

    const updatedBackInventoryResponse = await fetch('/api/back_inventory', {
      method: 'GET',
    });
    if (!updatedBackInventoryResponse.ok) {
      throw new Error('Failed to fetch updated back inventory');
    }
    const updatedBackInventory = await updatedBackInventoryResponse.json();
    setData(updatedBackInventory);

    router.refresh();
  } catch (error) {
    console.error('Failed to stock in items:', error);
  }
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
    const isConfirmed = window.confirm("Are you sure you want to delete this item?");
    if (!isConfirmed) {
      return;
    }

    try {
      await fetch(`/api/back_inventory/${bd_id}`, {
        method: 'DELETE',
      });

      setData(data.filter(item => item.bd_id !== bd_id));
    } catch (error) {
      console.error('Failed to delete item: ', error);
    }
  };

  // Helper functions to get names from IDs
  const getItemName = (item_id: number) => {
    const item = items.find(item => item.item_id === item_id);
    return item ? item.item_name : 'Unknown Item';
  };

  const getUnitName = (unit_id: number) => {
    const unit = units.find(unit => unit.unit_id === unit_id);
    return unit ? unit.unit_name : 'Unknown Unit';
  };

  const getCategoryName = (category_id: number) => {
    const category = categories.find(category => category.category_id === category_id);
    return category ? category.category_name : 'Unknown Category';
  };

  const getLocationShelfName = (ls_id: number) => {
    const locationShelf = locationShelves.find(ls => ls.ls_id === ls_id);
    return locationShelf ? locationShelf.ls_name : 'Unknown Location Shelf';
  };

  //DATE FORMAT
  const formatDateTime = (dateTimeString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Back Inventory
      </p>

      <div className="flex justify-end mt-10 space-x-4">
        <Button onClick={handleAddNewBackInventory}>Set Back Inventory</Button>
        <Button onClick={handleStockIn}>Stock In</Button>
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
              <TableHead className="text-center">Expiry Date</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.bd_id}>
                <TableCell className="text-center">{item.bd_id}</TableCell>
                <TableCell className="text-center">{getItemName(item.item_id)}</TableCell>
                <TableCell className="text-center">{item.item_stocks}</TableCell>
                <TableCell className="text-center">{getUnitName(item.unit_id)}</TableCell>
                <TableCell className="text-center">{getCategoryName(item.category_id)}</TableCell>
                <TableCell className="text-center">{getLocationShelfName(item.ls_id)}</TableCell>
                <TableCell className="text-center">{item.expiry_date ? formatDateTime(item.expiry_date) : 'N/A'}</TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" className="mx-1" onClick={() => handleViewDetails(item)}>
                    View
                  </Button>
                  <Button variant="outline" className="mx-1" onClick={() => handleEditDetails(item)}>
                    Edit
                  </Button>
                  <Button variant="outline" className="mx-1" onClick={() => handleDeleteItem(item.bd_id)}>
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
                <td className="px-5 py-3 whitespace-nowrap">{getItemName(selectedItem.item_id)}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Stocks:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.item_stocks}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Unit:</td>
                <td className="px-5 py-3 whitespace-nowrap">{getUnitName(selectedItem.unit_id)}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Category:</td>
                <td className="px-5 py-3 whitespace-nowrap">{getCategoryName(selectedItem.category_id)}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Location Shelf:</td>
                <td className="px-5 py-3 whitespace-nowrap">{getLocationShelfName(selectedItem.ls_id)}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Stock-In Date:</td>
                <td className="px-5 py-3 whitespace-nowrap">{formatDateTime(selectedItem.stock_in_date)}</td>
              </tr>
              <tr>
                <td className="px-5 py-3 whitespace-nowrap font-medium text-gray-900">Expiry Date:</td>
                <td className="px-5 py-3 whitespace-nowrap">{selectedItem.expiry_date ? formatDateTime(selectedItem.expiry_date) : 'N/A'}</td>
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
        <UpdateBackInventory
          selectedItem={selectedItem}
          onSave={handleSaveEdit}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}
export default backInventory;