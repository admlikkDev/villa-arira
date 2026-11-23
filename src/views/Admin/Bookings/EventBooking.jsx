import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  LogIn,
  Loader2,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import useFetch from "../../../hooks/useFetch";
import { formatRupiah } from "../../../hooks/Usevillaquery";
import Pagination from "../../../components/Pagination";
import "../../../assets/styles/villa.css";

const PAGE_SIZE = 8;

const STATUS_BADGE = {
  pending: { label: "Pending", bg: "rgba(245, 158, 11, 0.12)", color: "#d97706" },
  paid: { label: "Paid", bg: "rgba(16, 185, 129, 0.12)", color: "#059669" },
  checked_in: { label: "Checked In", bg: "rgba(59, 130, 246, 0.12)", color: "#2563eb" },
  completed: { label: "Completed", bg: "rgba(107, 114, 128, 0.12)", color: "#4b5563" },
  cancelled: { label: "Cancelled", bg: "rgba(239, 68, 68, 0.12)", color: "#dc2626" },
};

const fmtDateTime = (dt) => {
  if (!dt) return "-";
  return new Date(dt).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function EventBookingIndex() {
  const { get, put } = useFetch();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State konfirmasi aksi (check-in / complete / cancel)
  const [confirmAction, setConfirmAction] = useState(null); // { id, action: 'check-in' | 'complete' | 'cancel', title }

  // 1. Fetch Event Bookings
  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-event-bookings", page, PAGE_SIZE, statusFilter, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(PAGE_SIZE),
        sort: "desc",
      });
      if (statusFilter) params.append("status", statusFilter);
      if (typeFilter) params.append("type", typeFilter);

      const resp = await get(`event-bookings?${params.toString()}`);
      if (!resp.status) {
        throw new Error(typeof resp.error === "string" ? resp.error : "Gagal memuat event bookings");
      }
      return resp.data;
    },
    staleTime: 30 * 1000,
  });

  const bookings = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];

  const totalPages =
    rawData?.pagination?.total_pages ||
    Math.ceil((rawData?.pagination?.total_items || bookings.length) / PAGE_SIZE) ||
    1;

  // Filter pencarian lokal (nama tamu / nama paket / kode booking)
  const filtered = bookings.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const pkgTitle = item?.villa_package?.title || item?.package_title || "";
    const userName = item?.user?.name || item?.user_name || "";
    const code = item?.booking_code || String(item?.id || "");
    return (
      pkgTitle.toLowerCase().includes(q) ||
      userName.toLowerCase().includes(q) ||
      code.toLowerCase().includes(q)
    );
  });

  // 2. Mutasi Aksi Booking (Check In / Complete / Cancel)
  const actionMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      // Endpoint sesuai koleksi Postman: event-bookings/:id/check-in | complete | cancel
      const resp = await put(`event-bookings/${id}/${action}`, {});
      if (!resp.status) {
        throw new Error(typeof resp.error === "string" ? resp.error : `Gagal memproses ${action}`);
      }
      return resp.data;
    },
    onSuccess: (_, variables) => {
      const msgMap = {
        "check-in": "Tamu event berhasil Check-In!",
        complete: "Event booking ditandai selesai!",
        cancel: "Event booking berhasil dibatalkan.",
      };
      toast.success(msgMap[variables.action] || "Status diperbarui!");
      queryClient.invalidateQueries({ queryKey: ["admin-event-bookings"] });
      setConfirmAction(null);
    },
    onError: (err) => {
      toast.error(err.message || "Terjadi kesalahan.");
      setConfirmAction(null);
    },
  });

  return (
    <div>
      <header className="va-adm-head">
        <div>
          <h2 className="va-adm-title">Manajemen Event Booking</h2>
          <p className="va-text">
            Kelola jadwal acara, status pembayaran, check-in, dan penyelesaian event reguler.{" "}
            {!isLoading && !isError && (
              <span className="va-adm-count">
                · {rawData?.pagination?.total_items ?? bookings.length} data
              </span>
            )}
          </p>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div className="va-field">
          <label className="va-label" htmlFor="eb-search">Cari Booking / Tamu</label>
          <div style={{ position: "relative" }}>
            <input
              id="eb-search"
              className="va-input"
              placeholder="Nama tamu, paket, atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              size={16}
              style={{
                position: "absolute",
                right: "0.8rem",
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.5,
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        <div className="va-field">
          <label className="va-label" htmlFor="eb-status">Filter Status</label>
          <select
            id="eb-status"
            className="va-input"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="checked_in">Checked In</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="va-field">
          <label className="va-label" htmlFor="eb-type">Tipe Tarif</label>
          <select
            id="eb-type"
            className="va-input"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Tipe</option>
            <option value="per_hour">Per Jam (per_hour)</option>
            <option value="one_time">Sekali Acara (one_time)</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {isError ? (
        <div className="va-alert" role="alert">
          <AlertCircle size={16} />
          <span>Gagal memuat data: {error?.message}</span>
        </div>
      ) : isLoading ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="va-skel" style={{ height: "5.5rem" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="va-empty">
          <strong>Tidak ada Event Booking</strong>
          <p className="va-text">Belum ada data pemesanan event yang sesuai dengan filter saat ini.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: "1rem" }}>
            {filtered.map((item) => {
              const statusKey = String(item.status || "pending").toLowerCase();
              const badge = STATUS_BADGE[statusKey] || STATUS_BADGE.pending;
              const pkg = item.villa_package || {};
              const user = item.user || {};

              return (
                <div
                  key={item.id}
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--border, rgba(0,0,0,0.1))",
                    padding: "1.25rem",
                    display: "grid",
                    gap: "1rem",
                  }}
                >
                  {/* Baris Atas: Info Utama & Status */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--muted)" }}>
                          #{item.booking_code || item.id}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.55rem",
                            background: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg)" }}>
                        {pkg.title || item.package_title || "Paket Event"}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                        Pemesan: <strong style={{ color: "var(--fg)" }}>{user.name || item.user_name || "Tamu"}</strong>
                        {user.email ? ` (${user.email})` : ""}
                      </p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg)", display: "block" }}>
                        {formatRupiah(item.total_price ?? pkg.price ?? 0)}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                        {pkg.type === "per_hour" ? "Tarif Per Jam" : "Sekali Acara"}
                      </span>
                    </div>
                  </div>

                  {/* Baris Tengah: Jadwal & Kapasitas */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1.5rem",
                      padding: "0.75rem",
                      background: "var(--bg)",
                      border: "1px solid var(--border, rgba(0,0,0,0.06))",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Calendar size={15} />
                      Mulai: <strong>{fmtDateTime(item.start_at)}</strong>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Clock size={15} />
                      Selesai: <strong>{fmtDateTime(item.end_at)}</strong>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Users size={15} />
                      Tamu: <strong>{item.guest_count} orang</strong>
                    </span>
                  </div>

                  {/* Baris Bawah: Tombol Aksi Admin */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                      borderTop: "1px solid var(--border, rgba(0,0,0,0.06))",
                      paddingTop: "0.75rem",
                    }}
                  >
                    {statusKey === "paid" && (
                      <button
                        type="button"
                        className="va-btn va-btn--sm"
                        onClick={() =>
                          setConfirmAction({
                            id: item.id,
                            action: "check-in",
                            title: pkg.title || `Booking #${item.id}`,
                          })
                        }
                      >
                        <LogIn size={14} /> Check-In Event
                      </button>
                    )}

                    {statusKey === "checked_in" && (
                      <button
                        type="button"
                        className="va-btn va-btn--sm"
                        onClick={() =>
                          setConfirmAction({
                            id: item.id,
                            action: "complete",
                            title: pkg.title || `Booking #${item.id}`,
                          })
                        }
                      >
                        <CheckCircle2 size={14} /> Selesaikan Event
                      </button>
                    )}

                    {(statusKey === "pending" || statusKey === "paid") && (
                      <button
                        type="button"
                        className="va-btn va-btn--ghost va-btn--sm"
                        style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
                        onClick={() =>
                          setConfirmAction({
                            id: item.id,
                            action: "cancel",
                            title: pkg.title || `Booking #${item.id}`,
                          })
                        }
                      >
                        <XCircle size={14} /> Batalkan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
            <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
          </div>
        </>
      )}

      {/* Modal Konfirmasi Aksi */}
      {confirmAction && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
            padding: "1rem",
          }}
        >
          <div
            className="va-paper"
            style={{
              maxWidth: "420px",
              width: "100%",
              padding: "1.5rem",
              background: "var(--paper)",
              border: "1px solid var(--fg)",
            }}
          >
            <h3 className="va-h3" style={{ marginBottom: "0.5rem" }}>
              Konfirmasi {confirmAction.action === "check-in" ? "Check-In" : confirmAction.action === "complete" ? "Penyelesaian" : "Pembatalan"}
            </h3>
            <p className="va-text" style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Apakah Anda yakin ingin memproses <strong>{confirmAction.action}</strong> untuk{" "}
              <strong>{confirmAction.title}</strong>?
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
              <button
                type="button"
                className="va-btn va-btn--ghost"
                disabled={actionMutation.isPending}
                onClick={() => setConfirmAction(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="va-btn"
                style={confirmAction.action === "cancel" ? { background: "#ef4444", color: "#fff" } : {}}
                disabled={actionMutation.isPending}
                onClick={() => actionMutation.mutate(confirmAction)}
              >
                {actionMutation.isPending ? <Loader2 className="va-spin" size={16} /> : "Ya, Lanjutkan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}