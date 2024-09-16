import AddPurchaseOrder from "@/components/Add-PurchaseOrder";
import ViewPurchaseOrder from "@/components/View-PurchaseOrder";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PurchaseOrder = () => {
  return (
    <div>
      <AddPurchaseOrder />
      <ViewPurchaseOrder />
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
export default PurchaseOrder;