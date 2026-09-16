import AddOnVilla from "../components/AddOnVilla";
import CekJadwal from "../components/CekJadwal";
import FaqVilla from "../components/FaqVilla";
import FasilitasVilla from "../components/FasilitasVilla";
import FloatingToTop from "../components/FloatingToTop";
import FloatingWhatsApp from "../components/FloatingWhatsApp";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import InformasiSingkat from "../components/InformasiSingkat";
import Navbar from "../components/Navbar";
import PaketVilla from "../components/PaketVilla";
import PilihanSewa from "../components/PilihanSewa";
import PricelistVilla from "../components/PricelistVilla";
import ReviewVilla from "../components/ReviewVilla";

export default function Homepage(){
    return (
        <>  
            {/* <Navbar /> */}
            <Hero />
            <InformasiSingkat />
            <PilihanSewa />
            <FasilitasVilla />
            <PricelistVilla />
            <PaketVilla/>
            <CekJadwal />
            <AddOnVilla/>
            <ReviewVilla />
            <FaqVilla />
            {/* <Footer />
            <FloatingWhatsApp />
            <FloatingToTop /> */}
        </>
    )
}