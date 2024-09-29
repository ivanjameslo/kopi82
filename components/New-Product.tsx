import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from 'next/image';

interface ProductType {
    image_url: string;
    product_name: string;
    category: string;
    status: string;
    description: string;
    hotPrice?: number;
    icedPrice?: number;
    frappePrice?: number;
    singlePrice?: number;
}

export default function NewProduct({ product }: { product: ProductType }) {
    return (
        <Card className="w-full max-w-4xl mx-auto mt-20 bg-black border-transparent">
            <CardHeader>
                <CardTitle className="text-white">Newly Added Product</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <Image
                            src={product.image_url}
                            alt={product.product_name}
                            width={400}
                            height={400}
                            className="rounded-lg"
                        />
                    </div>
                    <div className="space-y-4 text-white">
                        <h2 className="text-2xl font-bold">{product.product_name}</h2>
                        <p>Category: {product.category}</p>
                        <p>Status: {product.status}</p>
                        <p>Description: {product.description}</p>
                        <div>
                            {product.hotPrice && <p>Hot Price: ${product.hotPrice}</p>}
                            {product.icedPrice && <p>Iced Price: ${product.icedPrice}</p>}
                            {product.frappePrice && <p>Frappe Price: ${product.frappePrice}</p>}
                            {product.singlePrice && <p>Price: ${product.singlePrice}</p>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}