"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import Select, { MultiValue } from "react-select";
import {
  Select as UISelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "../lib/initSupabase";
import { toast } from "react-toastify";

interface SelectedItem {
  item_id: number;
  item_name: string;
  description: string;
  required_quantity: number;
  status: string;
}


export default function AddProduct() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    category: "",
    product_name: "",
    type: "",
    hotPrice: "",
    icedPrice: "",
    frappePrice: "",
    singlePrice: "",
    status: "",
    description: "",
  });

  const [inventoryItems, setInventoryItems] = useState<SelectedItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const [item, setItem] = useState<SelectedItem[]>([]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchItem = async () => {
    try {
        const response = await fetch('/api/item', { method: 'GET' });
        const data = await response.json();
        setItem(data);
    } catch (error) {
        console.error('Failed to fetch items', error);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  const handleSelectItem = (
    newValue: MultiValue<{
      value: number;
      label: string;
      description: string;
      required_quantity: number;
      status: string;
    }>
  ) => {
    const selected = newValue.map((option) => ({
      item_id: option.value,
      item_name: option.label,
      description: option.description,
      required_quantity: option.required_quantity || 1,
      status: option.status,
    }));
    setSelectedItems(selected);
    console.log("Selected Items:", selected); 
  };
  
  const handleQuantityChange = (item_id: number, quantity: string) => {
    const updatedItems = selectedItems.map((item) =>
      item.item_id === item_id
        ? { ...item, required_quantity: parseInt(quantity, 10) }
        : item
    );
    setSelectedItems(updatedItems);
    console.log("Updated Items:", updatedItems);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
  
    let imageUrl = "";
  
    try {
      if (imageFile) {
        const { data, error } = await supabase.storage
          .from("ProductImages")
          .upload(`uploads/${Date.now()}_${imageFile.name}`, imageFile);
  
        if (error) {
          console.error("Error uploading image:", error);
          throw new Error("Failed to upload image");
        }
  
        const { data: publicUrlData } = supabase
          .storage
          .from("ProductImages")
          .getPublicUrl(data.path);
  
        imageUrl = publicUrlData.publicUrl;
      }
  
      const payload = {
        image_url: imageUrl,
        category: formData.category,
        product_name: formData.product_name,
        type: formData.type,
        hotPrice: Number(formData.hotPrice),
        icedPrice: Number(formData.icedPrice),
        frappePrice: Number(formData.frappePrice),
        singlePrice: Number(formData.singlePrice),
        status: "Widely Available",
        description: formData.description,
        selectedItems,
      };
  
      console.log("Payload being sent:", payload);
  
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from server:", errorData);
        toast.error("Failed to add product");
        return;
      }
  
      toast.success("Product added successfully");
      setTimeout(() => {
        router.push("/Menu");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setUploading(false);
    }
  };  

  const renderPriceInputs = () => {
    switch (formData.category) {
      case "Klassic Kopi":
      case "Non Kopi":
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hotPrice" className="text-white">
                Hot Price
              </Label>
              <Input
                id="hotPrice"
                name="hotPrice"
                type="number"
                value={formData.hotPrice}
                onChange={handleChange}
                placeholder="Hot price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icedPrice" className="text-white">
                Iced Price
              </Label>
              <Input
                id="icedPrice"
                name="icedPrice"
                type="number"
                value={formData.icedPrice}
                onChange={handleChange}
                placeholder="Iced price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frappePrice" className="text-white">
                Frappe Price
              </Label>
              <Input
                id="frappePrice"
                name="frappePrice"
                type="number"
                value={formData.frappePrice}
                onChange={handleChange}
                placeholder="Frappe price"
                required
              />
            </div>
          </div>
        );
      case "Fusion Teas":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hotPrice" className="text-white">
                Hot Price
              </Label>
              <Input
                id="hotPrice"
                name="hotPrice"
                type="number"
                value={formData.hotPrice}
                onChange={handleChange}
                placeholder="Hot price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icedPrice" className="text-white">
                Iced Price
              </Label>
              <Input
                id="icedPrice"
                name="icedPrice"
                type="number"
                value={formData.icedPrice}
                onChange={handleChange}
                placeholder="Iced price"
                required
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-2">
            <Label htmlFor="singlePrice" className="text-white">
              Price
            </Label>
            <Input
              id="singlePrice"
              name="singlePrice"
              type="number"
              value={formData.singlePrice}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-20 bg-black border-transparent">
      <CardHeader>
        <CardTitle className="text-white">Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="image" className="text-white">
                Product Image
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      width={400}
                      height={400}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product_name" className="text-white">
                  Product Name
                </Label>
                <Input
                  id="product_name"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">
                  Category
                </Label>
                <UISelect
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Klassic Kopi">Klassic Kopi</SelectItem>
                    <SelectItem value="Kold-Brew">Kold Brew</SelectItem>
                    <SelectItem value="Non Kopi">Non Kopi</SelectItem>
                    <SelectItem value="Fusion Teas">Fusion Teas</SelectItem>
                    <SelectItem value="Beer">Beer</SelectItem>
                    <SelectItem value="All-Day-Breakfast">All-Day Breakfast</SelectItem>
                    <SelectItem value="Rice-Meals">Rice Meals</SelectItem>
                    <SelectItem value="Pasta">Pasta</SelectItem>
                    <SelectItem value="Pizza">Pizza</SelectItem>
                    <SelectItem value="Pica-Pica">Pica Pica</SelectItem>
                    <SelectItem value="Sandwiches">Sandwiches</SelectItem>
                  </SelectContent>
                </UISelect>
              </div>

              {/* Multi-Select for Items */}
              <div>
                <Label className="text-white">Select Items</Label>
                <Select
                  isMulti
                  options={item.map((item) => ({
                    value: item.item_id,
                    label: `${item.item_name}`,
                    description: item.description,
                    required_quantity: item.required_quantity,
                    status: item.status,
                  }))}
                  onChange={handleSelectItem}
                />
                {selectedItems.map((item) => (
                  <div key={item.item_id} className="flex items-center gap-4 mt-2">
                    <Label className="text-white">{item.item_name}</Label>
                    <Input
                      type="number"
                      value={item.required_quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.item_id, e.target.value)
                      }
                      placeholder="Required Quantity"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {formData.category && renderPriceInputs()}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
            />
          </div>
          <Button type="submit" variant="outline" className="w-full" disabled={uploading}>
            {uploading ? "Uploading..." : "Add Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}