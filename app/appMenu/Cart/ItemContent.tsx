"use client";

import Link from "next/link";
import { useCart } from "../components/hooks/UseCart";
import Image from "next/image";
import { truncateText } from "../util/truncateText";
import { FormatPrice } from "../util/FormatPrice";
import SetQuantity from "../components/products/SetQuantity";
import { order_details, product } from "@prisma/client";

interface ProductContentProps {
  product: product & { quantity: number }; // Assuming product includes quantity
}

const ItemContent: React.FC<ProductContentProps> = ({ product }) => {
  const { handleRemoveProductFromCart, handleCartQtyIncrease, handleCartQtyDecrease } = useCart();

  return (
    <div className="grid grid-cols-5 text-xs md:text-sm gap-4 border-t-[1.5px] border-slate-200 py-4 items-center">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <Link href={`/appMenu/${product.product_id}/page`}>
          <div className="relative w-[70px] aspect-square">
            <Image 
              src={product.image_url || "/default-image.png"} 
              alt={product.product_name} 
              fill 
              className="object-contain" 
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/appMenu/${product.product_id}/page`}>
            {truncateText(product.product_name)}
          </Link>
          <div>{product.description}</div>
          <div className="w-[70px]">
            <button 
              className="text-slate-500 underline" 
              onClick={() => handleRemoveProductFromCart({
                  product_id: product.product_id, quantity: product.quantity,
                  orderDetails_id: 0,
                  order_id: 0
              })}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      {/* <div className="justify-self-center">{FormatPrice(product.price)}</div> */}
      <div className="justify-self-center">
        {/* <SetQuantity
          cartCounter={true}
          cartProduct={{
            product_id: product.product_id,
            quantity: product.quantity, // Use the correct quantity property
          }}
          handleQtyDecrease={() => handleCartQtyDecrease({
              product_id: product.product_id, quantity: product.quantity,
              orderDetails_id: 0,
              order_id: 0
          })}
          handleQtyIncrease={() => handleCartQtyIncrease({
              product_id: product.product_id, quantity: product.quantity,
              orderDetails_id: 0,
              order_id: 0
          })}
        /> */}
      </div>
      <div className="justify-self-end font-semibold">
        {/* {FormatPrice(product.price * product.quantity)}  */}
      </div>
    </div>
  );
};

export default ItemContent;
