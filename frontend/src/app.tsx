import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

// Layouts
import MainLayout from "./layouts/main-layout";
import JobsLayout from "./layouts/jobs-layout";

// Pages
import Homepage from "./pages/home";
import Loginpage, { action as loginAction } from "./pages/login";
import Signuppage, { action as signupAction } from "./pages/signup";
import JobsPage from "./pages/jobs";
import PostJobPage, { action as jobPostAction } from "./pages/post-job";

// RTK Store
import store from "./store/store";

// Loaders
import { tokenLoader } from "./util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    loader: tokenLoader,
    id: "root",
    children: [
      { index: true, element: <Homepage /> },
      { path: "login", element: <Loginpage />, action: loginAction },
      { path: "signup", element: <Signuppage />, action: signupAction },
      {
        path: "jobs",
        element: <JobsLayout />,
        children: [
          { index: true, element: <JobsPage /> },
          { path: "new", element: <PostJobPage />, action: jobPostAction },
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}
