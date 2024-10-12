// "use client";
// import React, { useState, ChangeEvent, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";

// interface StockOutFrontInventoryProps {
//   selectedItem: any;
//   onClose: () => void;
//   onSave: (updatedItem: any) => void;
// }

// const StockOutFrontInventory: React.FC<StockOutFrontInventoryProps> = ({ selectedItem, onClose, onSave, }) => {
//   const [formData, setFormData] = useState(selectedItem);
//   const [inStock, setInStock] = useState<number | null>(null);

//   useEffect(() => {
//     const fetchFrontInventoryData = async () => {
//         try {
//             const response = await fetch(`/api/front_inventory/${selectedItem.fd_id}`);
//             if (!response.ok) {
//                 throw new Error("Failed to fetch front inventory data");
//             }
//             const frontInventoryData = await response.json();
//             setInStock(frontInventoryData.in_stock);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     fetchFrontInventoryData();
//   }, [selectedItem.fd_id]);

//   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     if (name === "product_id") {
//       setFormData({ ...formData, [name]: value });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const stockUsed = Number(formData.stock_used);
//     const stockDamaged = Number(formData.stock_damaged);
//     const totalStockOut = stockUsed + stockDamaged;

//     if (inStock != null && totalStockOut > inStock){
//         toast.error(`Total Stock Out must be less than or equal to ${inStock}`);
//         return;
//     }

//     try {
//       const newInStock = inStock !== null? inStock- totalStockOut : null;
//       const response = await fetch(`/api/front_inventory/${selectedItem.fd_id}`,{
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             stock_used: Number(formData.stock_used),
//             stock_damaged: Number(formData.stock_damaged),
//             stock_out_date: new Date().toISOString(),
//             in_stock: Number(newInStock),
//           }),
//         }
//       );
//       if (!response.ok) {
//         throw new Error("Failed to update Front Inventory");
//       }
//       const updatedItem = await response.json();
//       console.log('Updated item:', updatedItem);

//       onSave(updatedItem);
//       onClose();
//     } catch (error) {
//       toast.error(`Total Stock Out must be less than or equal to ${inStock}`);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-8 rounded-md shadow-md">
//         <h2 className="text-2xl font-bold mb-4">Stock In</h2>
//         <form onSubmit={handleSubmit}>
 
//           <div className="mb-4">
//             <label>Stock Used:</label>
//             <input
//               type="number"
//               name="stock_used"
//               value={formData.stock_used}
//               onChange={handleChange}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>
//           <div className="mb-4">
//             <label>Stock Damaged:</label>
//             <input
//               type="number"
//               name="stock_damaged"
//               value={formData.stock_damaged}
//               onChange={handleChange}
//               className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//             />
//           </div>
//           <Button type="submit" className="mt-4">Save</Button>
//           <Button onClick={onClose} className="mt-4 ml-2">Cancel</Button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default StockOutFrontInventory;
