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
import UpdateProduct from "@/components/Update-Product";

const MenuPage = () => {
  return (
    <>
      <div className="ml-10 mr-10">
        <div className="mt-20 flex justify-end ">
          <Button variant="outline">
            <Link href="/Menu/AddProducts">Add Product</Link>
          </Button>
        </div>
        <MenuRow label="Klassic Kopi"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {klassicKopi.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Kold Brew"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {koldBrew.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Non Kopi"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {nonKopi.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Fusion Teas"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {fusionTeas.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="All Day Breakfast"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {allDayBreakfast.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Rice Meals"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {riceMeals.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Pasta"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {pasta.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Pizza"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {pizza.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Sandwiches"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {sandwiches.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Pica Pica"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {picaPica.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>

        <MenuRow label="Beer"></MenuRow>
        <div className="flex justify-center relative w-full max-w-8xl mx-auto">
          {" "}
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="flex">
              {beer.map((link, index) => (
                <CarouselItem key={index} className="flex-none w-1/6 p-2">
                  {" "}
                  <div className="flex flex-col justify-center items-center w-full h-[330px] rounded-xl">
                    <UpdateProduct />
                    <div className="flex justify-center items-center h-2/3 w-full">
                      <Image
                        className="object-contain w-full h-full"
                        src={link.productImage}
                        alt=""
                        width={0}
                        height={0}
                        sizes="100vw"
                      />
                    </div>
                    <div className="flex flex-col justify-evenly items-center h-/3 w-full">
                      <span className="text-lg font-bold">
                        {link.productName}
                      </span>
                      <span className="text-md font-normal">
                        {link.productPrice}
                      </span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-5 transform -translate-x-1/2" />{" "}
            <CarouselNext className="absolute right-5 transform translate-x-1/2" />{" "}
          </Carousel>
        </div>
      </div>
    </>
  );
};

export default MenuPage;
