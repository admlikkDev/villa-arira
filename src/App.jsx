import { useRoutes } from "react-router-dom";
import Homepage from "./views/Homepage";
import GalleryPage from "./views/GalleryPage";
import ContactPage from "./views/ContactPage";
import PublicLayout from "./views/layouts/PublicLayout";
import Login from "./views/Authentication/Login";
import Register from "./views/Authentication/Register";
import Index from "./views/Admin/HeroSection/Index";
import FaqIndex from "./views/Admin/FaqSection/Index";
import GalleryIndex from "./views/Admin/Gallery/Index";
import TestimonyIndex from "./views/Admin/Testimony/Index";
import ApplicationIndex from "./views/Admin/Application/Index";

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
      path: '/admin/hero-section',
      element: <Index />
    },
    {
      path: '/admin/faq-section',
      element: <FaqIndex />
    },
    {
      path: '/admin/gallery',
      element: <GalleryIndex />
    },
    {
      path: '/admin/testimony',
      element: <TestimonyIndex />
    },
    {
      path: '/admin/application',
      element: <ApplicationIndex />
    },
  ])
}