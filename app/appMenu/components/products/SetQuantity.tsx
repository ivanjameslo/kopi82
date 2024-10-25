"use client";

import { Cart, product } from "@prisma/client";

interface SetQuantityProps {
    cartCounter?: boolean;
    cartProduct: Cart;
    handleQtyIncrease: () => void;
    handleQtyDecrease: () => void;
}

const btnStyle = 'border-[1.2px] border-slate-300 px-2 rounded';

const SetQuantity: React.FC<SetQuantityProps> = ({
    cartProduct, 
    cartCounter, 
    handleQtyDecrease, 
    handleQtyIncrease,
}) => {
    return ( 
        <div className="gap-8 items-center">
            {cartCounter ? null : <div 
            className="font-semibold">QUANTITY</div> }
            <div className="flex gap-4 items-center text-base">
                <button onClick={handleQtyDecrease} className={btnStyle}>-</button>
                <div>{cartProduct.quantity}</div>
                <button onClick={handleQtyIncrease} className={btnStyle}>+</button>
            </div>
        </div>
     );
}
 
export default SetQuantity;