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

interface PurchaseOrderData {
  po_id: number;
  receipt_no: number;
  purchase_date: string;
}

interface PurchaseDetailsData {
  pd_id: number;
  po_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  price: number;
}

const ViewPurchaseOrder = () => {
  const router = useRouter();

  // For Displaying the table
  const [data, setData] = useState<PurchaseOrderData[]>([]);
  const fetchPurchaseOrder = async () => {
    try {
      const response = await fetch("/api/purchase_order", {
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

  useEffect(() => {
    fetchPurchaseOrder();
  }, []);

  // For displaying purchase details in modal
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<PurchaseDetailsData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = async (po_id: number) => {
    try {
      const response = await fetch(`/api/purchase_details/${po_id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSelectedPurchaseDetails(data);
      setIsModalOpen(true);
      console.log(data);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchaseDetails([]);
  };

  const phpFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  });

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
              <TableRow key={purchaseOrder.po_id}>
                <TableCell className="text-center">{purchaseOrder.receipt_no}</TableCell>
                <TableCell className="text-center">{purchaseOrder.purchase_date}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => handleViewDetails(purchaseOrder.po_id)}
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
            <h2 className="text-2xl font-bold mb-4">Purchase Details</h2>
            {selectedPurchaseDetails.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Item Name</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Unit</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPurchaseDetails.map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell>{detail.item_name}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>{detail.unit}</TableCell>
                      <TableCell>{phpFormatter.format(detail.price)}</TableCell>
                    </TableRow>
                  ))}
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