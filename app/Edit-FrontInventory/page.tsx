"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface EditFrontInventoryProps {
  selectedItem: any;
  onClose: () => void;
  onSave: (updatedItem: any) => void;
}

const EditFrontInventory: React.FC<EditFrontInventoryProps> = ({
  selectedItem,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState(selectedItem);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "product_id") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/front_inventory/${selectedItem.fd_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update Front Inventory");
      }
      const updatedItem = await response.json();
      onSave(updatedItem);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  //FETCHING BACK INVENTORY FOR DROPDOWN
  const [backInventory, setBackInventory] = useState([]);

  useEffect(() => {
    const fetchBackInventory = async () => {
      try {
        const response = await fetch("/api/back_inventory");
        if (!response.ok) {
          throw new Error("Failed to fetch back inventory");
        }
        const data = await response.json();
        setBackInventory(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBackInventory();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Front Inventory</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Back Inventory ID:</label>
            <select
              name="bd_id"
              value={formData.bd_id as string}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {backInventory.map((item: any) => (
                <option key={item.bd_id} value={item.bd_id}>
                  {item.item_name} (ID: {item.bd_id})
                </option>
              ))}
            </select>
          </div>
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
          <div className="mb-4">
            <label>Unit:</label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled hidden>
                {" "}
                Select Unit of Measurement
              </option>
              <option value="bag">Bag</option>
              <option value="box">Box</option>
              <option value="bottle">Bottle</option>
              <option value="slice">Slice</option>
              <option value="pack">Pack</option>
            </select>
          </div>
          <div className="mb-4">
            <label>Stock Used:</label>
            <input
              type="number"
              name="stock_used"
              value={formData.stock_used}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label>Stock Damaged:</label>
            <input
              type="text"
              name="stock_damaged"
              value={formData.stock_damaged}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label>Product ID:</label>
            <input
              type="number"
              name="product_id"
              value={formData.product_id}
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

export default EditFrontInventory;
