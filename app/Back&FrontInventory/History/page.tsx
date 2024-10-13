import InventoryHistory from '@/components/History';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const History = () => {

  return(
    <main>
      <InventoryHistory />
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
    </main>
  )
};

export default History;