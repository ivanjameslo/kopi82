"use client";

import { product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

interface OrderDetails {
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
    order: {
        order_id: number;
        customer_name: string;
        service_type: string;
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

interface orderData {
    order_id: number;
    customer_name: string;
    service_type: string;
}





const ProductDetails = () => {
    const router = useRouter();
    const [orderDetails, setOrderDetails] = useState<OrderDetails[]>([]);
    const [product, setProduct] = useState<ProductData[]>([]);

    console.log('Fetched order details:', orderDetails); // Check order details
    console.log('Fetched products:', product); // Check product data

    const [formDataOrder, setFormDataArray] = useState([{
        order_id: " ",
        product_id: " ",
        quantity: " ",

    }]);

    // Fetch Product Details
    const fetchProductData = async () => {
        try {
            const response = await fetch('/api/product');
            const data = await response.json();
            console.log('Fetched products:', data); // Log fetched products
            setProduct(data);
        } catch (error) {
            console.error('Failed to fetch product', error);
        }
    };

    // Fetch Order Details
    const handleAddtoCart = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        for (const formData of formDataOrder) {
            if (!formData.order_id || !formData.product_id || !formData.quantity) {
                toast.error('Missing required fields');
                return;
            }
        }

        const formDataOrderWithNumbers = formDataOrder.map(formDataOrder => ({
            ...formDataOrder,
            order_id: Number(formDataOrder.order_id),
            product_id: Number(formDataOrder.product_id),
        }));

        try {
            const response = await fetch('app/api/order_details', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formDataOrderWithNumbers),
            });

            const result = await response.json();

            // check if the response is successful
            if (!response.ok) {
                toast.error(result.error || 'Failed to add to cart');
                return;
            }

            toast.success('Added to cart successfully');
            setTimeout(() => {
                router.push('/Item');
            }, 1500);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    }

    // Load initial data on page load
    useEffect(() => {
        fetchProductData();
    }, []);

    const findProductbyId = (productId: number, products: ProductData[]): string => {
        const product = products.find((product) => product.product_id === productId);
        return product ? product.product_name : '';
    }

    const Horizontal = () => {
        return (
            <hr className="w-[30%] my-2" />
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full h-full">
            <form onSubmit={handleAddtoCart}>
                {product.map((order, index) => (
                    <div key={order.product_id}>
                        <div>
                            <img src={order.image_url} alt={order.product_name} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-medium text-slate-700">{order.product_name}</h2>
                            <Horizontal />
                            <div className="text-justify">{order.description}</div>
                            <Horizontal />
                            <div>
                                <span className="font-semibold">CATEGORY:</span> {order.category}
                            </div>
                            <Horizontal />
                            <div>
                                <Button type="submit" variant="outline" size="default" className="w-full">
                                    Add to cart</Button>
                            </div>

                        </div>
                    </div>
                ))}


            </form>



        </div>
    );
};

export default ProductDetails;
