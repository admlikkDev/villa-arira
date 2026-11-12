import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Check, Loader2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import useFetch from "../hooks/useFetch";
import { formatRupiah, toArray } from "../hooks/Usevillaquery";
import { BOOKING_PATH, errorText, extractBooking, useCancelBooking } from "../hooks/useBooking";
import { loadSnap } from "../hooks/useSnap";
import { countNights, eachDay, stayLabel } from "../hooks/stay";
import SectionState from "../components/SectionState";
import "../assets/styles/villa.css";
import "../assets/styles/booking.css";

const DRAFT_KEY = "va-booking-draft"; // pencarian (unit + tanggal + tamu + alasan)
const ADDONS_KEY = "va-booking-addons"; // add-on yang dipilih
const CREATED_KEY = "va-booking-created"; // booking yang sudah dibuat di server (menunggu bayar)

/* ---------- storage ---------- */
const readJson = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
};
const writeJson = (key, value) => {
  try {
    if (value === null || value === undefined) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* abaikan */
  }
};

/* ---------- tanggal & harga ---------- */
const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

const humanize = (s) =>
  String(s ?? "").replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

const ALIAS = { regular: "reguler", longweekend: "long_weekend", highseason: "high_season" };
const seasonKey = (s) => {
  const k = String(s ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  return ALIAS[k] ?? k;
};

const pad = (n) => String(n).padStart(2, "0");
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayTypeOf = (d) => ([5, 6, 0].includes(d.getDay()) ? "weekend" : "weekday");

const seasonFor = (iso, seasons) => {
  const hit = (seasons ?? []).find((s) => {
    const start = String(s?.start_date ?? "").slice(0, 10);
    const end = String(s?.end_date ?? "").slice(0, 10);
    return start && end && iso >= start && iso <= end && seasonKey(s.name) !== "reguler";
  });
  return hit ? seasonKey(hit.name) : "reguler";
};

const priceFor = (prices, season, dayType) =>
  prices.find((p) => seasonKey(p.season) === season && p.day_type === dayType) ??
  prices.find((p) => seasonKey(p.season) === season) ??
  prices.find((p) => seasonKey(p.season) === "reguler" && p.day_type === dayType) ??
  prices.find((p) => p.day_type === dayType) ??
  null;

/* ---------- page ---------- */
export default function BookingAddonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { get, post } = useFetch();
  const cancelBooking = useCancelBooking();

  // Pencarian baru dari halaman booking menggantikan sesi sebelumnya;
  // jika halaman di-refresh, data dipulihkan dari sessionStorage.
  const [draft] = useState(() => {
    if (location.state?.unit) {
      writeJson(DRAFT_KEY, location.state);
      writeJson(ADDONS_KEY, null);
      writeJson(CREATED_KEY, null);
      return location.state;
    }
    return readJson(DRAFT_KEY);
  });
  const [selectedAddons, setSelectedAddons] = useState(() => readJson(ADDONS_KEY) ?? {});
  const [created, setCreated] = useState(() => readJson(CREATED_KEY));
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");

  const unit = draft?.unit;
  const search = draft?.search;
  const locked = Boolean(created); // setelah booking dibuat, add-on tidak boleh diubah
  const nights = countNights(search?.startDate, search?.endDate); // 1 malam = 2 hari

  useEffect(() => {
    writeJson(ADDONS_KEY, selectedAddons);
  }, [selectedAddons]);

  // Muat Snap lebih awal supaya tombol bayar langsung responsif
  useEffect(() => {
    loadSnap().catch(() => {});
  }, []);

  const { data: addonData, isLoading, isError, error } = useQuery({
    queryKey: ["addons-checkout"],
    enabled: Boolean(draft),
    queryFn: async () => {
      const resp = await get("addons?unpage=true");
      if (!resp.status) throw new Error(errorText(resp.error));
      return resp.data;
    },
  });

  const { data: seasonData } = useQuery({
    queryKey: ["seasons-checkout"],
    enabled: Boolean(draft),
    retry: false,
    queryFn: async () => {
      const resp = await get("seasons?unpage=true");
      if (!resp.status) throw new Error(errorText(resp.error));
      return resp?.data?.data;
    },
  });

  const addons = useMemo(
    () => [...toArray(addonData)].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [addonData],
  );

  // Rincian harga sewa per malam
  const rent = useMemo(() => {
    if (!unit || !search) return { lines: [], total: 0, missing: 0 };
    const prices = Array.isArray(unit.prices) ? unit.prices : [];
    const groups = new Map();
    let missing = 0;

    // Tarif dihitung PER HARI: hari check-in sampai hari check-out (inklusif)
    for (const iso of eachDay(search.startDate, search.endDate)) {
      const d = new Date(`${iso}T00:00:00`);
      const season = seasonFor(iso, seasonData);
      const p = priceFor(prices, season, dayTypeOf(d));
      if (!p) {
        missing += 1;
        continue;
      }
      const label = `${humanize(seasonKey(p.season))}${p.day_type ? ` · ${humanize(p.day_type)}` : ""}`;
      const g = groups.get(`${p.id}`) ?? { label, unit: Number(p.price), qty: 0 };
      g.qty += 1;
      groups.set(`${p.id}`, g);
    }
    const lines = [...groups.values()].map((g) => ({ ...g, subtotal: g.unit * g.qty }));
    return { lines, total: lines.reduce((s, l) => s + l.subtotal, 0), missing };
  }, [unit, search, seasonData]);

  const changeQty = (id, delta) => {
    if (locked) return;
    setSelectedAddons((prev) => {
      const next = (prev[id] || 0) + delta;
      const updated = { ...prev };
      if (next <= 0) delete updated[id];
      else updated[id] = Math.min(next, 99);
      return updated;
    });
  };

  const chosenAddons = useMemo(
    () =>
      Object.entries(selectedAddons)
        .map(([id, quantity]) => {
          const addon = addons.find((a) => String(a.id) === String(id));
          return addon ? { ...addon, quantity, subtotal: Number(addon.price || 0) * quantity } : null;
        })
        .filter(Boolean),
    [selectedAddons, addons],
  );

  const addonTotal = chosenAddons.reduce((s, a) => s + a.subtotal, 0);
  const grandTotal = rent.total + addonTotal;

  const clearAll = ({ keepCreated = false } = {}) => {
    writeJson(DRAFT_KEY, null);
    writeJson(ADDONS_KEY, null);
    if (!keepCreated) writeJson(CREATED_KEY, null);
  };

  // Validasi sebelum mengirim; tidak ada nilai bawaan yang diam-diam menggantikan input pengguna
  const validate = () => {
    const reasonId = Number(search.purpose);
    const guests = Number(search.guestCount);
    if (!unit?.id) return "Tipe villa tidak valid. Ulangi pencarian.";
    if (!search.startDate || !search.endDate || !(nights > 0)) return "Tanggal menginap tidak valid.";
    if (!Number.isInteger(reasonId) || reasonId <= 0) return "Alasan menginap belum dipilih. Ubah pencarian Anda.";
    if (!Number.isInteger(guests) || guests < 1) return "Jumlah tamu minimal 1 orang.";
    return null;
  };

  const handlePay = async () => {
    setPayError("");
    const invalid = validate();
    if (invalid) {
      setPayError(invalid);
      toast.error(invalid);
      return;
    }

    setPaying(true);
    try {
      // Booking hanya dibuat SEKALI. Jika popup ditutup lalu klik bayar lagi,
      // token yang sama dipakai ulang (tidak membuat pesanan ganda).
      let booking = created;
      if (!booking?.snap_token) {
        const resp = await post(BOOKING_PATH, {
          rental_option_id: unit.id,
          check_in_date: search.startDate,
          check_out_date: search.endDate,
          reason_id: Number(search.purpose),
          guest_count: Number(search.guestCount),
          booking_addons: chosenAddons.map((a) => ({ addon_id: a.id, quantity: a.quantity })),
        });
        // console.log(resp)
        if (!resp.status) throw new Error(errorText(resp.error));

        booking = extractBooking(resp.data);
        if (!booking?.snap_token) throw new Error("Token pembayaran tidak diterima dari server.");

        setCreated(booking);
        writeJson(CREATED_KEY, booking);
      }

      const snap = await loadSnap();
      setPaying(false);

      const goTo = (path) => navigate(path, { state: { booking } });

      snap.pay(booking.snap_token, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil!");
          clearAll({ keepCreated: true });
          goTo("/booking/success");
        },
        onPending: () => {
          toast.info("Menunggu pembayaran selesai.");
          clearAll({ keepCreated: true });
          goTo("/booking/pending");
        },
        onError: () => {
          toast.error("Pembayaran gagal.");
          goTo("/booking/failed");
        },
        onClose: () => {
          toast.warning("Pembayaran belum selesai. Pesanan tersimpan; Anda bisa melanjutkan atau membatalkannya.");
        },
      });
    } catch (err) {
      setPaying(false);
      const message = errorText(err);
      setPayError(message);
      toast.error(message);
    }
  };

  // Batal: jika booking sudah dibuat (status pending), batalkan juga di server
  const handleCancel = async () => {
    if (created?.id) {
      try {
        await cancelBooking.mutateAsync(created);
      } catch {
        return; // pesan error sudah ditampilkan oleh hook
      }
    }
    clearAll();
    navigate("/booking");
  };

  if (!draft || !unit || !search) {
    return (
      <section className="va-paper va-state va-state--full">
        <h1 className="va-h2" style={{ fontSize: "2.4rem" }}>Data pemesanan tidak ditemukan</h1>
        <p className="va-text">Pilih tanggal dan tipe villa terlebih dahulu.</p>
        <Link to="/booking" className="va-btn" style={{ marginTop: "1rem" }}>
          <ArrowLeft size={16} /> Kembali ke booking
        </Link>
      </section>
    );
  }

  if (isLoading) return <SectionState tone="paper" full label="Memuat add-on…" />;
  if (isError) return <SectionState tone="paper" full label="Add-on gagal dimuat" error={errorText(error)} />;

  const busy = paying || cancelBooking.isPending;

  return (
    <>
      <header className="va-ink va-page-hero">
        <div className="va-wrap">
          <Link to="/booking" className="va-link" style={{ marginBottom: "2rem" }}>
            <ArrowLeft size={16} /> Ubah pencarian
          </Link>
          <div className="va-page-hero__inner">
            <div>
              <span className="va-eyebrow">Langkah 2 dari 2</span>
              <h1 className="va-page-hero__title">Tambah add-on</h1>
            </div>
            <p className="va-lead">
              Lengkapi kebutuhan menginap Anda dengan add-on pilihan beserta jumlahnya.
            </p>
          </div>
        </div>
      </header>

      <section className="va-paper va-section">
        <div className="va-wrap va-co">
          {/* Kiri: daftar add-on */}
          <div>
            <div className="va-co__head">
              <h2 className="va-h3">Pilih add-on</h2>
              <span className="va-text">{Object.keys(selectedAddons).length} jenis dipilih</span>
            </div>

            {locked && (
              <div className="va-alert" role="status" style={{ marginBottom: "1.25rem" }}>
                <AlertCircle size={16} />
                <span>Pesanan sudah dibuat dan menunggu pembayaran, jadi add-on dikunci. Batalkan pesanan untuk mengubahnya.</span>
              </div>
            )}

            {addons.length === 0 ? (
              <div className="va-empty">
                <strong>Belum ada add-on</strong>
                <p className="va-text">Anda dapat langsung melanjutkan pembayaran.</p>
              </div>
            ) : (
              <div className="va-co__list">
                {addons.map((a) => {
                  const qty = selectedAddons[a.id] || 0;
                  return (
                    <div key={a.id} className="va-addon-card" data-active={qty > 0}>
                      <div className="va-addon-card__main">
                        {a.subtitle && <span className="va-label">{a.subtitle}</span>}
                        <h3 className="va-h3">{a.title}</h3>
                        {a.description && <p className="va-text">{a.description}</p>}
                        {Array.isArray(a.lists) && a.lists.length > 0 && (
                          <ul className="va-checks" style={{ marginTop: "0.25rem" }}>
                            {a.lists.map((l) => (
                              <li key={l.id}><Check size={16} strokeWidth={2} />{l.text}</li>
                            ))}
                          </ul>
                        )}
                        <div style={{ marginTop: "0.5rem" }}>
                          <span className="va-price">{formatRupiah(a.price)}</span>
                          <span className="va-price-note">per item</span>
                        </div>
                      </div>

                      <div className="va-qty">
                        <button type="button" onClick={() => changeQty(a.id, -1)} disabled={locked || qty === 0} aria-label={`Kurangi ${a.title}`}>
                          <Minus size={16} />
                        </button>
                        <span aria-live="polite">{qty}</span>
                        <button type="button" onClick={() => changeQty(a.id, 1)} disabled={locked} aria-label={`Tambah ${a.title}`}>
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kanan: ringkasan */}
          <aside className="va-co__summary" aria-label="Ringkasan pesanan">
            <h2 className="va-h3">Ringkasan pesanan</h2>

            <dl className="va-sum">
              <div><dt>Tipe sewa</dt><dd>{unit.title}</dd></div>
              <div><dt>Check-in</dt><dd>{formatDate(search.startDate)}</dd></div>
              <div><dt>Check-out</dt><dd>{formatDate(search.endDate)}</dd></div>
              <div><dt>Durasi</dt><dd>{stayLabel(nights)}</dd></div>
              <div><dt>Estimasi tamu</dt><dd>{Number(search.guestCount) > 0 ? `${search.guestCount} orang` : "-"}</dd></div>
            </dl>

            <div className="va-sum__block">
              <span className="va-label">Rincian harga</span>
              <dl className="va-sum">
                {rent.lines.map((l) => (
                  <div key={l.label}>
                    <dt>Sewa · {l.label}<small>{l.qty} hari × {formatRupiah(l.unit)}</small></dt>
                    <dd>{formatRupiah(l.subtotal)}</dd>
                  </div>
                ))}
                {chosenAddons.map((a) => (
                  <div key={a.id}>
                    <dt>Add-on · {a.title}<small>{a.quantity} × {formatRupiah(a.price)}</small></dt>
                    <dd>{formatRupiah(a.subtotal)}</dd>
                  </div>
                ))}
              </dl>
              <p className="va-note" style={{ margin: 0 }}>Tarif dihitung per hari, termasuk hari check-in dan hari check-out.</p>
            </div>

            {rent.missing > 0 && (
              <div className="va-alert" role="alert">
                <AlertCircle size={16} />
                <span>Harga untuk {rent.missing} hari belum diatur. Hubungi admin sebelum membayar.</span>
              </div>
            )}
            {payError && (
              <div className="va-alert" role="alert">
                <AlertCircle size={16} />
                <span>{payError}</span>
              </div>
            )}

            <div className="va-sum__total">
              <span>Total</span>
              <strong className="va-price">{formatRupiah(grandTotal)}</strong>
            </div>
            <p className="va-note" style={{ margin: 0 }}>Total akhir dihitung ulang oleh server saat pesanan dibuat.</p>

            <div className="va-co__actions">
              <button
                type="button"
                className="va-btn va-btn--block"
                style={{ padding: "1.05rem" }}
                disabled={busy || rent.missing > 0 || rent.total <= 0}
                onClick={handlePay}
              >
                {paying ? (<><Loader2 size={16} className="va-spin" /> Memproses…</>) : created ? "Lanjutkan pembayaran" : "Bayar sekarang"}
              </button>
              <button type="button" className="va-btn va-btn--ghost va-btn--block" disabled={busy} onClick={handleCancel}>
                {cancelBooking.isPending ? "Membatalkan…" : created ? "Batalkan pesanan" : "Batal"}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}