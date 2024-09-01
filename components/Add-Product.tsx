"use client";

import { useState, ChangeEvent, FormEvent, TextareaHTMLAttributes } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from "next/navigation";

export default function Component() {
  
  const router = useRouter();

  const [formData, setFormData] = useState({
    image: "",
    category: "",
    product_name: "",
    type: "",
    price: "",
    status: "",
    description: "",
  });
  
  //ERASE 
  const [image, setImage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    });
  };
  
  //CHECK
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement | HTMLSelectElement>) => {
    e.preventDefault();
    try{
      await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      router.push('/menu');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                {image ? (
                  <img
                    src={image}
                    alt="Product preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 500x500px)
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
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="klassic-kopi">Klassic Kopi</SelectItem>
                <SelectItem value="kold-brew">Kold Brew</SelectItem>
                <SelectItem value="non-kopi">Non-Kopi</SelectItem>
                <SelectItem value="fusion-teas">Fusion Teas</SelectItem>
                <SelectItem value="all-day-breakfast">
                  All Day Breakfast
                </SelectItem>
                <SelectItem value="rice-meals">Rice Meals</SelectItem>
                <SelectItem value="pasta">Pasta</SelectItem>
                <SelectItem value="pizza">Pizza</SelectItem>
                <SelectItem value="pica-pica">Pica Pica</SelectItem>
                <SelectItem value="beers">Beers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              required
            />
          </div>
            <Button type="submit" className="w-full">
              Add Product
            </Button>
        </form>
      </CardContent>
    </Card>
  );
}
