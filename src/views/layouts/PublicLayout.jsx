import FloatingToTop from "@/components/FloatingToTop";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet /> 
            </main>
            <Footer />
            <FloatingToTop />
            <FloatingWhatsApp />
        </>
    )
}