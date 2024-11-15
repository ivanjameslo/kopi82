'use client';

import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface StockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: {
    bd_id: number;
    item_name: string;
    sl_id: number;
    quantity: number;
    unit_name: string;
    unit_id: number;
  }[];
  refreshInventory: () => void; // Function to refresh inventory data after stock out
}

const StockOutModal = ({ isOpen, onClose, selectedItems, refreshInventory }: StockOutModalProps) => {
  const [stockOutItems, setStockOutItems] = useState(
    selectedItems.map((item) => ({
      bd_id: item.bd_id,
      item_name: item.item_name,
      sl_id: item.sl_id,
      action: "", // stock used or damaged
      quantity: "", // quantity to stock out
      available_quantity: item.quantity, // max available quantity
      unit_name: item.unit_name,
      unit_id: item.unit_id,
    }))
  );

  // Handle action change (stock damaged or used)
  const handleActionChange = (bd_id: number, action: string) => {
    setStockOutItems((prev) =>
      prev.map((item) => (item.bd_id === bd_id ? { ...item, action } : item))
    );
  };

  // Handle quantity change with validation
  const handleQuantityChange = (bd_id: number, value: string) => {
    const quantity = parseInt(value, 10);
    if (isNaN(quantity) || quantity < 0) {
      toast.error("Invalid quantity");
      return;
    }
    const selectedItem = stockOutItems.find((item) => item.bd_id === bd_id);
    if (selectedItem && quantity > selectedItem.available_quantity) {
      toast.error(`Quantity cannot exceed ${selectedItem?.available_quantity}`);
      return;
    }

    setStockOutItems((prev) =>
      prev.map((item) => (item.bd_id === bd_id ? { ...item, quantity: value } : item))
    );
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validItems = stockOutItems.filter(
      (item) => item.action && parseInt(item.quantity, 10) > 0
    )

    if (validItems.length === 0) {
      toast.error("Please select an action and enter a valid quantity.");
      return;
    }

    try {
      const stockOutResponse = await fetch("/api/stock_out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: validItems.map((item) => ({
            bd_id: item.bd_id,
            sl_id: item.sl_id,
            action: item.action,
            quantity: parseInt(item.quantity, 10),
          })),
        }),
      });

      if (!stockOutResponse.ok) {
        const errorData = await stockOutResponse.json();
        toast.error(errorData.error || "Failed to stock out items.");
        return;
      }

      // Inventory tracking API calls
      for (const item of validItems) {
        const trackingData = {
          bd_id: item.bd_id,
          quantity: parseInt(item.quantity, 10),
          source_shelf_id: item.sl_id,
          destination_shelf_id: null,
          unit_id: item.unit_id,
          action: item.action,
        }

        const trackingResponse = await fetch("/api/inventory_tracking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(trackingData),
        })

        if (!trackingResponse.ok) {
          const trackingErrorData = await trackingResponse.json()
          throw new Error(trackingErrorData.error || "Failed to log inventory movement")
        }
      }

      toast.success("Stock out completed successfully.");
      onClose(); // Close modal
      refreshInventory(); // Refresh inventory data after stock out
    } catch (error) {
      console.error("Error during stock out:", error);
      toast.error("Failed to stock out items.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-5xl max-h-[80vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Stock Out Items</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="font-semibold text-xl mb-4">Select Items for Stock Out</h3>
            {stockOutItems.length > 0 ? (
              <div className="space-y-6">
                {stockOutItems.map((item) => (
                  <div key={item.bd_id}>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <span className="ml-2 font-semibold">
                          {item.item_name} (Available: {item.available_quantity} {item.unit_name})
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <label className="block text-sm font-semibold">Select Action</label>
                          <select
                            value={item.action}
                            onChange={(e) => handleActionChange(item.bd_id, e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 w-48"
                            required
                          >
                            <option value="" disabled>Select Action</option>
                            <option value="used">Stock Used</option>
                            <option value="damaged">Stock Damaged</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold">
                            Quantity ({item.unit_name})
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.bd_id, e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1 w-48"
                            placeholder={`Max: ${item.available_quantity}`}
                            min={0}
                            max={item.available_quantity}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <hr className="my-4 border-gray-300" />
                  </div>
                ))}
              </div>
            ) : (
              <p>No items selected for stock out.</p>
            )}
          </div>
          <div className="mt-6">
            <Button type="submit" className="text-white px-4 py-2 rounded-md">
              Confirm Stock Out
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StockOutModal;