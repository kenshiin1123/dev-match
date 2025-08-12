import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/main-layout";

// Pages
import Homepage from "./pages/home";
import Loginpage from "./pages/login";
import Signuppage from "./pages/signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "login", element: <Loginpage /> },
      { path: "signup", element: <Signuppage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
