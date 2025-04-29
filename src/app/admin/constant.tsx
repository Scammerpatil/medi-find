import {
  IconHome,
  IconUser,
  IconBuildingStore,
  IconTruckDelivery,
  IconShieldCheck,
  IconSettings,
} from "@tabler/icons-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: <IconHome size={24} />,
  },
  {
    title: "Customers",
    path: "/admin/customers",
    icon: <IconUser size={24} />,
  },
  {
    title: "Medical Stores",
    path: "/admin/medical-stores",
    icon: <IconBuildingStore size={24} />,
  },
  {
    title: "Delivery Boys",
    path: "/admin/delivery-boys",
    icon: <IconTruckDelivery size={24} />,
  },
];
