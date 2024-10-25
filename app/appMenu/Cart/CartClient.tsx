"use client";

import Link from "next/link";
import { useCart } from "../components/hooks/UseCart";
import { MdArrowBack } from "react-icons/md";
import ItemContent from "./ItemContent";
import Button from "../components/Button";
import { FormatPrice } from "../util/FormatPrice";

interface ProductContentProps {
    product: {
        product_id: number;
        product_name: string;
        category: string;
        type: string;
        description: string;
        image_url: string;
        qty: number;
        price: number;
        onIncrease?: () => any;
    }
}

const CartClient = () => {
    const { cartProducts, handleClearCart, cartTotalAmount } = useCart();

    if (!cartProducts || cartProducts.length === 0) {
        return (
            <div className="flex flex-col items-center">
                <div className="text-2xl">Your Cart is Empty</div>
                <div>
                    <Link href={'/appMenu'} className="text-slate-500 flex items-center gap-1 mt-2">
                        <MdArrowBack />
                        <span>Start Ordering</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>Menu Cart</div>
            <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center mt-8">
                <div className="col-span-2 justify-self-start">Menu</div>
                <div className="justify-self-center">Price</div>
                <div className="justify-self-center">Quantity</div>
                <div className="justify-self-end">Total</div>
            </div>

            <div>
                {/* {cartProducts?.map((o) => {
                    return <ItemContent key={o.product_id} product={o} />; // Use 'o' instead of 'product'
                })} */}
            </div>
            <div className="border-t-[1.5px] border-slate-200 py-4 flex justify-between gap-4">
                <Button label="Clear Cart" onclick={() => handleClearCart()} small={true} outline /> {/* Change 'onclick' to 'onClick' */}
            </div>
            <div className="text-sm flex flex-col gap-1 items-start">
                <div className="flex justify-between w-full text-base font-semibold">
                    <span>Subtotal</span>
                    <span>{FormatPrice(cartTotalAmount)}</span>
                </div>

                <Button label="Checkout" onclick={() => {}} small={true} />
                <Link href={'/appMenu'} className="text-slate-500 flex items-center gap-1 mt-2">
                    <MdArrowBack />
                    <span>Continue Ordering</span>
                </Link>
            </div>
        </div>
    );
};

export default CartClient;
