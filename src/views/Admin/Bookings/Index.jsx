import { useMemo, useState } from "react";
import { AlertCircle, Ban, Eye, Loader2, LogIn, LogOut, RefreshCw, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import Pagination from "../../../components/Pagination";
import { formatRupiah } from "../../../hooks/Usevillaquery";
import {
  ADMIN_BOOKING_PATH,
  STATUS_LABEL as BASE_STATUS_LABEL,
  bookingFields,
  canCancel,
  canCheckIn,
  canComplete,
  useAdminBookings,
  useCancelBooking,
  useCheckInBooking,
  useCompleteBooking,
} from "../../../hooks/useBooking";
import "../../../assets/styles/villa.css";
import "../../../assets/styles/booking.css";

const PAGE_SIZE = 10;

// Tambahkan label terjemahan untuk status baru seperti partially_paid
const STATUS_LABEL = {
  ...BASE_STATUS_LABEL,
  partially_paid: "Sebagian (DP)",
  pending: "Menunggu bayar",
  paid: "Lunas",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

const TABS = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu bayar" },
  { key: "partially_paid", label: "Sebagian (DP)" },
  { key: "paid", label: "Lunas" },
  { key: "completed", label: "Selesai" },
  { key: "cancelled", label: "Dibatalkan" },
];

const ACTIONS = {
  checkIn: {
    label: "Check-in",
    icon: LogIn,
    can: canCheckIn,
    title: "Check-in tamu?",
    text: "Catat bahwa tamu sudah tiba dan check-in di villa.",
  },
  complete: {
    label: "Check-out",
    icon: LogOut,
    can: canComplete,
    title: "Check-out tamu?",
    text: "Catat bahwa tamu sudah check-out dan selesaikan pemesanan ini.",
  },
  cancel: {
    label: "Batalkan",
    icon: Ban,
    can: canCancel,
    title: "Batalkan pemesanan?",
    text: "Pemesanan yang masih menunggu pembayaran akan dibatalkan dan tanggalnya dibuka kembali.",
  },
};

const formatDate = (iso) =>
  iso ? new Date(`${String(iso).slice(0, 10)}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";

const formatDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

function StatusBadge({ status }) {
  const label = STATUS_LABEL[status] ?? humanize(status) ?? "-";
  return (
    <span className="va-status" data-status={status}>
      {label}
    </span>
  );
}

const humanize = (s) =>
  String(s ?? "").replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

export default function AdminBookingsIndex() {
  const { data: bookings = [], isLoading, isError, error, isFetching, refetch } = useAdminBookings();

  const mutations = {
    cancel: useCancelBooking(ADMIN_BOOKING_PATH),
    checkIn: useCheckInBooking(ADMIN_BOOKING_PATH),
    complete: useCompleteBooking(ADMIN_BOOKING_PATH),
  };
  const busy = Object.values(mutations).some((m) => m.isPending);

  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const rows = useMemo(() => bookings.map((raw) => ({ raw, f: bookingFields(raw) })), [bookings]);

  const counts = useMemo(
    () =>
      rows.reduce(
        (acc, { f }) => {
          acc.all += 1;
          acc[f.status] = (acc[f.status] ?? 0) + 1;
          return acc;
        },
        { all: 0 },
      ),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(({ f }) => {
      if (tab !== "all" && f.status !== tab) return false;
      if (!q) return true;
      return [f.code, f.customerName, f.customerEmail, f.customerPhone, f.rentalTitle]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [rows, tab, query]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const detail = detailId ? rows.find(({ raw }) => raw.id === detailId) : null;

  const runConfirmed = () => {
    if (!confirm) return;
    mutations[confirm.action].mutate(confirm.booking, { onSettled: () => setConfirm(null) });
  };

  const renderActions = (raw) =>
    Object.entries(ACTIONS).map(([key, action]) => {
      if (!action.can(raw)) return null;
      if(raw?.check_in_at == null && action.label == "Check-out") return
      const Icon = action.icon;
      return (
        <button
          key={key}
          type="button"
          className="va-icon-btn va-icon-btn--sm"
          title={action.label}
          aria-label={action.label}
          disabled={busy}
          onClick={() => setConfirm({ action: key, booking: raw })}
        >
          <Icon size={15} />
        </button>
      );
    });

  return (
    <div>
      <header className="va-adm-head">
        <div>
          <h2 className="va-adm-title">Manajemen booking</h2>
          <p className="va-text">
            Pantau semua pemesanan, lalu atur check-in, check-out, atau pembatalan.
            {!isLoading && !isError && <span className="va-adm-count"> · {counts.all} booking</span>}
          </p>
        </div>
        <div className="va-adm-actions">
          <button type="button" className="va-btn va-btn--ghost va-btn--sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw size={15} className={isFetching ? "va-spin" : ""} /> Muat ulang
          </button>
        </div>
      </header>

      <div className="va-tabs" role="tablist" aria-label="Filter status" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            className="va-tab"
            onClick={() => { setTab(t.key); setPage(1); }}
          >
            {t.label} <span className="va-muted">({counts[t.key] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="va-field" style={{ maxWidth: "26rem", marginBottom: "1.5rem" }}>
        <label className="va-label" htmlFor="bk-search">Cari booking</label>
        <div className="va-input-wrap" style={{ position: "relative" }}>
          <input
            id="bk-search"
            className="va-input"
            placeholder="Kode, nama tamu, kontak, atau tipe sewa"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          />
          <span style={{ position: "absolute", right: "0.8rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "grid" }}>
            <Search size={16} />
          </span>
        </div>
      </div>

      {isError ? (
        <div className="va-alert" role="alert">
          <AlertCircle size={16} />
          <span>Gagal memuat booking: {error.message}</span>
        </div>
      ) : isLoading ? (
        <div style={{ display: "grid", gap: "1px" }}>
          {[...Array(6)].map((_, i) => <div key={i} className="va-skel" style={{ height: "3.5rem" }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="va-empty">
          <strong>Tidak ada booking</strong>
          <p className="va-text">{query || tab !== "all" ? "Coba ubah filter atau kata kunci pencarian." : "Booking akan tampil di sini setelah ada pemesanan."}</p>
        </div>
      ) : (
        <div className="va-adm-tablewrap">
          <table className="va-adm-table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Tamu</th>
                <th>Tipe sewa</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th className="is-right" style={{ width: "11rem", textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(({ raw, f }) => (
                <tr key={raw.id}>
                  <td>
                    <strong>{f.code}</strong>
                    <div className="va-muted" style={{ fontSize: "0.78rem" }}>{formatDate(f.createdAt)}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{f.customerName}</div>
                    <div className="va-muted" style={{ fontSize: "0.78rem" }}>
                      {f.customerPhone ?? f.customerEmail ?? "-"}{f.guests ? ` · ${f.guests} tamu` : ""}
                    </div>
                  </td>
                  <td>{f.rentalTitle}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatDate(f.checkIn)} – {formatDate(f.checkOut)}
                    <div className="va-muted" style={{ fontSize: "0.78rem" }}>{f.stay}</div>
                  </td>
                  <td><span className="va-adm-price">{f.total ? formatRupiah(f.total) : "-"}</span></td>
                  <td><StatusBadge status={f.status} /></td>
                  <td>
                    <div className="va-adm-actions" style={{ justifyContent: "flex-end" }}>
                      <button type="button" className="va-icon-btn va-icon-btn--sm" title="Detail" aria-label="Detail" onClick={() => setDetailId(raw.id)}>
                        <Eye size={15} />
                      </button>
                      {renderActions(raw)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />

      {/* Detail booking yang diperbaiki tata letaknya agar rapi */}
      <Dialog open={Boolean(detail)} onOpenChange={(open) => !open && setDetailId(null)}>
        <DialogContent className="va-paper va-modal" style={{ maxWidth: "500px", width: "90vw", maxHeight: "85vh", overflowY: "auto" }}>
          {detail && (
            <>
              <DialogHeader className="va-modal__head">
                <DialogTitle className="va-modal__title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{detail.f.code}</span>
                  <StatusBadge status={detail.f.status} />
                </DialogTitle>
                <DialogDescription className="va-modal__desc">
                  Detail informasi pemesanan tamu
                </DialogDescription>
              </DialogHeader>

              <div className="va-modal__body" style={{ display: "grid", gap: "1rem", padding: "1rem 0" }}>
                <div style={{ background: "rgba(0,0,0,0.03)", padding: "1rem", borderRadius: "8px", display: "grid", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Tamu:</span> <strong>{detail.f.customerName}</strong></div>
                  {detail.f.customerPhone && <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Telepon:</span> <span>{detail.f.customerPhone}</span></div>}
                  {detail.f.customerEmail && <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Email:</span> <span>{detail.f.customerEmail}</span></div>}
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Tipe sewa:</span> <span>{detail.f.rentalTitle}</span></div>
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Check-in:</span> <span>{formatDate(detail.f.checkIn)}</span></div>
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Check-out:</span> <span>{formatDate(detail.f.checkOut)}</span></div>
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Durasi:</span> <span>{detail.f.stay}</span></div>
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Jumlah tamu:</span> <span>{detail.f.guests ? `${detail.f.guests} orang` : "-"}</span></div>
                  {detail.f.reason && <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Keperluan:</span> <span>{detail.f.reason}</span></div>}
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Check-in aktual:</span> <span>{formatDateTime(detail.f.checkedInAt)}</span></div>
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Check-out aktual:</span> <span>{formatDateTime(detail.f.checkedOutAt)}</span></div>
                  <div style={{ display: "flex", justifyContent: "between" }}><span className="va-muted">Dipesan pada:</span> <span>{formatDateTime(detail.f.createdAt)}</span></div>
                  <div style={{ display: "flex", justifyContent: "between", borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
                    <span style={{ fontWeight: 600 }}>Total Harga:</span> 
                    <strong className="va-adm-price" style={{ fontSize: "1.1rem" }}>{detail.f.total ? formatRupiah(detail.f.total) : "-"}</strong>
                  </div>
                </div>

                {detail.f.addons.length > 0 && (
                  <div>
                    <span className="va-label" style={{ marginBottom: "0.5rem", display: "block" }}>Add-on Pilihan</span>
                    <ul className="va-checks" style={{ display: "grid", gap: "0.35rem" }}>
                      {detail.f.addons.map((a, i) => (
                        <li key={a.id ?? i} style={{ background: "rgba(0,0,0,0.02)", padding: "0.5rem 0.75rem", borderRadius: "6px", display: "flex", justifyContent: "space-between" }}>
                          <span>{a.addon?.title ?? a.title ?? `Add-on #${a.addon_id ?? a.id}`}</span>
                          <strong>× {a.quantity ?? 1}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <DialogFooter className="va-modal__foot" style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                <button type="button" className="va-btn va-btn--ghost" onClick={() => setDetailId(null)}>Tutup</button>
                {Object.entries(ACTIONS).map(([key, action]) => {
                  if (!action.can(detail.raw)) return null;
                  const Icon = action.icon;
                  return (
                    <button key={key} type="button" className="va-btn" disabled={busy} onClick={() => setConfirm({ action: key, booking: detail.raw })}>
                      <Icon size={16} /> {action.label}
                    </button>
                  );
                })}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Konfirmasi aksi */}
      <Dialog open={Boolean(confirm)} onOpenChange={(open) => !open && !busy && setConfirm(null)}>
        <DialogContent className="va-paper va-modal va-modal--sm">
          {confirm && (
            <>
              <DialogHeader className="va-modal__head">
                <DialogTitle className="va-modal__title">{ACTIONS[confirm.action].title}</DialogTitle>
                <DialogDescription className="va-modal__desc">
                  {bookingFields(confirm.booking).code} · {bookingFields(confirm.booking).customerName}. {ACTIONS[confirm.action].text}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="va-modal__foot">
                <button type="button" className="va-btn va-btn--ghost" disabled={busy} onClick={() => setConfirm(null)}>Kembali</button>
                <button type="button" className="va-btn" disabled={busy} onClick={runConfirmed}>
                  {busy ? <Loader2 size={16} className="va-spin" /> : null} Ya, {ACTIONS[confirm.action].label.toLowerCase()}
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}