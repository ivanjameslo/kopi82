import AddUnit from "@/components/Add-Unit";
import ViewUnit from "@/components/View-Unit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  return (
    <main>
        <AddUnit />
        <ViewUnit />
        <ToastContainer 
        position="bottom-right" 
        autoClose={1500} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        style={{ zIndex: 9999 }}
      />
    </main>
  );
};

export default page;