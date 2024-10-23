"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from "@/components/ui/button";
import Link from 'next/link';

interface InventoryMovement {
  date_moved: string;
  quantity: number;
  shelf_location: 
    { sl_name: string; }; // Shelf location name
  action: string; // "used", "damaged", or "NA"
}

interface InventoryHistory {
  bd_id: number;
  item_name: string;
  created_at: string;
  stock_out_date: string;
  movements: InventoryMovement[];
}

const InventoryHistoryPage = () => {
  const [history, setHistory] = useState<InventoryHistory[]>([]);

  const fetchInventoryHistory = async () => {
    try {
      const response = await fetch("/api/back_inventory/history");
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error("Error fetching inventory history", error);
    }
  };

  useEffect(() => {
    fetchInventoryHistory();
    console.log(history);
  }, []);

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString || dateTimeString === "NA") {
      return "NA";
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateTimeString).toLocaleString('en-US', options);
  };

  return (
    <div className="mt-24 ml-32 mr-32">
      <p className="text-3xl font-bold text-[#483C32] text-center mb-6">Inventory History</p>

      <div className="flex justify-end mt-10">
        <Link href="/Back&FrontInventory">
          <Button>Back</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Movement Date</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Shelf Location</TableHead>
            <TableHead>Stock Action</TableHead> {/* Used/Damaged/NA */}
            <TableHead>Stock Out Date</TableHead> {/* Stock out date */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length > 0 ? (
            history.map((record) => (
              <React.Fragment key={record.bd_id}>
                {record.movements.map((move, index) => (
                  <TableRow key={`${record.bd_id}-${index}`}>
                    <TableCell>{record.item_name}</TableCell>
                    <TableCell>{formatDateTime(move.date_moved)}</TableCell>
                    <TableCell>{move.quantity}</TableCell>
                    <TableCell>{move.shelf_location.sl_name}</TableCell>
                    <TableCell>{move.action === 'NA' ? 'NA' : move.action}</TableCell> {/* Display stock action */}
                    <TableCell>{formatDateTime(record.stock_out_date)}</TableCell> {/* Display stock out date */}
                  </TableRow>
                ))}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">No history available.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryHistoryPage;
