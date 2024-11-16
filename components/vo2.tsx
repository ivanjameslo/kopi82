// 'use client'

// import { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"

// interface Product {
//   product_id: number;
//   quantity: number;
//   selectedPrice: number;
// }

// interface FormData {
//   order_id: number;
//   products: Product[];
// }

// export default function Component() {
//   const [formData, setFormData] = useState<FormData>({
//     order_id: 1, // Assuming a default order_id
//     products: []
//   })

//   const incrementQuantity = (productId: number) => {
//     setFormData((prevFormData) => {
//       const existingProductIndex = prevFormData.products.findIndex(
//         (p) => p.product_id === productId
//       );
//       if (existingProductIndex > -1) {
//         const updatedProducts = [...prevFormData.products];
//         updatedProducts[existingProductIndex] = {
//           ...updatedProducts[existingProductIndex],
//           quantity: updatedProducts[existingProductIndex].quantity + 1
//         };
//         return {
//           ...prevFormData,
//           products: updatedProducts,
//         };
//       } else {
//         return {
//           ...prevFormData,
//           products: [
//             ...prevFormData.products,
//             { product_id: productId, quantity: 1, selectedPrice: 0 },
//           ],
//         };
//       }
//     });
//   };

//   const decrementQuantity = (productId: number) => {
//     setFormData((prevFormData) => {
//       const existingProductIndex = prevFormData.products.findIndex(
//         (p) => p.product_id === productId
//       );
//       if (existingProductIndex > -1) {
//         const updatedProducts = [...prevFormData.products];
//         updatedProducts[existingProductIndex] = {
//           ...updatedProducts[existingProductIndex],
//           quantity: Math.max(updatedProducts[existingProductIndex].quantity - 1, 0)
//         };
//         return {
//           ...prevFormData,
//           products: updatedProducts,
//         };
//       }
//       return prevFormData;
//     });
//   };

//   const handleQuantityInput = (productId: number, quantity: number) => {
//     setFormData((prevFormData) => {
//       const existingProductIndex = prevFormData.products.findIndex(
//         (p) => p.product_id === productId
//       );
//       if (existingProductIndex > -1) {
//         const updatedProducts = [...prevFormData.products];
//         updatedProducts[existingProductIndex] = {
//           ...updatedProducts[existingProductIndex],
//           quantity: Math.max(quantity, 0)
//         };
//         return {
//           ...prevFormData,
//           products: updatedProducts,
//         };
//       } else {
//         return {
//           ...prevFormData,
//           products: [
//             ...prevFormData.products,
//             { product_id: productId, quantity: Math.max(quantity, 0), selectedPrice: 0 },
//           ],
//         };
//       }
//     });
//   };

//   // For demonstration purposes, let's add a product to the formData
//   const addProduct = () => {
//     const newProductId = formData.products.length + 1;
//     setFormData(prevFormData => ({
//       ...prevFormData,
//       products: [...prevFormData.products, { product_id: newProductId, quantity: 0, selectedPrice: 0 }]
//     }));
//   };

//   return (
//     <div className="p-4">
//       <Button onClick={addProduct} className="mb-4">Add Product</Button>
//       {formData.products.map(product => (
//         <div key={product.product_id} className="flex items-center space-x-2 mb-4">
//           <Button onClick={() => decrementQuantity(product.product_id)} variant="outline">-</Button>
//           <Input
//             type="number"
//             value={product.quantity}
//             onChange={(e) => handleQuantityInput(product.product_id, parseInt(e.target.value, 10))}
//             className="w-20 text-center"
//           />
//           <Button onClick={() => incrementQuantity(product.product_id)} variant="outline">+</Button>
//           <span>Current quantity: {product.quantity}</span>
//         </div>
//       ))}
//     </div>
//   )
// }

//  const incrementQuantity = (productId: number) => {
//         setFormData((prevFormData) => {
//           const existingProductIndex = prevFormData.products.findIndex(
//             (p) => p.product_id === productId
//           );
//           if (existingProductIndex > -1) {
//             const updatedProducts = [...prevFormData.products];
//             updatedProducts[existingProductIndex].quantity += 1; 
//             return {
//               ...prevFormData,
//               products: updatedProducts,
//             };
//           } else {
//             return {
//               ...prevFormData,
//               products: [
//                 ...prevFormData.products,
//                 { product_id: productId, quantity: 1, selectedPrice: 0 },
//               ],
//             };
//           }
//         });
//       };
      
//       const decrementQuantity = (productId: number) => {
//         setFormData((prevFormData) => {
//           const existingProductIndex = prevFormData.products.findIndex(
//             (p) => p.product_id === productId
//           );
      
//           if (existingProductIndex > -1) {
//             const updatedProducts = [...prevFormData.products];
//             updatedProducts[existingProductIndex].quantity = Math.max(
//               updatedProducts[existingProductIndex].quantity - 1,
//               0
//             );
      
//             return {
//               ...prevFormData,
//               products: updatedProducts,
//             };
//           } else {
//             return prevFormData;
//           }
//         });
//       };