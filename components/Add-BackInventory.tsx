'use client';

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "react-toastify";

interface Item {
    item_id: number;
    item_name: string;
    description: string;
    category: {
        category_id: number;
        category_name: string;
    }
    unit: {
        unit_id: number;
        unit_name: string;
    }
}

interface PurchasedItem {
    pi_id: number;
}

interface Unit {
    unit_id: number;
    unit_name: string;
}

interface Supplier {
    supplier_id: number;
    supplier_name: string;
}

interface PurchasedDetailProps {
    pd_id: number;
    pi_id: number;
    item_id: number;
    quantity: number;
    unit_id: number;
    category_id: number;
    price: number;
    expiry_date: string | null;
    supplier_id: number;
    purchased_item: PurchasedItem;
    item: Item;
    unit: Unit;
    supplier: Supplier;
    createdAt: string;
}

interface ShelfLocationProps {
    sl_id: number;
    sl_name: string;
}

interface BackInventoryProps {
    pd_id: number;
}

interface AddBackInventoryProps {
    onModalClose?: () => void;
}

const AddBackInventory = ({ onModalClose }: AddBackInventoryProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [purchasedDetails, setPurchasedDetails] = useState<PurchasedDetailProps[]>([]);
    const [selectedItems, setSelectedItems] = useState<Array<{
        pd_id: number;
        item_id: number;
        sl_id: string | number | readonly string[] | undefined;
        quantity: number;
        unit_id: number;
        pi_id: number; // Include pi_id
        unit_name: string; // Include unit_name
        isInvalid: boolean;
    }>>([]);
    const [shelfLocations, setShelfLocations] = useState<ShelfLocationProps[]>([]);
    const [backInventory, setBackInventory] = useState<BackInventoryProps[]>([]);
    const [processedPurchaseOrders, setProcessedPurchaseOrders] = useState<number[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Fetch Processed Purchase Orders
    const fetchProcessedPurchaseOrders = async () => {
        try {
            const response = await fetch("/api/processed_purchase_details"); 
            const data = await response.json();
            setProcessedPurchaseOrders(data.map((order: { pd_id: number }) => order.pd_id)); // Store processed pd_ids
        } catch (error) {
            console.error("Failed to fetch processed purchase orders:", error);
            toast.error("Failed to load processed purchase orders");
        }
    };

    // Fetch Purchased Detail
    const fetchPurchasedDetail = async () => {
        try {
            const response = await fetch("/api/purchased_detail");
            const data = await response.json();

            // Sort by expiry_date with the nearest date to today first
            const sortedData = data.sort((a: PurchasedDetailProps, b: PurchasedDetailProps) => {
                const today = new Date();
                const expiryA = a.expiry_date ? new Date(a.expiry_date) : null;
                const expiryB = b.expiry_date ? new Date(b.expiry_date) : null;

                if (!expiryA && !expiryB) return 0;
                if (!expiryA) return 1;
                if (!expiryB) return -1;

                return expiryA.getTime() - expiryB.getTime(); // Nearest expiry date first
            });

            setPurchasedDetails(sortedData);
        } catch (error) {
            console.error("Failed to fetch purchased details:", error);
            toast.error("Failed to load purchased details");
        }
    };

    // Fetch Shelf Location
    const fetchShelfLocation = async () => {
        try {
            const response = await fetch("/api/shelf_location");
            const data = await response.json();
            setShelfLocations(data);
        } catch (error) {
            console.error("Failed to fetch shelf locations:", error);
            toast.error("Failed to load shelf locations");
        }
    }

    // Fetch Existing Back Inventory to filter out duplicates
    const fetchBackInventory = async () => {
        try {
            const response = await fetch("/api/back_inventory");
            const data = await response.json();
            setBackInventory(data); // Store the existing back inventory to filter duplicates
        } catch (error) {
            console.error("Failed to fetch back inventory:", error);
            toast.error("Failed to load back inventory");
        }
    };

    // Function to fetch categories
    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/category");
            const data = await response.json();
            setCategories(data); // Assuming you store the categories in state
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Failed to load categories");
        }
    };

    // Function to get category name by id
    const getCategoryNameById = (category_id: any) => {
        const category = categories.find(cat => cat.category_id === category_id);
        return category ? category.category_name : "Unknown";
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchBackInventory();
            fetchProcessedPurchaseOrders();
            fetchPurchasedDetail();
            fetchShelfLocation();
            fetchCategories();
        } else {
            setSelectedItems([]);
        }
    }, [isModalOpen]);

    // Filter out purchased details that are already in the back inventory
    const filteredPurchasedDetails = purchasedDetails.filter(
        (detail) => 
            !backInventory.some(inventory => inventory.pd_id === detail.pd_id) && 
            !processedPurchaseOrders.includes(detail.pd_id)
    );

    // Filter shelf locations based on item's category
    const getFilteredShelfLocations = (categoryName: string | undefined) => {
        if (categoryName?.toLowerCase() === "meat") {
            return shelfLocations.filter(
                (location) => location.sl_name.toLowerCase() === "raw meat" || location.sl_name.toLowerCase() === "meat prep"
            );
        }
        if (categoryName?.toLocaleLowerCase() === "seafood") {
            return shelfLocations.filter(
                (location) => location.sl_name.toLowerCase() === "raw seafood" || location.sl_name.toLowerCase() === "seafood prep"
            );
        }
        return shelfLocations.filter(
            (location) => !["raw meat", "raw seafood", "meat prep", "seafood prep"].includes(location.sl_name.toLowerCase())
        );
    };

    // Handle Item Selection
    const handleItemSelection = (pd_id: number, checked: boolean) => {
        const selectedDetail = purchasedDetails.find((detail) => detail.pd_id === pd_id);
    
        if (checked && selectedDetail) {
            console.log("Selected item details:", selectedDetail);
    
            const isCake = selectedDetail.item?.category?.category_name?.toLowerCase() === "cake";
            setSelectedItems([...selectedItems, {
                pd_id: selectedDetail.pd_id,
                item_id: selectedDetail.item_id, 
                sl_id: "",
                quantity: isCake ? 0 : selectedDetail.quantity, 
                unit_id: selectedDetail.unit.unit_id,
                pi_id: selectedDetail.pi_id,
                unit_name: isCake ? "Slice" : selectedDetail.unit.unit_name,
                isInvalid: false,
            }]);
        } else {
            setSelectedItems(selectedItems.filter((item) => item.pd_id !== pd_id));
        }
    };     

    const isItemSelected = (pd_id: number) => {
        return selectedItems.some(item => item.pd_id === pd_id);
    }

    const handleQuantityChange = (pd_id: number, value: string) => {
        const quantity = parseInt(value, 10);
        if (isNaN(quantity) || quantity < 0) {
            toast.error("Invalid quantity");
            return;
        }
        setSelectedItems(
            selectedItems.map(item => item.pd_id === pd_id ? { ...item, quantity } : item)
        );
    };

    // Handle Shelf Location change
    const handleShelfLocationChange = (pd_id: number, value: string) => {
        setSelectedItems(
            selectedItems.map((item) => (item.pd_id === pd_id ? { ...item, sl_id: value } : item))
        );
    };

    // Handle Submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
    
        const invalidItems = selectedItems.filter(item => !item.sl_id || item.quantity <= 0);
        if (invalidItems.length > 0) {
            toast.error("Please select a valid shelf location and quantity for all items.");
            return;
        }
    
        try {
            const payload = selectedItems.map(item => ({
                // console.log("Submitting item:", item);
                // const isCake = purchasedDetails.find(detail => detail.pd_id === item.pd_id)?.item?.category?.category_name?.toLowerCase() === "cake";
                // return {
                    pd_id: item.pd_id,
                    item_id: item.item_id,
                    sl_id: item.sl_id,
                    quantity: item.quantity,
                    pi_id: item.pi_id,
                    unit_name: item.unit_name,
                // };
            }));
    
            const response = await fetch("/api/back_inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items: payload }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add back inventory");
            }
    
            toast.success("Back Inventory added successfully!");
    
            await markAllAsProcessed(selectedItems);
            await fetchBackInventory();
            await fetchProcessedPurchaseOrders();
    
            setPurchasedDetails(prev => prev.filter(detail => !selectedItems.some(item => item.pd_id === detail.pd_id)));
            setSelectedItems([]);
            setIsModalOpen(false);
            if (onModalClose) onModalClose();
        } catch (error: any) {
            console.error("Failed to add back inventory:", error);
            toast.error(`Failed to add back inventory: ${error.message}`);
        }
    };
    
    const markAllAsProcessed = async (selectedItems: any[]) => {
        try {
            // Fetch all processed pd_ids in one request
            const processedResponse = await fetch("/api/processed_purchase_details");
            const processedData = await processedResponse.json();
            const processedPdIds = processedData.map((item: { pd_id: any; }) => item.pd_id);  // Extract processed pd_ids
    
            console.log("Processed pd_ids:", processedPdIds);
    
            // Filter the selected items to exclude already processed pd_ids
            const unprocessedItems = selectedItems.filter(item => !processedPdIds.includes(item.pd_id));
    
            // Proceed to mark the unprocessed items
            await Promise.all(
                unprocessedItems.map(item => {
                    return fetch("/api/processed_purchase_details", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ pd_id: item.pd_id }),
                    }).then(response => {
                        if (response.status === 409) {
                            console.log(`pd_id ${item.pd_id} was already processed.`);
                        } else if (!response.ok) {
                            console.error(`Failed to process pd_id ${item.pd_id}`, response.statusText);
                        } else {
                            console.log(`Successfully processed pd_id: ${item.pd_id}`);
                        }
                    });
                })
            );
        } catch (error) {
            console.error("Error processing pd_ids:", error);
        }
    };

    const formatDateTime = (dateTimeString: string | null) => {
        if (!dateTimeString || dateTimeString === "NA") {
            return "NA";
        }
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateTimeString).toLocaleString("en-US", options);
    };

    return (
        <div>
            <Button onClick={() => setIsModalOpen(true)}>Add Inventory</Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="w-full max-w-5xl max-h-[80vh] overflow-y-auto p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Add Inventory</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-xl mb-4">Select Items to Stock In</h3>
                            {filteredPurchasedDetails.length > 0 ? (
                                <div className="space-y-6">
                                    {filteredPurchasedDetails.map((item) => (
                                        <div key={item.pd_id}>
                                            <div className="flex items-center justify-between space-x-2">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`item-${item.pd_id}`}
                                                        onChange={(e) => handleItemSelection(item.pd_id, e.target.checked)}
                                                    />
                                                    <label htmlFor={`item-${item.pd_id}`} className="ml-2">
                                                        {item.item_id} {item.item.item_name} - {item.item.description} (Expiry: {formatDateTime(item.expiry_date)})
                                                    </label>
                                                </div>
                                                {selectedItems.some(selectedItem => selectedItem.pd_id === item.pd_id) && (
                                                    <div className="flex items-center space-x-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold">Shelf Location</label>
                                                            <select
                                                                value={selectedItems.find(selectedItem => selectedItem.pd_id === item.pd_id)?.sl_id || ""}
                                                                onChange={(e) => handleShelfLocationChange(item.pd_id, e.target.value)}
                                                                className="border border-gray-300 rounded px-3 py-1 w-48"
                                                                required
                                                            >
                                                                <option value="" disabled>Select Location</option>
                                                                {getFilteredShelfLocations(getCategoryNameById(item.category_id)).map((location) => (
                                                                    <option key={location.sl_id} value={location.sl_id}>
                                                                        {location.sl_name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-semibold">
                                                                Quantity ({getCategoryNameById(item.category_id).toLowerCase() === "cake" ? "Slice" : item.unit.unit_name})
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={selectedItems.find(selectedItem => selectedItem.pd_id === item.pd_id)?.quantity || ""}
                                                                onChange={(e) => handleQuantityChange(item.pd_id, e.target.value)}
                                                                className="border border-gray-300 rounded px-3 py-1 w-24"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <hr className="my-4 border-gray-300" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No purchased items available.</p>
                            )}
                        </div>
                        <div className="mt-6">
                            <Button type="submit" className="text-white px-4 py-2 rounded-md">
                                Add to Inventory
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddBackInventory;