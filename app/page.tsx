import React from 'react';
import PurchaseOrder from './PurchaseOrder/page'; // Adjust the path as necessary
import AddPurchaseDetails from './Add-PurchaseDetails/page'; // Adjust the path as necessary
import AddBackInventory from './Add-BackInventory/page'; // Adjust the path as necessary
import AddFrontInventory from './Add-FrontInventory/page'; // Adjust the path as necessary
import BackInventory from './BackInventory/page'; // Adjust the path as necessary
import FrontInventory from './FrontInventory/page'; // Adjust the path as necessary

export default function Home() {
  return (
    <main>
      <FrontInventory />
    </main>
  );
}