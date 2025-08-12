import type { PropsWithChildren, FC } from "react";
import {
  SidebarHeader,
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";

import { Home, BriefcaseBusiness, BookUser } from "lucide-react";
import { Link } from "react-router-dom";

// Menu items.
const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Jobs", url: "#", icon: BriefcaseBusiness },
  { title: "Connections", url: "#", icon: BookUser },
];

const AppSidebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader className="text-2xl text-center font-semibold mt-2">
            Dev Match
          </SidebarHeader>
          <SidebarGroup>
            <SidebarGroupLabel>Navigations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter></SidebarFooter>
      </Sidebar>
      <main className="w-full h-full">{children}</main>
    </SidebarProvider>
  );
};

export default AppSidebar;
