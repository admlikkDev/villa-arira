import { useRoutes } from "react-router-dom";
import Homepage from "./views/Homepage";
import GalleryPage from "./views/GalleryPage";
import ContactPage from "./views/ContactPage";
import Index from "./views/Admin";
import PublicLayout from "./views/layouts/PublicLayout";
import Login from "./views/Authentication/Login";
import Register from "./views/Authentication/Register";

export default function App() {
  return useRoutes([

    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },

    {
      element: <PublicLayout />,
      children: [
        {
          path: '/',
          element: <Homepage />
        },
        {
          path: '/gallery',
          element: <GalleryPage />
        },
        {
          path: '/contact',
          element: <ContactPage />
        },
      ]
    },

    // admin panel
    {
      path: '/admin/hero/index',
      element: <Index />
    },
  ])
}