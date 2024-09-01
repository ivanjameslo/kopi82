import React from "react";
import PurchaseOrder from "./PurchaseOrder/page"; // Adjust the path as necessary
import AddBackInventory from "./Add-BackInventory/page"; // Adjust the path as necessary
import AddFrontInventory from "./Add-FrontInventory/page"; // Adjust the path as necessary
import BackInventory from "./BackInventory/page"; // Adjust the path as necessary
import FrontInventory from "./FrontInventory/page"; // Adjust the path as necessary

export default function Home() {
  return (
    <main className="bg-[url('/darkbackground.png')] bg-cover bg-center min-h-screen flex justify-center items-center">
      <div className="text-center">
        <p className="text-white text-7xl font-extrabold drop-shadow-2xl mt-96">
          Welcome, Admin!
        </p>
        <p className="text-sm text-muted mt-96">
          Kopi 82 <br />
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </main>
  );
}
