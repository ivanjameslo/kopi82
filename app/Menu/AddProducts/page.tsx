import CreateProduct from "@/components/Add-Product";
import React from "react";

const page = () => {
  return (
    <main className="bg-[url('/darkbackground.png')] bg-cover bg-fixed min-h-screen">
      <div>
        <CreateProduct />
      </div>
    </main>
  );
};

export default page;
