import React from "react";

interface MenuRowProps {
  label: string;
}

// removed children here to make way for carousel

const MenuRow = ({ label }: MenuRowProps) => {
  return (
    <div>
      <div>
        <p className="mt-14 ml-5 mr-5 text-4xl font-bold text-[#483C32]">
          {label}
        </p>
      </div>
    </div>
  );
};

export default MenuRow;
