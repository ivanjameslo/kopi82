import MenuRow from "@/components/MenuRow";
import ProductsCard from "@/components/ProductsCard";
import { klassicKopi, picaPica } from "@/lib/menuitems";
import React from "react";

const MenuPage = () => {
  const renderPicaPica = picaPica.map((link) => (
    <ProductsCard
      productName={link.productName}
      productPrice={link.productPrice}
      productImage={link.productImage}
    />
  ));

  const renderKlassicKopi = klassicKopi.map((link) => (
    <ProductsCard
      productName={link.productName}
      productPrice={link.productPrice}
      productImage={link.productImage}
    />
  ));

  return (
    <>
      <div className="mt-20">
        <MenuRow label="Pica Pica">{renderPicaPica}</MenuRow>
        <MenuRow label="Klassic Kopi">{renderKlassicKopi}</MenuRow>
        <MenuRow label="Non Kopi">{renderPicaPica}</MenuRow>
      </div>
    </>
  );
};

export default MenuPage;
