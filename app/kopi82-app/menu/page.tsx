"use client";




import { FormEvent, useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiPlus } from "react-icons/fi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MenuRow from "@/components/MenuRow";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartContext } from "../context/cartContext";
import HomeBanner from "../app-components/Homebanner"
import Modal from "../modal";
import Navbar from "../app-components/Navbar";
import "./menu.css";


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


interface order {
    customer_name: string;
    service_type: string;
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
    const [order, setOrder] = useState<order | null>(null);
    const [toastActive, setToastActive] = useState(false);


    const fetchProduct = async () => {
        try {
            const response = await fetch("/api/product");
            const data = await response.json();
            setProduct(data);
        } catch (error) {
            console.error("Failed to fetch products", error);
        }
    }


    const fetchOrder = async () => {
        try {
            const response = await fetch("/api/order");
            const data = await response.json();
            setOrder(data);
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
        if (selectedPrice <= 0) {
            toast.error("Invalid price selected!");
            setToastActive(true);
            setTimeout(() => setToastActive(false), 3000);
            return;
        }


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
                const newQuantity = updatedProducts[existingProductIndex].quantity + 1;
                if (newQuantity > 1000) {
                    toast.error("Quantity cannot exceed 1000!");
                    setToastActive(true);
                    setTimeout(() => setToastActive(false), 3000);
                    return prevFormData;
                }
                updatedProducts[existingProductIndex] = {
                    ...updatedProducts[existingProductIndex],
                    quantity: newQuantity
                };
                return {
                    ...prevFormData,
                    products: updatedProducts,
                };
            } else {
                toast.error("Please select a drink preference before adding to cart!");
                setToastActive(true);
                setTimeout(() => setToastActive(false), 3000);
                return prevFormData;
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
                const newQuantity = Math.max(updatedProducts[existingProductIndex].quantity - 1, 0);
                if (newQuantity === 0) {
                    toast.error("Quantity cannot be less than zero!");
                    setToastActive(true);
                    setTimeout(() => setToastActive(false), 3000);
                }
                updatedProducts[existingProductIndex] = {
                    ...updatedProducts[existingProductIndex],
                    quantity: newQuantity
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
        if (quantity < 0) {
            toast.error("Quantity cannot be less than zero!");
            setToastActive(true);
            setTimeout(() => setToastActive(false), 3000);
            return;
        }


        if (quantity > 1000) {
            toast.error("Quantity cannot exceed 1000!");
            setToastActive(true);
            setTimeout(() => setToastActive(false), 3000);
            return;
        }


        setFormData((prevFormData) => {
            const existingProductIndex = prevFormData.products.findIndex(
                (p) => p.product_id === productId
            );


            if (existingProductIndex > -1) {
                const updatedProducts = [...prevFormData.products];
                updatedProducts[existingProductIndex].quantity = quantity;


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
                            quantity: quantity,
                            selectedPrice: 0,
                        },
                    ],
                };
            }
        });
    };


    const handleAddToCart = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        if (formData.products.length === 0) {
            toast.error("No items in the cart!");
            setToastActive(true);
            setTimeout(() => setToastActive(false), 3000);
            return;
        }


        // Validate that all selected products have a valid price and quantity
        for (const product of formData.products) {
            if (product.selectedPrice <= 0 || product.quantity <= 0) {
                toast.error("Please select drink preference");
                setToastActive(true);
                setTimeout(() => setToastActive(false), 3000);
                return;
            }
        }


        const updatedCart: {
            [key: string]: {
                product_id: number;
                quantity: number;
                selectedPrice: number;
                order_id: number;
                price: number;
            };
        } = { ...cart }; // Start with the existing cart


        formData.products.forEach((product) => {
            const uniqueKey = `${product.product_id}-${product.selectedPrice}`;


            if (updatedCart[uniqueKey]) {
                // Update existing item quantity
                updatedCart[uniqueKey].quantity += product.quantity;
            } else {
                // Add new item to cart
                updatedCart[uniqueKey] = {
                    product_id: product.product_id,
                    quantity: product.quantity || 1, // Default to 1 if quantity is undefined
                    selectedPrice: product.selectedPrice,
                    order_id: formData.order_id,
                    price: product.selectedPrice,
                };
            }
        });


        // Update the cart in context
        updateCart(updatedCart);
        toast.success("Items added to the cart!");
        setFormData((prevFormData) => ({
            ...prevFormData,
            products: [], // Clear formData after saving to the cart context
        }));


        console.log("Updated Cart:", updatedCart); // Debugging log
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
        <div className="background">
            <Navbar />
            <HomeBanner />


            <div className="maindiv">
                <form onSubmit={handleAddToCart}>
                    {Object.keys(groupedProducts).map((category) => (
                        <div key={category}>
                            <MenuRow label={category} />
                            <div className="seconddiv">
                                {groupedProducts[category].map((product) => {
                                    const selectedCartItem =
                                        formData.products.find(
                                            (p) => p.product_id === product.product_id
                                        ) || { quantity: 0, selectedPrice: 0 };


                                    return (
                                        <div
                                            key={product.product_id}
                                            className={`product-card ${visibility[product.product_id] ? "selected" : ""}`}
                                            onClick={() => openProductModal(product)}
                                        >
                                            <Image
                                                className="product-image"
                                                src={product.image_url}
                                                alt={product.product_name}
                                                width={128}
                                                height={128}
                                            />
                                            <span className="product-name">
                                                {product.product_name}
                                            </span>
                                            <div className="product-prices">
                                                {product.hotPrice > 0 && (
                                                    <span>Hot: {product.hotPrice}</span>
                                                )}
                                                {product.icedPrice > 0 && (
                                                    <span> Iced: {product.icedPrice}</span>
                                                )}
                                                {product.frappePrice > 0 && (
                                                    <span> Frappe: {product.frappePrice}</span>
                                                )}
                                                {product.singlePrice > 0 && (
                                                    <span> Single: {product.singlePrice}</span>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                className="visibility-toggle-button"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevents modal opening
                                                    handleVisibilityToggle(product.product_id);
                                                }}




                                            >
                                                {visibility[product.product_id] ? <FiArrowDown size={30} /> : <FiPlus size={30} />}
                                                {visibility[product.product_id] && (
                                                    <div className="mt-4">
                                                        <div className="price-selection-grid">
                                                            {product.hotPrice > 0 && (
                                                                <label
                                                                className={`price-selection-label ${
                                                                    selectedCartItem.selectedPrice === product.hotPrice ? 'selected' : ''
                                                                }`}
                                                                   
                                                                    onClick={(e) => e.stopPropagation()}>
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
                                                                <label
                                                                className={`price-selection-label ${
                                                                    selectedCartItem.selectedPrice === product.icedPrice ? 'selected' : ''
                                                                }`}
                                                                    onClick={(e) => e.stopPropagation()}>
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
                                                                <label
                                                                className={`price-selection-label ${
                                                                    selectedCartItem.selectedPrice === product.frappePrice ? 'selected' : ''
                                                                }`}
                                                                    onClick={(e) => e.stopPropagation()}>
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
                                                                <label
                                                                className={`price-selection-label ${
                                                                    selectedCartItem.selectedPrice === product.singlePrice ? 'selected' : ''
                                                                }`}
                                                                    onClick={(e) => e.stopPropagation()}>
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
                                                        <div className="quantity-controls">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    decrementQuantity(product.product_id);
                                                                }}
                                                                className="quantity-button"
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
                                                                        Math.max(0, parseInt(e.target.value))
                                                                    )
                                                                }
                                                                className="quantity-input"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    incrementQuantity(product.product_id);
                                                                }}
                                                                className="quantity-button"
                                                            >
                                                                +
                                                            </button>
                                                        </div>


                                                        <button
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="add-to-cart-button"
                                                            type="submit"
                                                            disabled={uploading}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                )}
                                            </button>
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
                        <div className="modal-content">
                            <Image
                                src={selectedProduct.image_url}
                                alt={selectedProduct.product_name}
                                width={200}
                                height={200}
                                className="modal-image"
                            />
                            <p className="modal-description">{selectedProduct.description}</p>
                        </div>
                    )}
                </Modal>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick />
        </div>
    );
};


export default AppMenu;