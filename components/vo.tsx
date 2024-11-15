// // ADD PRODUCT FRONT END
// "use client";

// import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
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
// import { ImageIcon } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { MultiSelect } from "@/components/ui/multi-select"; // Assuming you have this component
// import { supabase } from "../lib/initSupabase";
// import { toast } from "react-toastify";

// export default function AddProduct() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     category: "",
//     product_name: "",
//     type: "",
//     hotPrice: "",
//     icedPrice: "",
//     frappePrice: "",
//     singlePrice: "",
//     status: "",
//     description: "",
//     inventoryItems: [], // New field for selected inventory items
//   });

//   const [inventoryOptions, setInventoryOptions] = useState([]);
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     // Fetch inventory items when component mounts
//     fetchInventoryItems();
//   }, []);

//   const fetchInventoryItems = async () => {
//     try {
//       const response = await fetch("/api/inventory");
//       if (response.ok) {
//         const items = await response.json();
//         setInventoryOptions(items.map(item => ({
//           value: item.is_id.toString(),
//           label: `${item.item.item_name} (${item.quantity} ${item.unit.unit_name})`
//         })));
//       } else {
//         console.error("Failed to fetch inventory items");
//       }
//     } catch (error) {
//       console.error("Error fetching inventory items:", error);
//     }
//   };

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSelectChange = (name: string, value: string) => {
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleInventoryChange = (selectedItems: string[]) => {
//     setFormData({
//       ...formData,
//       inventoryItems: selectedItems,
//     });
//   };

//   // ... (rest of the component code remains the same)

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setUploading(true);

//     let imageUrl = "";

//     try {
//       // ... (image upload logic remains the same)

//       const response = await fetch("/api/product", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...formData,
//           image_url: imageUrl,
//           hotPrice: Number(formData.hotPrice),
//           icedPrice: Number(formData.icedPrice),
//           frappePrice: Number(formData.frappePrice),
//           singlePrice: Number(formData.singlePrice),
//           inventoryItems: formData.inventoryItems.map(id => ({ inventory_shelf_id: parseInt(id), required_quantity: 1 })),
//         }),
//       });

//       if (response.ok) {
//         toast.success("Product added successfully");
//         setTimeout(() => {
//           router.push('/Menu');
//         }, 1500);
//       } else {
//         toast.error("Failed to add product");
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // ... (rest of the component code remains the same)

//   return (
//     <Card className="w-full max-w-4xl mx-auto mt-20 bg-black border-transparent">
//       <CardHeader>
//         <CardTitle className="text-white">Add New Product</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* ... (other form fields remain the same) */}
          
//           <div className="space-y-2">
//             <Label htmlFor="inventoryItems" className="text-white">
//               Inventory Items
//             </Label>
//             <MultiSelect
//               options={inventoryOptions}
//               value={formData.inventoryItems}
//               onChange={handleInventoryChange}
//               placeholder="Select inventory items"
//             />
//           </div>

//           {/* ... (rest of the form remains the same) */}
          
//           <Button type="submit" variant="outline" className="w-full" disabled={uploading}>
//             {uploading ? "Uploading..." : "Add Product"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

// // API FOR ADD PRODUCT
// // In your API route
// export async function POST(request: NextRequest) {
//     try {
//       const res = await request.json();
//       const {
//         // ... other fields
//         inventoryItems, // This should be an array of { inventory_shelf_id, required_quantity }
//       } = res;
  
//       // Create product
//       const created = await prisma.product.create({
//         data: {
//           // ... other fields
//           ProductInventory: {
//             create: inventoryItems.map(item => ({
//               inventory_shelf_id: item.inventory_shelf_id,
//               required_quantity: item.required_quantity,
//             })),
//           },
//         },
//         include: {
//           ProductInventory: true,
//         },
//       });
  
//       return NextResponse.json(created, { status: 201 });
//     } catch (error) {
//       console.log("Error creating Product", error);
//       return NextResponse.json(
//         { error: "Failed to create product" },
//         { status: 500 }
//       );
//     }
//   }



// //   This schema allows you to specify not just which inventory items are used in a product, 
// //   but also how much of each item is required. This is crucial for accurate inventory management 
// //   and can help with features like automatic stock deduction when orders are placed.