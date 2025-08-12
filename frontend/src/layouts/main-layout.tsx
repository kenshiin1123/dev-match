import { Outlet } from "react-router-dom";
import AppSideBar from "../components/app-sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SiteHeader } from "@/components/site-header";
export default function MainLayout() {
  return (
    <ThemeProvider>
      <AppSideBar>
        <SiteHeader />
        <Outlet />
      </AppSideBar>
    </ThemeProvider>
  );
}
