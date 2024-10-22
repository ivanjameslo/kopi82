import UpdateProduct from "@/components/Update-Product";
import MenuRow from "@/components/MenuRow";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  klassicKopi,
  koldBrew,
  nonKopi,
  fusionTeas,
  allDayBreakfast,
  riceMeals,
  pasta,
  pizza,
  sandwiches,
  picaPica,
  beer,
} from "@/lib/menuitems";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const menuSections = [
  { label: "Klassic Kopi", items: klassicKopi },
  { label: "Kold Brew", items: koldBrew },
  { label: "Non Kopi", items: nonKopi },
  { label: "Fusion Teas", items: fusionTeas },
  { label: "All Day Breakfast", items: allDayBreakfast },
  { label: "Rice Meals", items: riceMeals },
  { label: "Pasta", items: pasta },
  { label: "Pizza", items: pizza },
  { label: "Sandwiches", items: sandwiches },
  { label: "Pica Pica", items: picaPica },
  { label: "Beer", items: beer },
];

const MenuPage = () => {
  return (
    <>
      <div className="ml-10 mr-10">
        <div className="mt-10 flex justify-end">
          <Button variant="outline">
            <Link href="/Menu/AddProducts">Add Product</Link>
          </Button>
        </div>
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <MenuRow label={section.label} />
            <div className="flex justify-center relative w-full max-w-8xl mx-auto">
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="flex">
                  {section.items.map((item, itemIndex) => (
                    <CarouselItem key={itemIndex} className="flex-none w-1/6 p-2">
                      <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                        <UpdateProduct />
                        <div className="flex justify-center items-center h-2/3 w-full">
                          <Image
                            className="object-contain w-full h-full"
                            src={item.productImage}
                            alt={item.productName}
                            width={500}
                            height={500}
                            sizes="100vw"
                          />
                        </div>
                        <div className="flex flex-col justify-evenly items-center h-1/3 w-full">
                          <span className="text-lg font-bold">{item.productName}</span>
                          <span className="text-md font-normal">{item.productPrice}</span>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />
                <CarouselNext className="absolute right-5 transform translate-x-1/2" />
              </Carousel>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MenuPage;