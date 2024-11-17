import ViewDiscount from "@/components/View-Discount"
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  return (
    <>
    <ViewDiscount />
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
      </>
  );
};

export default page;
