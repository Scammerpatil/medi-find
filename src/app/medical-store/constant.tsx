import {
  IconHome,
  IconListCheck,
  IconClipboardCheck,
  IconPackage,
  IconSettings,
} from "@tabler/icons-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/medical-store/dashboard",
    icon: <IconHome size={24} />,
  },
  {
    title: "Orders",
    path: "/medical-store/orders",
    icon: <IconListCheck size={24} />,
  },
  {
    title: "Manage Medicines",
    path: "/medical-store/medicines",
    icon: <IconPackage size={24} />,
  },
];
