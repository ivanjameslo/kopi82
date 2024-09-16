"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface StockInFrontInventoryProps {
  selectedItem: any;
  onClose: () => void;
  onSave: (updatedItem: any) => void;
}

const StockInFrontInventory: React.FC<StockInFrontInventoryProps> = ({
  selectedItem,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(selectedItem);
  const [itemStock, setItemStock] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the front inventory data, which now includes back_inventory details
    const fetchFrontInventoryData = async () => {
      try {
        console.log("Fetching front inventory for fd_id:", selectedItem.fd_id);
  
        const response = await fetch(`/api/front_inventory/${selectedItem.fd_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch front inventory data");
        }
  
        const frontInventoryData = await response.json();
        console.log("Front inventory data:", frontInventoryData); // Log to check what is received
  
        // Ensure back_inventory is included and contains item_stocks
        if (frontInventoryData.back_inventory && frontInventoryData.back_inventory.item_stocks !== undefined) {
          setItemStock(frontInventoryData.back_inventory.item_stocks);
        } else {
          throw new Error("item_stocks is missing from back inventory in the response");
        }
      } catch (error) {
        console.error("Error fetching front inventory data:", error);
        toast.error(`Error fetching inventory data: ${error}`);
      }
    };
  
    fetchFrontInventoryData();
  }, [selectedItem.fd_id]);
  

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the stock input before making the API call
    if (itemStock !== null && (formData.in_stock < 0 || formData.in_stock > itemStock)) {
      toast.error(`In Stock value must be between 0 and ${itemStock}`);
      return;
    }

    try {
      console.log("Sending PATCH request to update front inventory:", formData);

      const response = await fetch(`/api/front_inventory/${selectedItem.fd_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          in_stock: Number(formData.in_stock),
          stock_in_date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update Front Inventory");
      }

      const updatedItem = await response.json();
      console.log("Front inventory updated:", updatedItem);

      // Update back inventory
      const newItemStock = itemStock !== null ? itemStock - formData.in_stock : null;
      const backInventoryResponse = await fetch(`/api/back_inventory/${selectedItem.bd_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_stocks: Number(newItemStock),
        }),
      });

      if (!backInventoryResponse.ok) {
        throw new Error("Failed to update Back Inventory");
      }

      onSave(updatedItem);
      onClose();
    } catch (error) {
      console.error("Error updating inventory:", error);
      toast.error(`Failed to update inventory: ${error}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Stock In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>In Stock:</label>
            <input
              type="number"
              name="in_stock"
              value={formData.in_stock}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <Button type="submit" className="mt-4">
            Save
          </Button>
          <Button onClick={onClose} className="mt-4 ml-2">
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StockInFrontInventory;
