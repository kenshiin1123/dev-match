import { Outlet, useLoaderData, useLocation } from "react-router-dom";
import AppSideBar from "../components/app-sidebar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useDispatch } from "react-redux";
import { userActions } from "@/store/user-reducer";
import { getAuthToken } from "@/util/auth";

export default function MainLayout() {
  const location = useLocation();
  const loaderData = useLoaderData();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (!loaderData || !loaderData.user_id) {
      // Don't proceed to next block if user_id is missing
      return;
    }

    const fetchUserData = async () => {
      const { VITE_API_BASE_URL } = import.meta.env;
      const response = await fetch(VITE_API_BASE_URL + "/users/me", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + getAuthToken(),
        },
      });

      const { success, data } = await response.json();

      if (!success) {
        return;
      }

      dispatch(userActions.setUser(data));
    };

    fetchUserData();
  }, [loaderData]);

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
