import Hero from '../components/Hero';
import InformasiSingkat from '../components/InformasiSingkat';
import PilihanSewa from '../components/PilihanSewa';
import FasilitasVilla from '../components/FasilitasVilla';
import WisataTerdekat from '../components/WisataTerdekat';
import ReviewVilla from '../components/ReviewVilla';
import FaqVilla from '../components/FaqVilla';
import CtaBooking from '../components/CtaBooking';

// Navbar, Footer, FloatingWhatsApp, dan FloatingToTop dirender oleh layout publik (lihat routes).
export default function Homepage() {
    return (
        <>
            <Hero />
            <InformasiSingkat />
            <PilihanSewa />
            <FasilitasVilla />
            <WisataTerdekat />
            <ReviewVilla />
            <FaqVilla />
            <CtaBooking />
        </>
    );
}