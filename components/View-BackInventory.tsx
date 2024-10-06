'use client';

import React, { useEffect, useState } from 'react';
import AddShelfLocation from '@/components/Add-ShelfLocation';
import AddBackInventory from '@/components/Add-BackInventory';
import MoveInventory from '@/components/Move-Inventory';
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";

interface ShelfLocation {
  sl_id: number;
  sl_name: string;
}

interface BackInventory {
  bd_id: number;
  purchased_detail: {
    item: {
      item_id: number;
      item_name: string;
      description: string;
      unit: {
        unit_name: string;
      }
      category: {
        category_name: string;
      }
    }
    expiry_date: string;
  };
  inventory_shelf: Array<{
    sl_id: number;
    quantity: number;
    shelf_location: {
      sl_name: string;
    };
  }>;
}


const ViewBackInventory = () => {
  const [shelfLocations, setShelfLocations] = useState<ShelfLocation[]>([]);
  const [backInventory, setBackInventory] = useState<BackInventory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [selectedItems, setSelectedItems] = useState<Array<BackInventory>>([]);
  const [selectedItemsForMove, setSelectedItemsForMove] = useState<BackInventory[]>([]);

  const fetchShelfLocations = async () => {
    try {
      const response = await fetch("/api/shelf_location");
      const data = await response.json();
      setShelfLocations(data);
    } catch (error) {
      console.log("Error fetching shelf locations", error);
    }
  };

  const fetchBackInventory = async () => {
    try {
        const response = await fetch("/api/back_inventory");
        const data = await response.json();

        // Sort the backInventory by expiry_date from nearest to farthest
        const sortedData = data.sort((a: BackInventory, b: BackInventory) => {
            const expiryA = new Date(a.purchased_detail.expiry_date).getTime();
            const expiryB = new Date(b.purchased_detail.expiry_date).getTime();
            return expiryA - expiryB; // Nearest expiry date first
        });

        console.log('Sorted Back Inventory Data:', sortedData);
        setBackInventory(sortedData);
    } catch (error) {
        console.log("Error fetching back inventory", error);
    }
  };

  useEffect(() => {
    fetchShelfLocations();
    fetchBackInventory();
  }, []);

  const handleItemSelection = (inventory: BackInventory, checked: boolean) => {
    if (checked) {
      setSelectedItemsForMove([...selectedItemsForMove, inventory]);
    } else {
      setSelectedItemsForMove(
        selectedItemsForMove.filter(item => item.bd_id !== inventory.bd_id)
      );
    }
  };

  const filteredInventory = selectedLocation === "All"
    ? backInventory
    : backInventory.filter(inventory =>
        inventory.inventory_shelf.some(shelf => shelf.shelf_location.sl_name === selectedLocation)
      );

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString || dateTimeString === "NA") {
        return "NA";
    }
    const expiryDate = new Date(dateTimeString);
    const currentDate = new Date();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;

    const isExpiringSoon = expiryDate.getTime() - currentDate.getTime() <= oneWeekInMs;

    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    const formattedDate = expiryDate.toLocaleString("en-US", options);

    return (
      <span style={{ color: isExpiringSoon ? 'red' : 'inherit' }}>
        {formattedDate}
      </span>
    )
  };


  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Back Inventory
      </p>

      {/* Layout for Add Shelf Location Button and Scrollable Nav */}
      <div className="flex justify-center items-center mt-4 mb-4">
        <div className="overflow-x-auto flex-1 flex items-center">
          <span
            className={`text-lg font-semibold mr-6 cursor-pointer relative group ${
              selectedLocation === "All" ? "text-[#6c757d]" : "text-[#483C32]"
            }`}
            onClick={() => setSelectedLocation("All")}
          >
            All
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#6c757d] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </span>
          <span className="mx-4 h-6 w-[2px] bg-gray-300"></span>

          <nav className="flex items-center">
            {shelfLocations.length > 0 ? (
              shelfLocations.map((location, index) => (
                <React.Fragment key={location.sl_id}>
                  <span
                    className={`text-lg font-semibold cursor-pointer relative group ${
                      selectedLocation === location.sl_name ? "text-[#6c757d]" : "text-[#483C32]"
                    }`}
                    onClick={() => setSelectedLocation(location.sl_name)}
                  >
                    {location.sl_name}
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#6c757d] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </span>

                  {index !== shelfLocations.length - 1 && (
                    <span className="mx-4 h-6 w-[2px] bg-gray-300"></span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <span className="text-lg text-gray-500">No shelf locations available</span>
            )}
          </nav>
        </div>

        <div className="ml-4 flex flex-row space-x-3">
          <AddShelfLocation onModalClose={fetchShelfLocations} />
          <AddBackInventory onModalClose={fetchBackInventory} />
          <MoveInventory onModalClose={fetchBackInventory} selectedItems={selectedItemsForMove}/>
        </div>
      </div>

      {/* Table */}
      <div className="mt-12">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Select</TableHead>
              <TableHead className="text-center">Item ID</TableHead>
              <TableHead className="text-center">Item Name</TableHead>
              <TableHead className="text-center">Description</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-center">Unit</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Shelf Location</TableHead>
              <TableHead className="text-center">Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((inventory) => (
                <React.Fragment key={inventory.bd_id}>
                  {inventory.inventory_shelf.map((shelf) => (
                    <TableRow key={shelf.sl_id}>
                      <TableCell className="text-center">
                        <input type="checkbox" onChange={(e) => handleItemSelection(inventory, e.target.checked)}/>
                      </TableCell>
                      <TableCell className="text-center">{inventory.purchased_detail.item.item_id}</TableCell>
                      <TableCell className="text-center">{inventory.purchased_detail.item.item_name}</TableCell>
                      <TableCell className="text-center">{inventory.purchased_detail.item.description}</TableCell>
                      <TableCell className="text-center">{shelf.quantity}</TableCell>
                      <TableCell className="text-center">{inventory.purchased_detail.item.unit.unit_name}</TableCell>
                      <TableCell className="text-center">{inventory.purchased_detail.item.category.category_name}</TableCell>
                      <TableCell className="text-center">{shelf.shelf_location.sl_name}</TableCell>
                      <TableCell className="text-center">{formatDateTime(inventory.purchased_detail.expiry_date)}</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">No back inventory available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewBackInventory;