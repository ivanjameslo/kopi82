"use client";

import { FormEvent, useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MenuRow from "@/components/MenuRow";
import { toast } from "react-toastify";

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
    const [visibility, setVisibility] = useState<{ [key: number]: boolean }>({});
    const router = useRouter();
    const [makeOrder, setMakeOrder] = useState({
        order_id: 0,
        product_id: 0,
        quantity: 0,
        selectedPrice: 0
    });
    const [uploading, setUploading] = useState(false);

    const handleAddtoCart = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setUploading(true);

        try {
            const response = await fetch("/api/order_details", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([makeOrder]),
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Failed response:', errorDetails);
                throw new Error(errorDetails.error || 'Unknown error');
            } else {
                toast.success("Added to cart");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setUploading(false);
        }
    };

    const fetchProduct = async () => {
        try {
            const response = await fetch("/api/product");
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error("Failed to fetch product", error);
        }
    };

    const fetchOrder = () => {
        fetch("/api/order")
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const latestOrder = data[0];
                    setMakeOrder(prev => ({ ...prev, order_id: latestOrder.order_id }));
                }
            })
            .catch(error => console.error("Failed to fetch order ID", error));
    };

    useEffect(() => {
        fetchProduct();
        fetchOrder();
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

    const handleTypeSelection = (price: number) => {
        setMakeOrder((prev) => ({
            ...prev,
            selectedPrice: price,
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMakeOrder({ ...makeOrder, [name]: value });
    };

    const handleProductClick = (product_id: number) => {
        router.push(`appMenu/menu/${product_id}`);
    };

    return (
        <div>
            <form onSubmit={handleAddtoCart}>
    {Object.keys(groupedProducts).map((category, index) => (
        <div key={index}>
            <MenuRow label={category} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {groupedProducts[category].map((product, index) => {
                    if (!hasNonZeroPrice(product)) return null;

                    return (
                        <div
                            key={index}
                            className="flex flex-col p-4 border border-gray-200 rounded-lg bg-white shadow-md text-center cursor-pointer"
                            onClick={() => handleProductClick(product.product_id)} // Click to navigate
                        >
                            <div className="flex justify-center items-center mb-4">
                                <Image className="object-contain w-full h-32" src={product.image_url} alt={product.product_name} width={128} height={128} />
                            </div>
                            <span className="text-lg font-bold">{product.product_name}</span>
                            <div className="text-sm text-gray-500 mt-2">
                                {product.hotPrice > 0 && <span>Hot: {product.hotPrice}</span>}
                                {product.icedPrice > 0 && <span> Iced: {product.icedPrice}</span>}
                                {product.frappePrice > 0 && <span> Frappe: {product.frappePrice}</span>}
                                {product.singlePrice > 0 && <span> Single: {product.singlePrice}</span>}
                            </div>

                            {/* Plus Icon with stopPropagation */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevents triggering the onClick of the parent div
                                    handleVisibilityToggle(product.product_id);
                                }}
                                className="bg-gray-300 p-2  mt-4"
                            >
                                <FiPlus size={20} />
                                {/* Quantity, Drink Type Selection, and Add to Cart, shown only if visibility[product.product_id] is true */}
                            {visibility[product.product_id] && (
                                <>
                                    <div className="mt-4">
                                        <div className="flex flex-col items-start">
                                            {product.hotPrice > 0 && (
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="drinkType"
                                                        value="hot"
                                                        onClick={(e) => e.stopPropagation()} // Stop event propagation
                                                        onChange={() => handleTypeSelection(product.hotPrice)}
                                                    />
                                                    <span className="ml-2">Hot</span>
                                                </label>
                                            )}
                                            {product.icedPrice > 0 && (
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="drinkType"
                                                        value="iced"
                                                        onClick={(e) => e.stopPropagation()} // Stop event propagation
                                                        onChange={() => handleTypeSelection(product.icedPrice)}
                                                    />
                                                    <span className="ml-2">Iced</span>
                                                </label>
                                            )}
                                            {product.frappePrice > 0 && (
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="drinkType"
                                                        value="frappe"
                                                        onClick={(e) => e.stopPropagation()} // Stop event propagation
                                                        onChange={() => handleTypeSelection(product.frappePrice)}
                                                    />
                                                    <span className="ml-2">Frappe</span>
                                                </label>
                                            )}
                                            {product.singlePrice > 0 && (
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="drinkType"
                                                        value="single"
                                                        onClick={(e) => e.stopPropagation()} // Stop event propagation
                                                        onChange={() => handleTypeSelection(product.singlePrice)}
                                                    />
                                                    <span className="ml-2">Single</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <input
                                            placeholder="Quantity"
                                            onClick={(e) => e.stopPropagation()} // Prevents triggering the onClick of the parent div
                                            onChange={(e) => setMakeOrder({ ...makeOrder, quantity: Number(e.target.value), product_id: product.product_id })}
                                            value={makeOrder.product_id === product.product_id ? makeOrder.quantity : ""}
                                            type="number"
                                            name="quantity"
                                            className="w-full p-2 rounded-md bg-gray-100 border border-gray-300 text-center"
                                        />
                                    </div>
                                    <button
                                        onClick={(e) => e.stopPropagation()} // Prevents triggering the onClick of the parent div
                                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition"
                                        type="submit"
                                        disabled={uploading}
                                    >
                                        Add to Cart
                                    </button>
                                </>
                            )}
                            </button>

                            
                        </div>
                    );
                })}
            </div>
        </div>
    ))}
</form>

        </div>
    );
};

export default ProductCard;
