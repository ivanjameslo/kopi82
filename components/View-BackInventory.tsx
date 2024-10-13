'use client';

import React, { useEffect, useState } from 'react';
import AddShelfLocation from '@/components/Add-ShelfLocation';
import AddBackInventory from '@/components/Add-BackInventory';
import MoveInventory from '@/components/Move-Inventory';
import StockOut from '@/components/Stock-Out-Inventory';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from 'react-toastify';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { set } from 'react-hook-form';

interface ShelfLocation {
  sl_id: number;
  inv_type: "Front Inventory" | "Back Inventory";
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
      sl_id: number;
      sl_name: string;
      inv_type: "Front Inventory" | "Back Inventory";
    };
    hidden: boolean;
  }>;
}

const ViewBackInventory = () => {

  const router = useRouter();

  const [shelfLocations, setShelfLocations] = useState<ShelfLocation[]>([]);
  const [inventory, setInventory] = useState<BackInventory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | string>("All");
  const [selectedItemsForMove, setSelectedItemsForMove] = useState<BackInventory[]>([]);
  const [selectedItemsForStockOut, setSelectedItemsForStockOut] = useState<BackInventory[]>([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState<boolean>(false);
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<Record<string, boolean>>({});
  const [selectedInventoryType, setSelectedInventoryType] = useState<"Back Inventory" | "Front Inventory">("Back Inventory");

  const fetchShelfLocations = async () => {
    try {
      const response = await fetch("/api/shelf_location");
      const data = await response.json();
      setShelfLocations(data);
    } catch (error) {
      console.log("Error fetching shelf locations", error);
    }
  };

  const fetchBackInventory = async (): Promise<BackInventory[]> => {
    try {
        const response = await fetch("/api/back_inventory");
        const data = await response.json();

        const sortedData = data.sort((a: BackInventory, b: BackInventory) => {
            const expiryA = new Date(a.purchased_detail.expiry_date).getTime();
            const expiryB = new Date(b.purchased_detail.expiry_date).getTime();
            return expiryA - expiryB;
        });

        setInventory(sortedData);
        return sortedData;
    } catch (error) {
        console.log("Error fetching back inventory", error);
        return [];
    }
  };

  const handleItemSelection = (inventory: BackInventory, sl_id: number, checked: boolean) => {
    const key = `${inventory.bd_id}-${sl_id}`;  // Unique key combining bd_id and sl_id

    // Update checked status
    setIsChecked(prevChecked => ({ ...prevChecked, [key]: checked }));

    // Update selected items based on the checked state
    if (checked) {
        // Add the selected item to the list, include sl_id for the specific shelf
        setSelectedItemsForMove((prev) => [
            ...prev,
            { ...inventory, inventory_shelf: [inventory.inventory_shelf.find(shelf => shelf.sl_id === sl_id)!] }
        ]);
    } else {
        // Remove the item from the selected items
        setSelectedItemsForMove((prev) =>
            prev.filter(
                item => !(item.bd_id === inventory.bd_id && item.inventory_shelf.some(shelf => shelf.sl_id === sl_id))
            )
        );
    }
  };

  const openMoveInventoryModal = () => {
    if (selectedItemsForMove.length === 0) {
      toast.error("Please select at least one item to move.");
      return;
    }
    setIsMoveModalOpen(true);
  };

  const closeMoveInventoryModal = () => {
    setIsMoveModalOpen(false);
    setSelectedItemsForMove([]);
    setIsChecked({});
  };

  // Mapping BackInventory[] to the required structure
  const mappedItemsForStockOut = inventory.flatMap(inv => 
    inv.inventory_shelf.map(shelf => ({
      bd_id: inv.bd_id,
      item_name: inv.purchased_detail.item.item_name,
      quantity: shelf.quantity,
      unit_name: inv.purchased_detail.item.unit.unit_name,
    }))
  );

  const openStockOutModal = () => {
    if (selectedItemsForMove.length === 0) {
      toast.error("Please select at least one item to stock out.");
      return;
    }
    setIsStockOutModalOpen(true);
  }

  const closeStockOutModal = () => {
    setIsStockOutModalOpen(false);
    setSelectedItemsForStockOut([]);
    setIsChecked({});
  }

  useEffect(() => {
    fetchShelfLocations();
    fetchBackInventory();
  }, []);

  const filteredShelfLocations = shelfLocations.filter(
    (location) => location.inv_type === selectedInventoryType
  );

  const filteredInventory = selectedLocation === "All"
  ? inventory.filter(inv => inv.inventory_shelf.some(shelf => {
        // Ensure we find the corresponding shelf location and it matches the selected inventory type
        const location = shelfLocations.find(loc => loc.sl_id === shelf.sl_id);
        return location && location.inv_type === selectedInventoryType;  // Match by selected inventory type
      }))
  : inventory.flatMap(inv =>
      inv.inventory_shelf
        .filter(shelf => {
          const location = shelfLocations.find(loc => loc.sl_id === shelf.sl_id);
          // Match both shelf location and inventory type
          return shelf.sl_id === selectedLocation && 
                 shelf.quantity > 0 &&
                 location?.inv_type === selectedInventoryType;  // Filter strictly by the selected inventory type
        })
        .map(shelf => ({
          ...inv,
          inventory_shelf: [shelf] // Only include the matching shelf
        }))
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
    <div className="mt-24 ml-32 mr-32">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Inventory
      </p>

      <div className="flex justify-between items-center mt-9 mb-4">
        <div className="flex justify-start items-center">
          <span
            onClick={() => setSelectedInventoryType("Back Inventory")}
            className={`text-lg font-semibold cursor-pointer mr-6 relative group ${
              selectedInventoryType === "Back Inventory" ? "font-bold text-[#603e20]" : "text-[#6c757d]"
            }`}
          >
            Back Inventory
            {/* Show the line when "Back Inventory" is selected or hovered */}
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-[#603e20] transition-transform origin-left ${
                selectedInventoryType === "Back Inventory" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            ></span>
          </span>

          <span
            onClick={() => setSelectedInventoryType("Front Inventory")}
            className={`text-lg font-semibold cursor-pointer relative group ${
              selectedInventoryType === "Front Inventory" ? "font-bold text-[#603e20]" : "text-[#6c757d]"
            }`}
          >
            Front Inventory
            {/* Show the line when "Front Inventory" is selected or hovered */}
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-[#603e20] transition-transform origin-left ${
                selectedInventoryType === "Front Inventory" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            ></span>
          </span>
        </div>
        
        <div className="ml-4 flex flex-row space-x-3 justify-end">
          <AddShelfLocation onModalClose={fetchShelfLocations} />
          <AddBackInventory onModalClose={fetchBackInventory} />
          <Button onClick={openMoveInventoryModal} className="btn-primary">
            Move Inventory
          </Button>
          {isMoveModalOpen && (
            <MoveInventory
              onModalClose={closeMoveInventoryModal}
              selectedItems={selectedItemsForMove}
              refreshInventory={fetchBackInventory}
            />
          )}
          <Button onClick={openStockOutModal} className="btn-danger">
            Stock Out
          </Button>
          {isStockOutModalOpen && (
            <StockOut
              isOpen={isStockOutModalOpen}
              onClose={closeStockOutModal}
              selectedItems={mappedItemsForStockOut}
              refreshInventory={fetchBackInventory}
            />
          )}
          <Button onClick={() => router.push("/Back&FrontInventory/History")} className="btn-secondary">
            History
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto flex-1 flex justify-start items-center mt-9">
          <span
            className={`text-lg font-semibold mr-6 cursor-pointer relative group ${
              selectedLocation === "All" ?  "text-[#603e20]" : "text-[#6c757d]"
            }`}
            onClick={() => setSelectedLocation("All")}
          >
            All
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#603e20] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </span>
          <span className="mx-4 h-6 w-[2px] bg-gray-300"></span>
          <nav className="flex items-center overflow-x-auto whitespace-nowrap mr-3">
            {filteredShelfLocations.length > 0 ? (
              filteredShelfLocations.map((location, index) => (
                <React.Fragment key={location.sl_id}>
                  <span
                    className={`text-m font-semibold cursor-pointer relative group ${
                      selectedLocation === location.sl_id ? "text-[#603e20]" : "text-[#6c757d]"
                    }`}
                    onClick={() => setSelectedLocation(location.sl_id)}
                  >
                    {location.sl_name}
                    <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#603e20] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </span>

                  {index !== filteredShelfLocations.length - 1 && (
                    <span className="mx-4 h-6 w-[2px] bg-gray-300"></span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <span className="text-lg text-gray-500">No shelf locations available</span>
            )}
        </nav>
        </div>

      <div className="mt-9">
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
              <TableHead className="text-center">Location Type</TableHead>
              <TableHead className="text-center">Expiry Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((inventory) =>
                inventory.inventory_shelf
                  .filter(shelf => shelf.quantity > 0)  // Ensure only items with quantity > 0 are shown
                  .map((shelf) => (
                    <React.Fragment key={`${inventory.bd_id}-${shelf.sl_id}`}>
                      <TableRow key={`${inventory.bd_id}-${shelf.sl_id}`}>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={Boolean(isChecked[`${inventory.bd_id}-${shelf.sl_id}`])}
                            onChange={(e) =>
                              handleItemSelection(inventory, shelf.sl_id, e.target.checked)
                            }
                          />
                        </TableCell>
                        <TableCell className="text-center">{inventory.purchased_detail.item.item_id}</TableCell>
                        <TableCell className="text-center">{inventory.purchased_detail.item.item_name}</TableCell>
                        <TableCell className="text-center">{inventory.purchased_detail.item.description}</TableCell>
                        <TableCell className="text-center">{shelf.quantity}</TableCell>
                        <TableCell className="text-center">{inventory.purchased_detail.item.unit.unit_name}</TableCell>
                        <TableCell className="text-center">{inventory.purchased_detail.item.category.category_name}</TableCell>
                        <TableCell className="text-center">{shelf.shelf_location.sl_name}</TableCell>
                        <TableCell className="text-center">{shelf.shelf_location.inv_type}</TableCell>
                        <TableCell className="text-center">{formatDateTime(inventory.purchased_detail.expiry_date)}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
              )
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  No inventory available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ViewBackInventory;
