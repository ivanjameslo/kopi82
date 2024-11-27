export enum Routes {
  HOME = "/Home",
  MENU = "/Menu",
  EMPLOYEE = "/Employee",
  // ORDERS = "/Orders",
  INVENTORY = "/Back&FrontInventory",
  SALES = "/Sales",
  DISCOUNT = "/Discount",
  PAYMENT = "/Payment",
  PURCHASED_ITEM = "/PurchasedItem",
  ITEM = "/Item",
}

export const NAVBAR_LINKS = [
  {
    label: "Home",
    href: Routes.HOME,
  },
  {
    label: "Employee",
    href: Routes.EMPLOYEE,
  },
  {
    label: "Menu",
    href: Routes.MENU,
  },
  // {
  //   label: "Orders",
  //   href: Routes.ORDERS,
  // },
  {
    label: "Inventory",
    href: Routes.INVENTORY,
  },
  {
    label: "Purchased Item",
    href: Routes.PURCHASED_ITEM,
  },
  {
    label: "Item",
    href: Routes.ITEM,
  },
  {
    label: "Payment",
    href: Routes.PAYMENT,
  },
  {
    label: "Discount",
    href: Routes.DISCOUNT,
  },
  {
    label: "Sales",
    href: Routes.SALES,
  },
];
