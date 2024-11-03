'use client';

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";

interface ShelfLocation {
    sl_id: number;
    sl_name: string;
    inv_type: string;
}

interface BackInventory {
    bd_id: number;
    purchased_detail: {
      item: {
        item_id: number;
        item_name: string;
        description: string;
        unit: {
          unit_id: number;
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

interface MoveInventoryProps {
    onModalClose?: () => void;
    selectedItems: BackInventory[];
    refreshInventory: () => void;
}

const MoveInventory = ({ onModalClose, selectedItems, refreshInventory }: MoveInventoryProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localSelectedItems, setLocalSelectedItems] = useState<Array<{
        bd_id: number;
        sl_id: number;
        quantity: number | null;
        newSlId: number | null;
        unit_id: number; // Add unit_id to localSelectedItems
    }>>([]);
    const [shelfLocations, setShelfLocations] = useState<ShelfLocation[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasInteracted, setHasInteracted] = useState<Record<number, boolean>>({});

    // Fetch shelf locations (example API)
    const fetchShelfLocations = async () => {
        try {
            const response = await fetch("/api/shelf_location");
            const data = await response.json();
            setShelfLocations(data);
        } catch (error) {
            console.log("Error fetching shelf locations", error);
            toast.error("Failed to fetch shelf locations");
        }
    };

    useEffect(() => {
        if (selectedItems.length > 0) {
            setIsModalOpen(true);  // Open modal only if there are selected items
            fetchShelfLocations(); // Fetch shelf locations on open
            // Initialize selected items
            const initialSelectedItems = selectedItems.flatMap(item =>
                item.inventory_shelf.map(shelf => ({
                    bd_id: item.bd_id,
                    sl_id: shelf.sl_id,
                    quantity: null, // Quantity starts as null, placeholder will be shown
                    newSlId: null,
                    unit_id: item.purchased_detail.item.unit.unit_id // Ensure this is the correct numeric `unit_id`
                }))
            );
                     
            setLocalSelectedItems(initialSelectedItems);
        }
    }, [selectedItems]);

    // Handle quantity change
    const handleQuantityChange = (bd_id: number, sl_id: number, value: string) => {
        const quantity = Number(value);
        if (isNaN(quantity) || quantity < 0) {
            toast.error("Invalid quantity");
            return;
        }
        setLocalSelectedItems(
            localSelectedItems.map(item => item.bd_id === bd_id && item.sl_id === sl_id ? { ...item, quantity } : item)
        );
         // Mark the input as "interacted" when the user types into it
         setHasInteracted((prev) => ({
            ...prev,
            [bd_id]: true,
        }));
    };

    const isInvalidQuantity = (bd_id: number, sl_id: number) => {
        const selectedItem = localSelectedItems.find(item => item.bd_id === bd_id && item.sl_id === sl_id);
        const shelfEntry = selectedItems.find(inv => inv.bd_id === bd_id)?.inventory_shelf.find(shelf => shelf.sl_id === sl_id);
        return selectedItem && (selectedItem.quantity === null || selectedItem.quantity < 0 || selectedItem.quantity > (shelfEntry?.quantity || 0));
      };

    // Handle location change
    const handleLocationChange = (bd_id: number, sl_id: number, newShelfId: number) => {
        console.log(`Updating shelf location for bd_id: ${bd_id}, sl_id: ${sl_id}, newShelfId: ${newShelfId}`);
        setLocalSelectedItems(
            localSelectedItems.map(item =>
                item.bd_id === bd_id && item.sl_id === sl_id
                    ? { ...item, newSlId: newShelfId }  // Store new shelf ID separately
                    : item
            )
        );
    };
    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const movements = localSelectedItems
            .filter(item => item.quantity !== null && item.quantity > 0 && item.newSlId !== null)
            .map(item => ({
                bd_id: item.bd_id,
                source_sl_id: item.sl_id,
                destination_sl_id: item.newSlId!,
                quantity: item.quantity!,
                hidden: item.newSlId === item.sl_id ? false : true,
                unit_id: item.unit_id
            }));

        // const trackingMovements = movements.map(({ hidden, source_sl_id, destination_sl_id, ...trackingFields }) => ({
        //     ...trackingFields,
        //     source_shelf_id: source_sl_id,
        //     destination_shelf_id: destination_sl_id,
        //     date_moved: new Date().toISOString(),
        //     action: "Transfer", // Set action to "Transfer" as required
        // }));

        const trackingMovements = movements.map(movement => ({
            bd_id: movement.bd_id,
            quantity: movement.quantity,
            source_shelf_id: movement.source_sl_id,
            destination_shelf_id: movement.destination_sl_id,
            unit_id: movement.unit_id,
            date_moved: new Date().toISOString(),
            action: "transferred"
          }))

        if (movements.length === 0) {
            toast.error("No valid movements to submit");
            setIsSubmitting(false);
            return;
        }

        console.log("Submitting movements: ", movements);
        console.log("Submitting trackingMovements for inventory_tracking:", trackingMovements);

        try {
            const response = await fetch("/api/move_inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ movements }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to move inventory");
            }

            // After successful movement, log each move in inventory_tracking
            for (const movement of trackingMovements) {
                const trackingResponse = await fetch("/api/inventory_tracking", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(movement),
                })
        
                if (!trackingResponse.ok) {
                  const trackingErrorData = await trackingResponse.json()
                  throw new Error(trackingErrorData.error || "Failed to log inventory movement")
                }
              }

            toast.success("Inventory moved successfully!");
            setLocalSelectedItems([]);
            setIsSubmitting(false);
            if (onModalClose) onModalClose();
            setIsModalOpen(false);
            await refreshInventory();
        } catch (error: any) {
            toast.error(error.message);
            setIsSubmitting(false);
        }
    };
    
