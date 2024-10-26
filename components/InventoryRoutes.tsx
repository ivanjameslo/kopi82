import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import Link from "next/link";

<div></div>;
const InventoryRoutes = () => {
  return (
    <div className="bg-[url('/darkbackground.png')] bg-cover bg-center min-h-screen">
      <div className="flex justify-center gap-3 h-screen items-center">
        {/* <Card className="bg-black border-none">
          <CardHeader>
            <CardTitle className="text-white">Front Inventory</CardTitle>
            <CardDescription className="text-white font-light">
              Make changes to your Front Inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-5">
              <Link href="/FrontInventory">
                <Button variant="outline" className="pl-28 pr-28 outline-white">
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card> */}

        <Card className=" bg-black border-none">
          <CardHeader>
            <CardTitle className="text-white">Inventory</CardTitle>
            <CardDescription className="text-white font-light">
              Make changes to your Inventory.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-5">
              <Link href="/Back&FrontInventory">
                <Button variant="outline" className="pl-28 pr-28">
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className=" bg-black border-none">
          <CardHeader>
            <CardTitle className="text-white">Purchased Item</CardTitle>
            <CardDescription className="text-white font-light">
              View your Purchased Item archive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-5">
              <Link href="/PurchasedItem">
                <Button variant="outline" className="pl-28 pr-28">
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className=" bg-black border-none">
          <CardHeader>
            <CardTitle className="text-white">Item</CardTitle>
            <CardDescription className="text-white font-light">
              View your Item archive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-5">
              <Link href="/Item">
                <Button variant="outline" className="pl-28 pr-28">
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryRoutes;
