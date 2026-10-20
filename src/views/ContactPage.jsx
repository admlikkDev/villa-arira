import { useState } from "react";
import {
  MessageCircle,
  MapPin,
  ArrowUpRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import "../assets/styles/villa.css";
import useFetch from "../hooks/useFetch";
import { toast } from "sonner";

// Ganti dengan nomor WhatsApp admin (format internasional, tanpa + atau spasi)
const WA_NUMBER = "6281234567890";
const ADDRESS =
  "Jl. Mekartani No.59, Kertawangi, Kec. Cisarua, Kab. Bandung Barat 40551";
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Villa Arira " + ADDRESS)}`;

export default function ContactPage() {
  const [error, setError] = useState({
    firstname: "",
    lastname: "",
    email: "",
    message: "",
  });

  const { post } = useFetch();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = Object.fromEntries(new FormData(e.target));
    const resp = await post("messages", formData);
    if (!resp.status) {
      setLoading(false);
      setError(resp.error);
      toast.error("Gagal mengirim pesan.");
      return;
    }
    setError("");
    toast.success("Pesan berhasil dikirim.");
    setLoading(false);
  };

  return (
    <>
      {/* Hero */}
      <header className="va-ink va-page-hero">
        <div className="va-wrap va-page-hero__inner">
          <div>
            <span className="va-eyebrow">Hubungi kami</span>
            <h1 className="va-page-hero__title">
              Pusat bantuan &amp; reservasi
            </h1>
          </div>
          <p className="va-lead">
            Punya pertanyaan seputar ketersediaan kamar, paket gathering, atau
            detail fasilitas Villa Arira? Tim kami siap membantu.
          </p>
        </div>
      </header>

      {/* Form + info */}
      <section className="va-paper va-section">
        <div className="va-wrap va-contact">
          {/* Kiri: formulir */}
          <form className="va-contact__form" onSubmit={submit} noValidate>
            <div>
              <h2
                className="va-h2"
                style={{
                  fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                  marginBottom: "0.6rem",
                }}
              >
                Kirim pesan ke admin
              </h2>
              <p className="va-text">
                Tanyakan jadwal kosong atau konsultasikan acara spesial Anda.
                Pesan akan dikirim lewat WhatsApp.
              </p>
            </div>

            {/* {error && (
                            <div className="va-alert" role="alert">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )} */}

            <div className="va-contact__row">
              <div className="va-field">
                <label className="va-label" htmlFor="firstname">
                  Nama depan
                </label>
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  autoComplete="given-name"
                  placeholder="cth. Budi"
                  className="va-input"
                  aria-invalid={Boolean(error.firstname)}
                />
                {error.firstname && (
                  <p className="va-error">{error.firstname}</p>
                )}
              </div>
              <div className="va-field">
                <label className="va-label" htmlFor="lastname">
                  Nama belakang
                </label>
                <input
                  id="lastname"
                  name="lastname"
                  type="text"
                  autoComplete="family-name"
                  placeholder="cth. Santoso"
                  className="va-input"
                  aria-invalid={Boolean(error.lastname)}
                />
                {error.lastname && <p className="va-error">{error.lastname}</p>}
              </div>
            </div>

            <div className="va-field">
              <label className="va-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="budi@gmail.com"
                className="va-input"
                aria-invalid={Boolean(error.email)}
              />
              {error.email && <p className="va-error">{error.email}</p>}
            </div>

            <div className="va-field">
              <label className="va-label" htmlFor="message">
                Pesan / detail kebutuhan
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="va-input"
                placeholder="Tuliskan tanggal rencana sewa atau pertanyaan Anda di sini..."
                aria-invalid={Boolean(error.message)}
              />
              {error.message && <p className="va-error">{error.message}</p>}
            </div>

            <button
              type="submit"
              className="va-btn va-btn--block"
              style={{ padding: "1.05rem" }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="va-spin" size={28} strokeWidth={1.5} />
              ) : (
                "Kirim pesan sekarang"
              )}
            </button>
          </form>

          {/* Kanan: info */}
          <div className="va-contact__side">
            <div className="va-cells va-cells--1">
              <div className="va-cell">
                <MessageCircle size={24} strokeWidth={1.5} />
                <h3 className="va-h3">Respon cepat via WhatsApp</h3>
                <p className="va-text">
                  Butuh cek tanggal kosong dan kalkulasi harga rombongan?
                  Hubungi admin operasional kami langsung.
                </p>
                <a
                  className="va-btn va-btn--ghost va-cell__push"
                  style={{ alignSelf: "flex-start" }}
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tanya villa <ArrowUpRight size={16} />
                </a>
              </div>

              <div className="va-cell">
                <MapPin size={24} strokeWidth={1.5} />
                <h3 className="va-h3">Panduan lokasi &amp; alamat</h3>
                <p className="va-text">
                  {ADDRESS}. Akses jalan mudah dijangkau kendaraan roda empat
                  dan bus pariwisata ukuran sedang.
                </p>
                <a
                  className="va-link va-cell__push"
                  style={{ alignSelf: "flex-start" }}
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lihat petunjuk Google Maps <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
