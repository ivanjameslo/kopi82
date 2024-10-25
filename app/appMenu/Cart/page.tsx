// app/appMenu/Cart/page.tsx
import Container from "../components/Container";
import CartClient from "./CartClient";
import { CartContextProvider } from "../components/hooks/UseCart"; // Make sure this path is correct
import NavBar from "../components/navbar/Navbar";

const Cart = () => {
    return ( 
        <div className="pt-8">
            <Container>
                {/* Wrap everything inside CartContextProvider */}
                <CartContextProvider>
                 
                    <CartClient />
                </CartContextProvider>
            </Container>
        </div>
    );
}

export default Cart;
