import AddEmployee from "@/components/Add-Employee";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  return (
    <div>
      <AddEmployee />
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
export default RegisterPage;