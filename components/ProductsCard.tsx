import Image from "next/image";

import EditProduct from "./EditProduct";

type ProductProps = {
  productName: string;
  productPrice: string;
  productImage: string;
};
const ProductCard = ({
  productName,
  productPrice,
  productImage,
}: ProductProps) => {
  return (
    <>
      <div className="border border-black flex flex-col justify-center items-center w-[300px] h-[300px] rounded-xl">
        <EditProduct />
        <div className="flex justify-center items-center h-2/3 w-full">
          <Image
            className="object-contain w-full h-full"
            src={productImage}
            alt=""
            width={0}
            height={0}
            sizes="100vw"
          />
        </div>
        <div className="flex flex-col items-center h-/3 w-full">
          <span className="text-xl font-medium mb-0">{productName}</span>
          <span className="text-sm mt-0">{productPrice}</span>
        </div>
      </div>
    </>
  );
};

export default ProductCard;