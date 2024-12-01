
// "use client";


// import { useCartContext } from "../app/kopi82-app/context/cartContext";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { toast } from "react-toastify";


// const PaymentPage = () => {
//     const { cart, order_id } = useCartContext();

//     //ERASE
//     // const [productDetails, setProductDetails] = useState<{
//     //     [key: number]: { product_name: string; image_url: string; price: number };
//     // }>({});
//     // const [paymentMethod, setPaymentMethod] = useState<string>("card"); // Default to card
//     // const [discountType, setDiscountType] = useState<string>(""); // Discount type: PWD, Senior Citizen, Other
//     // const [customDiscount, setCustomDiscount] = useState<number>(0); // Custom discount amount
//     // const [discountPercentage, setDiscountPercentage] = useState<number>(0); // Discount percentage
//     // const [pwdSeniorDetails, setPwdSeniorDetails] = useState<{
//     //     name: string;
//     //     cardNumber: string;
//     //     picture: File | null;
//     // }>({ name: "", cardNumber: "", picture: null }); // PWD/Senior Details
//     //

//     const [orderDetails, setOrderDetails] = useState<any[]>([]);
//     const [discounts, setDiscounts] = useState<any[]>([]);
//     const [discountPercentage, setDiscountPercentage] = useState<number>(0);
//     // const [customDiscount, setCustomDiscount] = useState<number>(0);
//     const [payment, setPayment] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);


//     // Fetch product details for a given productId
//     // const fetchProductDetails = async (productId: number) => {
//     //     try {
//     //         const response = await fetch(`/api/product/${productId}`);
//     //         if (!response.ok) throw new Error("Failed to fetch product details");
//     //         const product = await response.json();
//     //         setProductDetails((prev) => ({
//     //             ...prev,
//     //             [productId]: {
//     //                 product_name: product.product_name || "Unknown Product",
//     //                 image_url: product.image_url || "/placeholder.png",
//     //                 price: product.price || 0, // Ensure price has a fallback value
//     //             },
//     //         }));
//     //     } catch (err: any) {
//     //         console.error("Error fetching product details for productId:", productId, err.message);
//     //     }
//     // };


//     // useEffect(() => {
//     //     const fetchAllProducts = async () => {
//     //         setLoading(true);
//     //         try {
//     //             await Promise.all(
//     //                 Object.values(cart).map(async (item) => {
//     //                     if (!productDetails[item.product_id]) {
//     //                         await fetchProductDetails(item.product_id);
//     //                     }
//     //                 })
//     //             );
//     //         } catch (err: any) {
//     //             setError("Failed to fetch product data.");
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };


//     //     fetchAllProducts();
//     // }, [cart]);

//     const fetchOrderDetails = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`/api/order/${order_id}`, {
//                 method: "GETOrderID"
//             });
//             if (!response.ok) throw new Error("Failed to fetch order details");
//             const data = await response.json();
//             setOrderDetails(data); // Populate state with fetched data
//         } catch (err: any) {
//             console.error("Error fetching order details:", err.message);
//             setError("Failed to fetch order details.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (order_id) {
//             fetchOrderDetails();
//         }
//     }, [order_id]);

//     const fetchDiscounts = async () => {
//         setLoading(true);
//         try {
//             const response = await fetch(`/api/discount`, {
//                 method: "GET", // Specify HTTP method
//             });
//             if (!response.ok) throw new Error("Failed to fetch discounts");
//             const data = await response.json();
//             setDiscounts(data); // Update discounts state
//         } catch (err: any) {
//             console.error("Error fetching discounts:", err.message);
//             setError(err.message || "Failed to fetch discounts.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchDiscounts();
//     }, [])

//     const handleDiscountChange = async (discount_id: string) => {
//         try {
//             const response = await fetch(`/api/discount/${discount_id}`);
//             if (!response.ok) throw new Error("Failed to fetch discount details.");
//             const data = await response.json();

//             setDiscountPercentage(data.discount_rate || 0);
//             // setCustomDiscount(0);
//         } catch (error) {
//             toast.error("Invalid Discount!")
//         }
//     }

