import Link from "next/link";
import Container from "../app-components/Container";
import Image from "next/image";
import { MdShoppingBasket } from "react-icons/md";

// import CartContextProvider from "../../Cart/page";
// import CartCount, { CartContextProvider } from "./CartCount";

const Navbar = () => {
    return (  
        <div className="
        sticky
        top-0
        w-full
        bg-slate-200
        z-30
        shadow-sm">
        
        <div className="py-4 border-b-[1px]">
        <Container>
            <div className="
            flex
            items-center
            justify-between
            gap-3
            md:gap-0">
                <div className="flex items-center gap-2">
                <Image src="/kopi.png" alt="Kopi82" width={40} height={40} />
                <Link href="/kopi82-app/menu">Kopi82</Link>
                </div> 
                <div className="hidden md:block">Search</div>
                <div className="flex items-center gap-8
                md:gap-12">
                    
                  <div className="flex items-center gap-2">
                  <MdShoppingBasket/>
                    <Link href="/kopi82-app/menu/cart">Cart</Link>
                    </div>
                </div>
            </div>
        </Container>
        </div>

        </div>
    );
}
 
export default Navbar;