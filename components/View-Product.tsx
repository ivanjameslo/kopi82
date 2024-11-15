"use client";

import { useEffect, useState } from "react";
import MenuRow from "@/components/MenuRow";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FiEdit } from "react-icons/fi"; // Importing edit icon from react-icons
import Link from "next/link";
import UpdateProduct from "@/components/Update-Product";

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

const ViewProduct = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
      setIsViewModalOpen(true); // Set modal open to true
    } catch (error) {
      console.error("Failed to view product", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const Horizontal = () => <hr className="w-[30%] my-2" />;

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="ml-10 mr-10">

      <div className="flex justify-between items-center mt-5">
        <p className="flex text-4xl text-[#483C32] font-bold justify-center">
          PRODUCTS
        </p>
        <Link href="/Menu/AddProducts">
            <Button>Add Product</Button>
        </Link>
      </div>

      {/* Iterate over each category and render its carousel */}
      {Object.keys(groupedProducts).map((category, index) => (
        <div key={index}>
          <MenuRow label={category} />
          <div className="flex justify-center relative w-full max-w-8xl mx-auto">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="flex px-8">
                {groupedProducts[category].map((product, index) => {
                  if (!hasNonZeroPrice(product)) return null; // Skip products with all zero prices

                  return (
                    <CarouselItem key={index} className="flex-none w-1/6 p-2">
                      <div className="relative flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                        {/* Edit Icon Button */}
                        <button
                          className="absolute top-2 right-2 text-gray-500 hover:text-blue-500"
                          onClick={() => handleEditClick(product)} // Handle edit click
                        >
                          <FiEdit size={24} />
                        </button>

                        {/* Clicking on Product Image or Name triggers the modal */}
                        <div
                          className="flex justify-center items-center h-2/3 w-full cursor-pointer"
                          onClick={() => handleViewProduct(product.product_id)} // Handle image click
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
                          onClick={() => handleViewProduct(product.product_id)} // Handle name click
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
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />
              <CarouselNext className="absolute right-5 transform translate-x-1/2" />
            </Carousel>
          </div>
        </div>
      ))}

      {/* Modal */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="flex justify-center items-center">
                <img
                  className="object-contain w-full h-full"
                  src={selectedProduct.image_url}
                  alt={selectedProduct.product_name}
                  width={0}
                  height={0}
                  sizes="100vw"
                />
              </div>

              {/* Product Details */}
                <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-medium text-slate-700 text-center mb-4">
                    {selectedProduct.product_name}
                </h2>
                <Horizontal />
                <p className="text-justify mb-2">
                    {selectedProduct.description}
                </p>
                <Horizontal />
                <div className="mb-2">
                    <span className="font-semibold">CATEGORY: </span>
                    {selectedProduct.category}
                </div>
                <Horizontal />
                {/* <div className="mb-2">
                    <span className="font-semibold">TYPE: </span>
                    {selectedProduct.type}
                </div>
                <Horizontal /> */}
                
                {/* Conditionally show prices only if they are greater than 0 */}
                {selectedProduct.hotPrice > 0 && (
                    <div className="mb-2">
                    <span className="font-semibold">HOT PRICE: </span>
                    {selectedProduct.hotPrice}
                    </div>
                )}
                {selectedProduct.icedPrice > 0 && (
                    <div className="mb-2">
                    <span className="font-semibold">ICED PRICE: </span>
                    {selectedProduct.icedPrice}
                    </div>
                )}
                {selectedProduct.frappePrice > 0 && (
                    <div className="mb-2">
                    <span className="font-semibold">FRAPPE PRICE: </span>
                    {selectedProduct.frappePrice}
                    </div>
                )}
                {selectedProduct.singlePrice > 0 && (
                    <div className="mb-2">
                    <span className="font-semibold">SINGLE PRICE: </span>
                    {selectedProduct.singlePrice}
                    </div>
                )}
                
                <Horizontal />
                <div
                    className={
                    selectedProduct.status ? "text-teal-400" : "text-rose-400"
                    }
                >
                    {selectedProduct.status ? "Widely Available" : "Out of stock"}
                </div>

                <Button onClick={handleCloseModal} className="mt-4">
                    Close
                </Button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedProduct && (
        <UpdateProduct
          product={selectedProduct}
          onClose={handleCloseModal}
          onUpdate={(updatedProduct) => {
            // Update the product list with the new product data
            setProduct((prevProducts) =>
              prevProducts.map((prod) =>
                prod.product_id === updatedProduct.product_id ? updatedProduct : prod
              )
            );
          }}
        />
      )}
    </div>
  );
};

export default ViewProduct;