//     // Calculate subtotal
//     const calculateSubtotal = () => {
//         return orderDetails.reduce((subtotal, item) => {
//             return subtotal + item.quantity * item.price;
//         }, 0).toFixed(2);
//     };
    
//     // Calculate total after discount
//     const calculateTotal = () => {
//         const subtotal = parseFloat(calculateSubtotal());
//         const discountAmount = (subtotal * discountPercentage) / 100;
//         const total = subtotal - discountAmount;
//         return total > 0 ? total.toFixed(2) : "0.00";
//     };

//     // Handle discount type change
//     // const handleDiscountChange = (type: string) => {
//     //     setDiscountType(type);
//     //     switch (type) {
//     //         case "PWD":
//     //         case "Senior":
//     //             setDiscountPercentage(20); // 20% discount for PWD/Senior Citizen
//     //             setCustomDiscount(0); // Reset custom discount
//     //             setPwdSeniorDetails({ name: "", cardNumber: "", picture: null }); // Reset PWD/Senior fields
//     //             break;
//     //         case "Other":
//     //             setDiscountPercentage(0); // Reset discount percentage
//     //             setCustomDiscount(0); // Allow custom discount
//     //             break;
//     //         default:
//     //             setDiscountPercentage(0); // No discount
//     //             setCustomDiscount(0); // Reset custom discount
//     //             break;
//     //     }
//     // };

//     const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             if (e.target.files && e.target.files[0]) {
               
//             }
//         }
//     };

//     const renderPaymentForm = () => {
//         switch (paymentMethod) {
//             case "card":
//                 return <CardForm />;
//             case "gcash":
//                 return (
//                     <div className="mt-4">
//                         <h3 className="text-lg font-bold mb-2">GCash Payment</h3>
//                         <input
//                             type="text"
//                             placeholder="GCash Mobile Number"
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>
//                 );
//             case "paymaya":
//                 return (
//                     <div className="mt-4">
//                         <h3 className="text-lg font-bold mb-2">PayMaya Payment</h3>
//                         <input
//                             type="text"
//                             placeholder="PayMaya Account Number"
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };


//     const handlePaymentSubmit = async () => {
//         if (!paymentMethod) {
//             alert("Please select a payment method.");
//             return;
//         }


//         if ((discountType === "PWD" || discountType === "Senior") && !pwdSeniorDetails.name) {
//             alert("Please enter your name for PWD/Senior Citizen discount.");
//             return;
//         }


//         console.log("Processing payment with method:", paymentMethod);
//         alert(`Payment method ${paymentMethod} selected.`);
//     };


//     return (
//         <div className="m-14">
//             <h1 className="text-2xl font-bold">Payment</h1>
//             {loading ? (
//                 <p className="text-gray-600 mt-4">Loading...</p>
//             ) : error ? (
//                 <p className="text-red-500">{error}</p>
//             ) : (
//                 <div>
//                     <p className="text-gray-600">Order ID: {order_id}</p>


//                     <table className="w-full table-auto border-collapse border border-gray-300 mt-6">
//                         <thead>
//                             <tr>
//                                 <th className="border border-gray-300 px-4 py-2">Product</th>
//                                 <th className="border border-gray-300 px-4 py-2">Quantity</th>
//                                 <th className="border border-gray-300 px-4 py-2">Price</th>
//                                 <th className="border border-gray-300 px-4 py-2">Total</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {Object.entries(cart).map(([key, item]) => {
//                                 const product = productDetails[item.product_id] || {
//                                     product_name: "Loading...",
//                                     image_url: "/placeholder.png",
//                                     price: 0, // Default price if unavailable
//                                 };
//                                 return (
//                                     <tr key={key}>
//                                         <td className="border border-gray-300 px-4 py-2 flex items-center space-x-4">
//                                             <Image
//                                                 src={product.image_url}
//                                                 alt={product.product_name}
//                                                 width={50}
//                                                 height={50}
//                                             />
//                                             <span>{product.product_name}</span>
//                                         </td>
//                                         <td className="border border-gray-300 px-4 py-2 text-center">
//                                             {item.quantity}
//                                         </td>
//                                         <td className="border border-gray-300 px-4 py-2 text-center">
//                                             {product.price.toFixed(2)}
//                                         </td>
//                                         <td className="border border-gray-300 px-4 py-2 text-center">
//                                             {(item.quantity * product.price).toFixed(2)}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                         </tbody>
//                     </table>


