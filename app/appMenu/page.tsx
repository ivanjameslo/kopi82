import Container from "./components/Container";
import HomeBanner from "./components/Homebanner";
import Navbar from "./components/navbar/Navbar";
import ProductCard from "./components/products/ProductCard";
import { CartContextProvider } from "./components/hooks/UseCart";  // Import the provider

const AppMenu = () => {
    return (
        <CartContextProvider> {/* Wrap the component tree with CartContextProvider */}
            <div>
                <Navbar />
                <div className="p-8">
                    <Container>
                        <div>
                            <HomeBanner />
                        </div>
                        <div>
                            <ProductCard />
                        </div>
                    </Container>
                </div>
            </div>
        </CartContextProvider>
    );
}

export default AppMenu;
