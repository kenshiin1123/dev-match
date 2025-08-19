import { Outlet, useLocation } from "react-router-dom";
import AppSideBar from "../components/app-sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { useEffect } from "react";
import { Toaster } from "sonner";

export default function MainLayout() {
  const location = useLocation();

  const locations = [
    { location: "/", title: "Homepage" },
    { location: "/login", title: "Login Page" },
    { location: "/signup", title: "Register Page" },
  ];

  useEffect(() => {
    const headerText = document.querySelector("#header-text");
    const obj = locations.find((l) => l.location === location.pathname);

    if (obj) {
      headerText!.innerHTML = obj!.title;
    } else {
      headerText!.innerHTML = "";
    }
  }, [location.pathname]);

  return (
    <ThemeProvider>
      <AppSideBar>
        <SiteHeader />
        <Outlet />
      </AppSideBar>
      <Toaster />
    </ThemeProvider>
  );
}
