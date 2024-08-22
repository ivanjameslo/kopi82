import React from "react";

interface MenuRowProps {
  children: React.ReactNode;
  label: string;
}

const MenuRow = ({ children, label }: MenuRowProps) => {
  return (
    <div>
      <div>
        <p className="mt-10 ml-5 mr-5 text-3xl font-bold text-[#483C32]">
          {label}
        </p>
      </div>
      <div className="flex flex-row place-content-around mt-5 ml-5 mr-5">
        {children}
      </div>
    </div>
  );
};

export default MenuRow;
