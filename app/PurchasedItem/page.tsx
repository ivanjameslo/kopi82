import AddPurchasedItem from "@/components/Add-PurchasedItem";
import ViewPurchasedItem from "@/components/View-PurchasedItem";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PurchasedItem = () => {
  return (
    <div>
      <AddPurchasedItem />
      <ViewPurchasedItem />
      <ToastContainer 
          position="bottom-right" 
          autoClose={5000} 
          hideProgressBar={false} 
          newestOnTop={false} 
          closeOnClick rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          style={{ zIndex: 9999 }}
        />
    </div>
  );
};
export default PurchasedItem;