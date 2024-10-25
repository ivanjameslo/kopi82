"use client";

import { on } from "events";
import { useEffect, useState } from "react";

interface order_details {
    order_id: number;
    product_id: number;
    quantity: number;
    product: {
        product_id: number;
        product_name: string;
        category: string;
        type: string;
        hotPrice: number;
        icedPrice: number;
        frappePrice: number;
        singlePrice: number;
        status: string;
        description: string;
        image_url: string;
    }
}

interface ProductData {
    product_id: number;
    product_name: string;
    category: string;
    type: string;
    hotPrice: number;
    icedPrice: number;
    frappePrice: number;
    singlePrice: number;
    status: string;
    description: string;
    image_url: string;
}



const ProductDetails = () => {


    const [orderDetails, setOrderDetails] = useState<order_details[]>([]);
    const [product, setProduct] = useState<ProductData[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null);

    // Fetch Product Details
    const fetchProductData = async () => {
        try {
            const response = await fetch('/api/product');
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error('Failed to fetch unit', error);
        }
    }

    // Fetch Order Details
    const fetchOrderDetails = async () => {
        try {
            const response = await fetch('/api/order_details');
            const data = await response.json();
            setOrderDetails(data);
        } catch (error) {
            console.error('Failed to fetch order details', error);
        }
    }

    // Load intial data on page load
    useEffect(() => {
        fetchProductData();
        fetchOrderDetails();
    }, []);

    // Group products by category
  const groupedProducts = product.reduce(
    (acc: { [key: string]: ProductData[] }, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    },
    {}
  );

  // Helper function to check if a product has any valid prices
  const hasNonZeroPrice = (product: order_details) => {
    return (
      product.product.hotPrice > 0 ||
      product.product.icedPrice > 0 ||
      product.product.frappePrice > 0 ||
      product.product.singlePrice > 0
    );
  };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full h-full">
            {orderDetails.map((order) => (
                <div>
                    {order.product.image_url}
                </div>
            ))}
        </div>
    );
}

export default ProductDetails;