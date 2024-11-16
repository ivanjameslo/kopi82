"use client";

import { FormEvent, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MenuRow from "@/components/MenuRow";
import { toast } from "react-toastify";
import { useCartContext } from "../context/cartContext";
import  HomeBanner  from "../app-components/Homebanner"
import Modal from "../modal";
import Navbar from "../app-components/Navbar";

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

interface Cart {
    [key: string]: CartItem;
}

interface CartItem {
    product_id: number;
    quantity: number;
    selectedPrice: number;
    order_id: number;
}

const AppMenu = () => {
    const { cart, order_id, updateCart, setOrderId } = useCartContext();
    const [product, setProduct] = useState<Product[]>([]);
    const [visibility, setVisibility] = useState<{ [key: number]: boolean }>({});
    const router = useRouter();
    const [formData, setFormData] = useState<{
        order_id: number;
        products: Array<{
            product_id: number;
            quantity: number;
            selectedPrice: number;
        }>;
    }>({
        order_id: order_id, // Initial value from context
        products: [],       // Empty array for storing product selections
    });
    const [uploading, setUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);


    const fetchProduct = async () => {
        try {
            const response = await fetch("/api/product");
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, []);

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

    const hasNonZeroPrice = (product: Product) => {
        return (
            product.hotPrice > 0 ||
            product.icedPrice > 0 ||
            product.frappePrice > 0 ||
            product.singlePrice > 0
        );
    };

    const handleVisibilityToggle = (productId: number) => {
        setVisibility((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };  

    const handleTypeSelection = (productId: number, selectedPrice: number) => {
        setFormData((prevFormData) => {
            const existingProductIndex = prevFormData.products.findIndex(
                (p) => p.product_id === productId
            );
    
            if (existingProductIndex > -1) {
                const updatedProducts = [...prevFormData.products];
                updatedProducts[existingProductIndex].selectedPrice = selectedPrice;
    
                return {
                    ...prevFormData,
                    products: updatedProducts,
                };
            } else {
                return {
                    ...prevFormData,
                    products: [
                        ...prevFormData.products,
                        {
                            product_id: productId,
                            quantity: 0, // Default quantity
                            selectedPrice,
                        },
                    ],
                };
            }
        });
    };

    const incrementQuantity = (productId: number) => {
        setFormData((prevFormData) => {
          const existingProductIndex = prevFormData.products.findIndex(
            (p) => p.product_id === productId
          );
          if (existingProductIndex > -1) {
            const updatedProducts = [...prevFormData.products];
            updatedProducts[existingProductIndex] = {
              ...updatedProducts[existingProductIndex],
              quantity: updatedProducts[existingProductIndex].quantity + 1
            };
            return {
              ...prevFormData,
              products: updatedProducts,
            };
          } else {
            return {
              ...prevFormData,
              products: [
                ...prevFormData.products,
                { product_id: productId, quantity: 1, selectedPrice: 0 },
              ],
            };
          }
        });
      };
    
      const decrementQuantity = (productId: number) => {
        setFormData((prevFormData) => {
          const existingProductIndex = prevFormData.products.findIndex(
            (p) => p.product_id === productId
          );
          if (existingProductIndex > -1) {
            const updatedProducts = [...prevFormData.products];
            updatedProducts[existingProductIndex] = {
              ...updatedProducts[existingProductIndex],
              quantity: Math.max(updatedProducts[existingProductIndex].quantity - 1, 0)
            };
            return {
              ...prevFormData,
              products: updatedProducts,
            };
          }
          return prevFormData;
        });
      };

    const handleQuantityInput = (productId: number, quantity: number) => {
        setFormData((prevFormData) => {
            const existingProductIndex = prevFormData.products.findIndex(
                (p) => p.product_id === productId
            );
    
            if (existingProductIndex > -1) {
                const updatedProducts = [...prevFormData.products];
                updatedProducts[existingProductIndex].quantity = Math.max(quantity, 0);
    
                return {
                    ...prevFormData,
                    products: updatedProducts,
                };
            } else {
                return {
                    ...prevFormData,
                    products: [
                        ...prevFormData.products,
                        {
                            product_id: productId,
                            quantity: Math.max(quantity, 0),
                            selectedPrice: 0,
                        },
                    ],
                };
            }
        });
    };    
    
    const handleAddToCart = (
        e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
        productId?: number
      ) => {
        e.preventDefault();
      
        if (!productId) {
          if (formData.products.length === 0) {
            toast.error("No items in the cart!");
        const updatedCart: Cart = { ...cart }; // Copy the current cart state
          }
        }
      
        const updatedCart: Cart = { ...cart }; // Copy the current cart state
      
        // If adding a single product (via button click)
        if (productId) {
          const productToAdd = formData.products.find((p) => p.product_id === productId);
      
          if (!productToAdd || productToAdd.quantity === 0) {
            toast.error("Select a product and quantity before adding to the cart.");
            return;
          }
      
          const cartKey = `${productId}-${productToAdd.selectedPrice}`; // Unique key for the product+price
      
          // Check if the product with the specific price already exists in the cart
          if (updatedCart[cartKey]) {
            updatedCart[cartKey].quantity += productToAdd.quantity;
          } else {
            updatedCart[cartKey] = { ...productToAdd, order_id };
          }
        } else {
          // Handle form submission of multiple products
          formData.products.forEach((product) => {
            const cartKey = `${product.product_id}-${product.selectedPrice}`; // Unique key
      
            if (updatedCart[cartKey]) {
              updatedCart[cartKey].quantity += product.quantity;
            } else {
              updatedCart[cartKey] = { ...product, order_id };
            }
          });
        }
      
        updateCart(updatedCart); // Update the cart in context
        toast.success("Items added to the cart!");
      
        // Clear formData products array
        setFormData((prev) => ({
          ...prev,
          products: []
        }));
      };
      
    const openProductModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };
    
    const closeProductModal = () => {
        setSelectedProduct(null);
        setIsModalOpen(false);
    };
    

    return (
        <div>
            <Navbar />
            <div className="m-14">
                <HomeBanner />
                <form onSubmit={handleAddToCart}>
                    {Object.keys(groupedProducts).map((category) => (
                        <div key={category}>
                            <MenuRow label={category} />
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {groupedProducts[category].map((product) => {
                                    const selectedCartItem =
                                        formData.products.find(
                                            (p) => p.product_id === product.product_id
                                        ) || { quantity: 0, selectedPrice: 0 };
    
                                    return (
                                        <div
                                            key={product.product_id}
                                            className={`flex flex-col p-4 border rounded-lg shadow-md text-center ${
                                                visibility[product.product_id]
                                                    ? "border-blue-500"
                                                    : ""
                                            }`}
                                        >
                                            <Image
                                                className="object-contain w-full h-32"
                                                src={product.image_url}
                                                alt={product.product_name}
                                                width={128}
                                                height={128}
                                            />
                                            <span className="text-lg font-bold">
                                                {product.product_name}
                                            </span>
                                            <div className="text-sm text-gray-500 mt-2">
                                                {product.hotPrice > 0 && <span>Hot: {product.hotPrice}</span>}
                                                {product.icedPrice > 0 && <span> Iced: {product.icedPrice}</span>}
                                                {product.frappePrice > 0 && (
                                                    <span> Frappe: {product.frappePrice}</span>
                                                )}
                                                {product.singlePrice > 0 && (
                                                    <span> Single: {product.singlePrice}</span>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="bg-gray-300 p-2 mt-4"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleVisibilityToggle(product.product_id);
                                                }}
                                            >
                                                <FiPlus size={20} />
                                            </button>
                                            {visibility[product.product_id] && (
                                                <div className="mt-4">
                                                    <div className="grid grid-cols-2 gap-2 mt-2 pl-5 pr-5">
                                                        {product.hotPrice > 0 && (
                                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name={`price-${product.product_id}`}
                                                                    onChange={() =>
                                                                        handleTypeSelection(
                                                                            product.product_id,
                                                                            product.hotPrice
                                                                        )
                                                                    }
                                                                    checked={
                                                                        selectedCartItem.selectedPrice ===
                                                                        product.hotPrice
                                                                    }
                                                                />
                                                                <span>Hot</span>
                                                            </label>
                                                        )}
                                                        {product.icedPrice > 0 && (
                                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name={`price-${product.product_id}`}
                                                                    onChange={() =>
                                                                        handleTypeSelection(
                                                                            product.product_id,
                                                                            product.icedPrice
                                                                        )
                                                                    }
                                                                    checked={
                                                                        selectedCartItem.selectedPrice ===
                                                                        product.icedPrice
                                                                    }
                                                                />
                                                                <span>Iced</span>
                                                            </label>
                                                        )}
                                                        {product.frappePrice > 0 && (
                                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name={`price-${product.product_id}`}
                                                                    onChange={() =>
                                                                        handleTypeSelection(
                                                                            product.product_id,
                                                                            product.frappePrice
                                                                        )
                                                                    }
                                                                    checked={
                                                                        selectedCartItem.selectedPrice ===
                                                                        product.frappePrice
                                                                    }
                                                                />
                                                                <span>Frappe</span>
                                                            </label>
                                                        )}
                                                        {product.singlePrice > 0 && (
                                                            <label className="flex items-center space-x-2 cursor-pointer">
                                                                <input
                                                                    type="radio"
                                                                    name={`price-${product.product_id}`}
                                                                    onChange={() =>
                                                                        handleTypeSelection(
                                                                            product.product_id,
                                                                            product.singlePrice
                                                                        )
                                                                    }
                                                                    checked={
                                                                        selectedCartItem.selectedPrice ===
                                                                        product.singlePrice
                                                                    }
                                                                />
                                                                <span>Single</span>
                                                            </label>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center mt-2 space-x-2"
                                                    onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                decrementQuantity(product.product_id);
                                                            }}
                                                            className="px-3 py-1 rounded bg-gray-200"
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            value={selectedCartItem.quantity}
                                                            onClick={(e) => e.stopPropagation()}
                                                            onChange={(e) =>
                                                                handleQuantityInput(
                                                                    product.product_id,
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className="w-full pl-4 text-center border border-gray-300 rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                incrementQuantity(product.product_id);
                                                            }}
                                                            className="px-3 py-1 rounded bg-gray-200"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleAddToCart(e, product.product_id)}
                                                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </form>
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeProductModal}
                    title={selectedProduct?.product_name || "Product Details"}
                >
                    {selectedProduct && (
                        <div className="flex flex-col items-center">
                            <Image
                                src={selectedProduct.image_url}
                                alt={selectedProduct.product_name}
                                width={200}
                                height={200}
                                className="mb-4"
                            />
                            <p className="text-gray-600">{selectedProduct.description}</p>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default AppMenu;