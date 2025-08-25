import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import ThemeSelector from "./theme-selector";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "@/store/user-reducer";

export function SiteHeader() {
  const userRole = useSelector((state: any) => state.user.role);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(userActions.logOutUser());
    navigate("/");
  };

  return (
    <header className="flex h-13 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium" id="header-text">
          Home
        </h1>
        <ThemeSelector className="ml-auto" />
        {userRole === "anonymous" ? (
          <div className="flex items-center gap-1">
            <Link to={"/login"}>
              <Button variant={"outline"} className="max-sm:px-3">
                Login
              </Button>
            </Link>
            <Link to={"/signup"}>
              <Button variant={"outline"} className="max-sm:px-3">
                Signup
              </Button>
            </Link>
          </div>
        ) : (
          <Button
            onClick={handleLogout}
            variant={"outline"}
            className="max-sm:px-3"
          >
            Logout
          </Button>
        )}
      </div>
    </header>
  );
}
