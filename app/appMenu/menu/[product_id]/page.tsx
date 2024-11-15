"use client";

import React from "react";
import { useCartContext } from "@/app/appMenu/components/context/cartContext";
import ProductDetails from "../productDetails";
import Container from "@/app/appMenu/components/Container";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface IParams {
  product_id: string;
}

const Menu = ({ params }: { params: IParams }) => {
  const { cart, order_id } = useCartContext();

  // Track the cart context for the current product
  const cartItem = cart[Number(params.product_id)] || null;

  console.log("Cart Context on Menu:", JSON.stringify(cart, null, 2));
  console.log("Order ID:", order_id);

  return (
    <div className="h-screen overflow-hidden bg-[url('/kopimural3.jpg')] flex items-center justify-center filter-brightness-50">
      <Container>
        {/* Back Link */}
        <div className="mb-4">
          <Link href="/appMenu" className="text-gray-500 flex items-center gap-2">
            <MdArrowBack />
            <span>Start Ordering</span>
          </Link>
        </div>
        <ProductDetails product_id={params.product_id} />
        <ToastContainer
          position="top-center"
          autoClose={1500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </Container>
    </div>
  );
};

export default Menu;
