import ViewProduct from "@/components/View-Product";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  return (
    <main>
      <div className="pt-10">
        <ViewProduct />
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
      </div>
    </main>
  );
};

export default page;