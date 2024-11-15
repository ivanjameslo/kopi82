"use client";

import React, { useEffect, useState } from "react";
import AddShelfLocation from "@/components/Add-ShelfLocation";
import AddBackInventory from "@/components/Add-BackInventory";
import MoveInventory from "@/components/Move-Inventory";
import StockOut from "@/components/Stock-Out-Inventory";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { Button } from "./ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "./ui/pagination";
import { set } from "date-fns";

interface ShelfLocation {
  sl_id: number;
  inv_type: "Front Inventory" | "Back Inventory";
  sl_name: string;
}

interface Unit {
  unit_id: number;
  unit_name: string;
}

interface BackInventory {
  bd_id: number;
  purchased_detail: {
    item: {
      item_id: number;
      item_name: string;
      description: string;
      unit: Unit;
      category: {
        category_name: string;
      };
    };
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
  const [groupedInventory, setGroupedInventory] = useState<Record<string, any>>({});
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});
  const [selectedItemsForMove, setSelectedItemsForMove] = useState<BackInventory[]>([]);
  const [selectedItemsForStockOut, setSelectedItemsForStockOut] = useState<BackInventory[]>([]);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState<boolean>(false);
  const [isStockOutModalOpen, setIsStockOutModalOpen] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<Record<string, boolean>>({});
  const [filteredInventory, setFilteredInventory] = useState<Record<string, any>>({});
  const [selectedLocation, setSelectedLocation] = useState<string>("All");
  const [disableCheckBox, setDisableCheckBox] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchShelfLocations = async () => {
    try {
      const response = await fetch("/api/shelf_location");
      const data = await response.json();
      setShelfLocations([{ sl_id: 0, sl_name: "All", inv_type: "Back Inventory" }, ...data]);
    } catch (error) {
      console.log("Error fetching shelf locations", error);
    }
  };

  const fetchBackInventory = async () => {
    try {
      const response = await fetch("/api/back_inventory");
      const data = await response.json();
      groupInventoryByItem(data);
    } catch (error) {
      console.log("Error fetching back inventory", error);
    }
  };

  const groupInventoryByItem = (data: BackInventory[]) => {
    const grouped = data.reduce((acc: Record<number, any>, item) => {
      const nonZeroShelves = item.inventory_shelf.filter((shelf) => shelf.quantity > 0);
      if (nonZeroShelves.length === 0) return acc;

      const { item_id, item_name } = item.purchased_detail.item;
      const key = item_id;

      if (!acc[key]) {
        acc[key as number] = {
          item_id,
          item_name,
          description: item.purchased_detail.item.description,
          unit_name: item.purchased_detail.item.unit.unit_name,
          category_name: item.purchased_detail.item.category.category_name,
          quantity: 0,
          expiryRange: { min: "", max: "" },
          items: [],
        };
      }

      const itemExpiry = item.purchased_detail.expiry_date;
      acc[key].items.push({ ...item, inventory_shelf: nonZeroShelves });
      // Sort by expiry date to ensure the order is correct after any stock-out updates
      acc[key].items.sort((a: BackInventory, b: BackInventory) => {
        return new Date(a.purchased_detail.expiry_date).getTime() - new Date(b.purchased_detail.expiry_date).getTime();
      });
      acc[key].quantity += nonZeroShelves.reduce((sum, shelf) => sum + shelf.quantity, 0);
      acc[key].expiryRange.min = acc[key].expiryRange.min
        ? new Date(acc[key].expiryRange.min) < new Date(itemExpiry)
          ? acc[key].expiryRange.min
          : itemExpiry
        : itemExpiry;

      acc[key].expiryRange.max = acc[key].expiryRange.max
        ? new Date(acc[key].expiryRange.max) > new Date(itemExpiry)
          ? acc[key].expiryRange.max
          : itemExpiry
        : itemExpiry;

      return acc;
    }, {});

    setGroupedInventory(grouped);
    setFilteredInventory(grouped); // Initially show all inventory items
  };

  const updateDisabledStatus = () => {
    const updatedDisableCheckBox: Record<string, boolean> = {};
  
    // Loop through the inventory to enable the first batch for each location
    Object.values(groupedInventory).forEach((group: any) => {
      const sortedItems = group.items
        .flatMap((item: BackInventory) => item.inventory_shelf.map((shelf) => ({
          ...shelf,
          expiry_date: item.purchased_detail.expiry_date || "NA",
          bd_id: item.bd_id,
        })))
        .sort((a: { expiry_date: string | number | Date; bd_id: number }, b: { expiry_date: string | number | Date; bd_id: number }) => {
          // Sort by expiry date or by order of purchase if expiry date is "NA"
          if (a.expiry_date === "NA" && b.expiry_date === "NA") {
            return a.bd_id - b.bd_id;
          }
          if (a.expiry_date === "NA") return -1;
          if (b.expiry_date === "NA") return 1;
          return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime();
        });
  
      const enabledLocations: Set<string> = new Set();
  
      sortedItems.forEach((shelf: { bd_id: any; sl_id: any; shelf_location: { sl_name: any; }; quantity: number; }) => {
        const key = `${shelf.bd_id}-${group.item_id}-${shelf.sl_id}`;
        const locationName = shelf.shelf_location.sl_name;
  
        // Enable the first batch for each location with quantity > 0
        if (shelf.quantity > 0 && !enabledLocations.has(locationName)) {
          updatedDisableCheckBox[key] = false; // Enable this checkbox
          enabledLocations.add(locationName); // Mark this location as having an enabled item
        } else {
          updatedDisableCheckBox[key] = true; // Disable subsequent items
        }
      });
    });
  
    setDisableCheckBox(updatedDisableCheckBox);
  };  

  const handleLocationFilter = (location: string) => {
    setSelectedLocation(location);
  
    if (location === "All") {
      setFilteredInventory(groupedInventory);
    } else {
      const filtered = Object.entries(groupedInventory).reduce((acc, [key, group]) => {
        const filteredItems = group.items.filter((item: BackInventory) =>
          item.inventory_shelf.some((shelf) => shelf.shelf_location.sl_name === location)
        );
  
        if (filteredItems.length > 0) {
          acc[key] = {
            ...group,
            items: filteredItems,
          };
        }
        return acc;
      }, {} as Record<string, any>); // Specify Record<string, any> to avoid implicit any
  
      setFilteredInventory(filtered);
    }
  };
  
  const clearCheckedForItem = (itemId: number) => {
    setIsChecked((prevChecked) => {
      const updatedChecked = { ...prevChecked };
      Object.keys(updatedChecked).forEach((key) => {
        if (key.startsWith(`${itemId}-`)) {
          delete updatedChecked[key];
        }
      });
      return updatedChecked;
    });
  
    // Also remove the item from selectedItemsForMove and selectedItemsForStockOut
    setSelectedItemsForMove((prev) => prev.filter((item) => item.purchased_detail.item.item_id !== itemId));
    setSelectedItemsForStockOut((prev) => prev.filter((item) => item.purchased_detail.item.item_id !== itemId));
  };
  
  const toggleExpanded = (itemId: number) => {
    setExpandedItems((prev) => {
      const isCurrentlyExpanded = prev[itemId];
  
      // Clear checkboxes if the item is being collapsed
      if (isCurrentlyExpanded) {
        clearCheckedForItem(itemId);
      }
  
      return { ...prev, [itemId]: !isCurrentlyExpanded };
    });
  };  

  const handleItemSelection = (inventory: BackInventory, sl_id: number, checked: boolean) => {
    const key = `${inventory.bd_id}-${inventory.purchased_detail.item.item_id}-${sl_id}`; // unique key
    setIsChecked((prevChecked) => ({ ...prevChecked, [key]: checked }));
  
    if (checked) {
      const selectedShelf = inventory.inventory_shelf.find((shelf) => shelf.sl_id === sl_id);
      if (selectedShelf) {
        const newInventory = { ...inventory, inventory_shelf: [selectedShelf] };
        setSelectedItemsForMove((prev) => [...prev, newInventory]);
        setSelectedItemsForStockOut((prev) => [...prev, newInventory]);
      }
    } else {
      setSelectedItemsForMove((prev) =>
        prev.filter((item) => !(item.bd_id === inventory.bd_id && item.inventory_shelf[0].sl_id === sl_id))
      );
      setSelectedItemsForStockOut((prev) =>
        prev.filter((item) => !(item.bd_id === inventory.bd_id && item.inventory_shelf[0].sl_id === sl_id))
      );
    }
    updateDisabledStatus();
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
    setSelectedItemsForStockOut([]);
    setIsChecked({});
  };

  const openStockOutModal = () => {
    if (selectedItemsForStockOut.length === 0) {
      toast.error("Please select at least one item to stock out.");
      return;
    }
    setIsStockOutModalOpen(true);
  };

  const mappedStockOutItems = selectedItemsForStockOut.map((inventory) => ({
    bd_id: inventory.bd_id,
    item_name: inventory.purchased_detail.item.item_name,
    sl_id: inventory.inventory_shelf[0].sl_id,
    quantity: inventory.inventory_shelf[0].quantity,
    unit_name: inventory.purchased_detail.item.unit.unit_name,
    unit_id: inventory.purchased_detail.item.unit.unit_id,
  }));

  const closeStockOutModal = () => {
    setIsStockOutModalOpen(false);
    setSelectedItemsForStockOut([]);
    setSelectedItemsForMove([]);
    setIsChecked({});
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString || dateTimeString === "NA") {
      return "NA";
    }
    const expiryDate = new Date(dateTimeString);
    const currentDate = new Date();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    const isExpiringSoon = expiryDate.getTime() - currentDate.getTime() <= oneWeekInMs;

    return (
      <span style={{ color: isExpiringSoon ? "red" : "inherit" }}>
        {expiryDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </span>
    );
  };

  useEffect(() => {
    fetchShelfLocations();
    fetchBackInventory();
  }, []);

  useEffect(() => {
    updateDisabledStatus();
  }, [groupedInventory]);

  // Pagination
  const totalPages = Math.ceil(Object.keys(filteredInventory).length / itemsPerPage);
  const totalItems = Object.keys(filteredInventory).length;

  const paginatedInventory = Object.values(filteredInventory)
  .slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="mt-24 ml-32 mr-32">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">Inventory</p>

      <div className="flex justify-between items-center mt-9 mb-4">
        <div className="flex flex-row space-x-3 ml-auto">
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
              selectedItems={mappedStockOutItems}
              refreshInventory={fetchBackInventory}
            />
          )}
          <Button onClick={() => router.push("/Back&FrontInventory/History")} className="btn-secondary">
            History
          </Button>
        </div>
      </div>

      {/* Shelf location labels for filtering */}
      <div className="flex space-x-4 mt-8 mb-4">
        <span
          className={`cursor-pointer ${
            selectedLocation === "All" ? "text-yellow-900 font-bold" : "text-gray-500"
          }`}
          onClick={() => handleLocationFilter("All")}
        >
          All
        </span>
        {shelfLocations
          .filter((location) => location.sl_name !== "All")
          .map((location) => (
            <span
              key={location.sl_id}
              className={`cursor-pointer ${
                selectedLocation === location.sl_name ? "text-yellow-900 font-bold" : "text-gray-500"
              }`}
              onClick={() => handleLocationFilter(location.sl_name)}
            >
              {location.sl_name}
            </span>
          ))}
      </div>

      <div className="mt-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Expand</TableHead>
              <TableHead>Item ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Total Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Shelf Location</TableHead>
              <TableHead>Expiry Date Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              // Display items based on the selected shelf location (All or specific
            paginatedInventory.map((group: any) => {
              // Calculate total quantity based on the selected shelf location
              const filteredQuantity = group.items.reduce((sum: number, item: BackInventory) => {
                const shelfQuantity = item.inventory_shelf
                  .filter((shelf) => selectedLocation === "All" || shelf.shelf_location.sl_name === selectedLocation)
                  .reduce((shelfSum, shelf) => shelfSum + shelf.quantity, 0);
                return sum + shelfQuantity;
              }, 0);

              return (
                <React.Fragment key={group.item_id}>
                  <TableRow>
                    <TableCell className="text-center">
                      {expandedItems[group.item_id] ? (
                        <RiArrowDropUpLine
                          onClick={() => toggleExpanded(group.item_id)}
                          style={{ fontSize: "2rem", color: "#493628", cursor: "pointer" }}
                        />
                      ) : (
                        <RiArrowDropDownLine
                          onClick={() => toggleExpanded(group.item_id)}
                          style={{ fontSize: "2rem", color: "#493628", cursor: "pointer" }}
                        />
                      )}
                    </TableCell>
                    <TableCell>{group.item_id}</TableCell>
                    <TableCell>{group.item_name}</TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>{group.category_name}</TableCell>
                    <TableCell>{filteredQuantity}</TableCell>
                    <TableCell>{group.unit_name}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {(() => {
                        const uniqueLocations = Array.from(
                          new Set(
                            group.items.flatMap((item: BackInventory) =>
                              item.inventory_shelf.map((shelf) => shelf.shelf_location.sl_name)
                            )
                          )
                        );
                        return uniqueLocations.length > 1 ? "Varied" : (uniqueLocations[0] as React.ReactNode);
                      })()}
                    </TableCell>
                    <TableCell>
                      {group.expiryRange.min === group.expiryRange.max 
                        ? formatDateTime(group.expiryRange.min) 
                        : <>
                            {formatDateTime(group.expiryRange.min)} - <br /> {formatDateTime(group.expiryRange.max)}
                          </>}
                    </TableCell>
                  </TableRow>

                  {/* Expanded rows for individual items */}
                  {expandedItems[group.item_id] &&
                    group.items.map((item: BackInventory) =>
                      item.inventory_shelf
                        .filter((shelf) =>
                          selectedLocation === "All" || shelf.shelf_location.sl_name === selectedLocation
                        )
                        .map((shelf) => (
                          <TableRow key={`${group.item_id}-${shelf.sl_id}`} className="bg-gray-100">
                            <TableCell className="text-center">
                            <input
                              type="checkbox"
                              checked={Boolean(isChecked[`${item.bd_id}-${group.item_id}-${shelf.sl_id}`])} // unique key here
                              disabled={disableCheckBox[`${item.bd_id}-${group.item_id}-${shelf.sl_id}`]}
                              onChange={(e) => handleItemSelection(item, shelf.sl_id, e.target.checked)}
                              style={{ width: "20px", height: "20px" }}
                            />
                            </TableCell>
                            <TableCell>{group.item_id}</TableCell>
                            <TableCell>{group.item_name}</TableCell>
                            <TableCell>{group.description}</TableCell>
                            <TableCell>{group.category_name}</TableCell>
                            <TableCell>{shelf.quantity}</TableCell>
                            <TableCell>{group.unit_name}</TableCell>
                            <TableCell>{shelf.shelf_location.sl_name}</TableCell>
                            <TableCell>{formatDateTime(item.purchased_detail.expiry_date)}</TableCell>
                          </TableRow>
                        ))
                    )}
                </React.Fragment>
              );
            })
          )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls Floor and Ceiling limit */}
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={currentPage === 1 ? undefined : () => currentPage > 1 && goToPage(currentPage - 1)}
                style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto', opacity: currentPage === 1 ? 0.5 : 1 }}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToPage(page);
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            {totalPages > 5 && <PaginationEllipsis />}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => currentPage < totalPages && goToPage(currentPage + 1)}
                style={{ pointerEvents: currentPage === totalPages ? 'none' : 'auto', opacity: currentPage === totalPages ? 0.5 : 1 }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ViewBackInventory;