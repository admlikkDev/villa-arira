import { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Check,
  X,
  Loader2,
  AlertCircle,
  Search,
  Wallet,
  Sparkles,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import useFetch from "../../../hooks/useFetch";
import { formatRupiah } from "../../../hooks/Usevillaquery";
import Pagination from "../../../components/Pagination";
import "../../../assets/styles/villa.css";

const PAGE_SIZE = 8;

const REQUEST_STATUS = {
  pending: { label: "Menunggu Review", bg: "rgba(245, 158, 11, 0.12)", color: "#d97706" },
  approved: { label: "Disetujui", bg: "rgba(16, 185, 129, 0.12)", color: "#059669" },
  rejected: { label: "Ditolak", bg: "rgba(239, 68, 68, 0.12)", color: "#dc2626" },
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

export default function EventRequestIndex() {
  const { get, put } = useFetch();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // State modal approve / reject
  const [decisionModal, setDecisionModal] = useState(null); // { item, decision: 'approve' | 'reject', isCustom: boolean }
  const [rejectReason, setRejectReason] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  // 1. Fetch Event Booking Requests
  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-event-requests", page, PAGE_SIZE, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(PAGE_SIZE),
        sort: "desc",
      });
      if (statusFilter) params.append("status", statusFilter);

      const resp = await get(`event-requests?${params.toString()}`);
      if (!resp.status) {
        throw new Error(typeof resp.error === "string" ? resp.error : "Gagal memuat event requests");
      }
      return resp.data;
    },
    staleTime: 30 * 1000,
  });

  const requests = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];

  const totalPages =
    rawData?.pagination?.total_pages ||
    Math.ceil((rawData?.pagination?.total_items || requests.length) / PAGE_SIZE) ||
    1;

  // Filter pencarian lokal
  const filtered = requests.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const title = item?.title || "";
    const userName = item?.user?.name || item?.user_name || "";
    const pkgTitle = item?.villa_package?.title || "";
    return (
      title.toLowerCase().includes(q) ||
      userName.toLowerCase().includes(q) ||
      pkgTitle.toLowerCase().includes(q)
    );
  });

  // 2. Mutasi Approve / Reject Event Request
  const decisionMutation = useMutation({
    mutationFn: async ({ id, decision, payload }) => {
      const resp = await put(`event-requests/${id}/${decision}`, payload);
      if (!resp.status) {
        throw new Error(typeof resp.error === "string" ? resp.error : `Gagal memproses ${decision}`);
      }
      return resp.data;
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.decision === "approve"
          ? "Permintaan event berhasil disetujui!"
          : "Permintaan event telah ditolak.",
      );
      queryClient.invalidateQueries({ queryKey: ["admin-event-requests"] });
      closeDecisionModal();
    },
    onError: (err) => {
      toast.error(err.message || "Gagal memproses permintaan.");
    },
  });

  const openDecisionModal = (item, decision) => {
    const isCustom = !item.villa_package_id && !item.villa_package;
    setDecisionModal({ item, decision, isCustom });
    setRejectReason("");
    setFinalPrice(isCustom ? (item.budget ?? "") : "");
  };

  const closeDecisionModal = () => {
    setDecisionModal(null);
    setRejectReason("");
    setFinalPrice("");
  };

  const handleConfirmDecision = (e) => {
    e.preventDefault();
    if (!decisionModal) return;

    const { item, decision, isCustom } = decisionModal;
    let payload = {};

    if (decision === "approve") {
      if (isCustom) {
        // Custom event wajib menyertakan price
        if (!finalPrice || Number(finalPrice) <= 0) {
          toast.error("Masukkan harga penawaran (price) untuk custom event.");
          return;
        }
        payload = { price: Number(finalPrice) };
      } else {
        // Bukan custom event mengirimkan object kosong {}
        payload = {};
      }
    } else if (decision === "reject") {
      if (!rejectReason.trim()) {
        toast.error("Alasan penolakan (reject_reason) wajib diisi.");
        return;
      }
      payload = { reject_reason: rejectReason.trim() };
    }

    decisionMutation.mutate({ id: item.id, decision, payload });
  };

  return (
    <div>
      <header className="va-adm-head">
        <div>
          <h2 className="va-adm-title">Manajemen Event Request</h2>
          <p className="va-text">
            Tinjau, setujui, atau tolak pengajuan acara custom dan permintaan khusus paket event.{" "}
            {!isLoading && !isError && (
              <span className="va-adm-count">
                · {rawData?.pagination?.total_items ?? requests.length} pengajuan
              </span>
            )}
          </p>
        </div>
      </header>

      {/* Filter & Search Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1.5rem",
          maxWidth: "42rem",
        }}
      >
        <div className="va-field">
          <label className="va-label" htmlFor="er-search">Cari Pengajuan</label>
          <div style={{ position: "relative" }}>
            <input
              id="er-search"
              className="va-input"
              placeholder="Judul acara, pemesan, atau paket..."
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
          <label className="va-label" htmlFor="er-status">Filter Status</label>
          <select
            id="er-status"
            className="va-input"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending (Menunggu Review)</option>
            <option value="approved">Approved (Disetujui)</option>
            <option value="rejected">Rejected (Ditolak)</option>
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
            <div key={i} className="va-skel" style={{ height: "6rem" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="va-empty">
          <strong>Belum ada Event Request</strong>
          <p className="va-text">Tidak ada pengajuan acara yang sesuai dengan filter saat ini.</p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: "1rem" }}>
            {filtered.map((item) => {
              const statusKey = String(item.status || "pending").toLowerCase();
              const badge = REQUEST_STATUS[statusKey] || REQUEST_STATUS.pending;
              const isCustom = !item.villa_package_id && !item.villa_package;
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
                  {/* Header Card */}
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
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "0.75rem", fontFamily: "monospace", color: "var(--muted)" }}>
                          #{item.id}
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
                        <span
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            padding: "0.15rem 0.55rem",
                            border: "1px solid var(--line)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                          }}
                        >
                          {isCustom ? (
                            <>
                              <Sparkles size={12} /> Custom Event
                            </>
                          ) : (
                            <>
                              <Package size={12} /> Paket: {item.villa_package?.title || `#${item.villa_package_id}`}
                            </>
                          )}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--fg)" }}>
                        {item.title || "Pengajuan Acara"}
                      </h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: "0.15rem" }}>
                        Pemohon: <strong style={{ color: "var(--fg)" }}>{user.name || item.user_name || "Tamu"}</strong>
                        {user.phone ? ` (${user.phone})` : ""}
                      </p>
                    </div>

                    {/* Info Budget / Harga */}
                    <div style={{ textAlign: "right" }}>
                      {isCustom ? (
                        <>
                          <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block" }}>
                            {item.price ? "Harga Disetujui" : "Budget Diajukan"}
                          </span>
                          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg)" }}>
                            {item.price
                              ? formatRupiah(item.price)
                              : item.budget
                                ? formatRupiah(item.budget)
                                : "-"}
                          </span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: "0.75rem", color: "var(--muted)", display: "block" }}>
                            Tarif Dasar Paket
                          </span>
                          <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--fg)" }}>
                            {item.villa_package?.price ? formatRupiah(item.villa_package.price) : "-"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Deskripsi Kebutuhan */}
                  {item.description && (
                    <div
                      style={{
                        padding: "0.75rem 1rem",
                        background: "var(--bg)",
                        borderLeft: "2px solid var(--fg)",
                        fontSize: "0.88rem",
                        color: "var(--fg)",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {item.description}
                    </div>
                  )}

                  {/* Alasan Penolakan jika status rejected */}
                  {statusKey === "rejected" && item.reject_reason && (
                    <div
                      style={{
                        padding: "0.65rem 0.9rem",
                        background: "rgba(239, 68, 68, 0.08)",
                        borderLeft: "2px solid #dc2626",
                        fontSize: "0.85rem",
                        color: "#dc2626",
                      }}
                    >
                      <strong>Alasan Penolakan:</strong> {item.reject_reason}
                    </div>
                  )}

                  {/* Metadata Tanggal & Tamu */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "1.5rem",
                      fontSize: "0.85rem",
                      color: "var(--muted)",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Calendar size={15} />
                      Mulai: <strong style={{ color: "var(--fg)" }}>{fmtDateTime(item.start_at)}</strong>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Clock size={15} />
                      Selesai: <strong style={{ color: "var(--fg)" }}>{fmtDateTime(item.end_at)}</strong>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Users size={15} />
                      Tamu: <strong style={{ color: "var(--fg)" }}>{item.guest_count} orang</strong>
                    </span>
                  </div>

                  {/* Tombol Aksi Approve / Reject (Hanya jika masih pending) */}
                  {statusKey === "pending" && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "0.5rem",
                        borderTop: "1px solid var(--border, rgba(0,0,0,0.06))",
                        paddingTop: "0.75rem",
                      }}
                    >
                      <button
                        type="button"
                        className="va-btn va-btn--ghost va-btn--sm"
                        style={{ color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
                        onClick={() => openDecisionModal(item, "reject")}
                      >
                        <X size={15} /> Tolak Pengajuan
                      </button>
                      <button
                        type="button"
                        className="va-btn va-btn--sm"
                        onClick={() => openDecisionModal(item, "approve")}
                      >
                        <Check size={15} /> Setujui Pengajuan
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
            <Pagination page={page} totalPages={totalPages} onChange={(p) => setPage(p)} />
          </div>
        </>
      )}

      {/* Modal Approve / Reject */}
      {decisionModal && (
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
              maxWidth: "460px",
              width: "100%",
              padding: "1.5rem",
              background: "var(--paper)",
              border: "1px solid var(--fg)",
            }}
          >
            <h3 className="va-h3" style={{ marginBottom: "0.4rem" }}>
              {decisionModal.decision === "approve" ? "Setujui Pengajuan Event" : "Tolak Pengajuan Event"}
            </h3>
            <p className="va-text" style={{ marginBottom: "1.25rem", fontSize: "0.9rem" }}>
              Acara: <strong>{decisionModal.item.title}</strong>
            </p>

            <form onSubmit={handleConfirmDecision} style={{ display: "grid", gap: "1rem" }}>
              {/* Input Price HANYA muncul jika Approve & Custom Event */}
              {decisionModal.decision === "approve" && decisionModal.isCustom && (
                <div className="va-field">
                  <label className="va-label" htmlFor="er-final-price">
                    <Wallet size={13} style={{ display: "inline", marginRight: "0.3rem" }} />
                    Harga Penawaran Custom Event (Rp) *
                  </label>
                  <input
                    id="er-final-price"
                    type="number"
                    min="1"
                    required
                    className="va-input"
                    placeholder="cth. 1000000"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(e.target.value)}
                  />
                </div>
              )}

              {/* Konfirmasi singkat jika Approve Non-Custom Event (body {}) */}
              {decisionModal.decision === "approve" && !decisionModal.isCustom && (
                <p className="va-text" style={{ fontSize: "0.88rem", padding: "0.75rem", background: "var(--bg)", border: "1px solid var(--line)" }}>
                  Pengajuan ini menggunakan paket <strong>{decisionModal.item.villa_package?.title}</strong> dengan tarif standar paket. Klik konfirmasi untuk menyetujui.
                </p>
              )}

              {/* Input reject_reason HANYA muncul jika Reject */}
              {decisionModal.decision === "reject" && (
                <div className="va-field">
                  <label className="va-label" htmlFor="er-reject-reason">
                    Alasan Penolakan *
                  </label>
                  <textarea
                    id="er-reject-reason"
                    rows={3}
                    required
                    className="va-input"
                    placeholder="Masukkan alasan penolakan untuk pemohon..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="va-btn va-btn--ghost"
                  disabled={decisionMutation.isPending}
                  onClick={closeDecisionModal}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="va-btn"
                  style={decisionModal.decision === "reject" ? { background: "#ef4444", color: "#fff" } : {}}
                  disabled={decisionMutation.isPending}
                >
                  {decisionMutation.isPending ? (
                    <Loader2 className="va-spin" size={16} />
                  ) : decisionModal.decision === "approve" ? (
                    "Konfirmasi Setujui"
                  ) : (
                    "Konfirmasi Tolak"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}