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
import JobDisplayPage, {
  loader as jobDisplayLoader,
  action as jobApplicationAction,
} from "./pages/job-display";
import ApplicationsPage, {
  loader as applicationsLoader,
} from "./pages/applications";

// RTK Store
import store from "./store/store";

// Loaders
import { tokenLoader } from "./util/auth";
import { Loader2 } from "lucide-react";

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
          {
            path: ":jobpost_id",
            element: <JobDisplayPage />,
            loader: jobDisplayLoader,
            action: jobApplicationAction,
            hydrateFallbackElement: (
              <div className="h-[100vh] w-[100%] z-10 fixed top-0 flex justify-center items-center bg-black/40 animate-pulse">
                <Loader2 className="animate-spin" size={70} />
              </div>
            ),
          },
          { path: "new", element: <PostJobPage />, action: jobPostAction },
        ],
      },
      {
        path: "applications",
        element: <ApplicationsPage />,
        loader: applicationsLoader,
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
