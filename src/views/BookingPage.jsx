import CekJadwal from "../components/CekJadwal";
import PricelistVilla from "../components/PricelistVilla";
import PaketVilla from "../components/PaketVilla";
import AddOnVilla from "../components/AddOnVilla";
// import FaqVilla from "../components/FaqVilla";
import "../assets/styles/villa.css";

// Alur keputusan: pilih tanggal -> lihat harga -> pilih paket -> tambah add-on -> FAQ
export default function BookingPage() {
  return (
    <>
      {/* Hero */}
      <header className="va-ink va-page-hero">
        <div className="va-wrap va-page-hero__inner">
          <div>
            <span className="va-eyebrow">Reservasi</span>
            <h1 className="va-page-hero__title">Cek jadwal &amp; booking</h1>
          </div>
          <p className="va-lead">
            Pilih tanggal menginap, tentukan unit dan paket, lalu tambahkan
            add-on. Admin kami akan mengonfirmasi ketersediaan sebelum
            pembayaran.
          </p>
        </div>
      </header>
      <CekJadwal />
      <PricelistVilla />
      <hr /> 
      <PaketVilla />
      <AddOnVilla />
      {/* <FaqVilla /> */}
    </>
  );
}
