import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../assets/styles/villa.css";
import "../assets/styles/booking.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="va-ink va-result">
      <div className="va-result__inner">
        <h1 className="va-404" aria-label="Error 404">404</h1>
        <div>
          <h2 className="va-h2" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>Halaman tidak ditemukan</h2>
          <p className="va-lead" style={{ marginTop: "1rem", maxWidth: "50ch" }}>
            Alamat yang Anda tuju tidak ada atau sudah dipindahkan. Periksa kembali alamatnya, atau kembali ke halaman utama.
          </p>
        </div>
        <div className="va-result__actions">
          <Link to="/" className="va-btn">Ke beranda</Link>
          <button type="button" className="va-btn va-btn--ghost" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Halaman sebelumnya
          </button>
        </div>
      </div>
    </main>
  );
}