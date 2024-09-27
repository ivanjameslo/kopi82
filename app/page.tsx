import React from "react";
import PurchaseOrder from "./PurchasedItem/page"; // Adjust the path as necessary
import AddBackInventory from "./Add-BackInventory/page"; // Adjust the path as necessary
import AddFrontInventory from "./Add-FrontInventory/page"; // Adjust the path as necessary
import BackInventory from "./BackInventory/page"; // Adjust the path as necessary
import FrontInventory from "./FrontInventory/page"; // Adjust the path as necessary

export default function Home() {
  return (
    <main className="bg-[url('/darkbackground.png')] bg-cover bg-fixed min-h-screen flex flex-col justify-between">
      <div className="flex-grow flex items-center justify-center">
        <p className="text-white text-7xl font-extrabold drop-shadow-2xl">
          Welcome, Admin!
        </p>
      </div>
      <footer className="p-4">
        <p className="text-sm text-muted text-center">
          Kopi 82 <br />
          &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </main>
  );
}
