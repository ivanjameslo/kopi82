"use client";

import MenuRow from "@/components/MenuRow";
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter

interface Product {
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

const ProductCard = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter(); // Initialize router

  // Fetch Products
  const fetchProduct = async () => {
    try {
      const response = await fetch("/api/product");
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Failed to fetch product", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  // Group products by category
  const groupedProducts = product.reduce(
    (acc: { [key: string]: Product[] }, product) => {
      if (!acc[product.category]) {
        acc[product.category] = [];
      }
      acc[product.category].push(product);
      return acc;
    },
    {}
  );

  // Helper function to check if a product has any valid prices
  const hasNonZeroPrice = (product: Product) => {
    return (
      product.hotPrice > 0 ||
      product.icedPrice > 0 ||
      product.frappePrice > 0 ||
      product.singlePrice > 0
    );
  };

  const handleViewProduct = async (product_id: number) => {
    try {
      const response = await fetch(`/api/product/${product_id}`);
      if (!response.ok) {
        throw new Error("Failed to view product");
      }
      const data = await response.json();
      setSelectedProduct(data);
      // Set modal open to true
    } catch (error) {
      console.error("Failed to view product", error);
    }
  };

  const handleCardProduct = (product_id: number) => {
    router.push(`/appMenu/menu/${product_id}`); // Navigate to the product page
  };

  const Horizontal = () => 
  <hr className="w-[30%] my-2" />;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div>
      {Object.keys(groupedProducts).map((category, index) => (
        <div key={index}>
          <MenuRow label={category} />
          <div className="flex flex-wrap gap-4"> {/* Updated to flex row */}
            {groupedProducts[category].map((product, index) => {
              if (!hasNonZeroPrice(product)) return null; // Skip products with all zero prices

              return (
                <div
                  key={index}
                  className="
                    flex-none 
                    w-1/6 
                    p-2
                    border-slate-200
                    bg-slate-50
                    transition
                    hover:scale-105
                    text-center
                    text-sm
                    col-span-1 
                    cursor-pointer 
                    border-[1.2px] "
                >
                  {/* Clicking on Product Image or Name triggers the navigation */}
                  <div
                    className="flex justify-center items-center h-2/3 w-full cursor-pointer"
                    onClick={() => handleCardProduct(product.product_id)} // Navigate to product page
                  >
                    <Image
                      className="object-contain w-full h-full"
                      src={product.image_url}
                      alt={product.product_name}
                      width={0}
                      height={0}
                      sizes="100vw"
                    />
                  </div>
                  {/* Product Details */}
                  <div
                    className="flex flex-col justify-evenly items-center h-1/3 w-full cursor-pointer"
                    onClick={() => handleViewProduct(product.product_id)} // Handle view product
                  >
                    <span className="text-2xl font-bold">
                      {product.product_name}
                    </span>
                    <div className="flex flex-col items-center text-md font-normal text-center mt-2 space-y-1">
                      {product.hotPrice > 0 && (
                        <span>Hot: {formatPrice(product.hotPrice)}</span>
                      )}
                      {product.icedPrice > 0 && (
                        <span> Iced: {formatPrice(product.icedPrice)}</span>
                      )}
                      {product.frappePrice > 0 && (
                        <span> Frappe: {formatPrice(product.frappePrice)}</span>
                      )}
                      {product.singlePrice > 0 && (
                        <span> Single: {formatPrice(product.singlePrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;
