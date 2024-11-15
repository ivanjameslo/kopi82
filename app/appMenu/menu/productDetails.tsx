"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartContext } from "../components/context/cartContext";

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

interface ProductDetailsProps {
  product_id: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product_id }) => {
  const { cart, updateCart, order_id } = useCartContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {

    const initialPrice = Number(searchParams.get("selectedPrice"));
    const initialQuantity = Number(searchParams.get("quantity"));
    if (initialPrice) {
      setSelectedPrice(initialPrice);
    }
    if (!isNaN(initialQuantity)) {
      setQuantity(initialQuantity);
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${product_id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast.error("Failed to fetch product");
      }
    };

    fetchProduct();
  }, [product_id, searchParams]);

  const handlePriceSelection = (price: number) => setSelectedPrice(price);

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(price);

  // const incrementQuantity = () => setQuantity((q) => (q < 1000 ? q + 1 : q));
  // const decrementQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : q));

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 1000));
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 0));

  const handleAddToCart = async (e: FormEvent) => {
    e.preventDefault();

    if (!product || selectedPrice === null || quantity === 0) {
      toast.error("Please select a price and quantity");
      return;
    }

    const cartItem = {
      product_id: product.product_id,
      selectedPrice,
      quantity,
      order_id, // Use order_id from CartContext
    };

    setLoading(true);

    try {
      // Update server
      const response = await fetch("/api/order_details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      });

      if (response.ok) {
        // Update CartContext
        updateCart(cartItem);
        toast.success("Added to cart");
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div>Product not found</div>;

  return (
    <div className="bg-white shadow-lg rounded-lg p-12 flex flex-col md:flex-row gap-16 w-full max-w-7xl">
      <Image src={product.image_url} alt={product.product_name} width={400} height={400} sizes="100vw" />
      <div>
        <h1 className="text-4xl font-bold">{product.product_name}</h1>
        <p className="text-2xl font-light">{product.category}</p>
        <p className="text-sm font-semibold mt-4">{product.description}</p>
        
        <div className="flex flex-row items-center space-x-8 mt-8">
          {product.hotPrice > 0 && (
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="price"
                onChange={() => handlePriceSelection(product.hotPrice)}
                checked={selectedPrice === product.hotPrice}
              />
              <span className="ml-2">Hot</span>
            </label>
          )}
          {product.icedPrice > 0 && (
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="price"
                onChange={() => handlePriceSelection(product.icedPrice)}
                checked={selectedPrice === product.icedPrice}
              />
              <span className="ml-2">Iced</span>
            </label>
          )}
          {product.frappePrice > 0 && (
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="price"
                onChange={() => handlePriceSelection(product.frappePrice)}
                checked={selectedPrice === product.frappePrice}
              />
              <span className="ml-2">Frappe</span>
            </label>
          )}
          {product.singlePrice > 0 && (
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="price"
                onChange={() => handlePriceSelection(product.singlePrice)}
                checked={selectedPrice === product.singlePrice}
              />
              <span className="ml-2">Single</span>
            </label>
          )}
        </div>
        
        {/* <div className="mt-4 text-lg">
          Price: {selectedPrice !== null ? formatPrice(selectedPrice) : "Please select a price"}
        </div> */}
        
        <div className="flex items-center mt-8 space-x-4">
          <button
            type="button"
            onClick={decrementQuantity}
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 pl-4 text-center border border-gray-300 rounded"
          />
          <button
            type="button"
            onClick={incrementQuantity}
            className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
        
        <Button onClick={handleAddToCart} disabled={loading} className="mt-4">
          {loading ? "Adding..." : "ADD TO CART"}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
