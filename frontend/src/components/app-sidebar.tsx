import { type PropsWithChildren, type FC } from "react";
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

import { type LucideProps } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

type ItemType = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

import {
  Home,
  BriefcaseBusiness,
  BookUser,
  FileText,
  MessageSquare,
  User,
  Settings,
  PlusCircle,
  Users,
  Building,
} from "lucide-react";

const INITIAL_ITEMS = [
  { title: "Home", url: "/", icon: Home },
  { title: "Jobs", url: "/jobs", icon: BriefcaseBusiness },
];

const DEVELOPER_ITEMS = [
  { title: "Home", url: "/", icon: Home },
  { title: "Jobs", url: "/jobs", icon: BriefcaseBusiness },
  { title: "Applications", url: "/applications", icon: FileText },
  { title: "Connections", url: "/connections", icon: BookUser },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

const EMPLOYER_ITEMS = [
  { title: "Home", url: "/", icon: Home },
  { title: "Post Job", url: "/jobs/new", icon: PlusCircle },
  { title: "Job Listings", url: "/jobs", icon: BriefcaseBusiness },
  { title: "Applicants", url: "/applicants", icon: Users },
  { title: "Connections", url: "/connections", icon: BookUser },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Company Profile", url: "/company", icon: Building },
  { title: "Settings", url: "/settings", icon: Settings },
];

const AppSidebar: FC<PropsWithChildren> = ({ children }) => {
  const userRole = useSelector((state: any) => state.user.role);
  let items = INITIAL_ITEMS;

  switch (userRole) {
    case "developer":
      items = DEVELOPER_ITEMS;
      break;
    case "employer":
      items = EMPLOYER_ITEMS;
      break;
  }

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
                {items.map((item: ItemType) => (
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
