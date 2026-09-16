import { useRoutes } from "react-router-dom";
import Homepage from "./views/Homepage";
import GalleryPage from "./views/GalleryPage";
import ContactPage from "./views/ContactPage";

export default function App(){
  return useRoutes([
    {
      path: '/',
      element: <Homepage/>
    },
    {
      path: '/gallery',
      element: <GalleryPage/>
    },
    {
      path: '/contact',
      element: <ContactPage/>
    },
  ])
}