"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";


interface PurchasedItemData {
  pi_id: number;
  receipt_no: number;
  purchase_date: string;
}

interface PurchasedDetailData {
  pd_id: number;
  pi_id: number;
  item_id: number;
  quantity: number;
  unit_id: number;
  price: number;
  expiry_date: string;
}

interface ItemDate {
  item_id: number;
  item_name: string;
}

interface UnitData {
  unit_id: number;
  unit_name: string;
}

const ViewPurchaseOrder = () => {
  const router = useRouter();

  // For Displaying the table
  const [data, setData] = useState<PurchasedItemData[]>([]);
  const [items, setItems] = useState<ItemDate[]>([]);
  const [units, setUnits] = useState<UnitData[]>([]);

  const fetchPurchasedItem = async () => {
    try {
      const response = await fetch("/api/purchased_item", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);

      const formattedData = data.map((item: any) => {
        const [purchaseDate, purchaseTime] = item.purchase_date.split("T");
        return {
          ...item,
          purchase_date: purchaseDate,
          purchase_time: purchaseTime.split("Z")[0],
        };
      });
      setData(formattedData);
    } catch (error) {
      console.error("Error fetching purchase orders:", error);
    }
  };

  const fetchItemsAndUnits = async () => {
    try {
      const [itemsResponse, unitsResponse] = await Promise.all([
        fetch("/api/item"),
        fetch("/api/unit"),
      ]);

      if (!itemsResponse.ok || !unitsResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const itemsData = await itemsResponse.json();
      const unitsData = await unitsResponse.json();

      setItems(itemsData);
      setUnits(unitsData);
    } catch (error) {
      console.error("Error fetching items and units:", error);
    }
  };

  useEffect(() => {
    fetchPurchasedItem();
    fetchItemsAndUnits();
  }, []);

  // For displaying purchase details in modal
  const [selectedPurchasedDetail, setSelectedPurchasedDetail] = useState<PurchasedDetailData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = async (pi_id: number) => {
    try {
      const response = await fetch(`/api/purchased_detail/${pi_id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSelectedPurchasedDetail(data);
      setIsModalOpen(true);
      console.log(data);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchasedDetail([]);
  };

  const phpFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });

  const getItemName = (item_id: number) => {
    const item = items.find((item) => item.item_id === item_id);
    return item ? item.item_name : "Unknown Item";
  };

  const getUnitName = (unit_id: number) => {
    const unit = units.find((unit) => unit.unit_id === unit_id);
    return unit ? unit.unit_name : "Unknown Unit";
  };

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

      <div className="mt-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Receipt Number</TableHead>
              <TableHead className="text-center">Purchase Date</TableHead>
              <TableHead className="text-center">Purchase Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((purchaseOrder) => (
              <TableRow key={purchaseOrder.pi_id}>
                <TableCell className="text-center">{purchaseOrder.receipt_no}</TableCell>
                <TableCell className="text-center">{formatDateTime(purchaseOrder.purchase_date)}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(purchaseOrder.pi_id)}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-md">
            <h2 className="text-2xl font-bold mb-4">Purchased Item Details</h2>
            {selectedPurchasedDetail.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-32">Item Name</TableHead>
                    <TableHead className="text-center w-32">Expiry Date</TableHead>
                    <TableHead className="text-center w-32">Quantity</TableHead>
                    <TableHead className="text-center w-32">Unit</TableHead>
                    <TableHead className="text-center w-32">Price</TableHead>
                    <TableHead className="text-center w-32">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchasedDetail.map((detail, index) => {
                    const total = detail.quantity * detail.price;
                    return (
                      <TableRow key={index}>
                        <TableCell className="text-center">{getItemName(detail.item_id)}</TableCell>
                        <TableCell className="text-center whitespace-nowrap">{formatDateTime(detail.expiry_date)}</TableCell>
                        <TableCell className="text-center">{detail.quantity}</TableCell>
                        <TableCell className="text-center">{getUnitName(detail.unit_id)}</TableCell>
                        <TableCell className="text-center">{phpFormatter.format(detail.price)}</TableCell>
                        <TableCell className="text-center">{phpFormatter.format(total)}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={5} className="text-right font-bold">Grand Total</TableCell>
                    <TableCell className="font-bold text-center">
                      {phpFormatter.format(
                        selectedPurchasedDetail.reduce((acc, detail) => acc + detail.quantity * detail.price, 0)
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <p>No details available.</p>
            )}
            <Button onClick={handleCloseModal} className="mt-4">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPurchaseOrder;