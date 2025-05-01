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
    path: "/delivery-boy/dashboard",
    icon: <IconHome size={24} />,
  },
  {
    title: "Pickup Orders",
    path: "/delivery-boy/pickup-orders",
    icon: <IconClipboardList size={24} />,
  },
];
