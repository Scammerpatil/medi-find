import {
  IconHome,
  IconClipboardList,
  IconMapPin,
  IconSettings,
} from "@tabler/icons-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/delivery/dashboard",
    icon: <IconHome size={24} />,
  },
  {
    title: "Pickup Orders",
    path: "/delivery/pickup-orders",
    icon: <IconClipboardList size={24} />,
  },
  {
    title: "Delivery Map",
    path: "/delivery/map",
    icon: <IconMapPin size={24} />,
  },
  {
    title: "Settings",
    path: "/delivery/settings",
    icon: <IconSettings size={24} />,
  },
];
