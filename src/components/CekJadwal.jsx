import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertCircle,
  Users,
  ArrowUpRight,
} from "lucide-react";
import {
  useVillaList,
  formatRupiah,
  formatCapacity,
} from "../hooks/Usevillaquery";
import "../assets/styles/villa.css";
import SectionState from "./SectionState";

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
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

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // minggu dimulai Senin
};

/**
 * onSelectUnit(item, search) dipanggil saat tombol "Lihat detail" ditekan.
 * search = { startDate, endDate, villaType, purpose, guestCount, nights }
 */
export default function CekJadwal({ onSelectUnit }) {
  const today = new Date();
  const todayISO = toISO(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [villaType, setVillaType] = useState(""); // "" = semua tipe
  const [purpose, setPurpose] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [formError, setFormError] = useState("");
  const [result, setResult] = useState(null); // snapshot pencarian terakhir
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const dropdownRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gulir ke hasil setiap kali pencarian baru dijalankan
  useEffect(() => {
    if (result) {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const {
    data: rentalOptionItems,
    isLoading,
    isError,
    error,
  } = useVillaList("pricelists", { query: "unpage=true" });

  const {
    data: reasonItems,
    isLoading: loadingReason,
    isError: isErrorReason,
    error: errorReason,
  } = useVillaList("reasons", { query: "unpage=true" });

  const handleCekJadwal = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setFormError("Pilih tanggal check-in dan check-out terlebih dahulu.");
      setIsOpen(true);
      return;
    }
    setFormError("");
    setResult({
      startDate,
      endDate,
      villaType,
      purpose: purpose || reasonItems?.[0]?.text || "",
      guestCount: Number(guestCount) || 0,
      nights: countNights(startDate, endDate),
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
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1),
    );

  const months = [0, 1].map((i) => {
    const d = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + i,
      1,
    );
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const renderDays = ({ year, month }) => {
    const cells = [];
    for (let i = 0; i < getFirstDayOfMonth(year, month); i++) {
      cells.push(<span key={`e-${i}`} />);
    }
    for (let d = 1; d <= getDaysInMonth(year, month); d++) {
      const dateStr = toISO(year, month, d);
      const isSel = dateStr === startDate || dateStr === endDate;
      const inRange =
        startDate && endDate && dateStr > startDate && dateStr < endDate;
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

  if (isLoading || loadingReason)
    return <SectionState tone="paper" label="Memuat pilihan sewa…" />;
  if (isError)
    return (
      <SectionState
        tone="paper"
        label="Pilihan sewa gagal dimuat"
        error={error.message}
      />
    );
  if (isErrorReason)
    return (
      <SectionState
        tone="paper"
        label="Pilihan keperluan gagal dimuat"
        error={errorReason.message}
      />
    );

  // Urutkan: tipe pilihan pengunjung tampil paling awal
  const resultItems = result
    ? [...(rentalOptionItems ?? [])].sort((a, b) => {
        const aSel = a?.rental_option?.title === result.villaType;
        const bSel = b?.rental_option?.title === result.villaType;
        return Number(bSel) - Number(aSel);
      })
    : [];

  return (
    <section id="cek-jadwal" className="va-paper va-section">
      <div className="va-wrap">
        <div className="va-head">
          <h2 className="va-h2">Cek ketersediaan villa</h2>
          <p className="va-lead">
            Pilih tanggal dan tipe unit untuk melihat ketersediaan sebelum
            melakukan pemesanan.
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
              <label className="va-label" htmlFor="cj-date">
                Tanggal menginap
              </label>
              <button
                id="cj-date"
                type="button"
                className="va-input va-input--btn"
                aria-expanded={isOpen}
                aria-invalid={Boolean(formError)}
                onClick={() => setIsOpen(!isOpen)}
                style={{ color: startDate ? "var(--fg)" : "var(--muted)" }}
              >
                <span>{displayText}</span>
                <Calendar size={18} strokeWidth={1.5} />
              </button>

              {isOpen && (
                <div className="va-pop va-cal">
                  <div className="va-cal__bar">
                    <button
                      type="button"
                      className="va-icon-btn"
                      onClick={() => shiftMonth(-1)}
                      aria-label="Bulan sebelumnya"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="va-icon-btn"
                      onClick={() => shiftMonth(1)}
                      aria-label="Bulan berikutnya"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="va-cal__months">
                    {months.map((m) => (
                      <div key={`${m.year}-${m.month}`}>
                        <div className="va-cal__title">
                          {monthNames[m.month]} {m.year}
                        </div>
                        <div className="va-cal__dow">
                          {dayNames.map((n) => (
                            <span key={n}>{n}</span>
                          ))}
                        </div>
                        <div className="va-cal__days">{renderDays(m)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="va-cal__foot">
                    <span>
                      {nights > 0
                        ? `${formatDate(startDate)} – ${formatDate(endDate)} · ${nights} malam`
                        : "Pilih tanggal check-in dan check-out"}
                    </span>
                    <div className="va-cal__actions">
                      <button
                        type="button"
                        className="va-btn va-btn--ghost va-btn--sm"
                        disabled={!startDate}
                        onClick={resetDates}
                      >
                        Hapus
                      </button>
                      <button
                        type="button"
                        className="va-btn va-btn--sm"
                        disabled={!startDate || !endDate}
                        onClick={() => setIsOpen(false)}
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tipe villa */}
            <div className="va-field">
              <label className="va-label" htmlFor="cj-villa">
                Tipe villa
              </label>
              <div className="va-select">
                <select
                  id="cj-villa"
                  className="va-input"
                  value={villaType}
                  onChange={(e) => setVillaType(e.target.value)}
                >
                  <option value="">Semua tipe</option>
                  {rentalOptionItems?.map((item) => (
                    <option key={item?.id} value={item?.rental_option?.title}>
                      {item?.rental_option?.title}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={1.5} />
              </div>
            </div>

            {/* Keperluan */}
            <div className="va-field">
              <label className="va-label" htmlFor="cj-purpose">
                Keperluan
              </label>
              <div className="va-select">
                <select
                  id="cj-purpose"
                  className="va-input"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  {reasonItems?.map((item) => (
                    <option key={item?.id} value={item?.text}>
                      {item?.text}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} strokeWidth={1.5} />
              </div>
            </div>

            {/* Jumlah tamu */}
            <div className="va-field">
              <label className="va-label" htmlFor="cj-guest">
                Estimasi tamu
              </label>
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
              {nights > 0 && <span className="va-tag">{nights} malam</span>}
              {villaType && <span className="va-tag">{villaType}</span>}
              {Number(guestCount) > 0 && (
                <span className="va-tag">{guestCount} tamu</span>
              )}
              {!nights && !villaType && !guestCount && (
                <span className="va-text">
                  Lengkapi tanggal untuk melihat ketersediaan.
                </span>
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
                  {result.nights} malam
                  {result.guestCount > 0 && ` · ${result.guestCount} tamu`}
                  {result.purpose && ` · ${result.purpose}`}
                </p>
              </div>
              <button
                type="button"
                className="va-btn va-btn--ghost va-btn--sm"
                onClick={() => setResult(null)}
              >
                Tutup hasil
              </button>
            </header>

            {resultItems.length === 0 ? (
              <div className="va-empty">
                <strong>Belum ada unit tersedia</strong>
                <p className="va-text">Coba ubah tanggal atau tipe villa.</p>
              </div>
            ) : (
              <div className="va-results__grid">
                {resultItems.map((item) => {
                  const opt = item?.rental_option;
                  const max = Number(opt?.max_capacity);
                  const tooSmall =
                    result.guestCount > 0 &&
                    Number.isFinite(max) &&
                    result.guestCount > max;
                  const selected =
                    result.villaType && opt?.title === result.villaType;

                  return (
                    <article
                      key={item.id ?? opt?.title}
                      className="va-rent"
                      data-full={tooSmall}
                    >
                      <div className="va-rent__img">
                        <img src={opt?.image} alt={opt?.title} draggable={false} />
                        {(tooSmall || selected) && (
                          <span className="va-chip">
                            {tooSmall ? "Melebihi kapasitas" : "Pilihan Anda"}
                          </span>
                        )}
                      </div>
                      <div className="va-rent__body">
                        <div>
                          <h3 className="va-h3">{opt?.title}</h3>
                          <p className="va-meta" style={{ marginTop: "0.9rem" }}>
                            <Users size={16} strokeWidth={1.5} />
                            Kapasitas {formatCapacity(opt?.max_capacity)}
                          </p>
                        </div>
                        <p className="va-text va-clamp-2">{opt?.description}</p>
                        <div>
                          <span className="va-price" style={{ fontSize: "1.6rem" }}>
                            {formatRupiah(item.weekday_price)}
                          </span>
                          <span className="va-price-note">
                            mulai dari / malam (weekday)
                          </span>
                        </div>
                        <button
                          type="button"
                          className="va-btn va-btn--ghost va-btn--block va-cell__push"
                          disabled={tooSmall}
                          onClick={() => onSelectUnit?.(item, result)}
                        >
                          {tooSmall ? (
                            "Kapasitas tidak cukup"
                          ) : (
                            <>
                              Lihat detail <ArrowUpRight size={16} />
                            </>
                          )}
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