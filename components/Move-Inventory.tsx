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
    selectedItems: BackInventory[];  // Pass selected items from the table
}

const MoveInventory = ({ onModalClose, selectedItems }: MoveInventoryProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [localSelectedItems, setLocalSelectedItems] = useState<Array<{bd_id: number; sl_id: number; quantity: number | null; newSlId: number | null}>>([]);
    const [shelfLocations, setShelfLocations] = useState<ShelfLocation[]>([]);

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
                    newSlId: null
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
    };

    const isInvalidQuantity = (bd_id: number, sl_id: number) => {
        const selectedItem = localSelectedItems.find(item => item.bd_id === bd_id && item.sl_id === sl_id);
        const shelfEntry = selectedItems.find(inv => inv.bd_id === bd_id)?.inventory_shelf.find(shelf => shelf.sl_id === sl_id);
        return selectedItem && (selectedItem.quantity === null || selectedItem.quantity < 0 || selectedItem.quantity > (shelfEntry?.quantity || 0));
      };

    // Handle location change
    const handleLocationChange = (bd_id: number, sl_id: number, newSlId: number) => {
        setLocalSelectedItems(
            localSelectedItems.map(item => item.bd_id === bd_id && item.sl_id === sl_id ? { ...item, newSlId } : item)
        );
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        for (const item of localSelectedItems) {
            const originalItem = selectedItems.find(inv => inv.bd_id === item.bd_id);
            const shelfEntry = originalItem?.inventory_shelf.find(
                shelf => shelf.sl_id === item.sl_id
            );
            if (!shelfEntry || !item.quantity || item.quantity > shelfEntry.quantity) {
                toast.error(`Invalid quantity for ${originalItem?.purchased_detail.item.item_name}`);
                return;
            }
            if (!item.newSlId) {
                toast.error(`Please select a new location for ${originalItem?.purchased_detail.item.item_name}`);
                return;
            }
        }

        try {
            const response = await fetch("/api/move_inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: localSelectedItems }),
            });
            if (!response.ok) throw new Error("Failed to move inventory");

            toast.success("Inventory moved successfully!");
            setLocalSelectedItems([]); // Clear selected items after submission
            if (onModalClose) onModalClose();
            setIsModalOpen(false); // Close modal
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    // Function to filter locations
    const getFilteredLocations = (shelfName: string) => {
        // If the item is in "Raw Meat", only allow it to be moved to "Meat Prep"
        if (shelfName === "Raw Meat") {
            return shelfLocations.filter(location => location.sl_name === "Meat Prep");
        }
        return shelfLocations; // Otherwise, allow all locations
    };

    return (
        <div>
            <Dialog open={isModalOpen} onOpenChange={() => { setIsModalOpen(!isModalOpen); setLocalSelectedItems([]); }}>
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
                                                                className={`border ${isInvalidQuantity(inventory.bd_id, shelf.sl_id) ? 'border-red-500' : 'border-gray-300'} rounded px-3 py-1 w-48 focus:outline-none`}
                                                                placeholder={`Max: ${String(shelf.quantity)}`}
                                                                min={0}
                                                                max={shelf.quantity}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold">New Location</label>
                                                            <select
                                                                onChange={(e) => handleLocationChange(inventory.bd_id, shelf.sl_id, Number(e.target.value))}
                                                                className="border border-gray-300 rounded px-3 py-1 w-48 focus:outline-none"
                                                            >
                                                                <option value="" disabled>Select Location</option>
                                                                {/* Use filtered locations based on the current shelf */}
                                                                {getFilteredLocations(shelf.shelf_location.sl_name).map((location) => (
                                                                    <option key={location.sl_id} value={location.sl_id}>{location.sl_name}</option>
                                                                ))}
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
                            <Button type="submit" className="text-white px-4 py-2 rounded-md">
                                Move Inventory
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MoveInventory;
