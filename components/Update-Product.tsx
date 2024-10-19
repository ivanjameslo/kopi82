"use client";

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, X } from "lucide-react"; // X icon for close button
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "../lib/initSupabase";
import Image from "next/image";

interface Product {
  product_id: number;
  product_name: string;
  category: string;
  type: string;
  hotPrice: number;
  icedPrice: number;
  frappePrice: number;
  singlePrice: number;
  status: string;
  description: string;
  image_url: string;
}

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
  onUpdate: (updatedProduct: Product) => void;
}

export default function EditProduct({ product, onClose, onUpdate }: EditProductModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: product?.category || "",  // Initialize to empty string or product data
    product_name: product?.product_name || "",
    type: product?.type || "",
    hotPrice: product?.hotPrice ? String(product.hotPrice) : "",
    icedPrice: product?.icedPrice ? String(product.icedPrice) : "",
    frappePrice: product?.frappePrice ? String(product.frappePrice) : "",
    singlePrice: product?.singlePrice ? String(product.singlePrice) : "",
    status: product?.status || "",
    description: product?.description || "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        category: product.category || "",
        product_name: product.product_name || "",
        type: product.type || "",
        hotPrice: String(product.hotPrice || ""),
        icedPrice: String(product.icedPrice || ""),
        frappePrice: String(product.frappePrice || ""),
        singlePrice: String(product.singlePrice || ""),
        status: product.status || "",
        description: product.description || "",
      });
      setImagePreview(product.image_url);
    }
  }, [product]);

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
    console.log(`${name} changed to ${value}`); // Debugging statement
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

    let imageUrl = product?.image_url || "";

    try {
      if (imageFile) {
        const { data, error } = await supabase.storage
          .from("ProductImages")
          .upload(`uploads/${Date.now()}_${imageFile.name}`, imageFile);

        if (error) {
          throw new Error("Error uploading image: " + error.message);
        }

        const { data: publicUrlData } = supabase
          .storage
          .from("ProductImages")
          .getPublicUrl(data.path);

        imageUrl = publicUrlData.publicUrl;
      }

      const response = await fetch(`/api/product/${product?.product_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          category: formData.category,
          product_name: formData.product_name,
          type: formData.type,
          hotPrice: Number(formData.hotPrice),
          icedPrice: Number(formData.icedPrice),
          frappePrice: Number(formData.frappePrice),
          singlePrice: Number(formData.singlePrice),
          status: formData.status,
          description: formData.description,
        }),
      });

      if (response.ok) {
        const updatedProduct = await response.json(); // Get the updated product
        onClose(); 
        if (onUpdate) { // Check if onUpdate exists before calling it
          onUpdate(updatedProduct); // Call the onUpdate callback
        }
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setUploading(false);
    }
  };

  const renderPriceInputs = () => {
    switch (formData.category) {
      case "klassic-kopi":
      case "non-kopi":
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
      case "fusion-teas":
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <Card className="w-full max-w-4xl bg-black border-transparent relative">
        <button
          className="absolute top-4 right-4 text-white"
          onClick={onClose} // Close modal on click
        >
          <X size={24} />
        </button>
        <CardHeader>
          <CardTitle className="text-white">Edit Product</CardTitle>
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
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700"
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Click to upload or drag and drop
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
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="z-[10000]">
                      <SelectItem value="klassic-kopi">Klassic Kopi</SelectItem>
                      <SelectItem value="kold-brew">Kold Brew</SelectItem>
                      <SelectItem value="non-kopi">Non Kopi</SelectItem>
                      <SelectItem value="fusion-teas">Fusion Teas</SelectItem>
                      <SelectItem value="beer">Beer</SelectItem>
                      <SelectItem value="all-day-breakfast">All-Day Breakfast</SelectItem>
                      <SelectItem value="rice-meals">Rice Meals</SelectItem>
                      <SelectItem value="pasta">Pasta</SelectItem>
                      <SelectItem value="pizza">Pizza</SelectItem>
                      <SelectItem value="pica-pica">Pica Pica</SelectItem>
                      <SelectItem value="sandwiches">Sandwiches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-white">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent className="z-[10000]">
                      <SelectItem value="widely-available">Widely Available</SelectItem>
                      <SelectItem value="low-in-stock">Low in Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
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
              {uploading ? "Uploading..." : "Update Product"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}