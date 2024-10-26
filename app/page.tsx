
import React from "react";
import PurchaseOrder from "./PurchasedItem/page"; // Adjust the path as necessary
import Kopi82app from "./kopi82-app/page";


const page = () => {
  return (

    <main >
      {/* <div className="flex-grow flex items-center justify-center">
        <p className="text-white text-7xl font-extrabold drop-shadow-2xl">
          Welcome, Admin!
        </p>
      </div>
      <footer className="p-4">
        <p className="text-sm text-muted text-center">
          Kopi 82 <br />
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </footer> */}
      <Kopi82app />
    </main>
  );
}

export default page