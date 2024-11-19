export enum Routes {
  HOME = "/Home",
  MENU = "/Menu",
  EMPLOYEE = "/Employee",
  // ORDERS = "/Orders",
  INVENTORY = "/Inventory",
  SALES = "/Sales",
  DISCOUNT="/Discount",
  PAYMENT="/Payment",
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
