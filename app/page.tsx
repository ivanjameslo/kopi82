<<<<<<< HEAD
import React from 'react';
import PurchaseOrder from './PurchaseOrder/page'; // Adjust the path as necessary
import AddPurchaseDetails from './Add-PurchaseDetails/[po_id]/page'; // Adjust the path as necessary
import AddBackInventory from './Add-BackInventory/page'; // Adjust the path as necessary
import AddFrontInventory from './Add-FrontInventory/page'; // Adjust the path as necessary
import BackInventory from './BackInventory/page'; // Adjust the path as necessary
import FrontInventory from './FrontInventory/page'; // Adjust the path as necessary

export default function Home() {
  return (
    <main>
      {/* <PurchaseOrder /> */}
      <FrontInventory />
    </main>
=======
import React from "react";
import PurchaseOrder from "./PurchaseOrder/page"; // Adjust the path as necessary
import AddPurchaseDetails from "./Add-PurchaseDetails/page"; // Adjust the path as necessary
import AddBackInventory from "./Add-BackInventory/page"; // Adjust the path as necessary
import AddFrontInventory from "./Add-FrontInventory/page"; // Adjust the path as necessary
import BackInventory from "./BackInventory/page"; // Adjust the path as necessary
import FrontInventory from "./FrontInventory/page"; // Adjust the path as necessary

export default function Home() {
  return (
    <main className="bg-[url('/background.png')] bg-cover bg-center min-h-screen"></main>
>>>>>>> 4e910518e2d048ca75e491d221e380739e12f457
  );
}
