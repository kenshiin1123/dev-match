import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/main-layout";

// Pages
import Homepage from "./pages/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [{ index: true, element: <Homepage /> }],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
