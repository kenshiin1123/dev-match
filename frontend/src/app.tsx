import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/main-layout";

// Pages
import Homepage from "./pages/home";
import Loginpage, { action as loginAction } from "./pages/login";
import Signuppage, { action as signupAction } from "./pages/signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "login", element: <Loginpage />, action: loginAction },
      { path: "signup", element: <Signuppage />, action: signupAction },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
