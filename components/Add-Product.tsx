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
    hotPrice: "",
    icedPrice: "",
    frappePrice: "",
    singlePrice: "",
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
      status: value,
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

  const handleCategoryChange = (value: string) => {

    const isNoHotPrice = ["kold-brew"].includes(value);
    const isNoIcedPrice = ["beer", "all-day-breakfast", "rice-meals", "pasta", "pizza", "pica-pica", "sandwiches"].includes(value);
    const isNoFrappePrice = ["kold-brew", "beer", "fusion-teas", "all-day-breakfast", "rice-meals", "pasta", "pizza", "pica-pica", "sandwiches"].includes(value);
    const isNoSinglePrice = ["klassic-kopi", "kold-brew", "non-kopi", "fusion-teas"].includes(value)

    setFormData({
      ...formData,
      category: value,
      hotPrice: isNoHotPrice ? "0" : "",
      icedPrice: isNoIcedPrice ? "0" : "",
      frappePrice: isNoFrappePrice ? "0" : "",
      singlePrice: isNoSinglePrice ? "0" : "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch('/api/products',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image,
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
      })
      router.push('/menu'); //Routing
    } catch (error) {
      console.error(error);
    }
  };

  const renderPriceInputs = () => {
    switch (formData.category) {
      case "klassic-kopi":
      case "non-kopi":
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hot-price" className="text-white">
                Hot Price
              </Label>
              <Input
                id="hot-price"
                type="number"
                value={formData.hotPrice}
                onChange={handleChange}
                placeholder="Hot price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iced-price" className="text-white">
                {" "}
                Iced Price
              </Label>
              <Input
                id="iced-price"
                type="number"
                value={formData.icedPrice}
                onChange={handleChange}
                placeholder="Iced price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frappe-price" className="text-white">
                Frappe Price
              </Label>
              <Input
                id="frappe-price"
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
              <Label htmlFor="hot-price" className="text-white">
                Hot Price
              </Label>
              <Input
                id="hot-price"
                type="number"
                value={formData.hotPrice}
                onChange={handleChange}
                placeholder="Hot price"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iced-price" className="text-white">
                Iced Price
              </Label>
              <Input
                id="iced-price"
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
            <Label htmlFor="single-price" className="text-white">
              Price
            </Label>
            <Input
              id="single-price"
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
                <Label htmlFor="name" className="text-white">
                  Product Name
                </Label>
                <Input
                  id="name"
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
                <Select value={formData.category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="klassic-kopi">Klassic Kopi</SelectItem>
                    <SelectItem value="kold-brew">Kold Brew</SelectItem>
                    <SelectItem value="non-kopi">Non Kopi</SelectItem>
                    <SelectItem value="fusion-teas">Fusion Teas</SelectItem>
                    <SelectItem value="beer">Beer</SelectItem>
                    <SelectItem value="all-day-breakfast">
                      All-Day Breakfast
                    </SelectItem>
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
                <Select value={formData.status} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="widely-available">
                      Widely Available
                    </SelectItem>
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
