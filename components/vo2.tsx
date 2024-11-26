// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { ImageIcon, X } from 'lucide-react';
// import Select, { MultiValue } from "react-select";
// import {
//   Select as UISelect,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { supabase } from "../lib/initSupabase";
// import { toast } from "react-toastify";
// import Image from "next/image";

// interface SelectedItem {
//   item_id: number;
//   item_name: string;
//   description: string;
//   required_quantity: number;
//   status: string;
// }

// interface Product {
//   product_id: number;
//   image_url: string;
//   category: string;
//   product_name: string;
//   type: string;
//   hotPrice: number;
//   icedPrice: number;
//   frappePrice: number;
//   singlePrice: number;
//   status: string;
//   description: string;
//   selectedItems: SelectedItem[];
// }

// interface EditProductModalProps {
//   product: Product;
//   onClose: () => void;
//   onUpdate: (updatedProduct: Product) => void;
// }

// export default function EditProductModal({ product, onClose, onUpdate }: EditProductModalProps) {
//   const [formData, setFormData] = useState({
//     category: product.category,
//     product_name: product.product_name,
//     type: product.type,
//     hotPrice: product.hotPrice.toString(),
//     icedPrice: product.icedPrice.toString(),
//     frappePrice: product.frappePrice.toString(),
//     singlePrice: product.singlePrice.toString(),
//     status: product.status,
//     description: product.description,
//   });

//   const [inventoryItems, setInventoryItems] = useState<SelectedItem[]>([]);
//   const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(product.selectedItems);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(product.image_url);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     fetchInventoryItems();
//   }, []);

//   const fetchInventoryItems = async () => {
//     try {
//       const response = await fetch('/api/item', { method: 'GET' });
//       const data = await response.json();
//       setInventoryItems(data);
//     } catch (error) {
//       console.error('Failed to fetch inventory items:', error);
//     }
//   };

//   const handleSelectItem = (
//     newValue: MultiValue<{
//       value: number;
//       label: string;
//       description: string;
//       required_quantity: number;
//       status: string;
//     }>
//   ) => {
//     const selected = newValue.map((option) => ({
//       item_id: option.value,
//       item_name: option.label,
//       description: option.description,
//       required_quantity: option.required_quantity || 1,
//       status: option.status,
//     }));
//     setSelectedItems(selected);
//   };

//   const handleQuantityChange = (item_id: number, quantity: string) => {
//     const updatedItems = selectedItems.map((item) =>
//       item.item_id === item_id
//         ? { ...item, required_quantity: parseInt(quantity, 10) }
//         : item
//     );
//     setSelectedItems(updatedItems);
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImageFile(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       let imageUrl = product.image_url;

//       if (imageFile) {
//         const { data, error } = await supabase.storage
//           .from("ProductImages")
//           .upload(`uploads/${Date.now()}_${imageFile.name}`, imageFile);

//         if (error) throw error;

//         const { data: publicUrlData } = supabase.storage
//           .from("ProductImages")
//           .getPublicUrl(data.path);

//         imageUrl = publicUrlData.publicUrl;
//       }

//       const updatedProduct = {
//         ...product,
//         ...formData,
//         image_url: imageUrl,
//         hotPrice: Number(formData.hotPrice),
//         icedPrice: Number(formData.icedPrice),
//         frappePrice: Number(formData.frappePrice),
//         singlePrice: Number(formData.singlePrice),
//         selectedItems,
//       };

//       const response = await fetch(`/api/product/${product.product_id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(updatedProduct),
//       });

//       if (!response.ok) throw new Error("Failed to update product");

//       toast.success("Product updated successfully");
//       onUpdate(updatedProduct);
//       onClose();
//     } catch (error) {
//       console.error("Error updating product:", error);
//       toast.error("Failed to update product");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const renderPriceInputs = () => {
//     // ... (keep the existing renderPriceInputs logic)
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <Card className="w-full max-w-4xl bg-black border-transparent relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-white hover:text-gray-300"
//         >
//           <X size={24} />
//         </button>
//         <CardHeader>
//           <CardTitle className="text-white">Edit Product</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Image upload */}
//             <div className="space-y-2">
//               <Label htmlFor="image" className="text-white">Product Image</Label>
//               <div className="flex items-center justify-center w-full">
//                 <label
//                   htmlFor="image-upload"
//                   className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600"
//                 >
//                   {imagePreview ? (
//                     <Image
//                       src={imagePreview}
//                       alt="Product preview"
//                       width={400}
//                       height={400}
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   ) : (
//                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
//                       <ImageIcon className="w-10 h-10 mb-3 text-gray-400" />
//                       <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
//                     </div>
//                   )}
//                   <input
//                     id="image-upload"
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                   />
//                 </label>
//               </div>
//             </div>

//             {/* Product details */}
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="product_name" className="text-white">Product Name</Label>
//                 <Input
//                   id="product_name"
//                   name="product_name"
//                   value={formData.product_name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="category" className="text-white">Category</Label>
//                 <UISelect
//                   value={formData.category}
//                   onValueChange={(value) => handleSelectChange("category", value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a category" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Klassic Kopi">Klassic Kopi</SelectItem>
//                     <SelectItem value="Kold-Brew">Kold Brew</SelectItem>
//                     <SelectItem value="Non Kopi">Non Kopi</SelectItem>
//                     <SelectItem value="Fusion Teas">Fusion Teas</SelectItem>
//                     <SelectItem value="Beer">Beer</SelectItem>
//                     <SelectItem value="All-Day-Breakfast">All-Day Breakfast</SelectItem>
//                     <SelectItem value="Rice-Meals">Rice Meals</SelectItem>
//                     <SelectItem value="Pasta">Pasta</SelectItem>
//                     <SelectItem value="Pizza">Pizza</SelectItem>
//                     <SelectItem value="Pica-Pica">Pica Pica</SelectItem>
//                     <SelectItem value="Sandwiches">Sandwiches</SelectItem>
//                   </SelectContent>
//                 </UISelect>
//               </div>

//               {/* Multi-Select for Items */}
//               <div>
//                 <Label className="text-white">Select Items</Label>
//                 <Select
//                   isMulti
//                   value={selectedItems.map(item => ({
//                     value: item.item_id,
//                     label: item.item_name,
//                     description: item.description,
//                     required_quantity: item.required_quantity,
//                     status: item.status,
//                   }))}
//                   options={inventoryItems.map((item) => ({
//                     value: item.item_id,
//                     label: item.item_name,
//                     description: item.description,
//                     required_quantity: item.required_quantity,
//                     status: item.status,
//                   }))}
//                   onChange={handleSelectItem}
//                 />
//                 {selectedItems.map((item) => (
//                   <div key={item.item_id} className="flex items-center gap-4 mt-2">
//                     <Label className="text-white">{item.item_name}</Label>
//                     <Input
//                       type="number"
//                       value={item.required_quantity}
//                       onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
//                       placeholder="Required Quantity"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Price inputs */}
//             {renderPriceInputs()}

//             {/* Description */}
//             <div className="space-y-2">
//               <Label htmlFor="description" className="text-white">Description</Label>
//               <Textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Submit button */}
//             <Button type="submit" variant="outline" className="w-full" disabled={uploading}>
//               {uploading ? "Updating..." : "Update Product"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

