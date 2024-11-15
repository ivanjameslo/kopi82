// "use client";

// import { useRouter } from "next/navigation";
// import { CiShoppingCart } from "react-icons/ci";
// // import { useCart } from "../hooks/UseCart"; // Import the useCart hook to get cart quantity

// const CartCount = () => {
//     const router = useRouter();
//     // const { cartTotalQty } = useCart(); // Access the cart quantity

//     return (
//         <div
//             className="relative cursor-pointer"
//             onClick={() => router.push('/appMenu/Cart')}
//         >
//             <div className="text-3xl">
//                 <CiShoppingCart />
//             </div>
//             {cartTotalQty > 0 && ( // Only show the cart count if there are items in the cart
//                 <span
//                     className="absolute
//                     top-[-10px]
//                     right-[-10px]
//                     bg-slate-700
//                     text-white
//                     h-5
//                     w-5
//                     rounded-full
//                     flex
//                     items-center
//                     justify-center
//                     text-sm"
//                 >
//                     {cartTotalQty}
//                 </span>
//             )}
//         </div>
//     );
// };

// export default CartCount;
