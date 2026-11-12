import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { formatRupiah } from "../hooks/Usevillaquery";
import { STATUS_LABEL, bookingFields, useMyBooking } from "../hooks/useBooking";
import "../assets/styles/villa.css";
import "../assets/styles/booking.css";

const CREATED_KEY = "va-booking-created";

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    eyebrow: "Pembayaran diterima",
    title: "Pemesanan berhasil",
    text: "Terima kasih! Pembayaran Anda sudah kami terima. Simpan kode pemesanan di bawah ini dan tunjukkan saat check-in di villa.",
  },
  pending: {
    icon: Clock,
    eyebrow: "Menunggu pembayaran",
    title: "Selesaikan pembayaran",
    text: "Pesanan Anda sudah dibuat. Selesaikan pembayaran sesuai instruksi agar pemesanan terkonfirmasi. Status akan diperbarui otomatis setelah pembayaran kami terima.",
  },
  failed: {
    icon: XCircle,
    eyebrow: "Pembayaran tidak berhasil",
    title: "Pembayaran gagal",
    text: "Pembayaran tidak dapat diproses. Pesanan Anda masih tersimpan, jadi Anda bisa mencoba membayar lagi atau membatalkannya.",
  },
};

const formatDate = (iso) =>
  iso ? new Date(`${String(iso).slice(0, 10)}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-";

const readCreated = () => {
  try {
    return JSON.parse(sessionStorage.getItem(CREATED_KEY) || "null");
  } catch {
    return null;
  }
};

export default function BookingResultPage({ variant = "success" }) {
  const location = useLocation();
  const v = VARIANTS[variant] ?? VARIANTS.success;
  const Icon = v.icon;

  // Data awal dari halaman checkout; lalu disegarkan dari server agar status akurat
  const snapshot = location.state?.booking ?? readCreated();
  const { data: fresh } = useMyBooking(snapshot?.id);
  const f = bookingFields({ ...snapshot, ...fresh });

  const rows = [
    ["Kode pemesanan", f.code],
    f.rentalTitle !== "-" && ["Tipe sewa", f.rentalTitle],
    f.checkIn && ["Check-in", formatDate(f.checkIn)],
    f.checkOut && ["Check-out", formatDate(f.checkOut)],
    f.stay !== "-" && ["Durasi", f.stay],
    f.total && ["Total", formatRupiah(f.total)],
    f.status && ["Status", STATUS_LABEL[f.status] ?? f.status],
  ].filter(Boolean);

  return (
    <main className="va-paper va-result">
      <div className="va-result__inner">
        <div className="va-result__icon" data-variant={variant}>
          <Icon size={30} strokeWidth={1.5} />
        </div>

        <div>
          <span className="va-eyebrow">{v.eyebrow}</span>
          <h1 className="va-result__title">{v.title}</h1>
        </div>

        <p className="va-lead" style={{ maxWidth: "56ch" }}>{v.text}</p>

        {snapshot && (
          <dl className="va-result__box">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="va-result__actions">
          {variant === "failed" && (
            <Link to="/booking/addon" className="va-btn">Coba bayar lagi</Link>
          )}
          <Link to="/riwayat-pesanan" className={variant === "failed" ? "va-btn va-btn--ghost" : "va-btn"}>
            Lihat pesanan saya
          </Link>
          <Link to="/" className="va-btn va-btn--ghost">Kembali ke beranda</Link>
        </div>
      </div>
    </main>
  );
}