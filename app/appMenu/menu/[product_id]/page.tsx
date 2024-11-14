import ProductDetails from "../productDetails"; // Import the ProductDetails component
import Container from "@/app/appMenu/components/Container";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Iprams {
    product_id: string;
}

const Menu = ({ params }: { params: Iprams }) => {
    console.log(params.product_id);

    return (
        <div className="h-screen overflow-hidden bg-[url('/kopimural3.jpg')] flex items-center justify-center filter-brightness-50">
            <Container>
            
                {/* Back Link */}
                <div className="mb-4">
                <Link href="/appMenu" className="text-gray-500 flex items-center gap-2">
                    <MdArrowBack />
                    <span>Start Ordering</span>
                </Link>
                </div>
                <ProductDetails product_id={params.product_id} /> {/* Pass product_id as prop */}
                <ToastContainer
                            position="top-center"
                            autoClose={1500}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            style={{ zIndex: 9999 }}
                        />
           
            </Container>
        </div>
    );
}

export default Menu;
