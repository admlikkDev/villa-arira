import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UseAuthProvider from "./hooks/useAuth.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import ScrollToTop from "./components/ScrollToTop.jsx";

const queryClient = new QueryClient();

const THEMES = ["hutan", "kayu", "kabut", "logo"];
const q = new URLSearchParams(location.search).get("theme");
if (THEMES.includes(q)) sessionStorage.setItem("theme", q);
const theme = sessionStorage.getItem("theme") ?? "hutan";
if (theme !== "hutan") document.documentElement.dataset.theme = theme;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <QueryClientProvider client={queryClient}>
        <UseAuthProvider>
          <App />
        </UseAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
    <Toaster richColors />
  </StrictMode>,
);
