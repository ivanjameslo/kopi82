import AddCategory from "@/components/Add-Category";
import ViewCategory from "@/components/View-Category";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  return (
    <main>
      <div className="pt-20">
        <AddCategory />
      </div>
      <div className="pt-10">
        <ViewCategory />
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