//                     <div className="mt-6 text-right">
//                         <p className="text-lg font-bold">Subtotal: ₱{calculateSubtotal()}</p>
//                     </div>


//                     <div className="mt-6">
//                         <h2 className="text-lg font-bold">Discount</h2>
//                         <select
//                             className="w-full p-2 mt-2 border rounded"
//                             value={discountType}
//                             onChange={(e) => handleDiscountChange(e.target.value)}
//                         >
//                             <option value="">Select Discount</option>
//                             <option value="PWD">PWD (20%)</option>
//                             <option value="Senior">Senior Citizen (20%)</option>
//                             <option value="Other">Other</option>
//                         </select>


//                         {(discountType === "PWD" || discountType === "Senior") && (
//                             <div className="mt-4">
//                                 <input
//                                     type="text"
//                                     placeholder="Name"
//                                     value={pwdSeniorDetails.name}
//                                     onChange={(e) =>
//                                         setPwdSeniorDetails((prev) => ({ ...prev, name: e.target.value }))
//                                     }
//                                     className="w-full p-2 border rounded mb-2"
//                                 />
//                                 <input
//                                     type="text"
//                                     placeholder="Card Number"
//                                     value={pwdSeniorDetails.cardNumber}
//                                     onChange={(e) =>
//                                         setPwdSeniorDetails((prev) => ({
//                                             ...prev,
//                                             cardNumber: e.target.value,
//                                         }))
//                                     }
//                                     className="w-full p-2 border rounded mb-2"
//                                 />
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                                         Upload Picture
//                                     </label>
//                                     <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handlePictureUpload}
//                                         className="w-full p-2 border rounded"
//                                     />
//                                 </div>
//                             </div>
//                         )}


//                         {discountType === "Other" && (
//                             <input
//                                 type="number"
//                                 value={customDiscount}
//                                 onChange={(e) =>
//                                     setCustomDiscount(parseFloat(e.target.value) || 0)
//                                 }
//                                 placeholder="Enter custom discount amount"
//                                 className="w-full p-2 mt-2 border rounded"
//                             />
//                         )}
//                     </div>


//                     <div className="mt-6 text-right">
//                         <p className="text-lg font-bold">Total: ₱{calculateTotal()}</p>
//                     </div>


//                     <div className="mt-6">
//                         <h2 className="text-lg font-bold">Select Payment Method</h2>
//                         <select
//                             className="w-full p-2 mt-2 border rounded"
//                             value={paymentMethod}
//                             onChange={(e) => setPaymentMethod(e.target.value)}
//                         >
//                             <option value="card">Card/Debit</option>
//                             <option value="gcash">GCash</option>
//                             <option value="paymaya">PayMaya</option>
//                         </select>
//                     </div>


//                     {renderPaymentForm()}


//                     <button
//                         className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
//                         onClick={handlePaymentSubmit}
//                     >
//                         Confirm Payment
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };


// const CardForm = () => {
//     return (
//         <div className="mt-4">
//             <h3 className="text-lg font-bold mb-2">Card Payment</h3>
//             <div className="space-y-4">
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Card Number</label>
//                     <input
//                         type="text"
//                         placeholder="1234 5678 9012 3456"
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div className="flex space-x-4">
//                     <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
//                         <input
//                             type="text"
//                             placeholder="MM/YY"
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>
//                     <div className="flex-1">
//                         <label className="block text-sm font-medium text-gray-700">CVV</label>
//                         <input
//                             type="text"
//                             placeholder="123"
//                             className="w-full p-2 border rounded"
//                         />
//                     </div>
//                 </div>
//                 <div>
//                     <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
//                     <input
//                         type="text"
//                         placeholder="Taylor Swift"
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };


// export default PaymentPage;
