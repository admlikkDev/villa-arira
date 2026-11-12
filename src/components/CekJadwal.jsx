import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertCircle,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import {
  useVillaList,
  formatRupiah,
  formatCapacity,
  toArray,
} from "../hooks/Usevillaquery";
import { errorText } from "../hooks/useBooking";
import { stayLabel } from "../hooks/stay";
import "../assets/styles/villa.css";
import SectionState from "./SectionState";

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const toISO = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
const countNights = (start, end) =>
  Math.round(
    (new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000,
  );
const humanize = (s) =>
  String(s ?? "").replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // minggu dimulai Senin
};

// Status booking yang MENGUNCI unit (pending = sedang menunggu pembayaran)
const BLOCKING_STATUS = ["pending", "paid"];

// Lapisan pengaman di sisi klien. Penyaring utama tetap endpoint /available di server;
// ini hanya menyaring jika server menyertakan penanda ketersediaan / daftar booking unit.
const isUnitAvailable = (unit, start, end) => {
  if (unit?.is_available === false || unit?.available === false) return false;
  if (["booked", "unavailable"].includes(String(unit?.status ?? "").toLowerCase())) return false;

  const bookings = unit?.bookings ?? unit?.booked_dates;
  if (Array.isArray(bookings)) {
    const conflict = bookings.some((b) => {
      const status = String(b?.status ?? "pending").toLowerCase();
      const bIn = String(b?.check_in_date ?? b?.start_date ?? "").slice(0, 10);
      const bOut = String(b?.check_out_date ?? b?.end_date ?? "").slice(0, 10);
      if (!bIn || !bOut || !BLOCKING_STATUS.includes(status)) return false;
      // Rentang [check-in, check-out): hari check-out boleh dipakai tamu lain
      return bIn < end && bOut > start;
    });
    if (conflict) return false;
  }
  return true;
};