    // Function to filter locations
    const getFilteredLocations = (shelfName: string, categoryName: string, currentSlId: number) => {
        // If the item is already at Meat Prep or Seafood Prep, return an empty array (no further moves possible)
        if ((shelfName === "Meat Prep" && categoryName === "Meat") || 
            (shelfName === "Seafood Prep" && categoryName === "Seafood")) {
            return [];
        }
        
        if (categoryName === "Meat" && shelfName === "Raw Meat") {
            return shelfLocations.filter(location => location.sl_name === "Meat Prep" && location.sl_id !== currentSlId);
        }
        if (categoryName === "Seafood" && shelfName === "Raw Seafood") {
            return shelfLocations.filter(location => location.sl_name === "Seafood Prep" && location.sl_id !== currentSlId);
        }
        
        // Exclude locations related to meat/seafood raw/prep and current location
        return shelfLocations.filter(location => 
            location.sl_name !== "Raw Meat" &&
            location.sl_name !== "Raw Seafood" &&
            location.sl_name !== "Meat Prep" &&
            location.sl_name !== "Seafood Prep" &&
            location.sl_id !== currentSlId
        );
    };
    

    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setIsModalOpen(false);
                    setLocalSelectedItems([]);
                    setIsSubmitting(false);
                    if (onModalClose) onModalClose();
                }
            }}>
                <DialogContent className="w-full max-w-5xl max-h-[80vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Move Inventory</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-xl mb-4">Selected Items to Move</h3>
                            {selectedItems.length > 0 ? (
                                <div className="space-y-6">
                                    {selectedItems.map((inventory) => (
                                        <div key={inventory.bd_id}>
                                            {inventory.inventory_shelf.map((shelf) => (
                                                <div className="flex items-center justify-between space-x-2" key={shelf.sl_id}>
                                                    <label className="ml-2">
                                                        {inventory.purchased_detail.item.item_name} - {inventory.purchased_detail.item.description} (Shelf: {shelf.shelf_location.sl_name}, Qty: {shelf.quantity})
                                                    </label>
                                                    <div className="flex items-center space-x-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold">Quantity</label>
                                                            <input
                                                                type="number"
                                                                value={localSelectedItems.find(selectedItem => selectedItem.bd_id === inventory.bd_id && selectedItem.sl_id === shelf.sl_id)?.quantity || ""}
                                                                onChange={(e) => handleQuantityChange(inventory.bd_id, shelf.sl_id, e.target.value)}
                                                                className={`border ${hasInteracted[inventory.bd_id] && isInvalidQuantity(inventory.bd_id, shelf.sl_id) ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-1 w-48 focus:outline-none`}
                                                                placeholder={`Max: ${String(shelf.quantity)}`}
                                                                min={0}
                                                                max={shelf.quantity}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold">New Location</label>
                                                            <select
                                                                value={localSelectedItems.find(selectedItem => selectedItem.bd_id === inventory.bd_id && selectedItem.sl_id === shelf.sl_id)?.newSlId || ""}
                                                                onChange={(e) => handleLocationChange(inventory.bd_id, shelf.sl_id, Number(e.target.value))}
                                                                className="border border-gray-300 rounded px-3 py-1 w-48 focus:outline-none"
                                                                disabled={getFilteredLocations(shelf.shelf_location.sl_name, inventory.purchased_detail.item.category.category_name, shelf.sl_id).length === 0}
                                                            >
                                                                {getFilteredLocations(shelf.shelf_location.sl_name, inventory.purchased_detail.item.category.category_name, shelf.sl_id).length === 0 ? (
                                                                    <option value="" disabled>No available locations</option>
                                                                ) : (
                                                                    <>
                                                                        <option value="" disabled>Select Location</option>
                                                                        {getFilteredLocations(shelf.shelf_location.sl_name, inventory.purchased_detail.item.category.category_name, shelf.sl_id).map((location) => (
                                                                            <option key={location.sl_id} value={location.sl_id}>{location.sl_name}</option>
                                                                        ))}
                                                                    </>
                                                                )}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No items in inventory available for moving.</p>
                            )}
                        </div>
                        <div className="mt-6">
                            <Button type="submit" disabled={isSubmitting} className="text-white px-4 py-2 rounded-md">
                                {isSubmitting ? "Moving..." : "Move Inventory"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MoveInventory;