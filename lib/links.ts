export enum Routes {
  HOME = "/",
  MENU = "/Menu",
  EMPLOYEE = "/Employee",
  // ORDERS = "/Orders",
  INVENTORY = "/Inventory",
  SALES = "/Sales",
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
    label: "Sales",
    href: Routes.SALES,
  },
];
