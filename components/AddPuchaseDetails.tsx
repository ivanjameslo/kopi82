import React from "react";
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

const AddPuchaseDetails = () => {
  return (
    <div className="mt-20 ml-40 mr-40">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">PO_ID</TableHead>
            <TableHead>Item Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="flex flex-row gap-3 ml-4 mr-4 justify-end">
        <Button variant="outline">Add Item</Button>
        <Button variant="outline">Submit</Button>
      </div>
    </div>
  );
};

export default AddPuchaseDetails;
