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
<<<<<<< HEAD:components/Add-Product.tsx
  
  const router = useRouter();
=======
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [hotPrice, setHotPrice] = useState("");
  const [icedPrice, setIcedPrice] = useState("");
  const [frappePrice, setFrappePrice] = useState("");
  const [singlePrice, setSinglePrice] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("widely-available");
>>>>>>> 179c0ab421df72113067d929a85d833c1db08b29:components/AddProduct.tsx

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

<<<<<<< HEAD:components/Add-Product.tsx
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
=======
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setHotPrice("");
    setIcedPrice("");
    setFrappePrice("");
    setSinglePrice("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const priceData = ["klassic-kopi", "non-kopi"].includes(category)
      ? { hotPrice, icedPrice, frappePrice }
      : category === "fusion-teas"
      ? { hotPrice, icedPrice }
      : { price: singlePrice };
    console.log({
      image,
      name,
      category,
      ...priceData,
      description,
      availability,
    });
    // Reset form after submission
    setImage(null);
    setName("");
    setCategory("");
    setHotPrice("");
    setIcedPrice("");
    setFrappePrice("");
    setSinglePrice("");
    setDescription("");
    setAvailability("widely-available");
>>>>>>> 179c0ab421df72113067d929a85d833c1db08b29:components/AddProduct.tsx
  };

  const renderPriceInputs = () => {
    switch (category) {
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
                value={hotPrice}
                onChange={(e) => setHotPrice(e.target.value)}
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
                value={icedPrice}
                onChange={(e) => setIcedPrice(e.target.value)}
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
                value={frappePrice}
                onChange={(e) => setFrappePrice(e.target.value)}
                placeholder="Frappe price"
                required
              />
            </div>
          </div>
<<<<<<< HEAD:components/Add-Product.tsx
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="product_name"
              value={formData.product_name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
=======
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
                value={hotPrice}
                onChange={(e) => setHotPrice(e.target.value)}
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
                value={icedPrice}
                onChange={(e) => setIcedPrice(e.target.value)}
                placeholder="Iced price"
                required
              />
            </div>
>>>>>>> 179c0ab421df72113067d929a85d833c1db08b29:components/AddProduct.tsx
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
<<<<<<< HEAD:components/Add-Product.tsx
              value={formData.price}
              onChange={handleChange}
=======
              value={singlePrice}
              onChange={(e) => setSinglePrice(e.target.value)}
>>>>>>> 179c0ab421df72113067d929a85d833c1db08b29:components/AddProduct.tsx
              placeholder="Enter price"
              required
            />
          </div>
<<<<<<< HEAD:components/Add-Product.tsx
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
=======
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
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">
                  Category
                </Label>
                <Select value={category} onValueChange={handleCategoryChange}>
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
                <Label htmlFor="availability" className="text-white">
                  Availability
                </Label>
                <Select value={availability} onValueChange={setAvailability}>
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
>>>>>>> 179c0ab421df72113067d929a85d833c1db08b29:components/AddProduct.tsx
          </div>
          {category && renderPriceInputs()}
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
<<<<<<< HEAD:components/Add-Product.tsx
=======
      <CardFooter>
        <Button variant="outline" onClick={handleSubmit} className="w-full">
          Add Product
        </Button>
      </CardFooter>
>>>>>>> 179c0ab421df72113067d929a85d833c1db08b29:components/AddProduct.tsx
    </Card>
  );
}
