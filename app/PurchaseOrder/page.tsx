"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

const purchaseOrder = () => {
  const router = useRouter();

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    receipt_no: "",
    purchase_date: getCurrentDate(),
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch("/api/purchase_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receipt_no: formData.receipt_no,
          purchase_date: formData.purchase_date,
        }),
      });

      //Fetch the most recent po_id
      const response = await fetch("/api/get_recent_po_id");
      const data = await response.json();
      const recentPoId = data.po_id;

      //Redirect to the Add-PuchaseDetails page with the recent po_id
      router.push(`/Add-PurchaseDetails/${recentPoId}`);
    } catch (error) {
      console.log(error);
    }
  };

  //For Displaying the table
  const [data, setData] = useState<PurchaseOrderData[]>([]);
  const fetchPurchaseOrder = async () => {
    const response = await fetch("/api/purchase_order", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
  };
  useEffect(() => {
    fetchPurchaseOrder().catch((error) => console.log(error));
  }, []);

<<<<<<< HEAD
    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            await fetch('/api/purchase_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    receipt_no: formData.receipt_no,
                    purchase_date: formData.purchase_date + 'T00:00:00Z',
                })
            });

            //Fetch the most recent po_id
            const response = await fetch('/api/get_recent_po_id');
            if (!response.ok) {
                throw new Error('Failed to fetch recent po_id');
            }
            const data = await response.json();
            const recentPoId = data.po_id;

            if (!recentPoId) {
                throw new Error('No recent po_id found');
            }
            //Redirect to the Add-PuchaseDetails page with the recent po_id
            router.push(`/Add-PurchaseDetails/${recentPoId}`);

        } catch(error){
            console.log(error);
        }
    };

    //For Displaying the table
    const [data, setData] = useState<PurchaseOrderData[]>([]);
    const fetchPurchaseOrder = async () => {
        try {
            const response = await fetch('/api/purchase_order', {
                method: 'GET',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            } 
            const data = await response.json();
            console.log('Fetched data:', data); // Log fetched data
            // Split purchase_date into date and time
            const formattedData = data.map((order: any) => {
                const [date, time] = order.purchase_date.split('T');
                return {
                    ...order,
                    purchase_date: date,
                    purchase_time: time.split('Z')[0],
                };
            });
            setData(formattedData);
        } catch (error) {
            console.log(error);
        }
=======
  //For displaying purchase details in modal
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState<
    PurchaseDetailsData[]
  >([]);
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
      console.log(error);
>>>>>>> 4e910518e2d048ca75e491d221e380739e12f457
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPurchaseDetails([]);
  };

  return (
    <div className="mt-24 ml-40 mr-40">
      <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
        Purchase Order
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
          <label>Receipt Number: </label>

          <input
            type="int"
            id="receipt_no"
            name="receipt_no"
            value={formData.receipt_no}
            onChange={handleChange}
            required
            className="mt-1 w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
          />

<<<<<<< HEAD
    return (
        <div className="mt-24 ml-40 mr-40">
            <p className="flex text-3xl text-[#483C32] font-bold justify-center mb-2">
                Purchase Order
            </p>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 mt-5 flex items-center space-x-4 justify-center">
                    <label>Receipt Number: </label>
                    
                    <input type="int" 
                    id="receipt_no" 
                    name="receipt_no" 
                    value={formData.receipt_no} 
                    onChange={handleChange} 
                    required 
                    className="mt-1 w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                  
                    <Button type="submit" className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Submit
                    </Button>
                </div>
            </form>

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
                                    <Button className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
                                    onClick={() => handleViewDetails(purchaseOrder.po_id)}>
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
                                            <TableCell>{detail.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p>No details available.</p>
                        )}
                        <Button onClick={handleCloseModal} className="mt-4">Close</Button>
                    </div>
                </div>
            )}
=======
          <Button
            type="submit"
            className="bg-black text-white hover:bg-slate-900"
          >
            Submit
          </Button>
>>>>>>> 4e910518e2d048ca75e491d221e380739e12f457
        </div>
      </form>

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
                <TableCell>{purchaseOrder.receipt_no}</TableCell>
                <TableCell>{purchaseOrder.purchase_date}</TableCell>
                <TableCell>
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
                      <TableCell>{detail.price}</TableCell>
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

export default purchaseOrder;
