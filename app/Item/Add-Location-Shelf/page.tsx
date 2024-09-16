import AddShelfLocation from "@/components/Add-LocationShelf";
import ViewShelfLocation from "@/components/View-LocationShelf";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  return (
    <main>
      <div className="pt-20">
        <AddShelfLocation />
      </div>
      <div className="pt-10">
        <ViewShelfLocation />
      </div>
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
  );
};

export default page;