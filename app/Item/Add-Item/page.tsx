import AddItem from "@/components/Add-Item"
import React from "react";

const page = () => {
  return (
    <main className="bg-[url('/darkbackground.png')] bg-cover bg-fixed min-h-screen">
      <div className="pt-20">
        <AddItem />
      </div>
    </main>
  );
};

export default page;
