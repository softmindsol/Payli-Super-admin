import { UsersRound } from "lucide-react";
import { MdOutlineDashboard } from "react-icons/md";
import { GrCart } from "react-icons/gr";
import { AiOutlineCreditCard } from "react-icons/ai";
import { CiGlobe } from "react-icons/ci";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/assets/svgs";
import { IoCubeOutline } from "react-icons/io5";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: MdOutlineDashboard,
  },
  {
    title: "Inventory",
    url: "#",
    icon: GrCart,
  },
  {
    title: "POS",
    url: "#",
    icon: AiOutlineCreditCard,
  },
  {
    title: "Webshops",
    url: "#",
    icon: CiGlobe,
  },
  {
    title: "Orders",
    url: "#",
    icon: IoCubeOutline,
  },
  {
    title: "Employees",
    url: "#",
    icon: UsersRound,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-gradient-to-b from-[#1D50AB] to-[#0A285E] text-white">
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="relative top-4">
              <img
                className="max-w-[126px] w-full"
                src={Logo}
                alt="Payli-Logo"
              />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="pl-2 mt-8">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
