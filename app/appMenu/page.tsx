import Navbar from "@/app/appMenu/components/navbar/Navbar";
import NavBar from "@/app/appMenu/components/navbar/Navbar";
import Container from "./components/Container";
import HomeBanner from "./components/Homebanner";
import ProductCard from "./components/products/ProductCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AppMenu = () => {
    return (

        <div>
            <Navbar />
            <div className="p-8">
                <Container>
                    <div>
                        <HomeBanner />
                    </div>
                    <div>
                        <ProductCard />
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
                    </div>
                </Container>
            </div>
        </div>


    );
}

export default AppMenu;
