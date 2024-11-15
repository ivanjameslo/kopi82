import Link from "next/link";
import { useState, useEffect } from "react";
import { MdArrowBack } from "react-icons/md";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "react-toastify";

interface ProductDetails {
  product_name: string;
  description: string;
  image_url: string;
  hotPrice: number;
  icedPrice: number;
  frappePrice: number;
  singlePrice: number;
}

interface CartProduct {
  order_id: number;
  product_id: number;
  quantity: number;
  preference: "hot" | "iced" | "frappe" | "single";
  product?: ProductDetails;
}

const Cart = () => {
  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const response = await fetch("/api/order_details");
        if (!response.ok) {
          throw new Error("Failed to load cart details");
        }
        const orderDetails = await response.json();

        // Fetch each product's details from /api/product
        const productPromises = orderDetails.map(async (item: CartProduct) => {
          const productResponse = await fetch(`/api/product/${item.product_id}`);
          if (!productResponse.ok) {
            throw new Error(`Failed to load product details for product ID ${item.product_id}`);
          }
          const productData = await productResponse.json();
          return { ...item, product: productData };
        });

        const cartProductsWithDetails = await Promise.all(productPromises);
        setCartProducts(cartProductsWithDetails);
      } catch (error) {
        console.error("Failed to fetch cart products", error);
        toast.error("Failed to load cart");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartProducts();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl">Your Cart is Empty</div>
        <div>
          <Link href="/appMenu" className="text-slate-500 flex items-center gap-1 mt-2">
            <MdArrowBack />
            <span>Start Ordering</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleRemoveItem = (product_id: number) => {
    setCartProducts((prev) => prev.filter((item) => item.product_id !== product_id));
    toast.info("Item removed from cart");
  };

  const calculateSubtotal = () => {
    return cartProducts.reduce((total, item) => {
      const price = getPriceBasedOnPreference(item);
      return total + price * item.quantity;
    }, 0);
  };

  const getPriceBasedOnPreference = (product: CartProduct) => {
    if (!product.product) return 0;

    switch (product.preference) {
      case "hot":
        return product.product.hotPrice || 0;
      case "iced":
        return product.product.icedPrice || 0;
      case "frappe":
        return product.product.frappePrice || 0;
      case "single":
        return product.product.singlePrice || 0;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border-b p-4">Product</th>
            <th className="border-b p-4">Quantity</th>
            <th className="border-b p-4">Price</th>
            <th className="border-b p-4">Total</th>
            <th className="border-b p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {cartProducts.map((product) => {
            const price = getPriceBasedOnPreference(product);
            return (
              <tr key={product.product_id} className="border-b">
                <td className="p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.product?.image_url || "/placeholder.png"}
                      alt={product.product?.product_name || "Product Image"}
                      width={64}
                      height={64}
                      className="rounded-md"
                    />
                    <div>
                      <span className="font-semibold">{product.product?.product_name}</span>
                      <p className="text-gray-500 text-sm">
                        {product.product?.description
                          ? product.product.description.length > 50
                            ? product.product.description.slice(0, 50) + "..."
                            : product.product.description
                          : ""}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">{product.quantity}</td>
                <td className="p-4">₱{price.toFixed(2)}</td>
                <td className="p-4">₱{(price * product.quantity).toFixed(2)}</td>
                <td className="p-4">
                  <Button
                    onClick={() => handleRemoveItem(product.product_id)}
                    className="bg-red-500 text-white"
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-semibold">Subtotal:</span>
        <span className="text-xl font-bold">₱{calculateSubtotal().toFixed(2)}</span>
      </div>

      <Button className="w-full mt-6 bg-green-500 text-white">
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default Cart;
