import {
  IconHome,
  IconSearch,
  IconFileUpload,
  IconShoppingCart,
  IconBell,
  IconSettings,
} from "@tabler/icons-react";
import { SideNavItem } from "@/types/types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Home",
    path: "/user/dashboard",
    icon: <IconHome size={24} />,
  },
  {
    title: "Search Medicines",
    path: "/user/search",
    icon: <IconSearch size={24} />,
  },
  {
    title: "My Orders",
    path: "/user/orders",
    icon: <IconShoppingCart size={24} />,
  },
];
