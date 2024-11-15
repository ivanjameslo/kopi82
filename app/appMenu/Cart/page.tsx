"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "react-toastify";
import Container from "../components/Container";
import CartClient from "../Cart/cartClient";

interface CartProduct {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  image_url: string;
}

const Cart = () => {
  return (
    <div className="pt-8">
            <CartClient />
    </div>
  );
};

export default Cart;
