"use client";

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface InventoryHistory {
  bd_id: number;
  item_name: string;
  created_at: string;
  movements: Array<{
    date_moved: string;
    quantity: number;
    from_location: string;
    to_location: string;
  }>;
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
  }, []);

  return (
    <div className="mt-24 ml-32 mr-32">
      <p className="text-3xl font-bold text-[#483C32] text-center mb-6">Inventory History</p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Movement Date</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>From Location</TableHead>
            <TableHead>To Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.length > 0 ? (
            history.map((record) => (
              <React.Fragment key={record.bd_id}>
                {record.movements.map((move, index) => (
                  <TableRow key={`${record.bd_id}-${index}`}>
                    <TableCell>{record.item_name}</TableCell>
                    <TableCell>{new Date(record.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(move.date_moved).toLocaleDateString()}</TableCell>
                    <TableCell>{move.quantity}</TableCell>
                    <TableCell>{move.from_location}</TableCell>
                    <TableCell>{move.to_location}</TableCell>
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