export default function CekJadwal() {
  const today = new Date();
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [villaType, setVillaType] = useState(""); // id tipe villa; "" = semua tipe
  const [purpose, setPurpose] = useState(""); // id alasan; "" = pilihan pertama
  const [guestCount, setGuestCount] = useState("");
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null); // snapshot pencarian terakhir
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const dropdownRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  const { get } = useFetch();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gulir ke hasil setiap kali pencarian baru dijalankan
  useEffect(() => {
    if (result) resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [result]);

  const { data: rentalOptionItems, isLoading, isError, error } = useVillaList("rental-options", {
    query: "unpage=true",
  });

  const { data: reasonItems, isLoading: loadingReason, isError: isErrorReason, error: errorReason } =
    useVillaList("reasons", { query: "unpage=true" });

  // Ketersediaan SELALU diambil baru dari server (tanpa cache). Jika di-cache, unit yang baru saja
  // dipesan orang lain (atau oleh Anda sendiri) masih tampil tersedia sampai cache kedaluwarsa.
  const {
    data: availableItems = [],
    isLoading: resultLoading,
    isError: resultError,
    error: resultErrorMsg,
  } = useQuery({
    // `searchedAt` membuat setiap klik "Cek jadwal" menghasilkan request baru
    queryKey: ["rental-available", result?.startDate, result?.endDate, result?.guestCount, result?.searchedAt],
    enabled: Boolean(result),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    retry: 1,
    queryFn: async () => {
      const params = new URLSearchParams({
        check_in_date: result.startDate,
        check_out_date: result.endDate,
      });
      if (result.guestCount > 0) params.set("guest_count", String(result.guestCount));

      const resp = await get(`rental-options/available?${params.toString()}`);
      if (!resp.status) throw new Error(errorText(resp.error));
      return resp.data;
    },
    select: (body) => toArray(body),
  });

  // Nilai default keperluan = alasan pertama dari API
  const purposeValue = purpose || String(reasonItems?.[0]?.id ?? "");
  const purposeLabel = reasonItems?.find((r) => String(r.id) === purposeValue)?.text ?? "";
  const villaLabel = rentalOptionItems?.find((o) => String(o.id) === villaType)?.title ?? "";

  const handleCekJadwal = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setFormError("Pilih tanggal check-in dan check-out terlebih dahulu.");
      setIsOpen(true);
      return;
    }
    if (!(Number(guestCount) >= 1)) {
      setFormError("Isi estimasi jumlah tamu (minimal 1 orang).");
      return;
    }
    if (!purposeValue) {
      setFormError("Pilih keperluan menginap.");
      return;
    }
    setFormError("");
    setResult({
      startDate,
      endDate,
      villaType, // id tipe villa ("" = semua)
      purpose: purposeValue, // id alasan, dibaca halaman booking sebagai reason_id
      purposeLabel,
      guestCount: Number(guestCount),
      nights: countNights(startDate, endDate),
      searchedAt: Date.now(),
    });
  };

  const handleDateClick = (dateStr) => {
    setFormError("");
    if (!startDate || endDate) {
      setStartDate(dateStr);
      setEndDate("");
    } else if (dateStr <= startDate) {
      setStartDate(dateStr);
    } else {
      setEndDate(dateStr);
    }
  };

  const resetDates = () => {
    setStartDate("");
    setEndDate("");
  };

  const shiftMonth = (delta) =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));

  const months = [0, 1].map((i) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const renderDays = ({ year, month }) => {
    const cells = [];
    for (let i = 0; i < getFirstDayOfMonth(year, month); i++) cells.push(<span key={`e-${i}`} />);
    for (let d = 1; d <= getDaysInMonth(year, month); d++) {
      const dateStr = toISO(year, month, d);
      const isSel = dateStr === startDate || dateStr === endDate;
      const inRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
      cells.push(
        <button
          key={dateStr}
          type="button"
          className="va-day"
          data-sel={isSel}
          data-range={Boolean(inRange)}
          data-today={dateStr === todayISO}
          disabled={dateStr < todayISO}
          onClick={() => handleDateClick(dateStr)}
        >
          {d}
        </button>,
      );
    }
    return cells;
  };

  const nights = startDate && endDate ? countNights(startDate, endDate) : 0;

  const displayText =
    startDate && endDate
      ? `${formatDate(startDate)} – ${formatDate(endDate)}`
      : startDate
        ? `${formatDate(startDate)} – pilih check-out`
        : "Pilih check-in & check-out";

  if (isLoading || loadingReason) return <SectionState tone="paper" label="Memuat pilihan sewa…" />;
  if (isError) return <SectionState tone="paper" label="Pilihan sewa gagal dimuat" error={error.message} />;
  if (isErrorReason)
    return <SectionState tone="paper" label="Pilihan keperluan gagal dimuat" error={errorReason.message} />;

  // Hasil akhir: server menyaring tanggal; di sini ditambah filter tipe villa & pengaman klien
  const resultItems = result
    ? availableItems
        .filter((item) => !result.villaType || String(item?.id) === String(result.villaType))
        .filter((item) => isUnitAvailable(item, result.startDate, result.endDate))
    : [];

  return (
    <section id="cek-jadwal" className="va-paper va-section">
      <div className="va-wrap">
        <div className="va-head">
          <h2 className="va-h2">Cek ketersediaan villa</h2>
          <p className="va-lead">
            Pilih tanggal dan tipe unit untuk melihat ketersediaan sebelum melakukan pemesanan.
          </p>
        </div>

        <form className="va-booking" onSubmit={handleCekJadwal} noValidate>
          {formError && (
            <div className="va-alert" role="alert">
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          <div className="va-form-grid">
            {/* Tanggal */}
            <div className="va-field" ref={dropdownRef}>
              <label className="va-label" htmlFor="cj-date">Tanggal menginap</label>
              <button
                id="cj-date"
                type="button"
                className="va-input va-input--btn"
                aria-expanded={isOpen}
                aria-invalid={Boolean(formError) && !startDate}
                onClick={() => setIsOpen(!isOpen)}
                style={{ color: startDate ? "var(--fg)" : "var(--muted)" }}
              >
                <span>{displayText}</span>
                <Calendar size={18} strokeWidth={1.5} />
              </button>

              {isOpen && (
                <div className="va-pop va-cal">
                  <div className="va-cal__bar">
                    <button type="button" className="va-icon-btn" onClick={() => shiftMonth(-1)} aria-label="Bulan sebelumnya">
                      <ChevronLeft size={18} />
                    </button>
                    <button type="button" className="va-icon-btn" onClick={() => shiftMonth(1)} aria-label="Bulan berikutnya">
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="va-cal__months">
                    {months.map((m) => (
                      <div key={`${m.year}-${m.month}`}>
                        <div className="va-cal__title">{monthNames[m.month]} {m.year}</div>
                        <div className="va-cal__dow">
                          {dayNames.map((n) => <span key={n}>{n}</span>)}
                        </div>
                        <div className="va-cal__days">{renderDays(m)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="va-cal__foot">
                    <span>
                      {nights > 0
                        ? `${formatDate(startDate)} – ${formatDate(endDate)} · ${stayLabel(nights)}`
                        : "Pilih tanggal check-in dan check-out"}
                    </span>
                    <div className="va-cal__actions">
                      <button type="button" className="va-btn va-btn--ghost va-btn--sm" disabled={!startDate} onClick={resetDates}>
                        Hapus
                      </button>
                      <button type="button" className="va-btn va-btn--sm" disabled={!startDate || !endDate} onClick={() => setIsOpen(false)}>
                        Terapkan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tipe villa */}
            <div className="va-field">
              <label className="va-label" htmlFor="cj-villa">Tipe villa</label>
              <div className="va-select">
                <select id="cj-villa" className="va-input" value={villaType} onChange={(e) => setVillaType(e.target.value)}>
                  <option value="">Semua tipe</option>
                  {rentalOptionItems?.map((item) => (
                    <option key={item?.id} value={String(item?.id)}>{item?.title}</option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={1.5} />
              </div>
            </div>

            {/* Keperluan (value = id alasan, dikirim sebagai reason_id) */}
            <div className="va-field">
              <label className="va-label" htmlFor="cj-purpose">Keperluan</label>
              <div className="va-select">
                <select id="cj-purpose" className="va-input" value={purposeValue} onChange={(e) => setPurpose(e.target.value)}>
                  {reasonItems?.map((item) => (
                    <option key={item?.id} value={String(item?.id)}>{item?.text}</option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={1.5} />
              </div>
            </div>

            {/* Jumlah tamu */}
            <div className="va-field">
              <label className="va-label" htmlFor="cj-guest">Estimasi tamu</label>
              <input
                id="cj-guest"
                type="number"
                min="1"
                max="50"
                placeholder="Contoh: 15"
                className="va-input"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
              />
            </div>
          </div>

          <div className="va-booking__foot">
            <div className="va-booking__sum" aria-live="polite">
              {nights > 0 && <span className="va-tag">{stayLabel(nights)}</span>}
              {villaLabel && <span className="va-tag">{villaLabel}</span>}
              {Number(guestCount) > 0 && <span className="va-tag">{guestCount} tamu</span>}
              {!nights && !villaType && !guestCount && (
                <span className="va-text">Lengkapi tanggal untuk melihat ketersediaan.</span>
              )}
            </div>
            <button type="submit" className="va-btn">
              <Search size={18} /> Cek jadwal sekarang
            </button>
          </div>
        </form>

        {/* Hasil */}
        {result && (
          <div className="va-results" ref={resultsRef}>
            <header className="va-results__head">
              <div>
                <span className="va-label">Hasil pencarian</span>
                <h3 className="va-results__title">
                  {formatDate(result.startDate)} – {formatDate(result.endDate)}
                </h3>
                <p className="va-text" style={{ marginTop: "0.4rem" }}>
                  {stayLabel(result.nights)}
                  {result.guestCount > 0 && ` · ${result.guestCount} tamu`}
                  {result.purposeLabel && ` · ${result.purposeLabel}`}
                </p>
              </div>
              <button type="button" className="va-btn va-btn--ghost va-btn--sm" onClick={() => setResult(null)}>
                Tutup hasil
              </button>
            </header>

            {resultLoading ? (
              <SectionState tone="paper" label="Memeriksa ketersediaan unit…" />
            ) : resultError ? (
              <div className="va-alert" role="alert">
                <AlertCircle size={16} />
                <span>Gagal memuat ketersediaan: {resultErrorMsg?.message}</span>
              </div>
            ) : resultItems.length === 0 ? (
              <div className="va-empty">
                <strong>Belum ada unit tersedia</strong>
                <p className="va-text">Semua unit sudah terpesan pada tanggal ini. Coba ubah tanggal atau tipe villa.</p>
              </div>
            ) : (
              <div className="va-results__grid">
                {resultItems.map((item) => {
                  const max = Number(item?.max_capacity);
                  const tooSmall = result.guestCount > 0 && Number.isFinite(max) && result.guestCount > max;
                  const selected = result.villaType && String(item?.id) === String(result.villaType);

                  const prices = Array.isArray(item?.prices) ? item.prices : [];
                  const numeric = prices.map((p) => Number(p.price)).filter((n) => Number.isFinite(n));
                  const minPrice = numeric.length ? Math.min(...numeric) : null;

                  return (
                    <article key={item.id ?? item?.title} className="va-rent" data-full={tooSmall}>
                      <div className="va-rent__img">
                        <img src={item?.image} alt={item?.title} draggable={false} />
                        {(tooSmall || selected) && (
                          <span className="va-chip">{tooSmall ? "Melebihi kapasitas" : "Pilihan Anda"}</span>
                        )}
                      </div>
                      <div className="va-rent__body">
                        <div>
                          <h3 className="va-h3">{item?.title}</h3>
                          <p className="va-meta" style={{ marginTop: "0.9rem" }}>
                            <Users size={16} strokeWidth={1.5} />
                            Kapasitas {formatCapacity(item?.max_capacity)}
                          </p>
                        </div>
                        <p className="va-text va-clamp-2">{item?.description}</p>

                        <div>
                          {minPrice !== null ? (
                            <>
                              <span className="va-price">{formatRupiah(minPrice)}</span>
                              <span className="va-price-note">mulai dari / malam</span>
                            </>
                          ) : (
                            <span className="va-muted">Harga belum diatur</span>
                          )}
                        </div>

                        {prices.length > 1 && (
                          <ul className="va-checks" style={{ fontSize: "0.82rem", gap: "0.35rem" }}>
                            {prices.map((p) => (
                              <li key={p.id} style={{ justifyContent: "space-between" }}>
                                <span className="va-muted">
                                  {humanize(p.season)}{p.day_type ? ` · ${humanize(p.day_type)}` : ""}
                                </span>
                                <strong>{formatRupiah(p.price)}</strong>
                              </li>
                            ))}
                          </ul>
                        )}

                        <button
                          type="button"
                          className="va-btn va-btn--ghost va-btn--block va-cell__push"
                          disabled={tooSmall}
                          onClick={() => navigate("/booking/addon", { state: { unit: item, search: result } })}
                        >
                          {tooSmall ? "Kapasitas tidak cukup" : "Sewa Villa"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}