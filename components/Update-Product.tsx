import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface UpdateProductProps {
  selectedItem: any;
  onClose: () => void;
  onSave: (updatedItem: any) => void;
};

const UpdateProduct = () => {


  return (
    <Dialog>
      <div className="flex justify-end w-full">
        <DialogTrigger asChild>
          <div className="mt-1 mr-1">
            <Button variant="ghost">...</Button>
          </div>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Make changes to your items here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="product_name" className="text-right">
              Product Name
            </Label>
            <Input id="item" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input id="price" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Status" className="text-right">
              Status
            </Label>
            <Input id="availability" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button className="bg-green-900 hover:bg-green-950" type="submit">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProduct;
