"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InventoryMovement {
  date_moved: string;
  quantity: number;
  unit_name: string;
  action: string;
  source_shelf: string;
  destination_shelf: string;
}

interface InventoryItem {
  item_name: string;
  movements: InventoryMovement[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<InventoryItem[]>([]);

  const fetchInventoryTracking = async () => {
    try {
      const response = await fetch("/api/inventory_tracking");
      const data = await response.json();
      console.log("Fetched Inventory Tracking:", data);

      // Transform data to group by item name
      const transformedData = data.reduce((acc: InventoryItem[], record: any) => {
        const itemName = record.item_name || "Unnamed Item";

        const movement: InventoryMovement = {
          date_moved: record.date_moved,
          quantity: record.quantity,
          unit_name: record.unit_name,
          action: record.action,
          source_shelf: record.source_shelf,
          destination_shelf: record.destination_shelf,
        };

        const existingItem = acc.find((item) => item.item_name === itemName);
        if (existingItem) {
          existingItem.movements.push(movement);
        } else {
          acc.push({
            item_name: itemName,
            movements: [movement],
          });
        }

        return acc;
      }, []);

      // Sort movements for each item by date
      transformedData.forEach((item: { movements: any[]; }) => {
        item.movements.sort((a, b) => new Date(b.date_moved).getTime() - new Date(a.date_moved).getTime());
      });

      setHistory(transformedData);
    } catch (error) {
      console.error("Error fetching inventory tracking data:", error);
    }
  };

  useEffect(() => {
    fetchInventoryTracking();
  }, []);

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return "NA";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateTimeString).toLocaleString("en-US", options);
  };

  const formatMovement = (move: InventoryMovement) => {
    switch (move.action) {
      case "added":
        return `${formatDateTime(move.date_moved)}: Added ${move.quantity} ${move.unit_name} to ${move.destination_shelf}`;
      case "transferred":
        return `${formatDateTime(move.date_moved)}: Transferred ${move.quantity} ${move.unit_name} from ${move.source_shelf} to ${move.destination_shelf}`;
      case "used":
      case "damaged":
        return `${formatDateTime(move.date_moved)}: ${move.action.charAt(0).toUpperCase() + move.action.slice(1)} ${move.quantity} ${move.unit_name}`;
      default:
        return `${formatDateTime(move.date_moved)}: ${move.action.charAt(0).toUpperCase() + move.action.slice(1)} ${move.quantity} ${move.unit_name}`;
    }
  };

  return (
    <div className="mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[#483C32] text-center mb-6">Inventory History</h1>
      
      <div className="flex justify-end mt-10 mb-6">
        <Link href="/Back&FrontInventory">
          <Button>Back</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {history.length > 0 ? (
          history.map((item) => (
            <Card key={item.item_name} className="shadow-lg border border-gray-300">
              <CardHeader>
                <CardTitle>{item.item_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {item.movements.slice(0, 5).map((move, index) => (
                    <p key={index} className="text-sm">
                      {formatMovement(move)}
                    </p>
                  ))}
                </div>
                {item.movements.length > 5 && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="mt-4 w-full">View All</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{item.item_name} - Full History</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        {item.movements.map((move, index) => (
                          <p key={index} className="text-sm">
                            {formatMovement(move)}
                          </p>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-full">No inventory history available.</p>
        )}
      </div>
    </div>
  );
}