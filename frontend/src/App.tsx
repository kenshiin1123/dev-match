import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import MainLayout from "./layouts/MainLayout";

// Pages
import Homepage from "./pages/Home";

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
