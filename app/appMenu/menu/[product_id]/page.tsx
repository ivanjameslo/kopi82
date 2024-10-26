// Ensure that 'productDetails.tsx' exists in the same directory as '[product_id].tsx'
import ProductIdDetails from "../productDetails";

import Container from "@/app/appMenu/components/Container";
import { CartContextProvider } from "@/app/appMenu/components/hooks/UseCart";

interface IParams {
    productId?: string;
}

const Menu = () => {

      
    return ( 
        <div className="pt-8">
            <Container>
                <CartContextProvider>
                    <ProductIdDetails />
                </CartContextProvider>
            </Container>
        </div>
     );
}
 
export default Menu;
