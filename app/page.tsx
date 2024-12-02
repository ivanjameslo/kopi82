import Login from "@/components/Login"
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Kopi822App from "@/app/kopi82-app/page";

const page = () => {
  return (
    <>
    <Kopi822App />
    {/* <Login /> */}
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