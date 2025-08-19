import { type PropsWithChildren, type FC, useEffect, useState } from "react";
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

import {
  Home,
  BriefcaseBusiness,
  BookUser,
  type LucideProps,
  FileText,
  MessageSquare,
  User,
  Settings,
  PlusCircle,
  Users,
  Building,
} from "lucide-react";
import { Link, useLoaderData } from "react-router-dom";

type ItemType = {
  title: string;
  url: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}[];

const INITIAL_ITEMS = [
  { title: "Home", url: "/", icon: Home },
  { title: "Jobs", url: "#", icon: BriefcaseBusiness },
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
  const loaderData = useLoaderData();

  // Menu items.
  const [items, setItems] = useState<ItemType>(INITIAL_ITEMS);

  useEffect(() => {
    if (loaderData.role === "developer") {
      setItems(DEVELOPER_ITEMS);
    } else if (loaderData.role === "employer") {
      setItems(EMPLOYER_ITEMS);
    }
  }, [loaderData.role]);

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
