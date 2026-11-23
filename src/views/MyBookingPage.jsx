import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  Eye,
  PackagePlus,
  Sparkles,
  Package,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { formatRupiah } from "../hooks/Usevillaquery";
import useFetch from "../hooks/useFetch";
import {
  BOOKINGS_KEY,
  STATUS_LABEL,
  bookingFields,
  canCancel,
  errorText,
  useCancelBooking,
  useMyBookings,
} from "../hooks/useBooking";
import { loadSnap } from "../hooks/useSnap";
import SectionState from "../components/SectionState";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import "../assets/styles/villa.css";
import "../assets/styles/booking.css";

const formatDate = (iso) =>
  iso
    ? new Date(`${String(iso).slice(0, 10)}T00:00:00`).toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      )
    : "-";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const EVENT_STATUS_LABEL = {
  ...STATUS_LABEL,
  pending: "Menunggu Review / Bayar",
  approved: "Disetujui (Siap Bayar)",
  rejected: "Ditolak",
  paid: "Sudah Dibayar",
  checked_in: "Sedang Berlangsung",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

function BookingCard({ raw, onViewDetail }) {
  const f = bookingFields(raw);
  const { get, post } = useFetch();
  const queryClient = useQueryClient();
  const cancel = useCancelBooking();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [paying, setPaying] = useState(false);

  const busy = cancel.isPending || paying;

  const handlePay = async () => {
    try {
      setPaying(true);
      let snapToken = f.snapToken;

      if (raw.status === "pending") {
        const resp = await get(`bookings/${raw.id}`);
        if (!resp.status) throw new Error("Gagal mengambil data pembayaran.");
        const detail = resp.data?.data ?? resp.data;
        snapToken =
          detail?.payments?.find((p) => p.status === "pending")?.snap_token ||
          detail?.snap_token ||
          f.snapToken;
      } else if (
        raw.status === "partially_paid" ||
        raw.status === "awaiting_balance" ||
        raw.status === "paid_deposit"
      ) {
        const resp = await post(`my-bookings/${raw.id}/balance`);
        if (!resp.status)
          throw new Error(
            typeof resp.error === "string"
              ? resp.error
              : "Gagal memproses pembayaran pelunasan.",
          );
        const paymentData = resp.data?.data ?? resp.data;
        snapToken =
          paymentData?.snap_token || paymentData?.payments?.[0]?.snap_token;
      }

      if (!snapToken) throw new Error("Token pembayaran tidak ditemukan.");

      setPaying(false);
      const snap = await loadSnap();
      snap.pay(snapToken, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil!");
          queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
        },
        onPending: () => {
          toast.info("Menunggu pembayaran selesai.");
          queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
        },
        onError: () => toast.error("Pembayaran gagal."),
        onClose: () => toast.warning("Pembayaran belum selesai."),
      });
    } catch (err) {
      setPaying(false);
      toast.error(errorText(err));
    }
  };

  const showPayButton =
    raw.status === "pending" ||
    raw.status === "partially_paid" ||
    raw.status === "awaiting_balance";

  return (
    <article
      className="va-bk"
      style={{
        background: "var(--paper, #fff)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "12px",
        padding: "1.25rem",
        display: "grid",
        gap: "1rem",
      }}
    >
      <div
        className="va-bk__head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <span
            className="va-bk__code"
            style={{ fontWeight: 700, fontSize: "1.1rem" }}
          >
            {f.code}
          </span>
          <div className="va-muted" style={{ fontSize: "0.78rem" }}>
            Dipesan: {formatDateTime(f.createdAt)}
          </div>
        </div>
        <span className="va-status" data-status={f.status}>
          {STATUS_LABEL[f.status] ?? (f.status || "-")}
        </span>
      </div>

      <dl
        className="va-bk__body"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "0.75rem",
          background: "rgba(0,0,0,0.02)",
          padding: "0.85rem",
          borderRadius: "8px",
        }}
      >
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Tipe Sewa
          </dt>
          <dd style={{ fontWeight: 600 }}>{f.rentalTitle}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Check-in
          </dt>
          <dd>{formatDate(f.checkIn)}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Check-out
          </dt>
          <dd>{formatDate(f.checkOut)}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Durasi
          </dt>
          <dd>{f.stay}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Jumlah Tamu
          </dt>
          <dd>{f.guests ? `${f.guests} orang` : "-"}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Total Harga
          </dt>
          <dd style={{ fontWeight: 600, color: "var(--primary, #1b4332)" }}>
            {f.total ? formatRupiah(f.total) : "-"}
          </dd>
        </div>
      </dl>

      <div
        className="va-bk__foot"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          paddingTop: "0.75rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          {confirmCancel ? (
            <span
              className="va-text"
              style={{ color: "#ef4444", fontSize: "0.85rem" }}
            >
              Batalkan pemesanan ini? Tindakan tidak dapat diurungkan.
            </span>
          ) : (
            <span className="va-text" style={{ fontSize: "0.85rem" }}>
              {showPayButton
                ? "Selesaikan pembayaran atau pelunasan tagihan Anda."
                : "Pesanan sedang diproses atau sudah selesai."}
            </span>
          )}
        </div>

        <div
          className="va-bk__actions"
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <button
            type="button"
            className="va-btn va-btn--ghost va-btn--sm"
            onClick={() => onViewDetail({ type: "villa", data: raw })}
            style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}
          >
            <Eye size={15} /> Detail
          </button>

          {confirmCancel ? (
            <>
              <button
                type="button"
                className="va-btn va-btn--sm"
                style={{ background: "#ef4444", color: "#fff" }}
                disabled={busy}
                onClick={() =>
                  cancel.mutate(raw, {
                    onSettled: () => setConfirmCancel(false),
                  })
                }
              >
                {cancel.isPending ? (
                  <Loader2 size={14} className="va-spin" />
                ) : null}{" "}
                Ya, batalkan
              </button>
              <button
                type="button"
                className="va-btn va-btn--ghost va-btn--sm"
                disabled={busy}
                onClick={() => setConfirmCancel(false)}
              >
                Kembali
              </button>
            </>
          ) : (
            <>
              {showPayButton && (
                <button
                  type="button"
                  className="va-btn va-btn--sm"
                  disabled={busy}
                  onClick={handlePay}
                >
                  {paying ? <Loader2 size={14} className="va-spin" /> : null}
                  {raw.status === "partially_paid"
                    ? "Bayar Pelunasan"
                    : "Bayar Sekarang"}
                </button>
              )}
              {canCancel(raw) && (
                <button
                  type="button"
                  className="va-btn va-btn--ghost va-btn--sm"
                  style={{ color: "#ef4444" }}
                  disabled={busy}
                  onClick={() => setConfirmCancel(true)}
                >
                  Batalkan
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function EventBookingCard({ raw, onViewDetail }) {
  const { put } = useFetch();
  const queryClient = useQueryClient();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [paying, setPaying] = useState(false);

  const pkg = raw.villa_package || raw.package || {};
  const isFromRequest =
    !raw.villa_package && !raw.package && Boolean(raw.title);
  const eventTitle =
    raw.title || pkg.title || raw.package_title || "Paket Event";
  const statusKey = String(raw.status || "pending").toLowerCase();
  const totalAmount = raw.total_price ?? raw.price ?? pkg.price ?? 0;

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const resp = await put(`my-event-bookings/${raw.id}/cancel`, {});
      if (!resp.status)
        throw new Error(
          typeof resp.error === "string"
            ? resp.error
            : "Gagal membatalkan event booking.",
        );
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Event booking dibatalkan.");
      queryClient.invalidateQueries({ queryKey: ["my-event-bookings"] });
      setConfirmCancel(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const handlePay = async () => {
    try {
      setPaying(true);
      let snapToken =
        raw.snap_token ||
        raw.payments?.find((p) => p.status === "pending")?.snap_token ||
        raw.payment?.snap_token;

      if (!snapToken) {
        const resp = await put(`my-event-bookings/${raw.id}/pay`, {});
        if (!resp.status)
          throw new Error(
            typeof resp.error === "string"
              ? resp.error
              : "Gagal mengambil token pembayaran.",
          );
        const d = resp.data?.data ?? resp.data;
        snapToken = d?.snap_token || d?.payments?.[0]?.snap_token;
      }

      if (!snapToken) throw new Error("Token pembayaran tidak ditemukan.");

      setPaying(false);
      const snap = await loadSnap();
      snap.pay(snapToken, {
        onSuccess: () => {
          toast.success("Pembayaran event berhasil!");
          queryClient.invalidateQueries({ queryKey: ["my-event-bookings"] });
        },
        onPending: () => {
          toast.info("Menunggu pembayaran selesai.");
          queryClient.invalidateQueries({ queryKey: ["my-event-bookings"] });
        },
        onError: () => toast.error("Pembayaran gagal."),
        onClose: () => toast.warning("Pembayaran belum selesai."),
      });
    } catch (err) {
      setPaying(false);
      toast.error(errorText(err));
    }
  };

  const busy = cancelMutation.isPending || paying;
  const showPayButton = statusKey === "pending";
  const showCancelButton = statusKey === "pending";

  return (
    <article
      className="va-bk"
      style={{
        background: "var(--paper, #fff)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "12px",
        padding: "1.25rem",
        display: "grid",
        gap: "1rem",
      }}
    >
      <div
        className="va-bk__head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.75rem",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              className="va-bk__code"
              style={{ fontWeight: 700, fontSize: "1.1rem" }}
            >
              {raw.booking_code || `EVENT-#${raw.id}`}
            </span>
            {isFromRequest && (
              <span
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  padding: "0.15rem 0.5rem",
                  borderRadius: "6px",
                  background: "rgba(0,0,0,0.05)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <Sparkles size={12} /> Dari Request Event
              </span>
            )}
          </div>
          <div
            className="va-muted"
            style={{ fontSize: "0.78rem", marginTop: "0.2rem" }}
          >
            Dipesan: {formatDateTime(raw.created_at)}
          </div>
        </div>
        <span className="va-status" data-status={statusKey}>
          {EVENT_STATUS_LABEL[statusKey] ?? statusKey}
        </span>
      </div>

      <dl
        className="va-bk__body"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "0.75rem",
          background: "rgba(0,0,0,0.02)",
          padding: "0.85rem",
          borderRadius: "8px",
        }}
      >
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            {isFromRequest ? "Nama Acara" : "Paket Event"}
          </dt>
          <dd style={{ fontWeight: 600 }}>{eventTitle}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Mulai Acara
          </dt>
          <dd>{formatDateTime(raw.start_at)}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Selesai Acara
          </dt>
          <dd>{formatDateTime(raw.end_at)}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Jumlah Tamu
          </dt>
          <dd>{raw.guest_count ? `${raw.guest_count} orang` : "-"}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Total Harga
          </dt>
          <dd style={{ fontWeight: 600, color: "var(--primary, #1b4332)" }}>
            {totalAmount ? formatRupiah(totalAmount) : "-"}
          </dd>
        </div>
      </dl>

      <div
        className="va-bk__foot"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          paddingTop: "0.75rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          {confirmCancel ? (
            <span
              className="va-text"
              style={{ color: "#ef4444", fontSize: "0.85rem" }}
            >
              Batalkan event booking ini?
            </span>
          ) : (
            <span className="va-text" style={{ fontSize: "0.85rem" }}>
              {showPayButton
                ? "Selesaikan pembayaran event booking Anda."
                : statusKey === "paid"
                  ? "Pembayaran lunas. Jadwal acara Anda telah terkonfirmasi."
                  : "Lihat detail jadwal dan rincian acara Anda."}
            </span>
          )}
        </div>

        <div
          className="va-bk__actions"
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <button
            type="button"
            className="va-btn va-btn--ghost va-btn--sm"
            onClick={() => onViewDetail({ type: "event-booking", data: raw })}
            style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}
          >
            <Eye size={15} /> Detail
          </button>

          {confirmCancel ? (
            <>
              <button
                type="button"
                className="va-btn va-btn--sm"
                style={{ background: "#ef4444", color: "#fff" }}
                disabled={busy}
                onClick={() => cancelMutation.mutate()}
              >
                {cancelMutation.isPending ? (
                  <Loader2 size={14} className="va-spin" />
                ) : null}{" "}
                Ya, batalkan
              </button>
              <button
                type="button"
                className="va-btn va-btn--ghost va-btn--sm"
                disabled={busy}
                onClick={() => setConfirmCancel(false)}
              >
                Kembali
              </button>
            </>
          ) : (
            <>
              {showPayButton && (
                <button
                  type="button"
                  className="va-btn va-btn--sm"
                  disabled={busy}
                  onClick={handlePay}
                >
                  {paying ? <Loader2 size={14} className="va-spin" /> : null}{" "}
                  Bayar Sekarang
                </button>
              )}
              {showCancelButton && (
                <button
                  type="button"
                  className="va-btn va-btn--ghost va-btn--sm"
                  style={{ color: "#ef4444" }}
                  disabled={busy}
                  onClick={() => setConfirmCancel(true)}
                >
                  Batalkan
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function EventRequestCard({
  raw,
  onViewDetail,
  onPaymentSuccess,
  eventBookings = [],
}) {
  const { put } = useFetch();
  const queryClient = useQueryClient();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [paying, setPaying] = useState(false);

  const pkgObj = raw.villa_package || raw.package;
  const pkgId = raw.villa_package_id ?? pkgObj?.id;
  const isCustom =
    raw.custom === true ||
    (raw.budget !== undefined && raw.budget !== null && !pkgId && !pkgObj);
  const statusKey = String(raw.status || "pending").toLowerCase();

  const isAlreadyPaidInBookings = eventBookings.some(
    (eb) =>
      eb.title === raw.title && String(eb.status).toLowerCase() === "paid",
  );

  const handlePayRequest = async () => {
    try {
      setPaying(true);
      const resp = await put(`my-event-requests/${raw.id}/pay`, {});
      if (!resp.status) {
        throw new Error(
          typeof resp.error === "string"
            ? resp.error
            : "Gagal memproses pembayaran pengajuan event.",
        );
      }

      const paymentData = resp.data?.data ?? resp.data;
      const snapToken = paymentData?.snap_token;

      if (!snapToken) {
        if (paymentData?.redirect_url) {
          window.location.href = paymentData.redirect_url;
          return;
        }
        throw new Error("Token pembayaran tidak ditemukan.");
      }

      setPaying(false);
      const snap = await loadSnap();
      snap.pay(snapToken, {
        onSuccess: () => {
          toast.success(
            "Pembayaran berhasil! Pesanan masuk ke tab Event Booking.",
          );
          queryClient.invalidateQueries({ queryKey: ["my-event-requests"] });
          queryClient.invalidateQueries({ queryKey: ["my-event-bookings"] });
          if (onPaymentSuccess) onPaymentSuccess();
        },
        onPending: () => {
          toast.info("Menunggu pembayaran selesai.");
          queryClient.invalidateQueries({ queryKey: ["my-event-requests"] });
          queryClient.invalidateQueries({ queryKey: ["my-event-bookings"] });
        },
        onError: () => toast.error("Pembayaran gagal."),
        onClose: () => toast.warning("Pembayaran belum selesai."),
      });
    } catch (err) {
      setPaying(false);
      toast.error(errorText(err));
    }
  };

  const cancelRequestMutation = useMutation({
    mutationFn: async () => {
      const resp = await put(`my-event-requests/${raw.id}/cancel`, {});
      if (!resp.status) {
        throw new Error(
          typeof resp.error === "string"
            ? resp.error
            : "Gagal membatalkan pengajuan event.",
        );
      }
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Pengajuan event berhasil dibatalkan.");
      queryClient.invalidateQueries({ queryKey: ["my-event-requests"] });
      setConfirmCancel(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const busy = paying || cancelRequestMutation.isPending;
  const canPay = statusKey === "approved" && !isAlreadyPaidInBookings;
  const canCancelReq =
    (statusKey === "pending" || statusKey === "approved") &&
    !isAlreadyPaidInBookings;

  const displayPrice = isCustom
    ? raw.price
      ? formatRupiah(raw.price)
      : raw.budget
        ? `Budget: ${formatRupiah(raw.budget)}`
        : "-"
    : raw.price
      ? formatRupiah(raw.price)
      : pkgObj?.price
        ? formatRupiah(pkgObj.price)
        : "Sesuai Paket";

  return (
    <article
      className="va-bk"
      style={{
        background: "var(--paper, #fff)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: "12px",
        padding: "1.25rem",
        display: "grid",
        gap: "1rem",
      }}
    >
      <div
        className="va-bk__head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "0.75rem",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            <span
              className="va-bk__code"
              style={{ fontWeight: 700, fontSize: "1.1rem" }}
            >
              {raw.title || `REQ-#${raw.id}`}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                padding: "0.15rem 0.5rem",
                borderRadius: "6px",
                background: "rgba(0,0,0,0.05)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              {isCustom ? (
                <>
                  <Sparkles size={12} /> Custom Event
                </>
              ) : (
                <>
                  <Package size={12} /> {pkgObj?.title || "Paket Event"}
                </>
              )}
            </span>
          </div>
          <div
            className="va-muted"
            style={{ fontSize: "0.78rem", marginTop: "0.2rem" }}
          >
            Diajukan: {formatDateTime(raw.created_at)}
          </div>
        </div>
        <span
          className="va-status"
          data-status={isAlreadyPaidInBookings ? "paid" : statusKey}
        >
          {isAlreadyPaidInBookings
            ? "Sudah Dibayar"
            : (EVENT_STATUS_LABEL[statusKey] ?? statusKey)}
        </span>
      </div>

      <dl
        className="va-bk__body"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "0.75rem",
          background: "rgba(0,0,0,0.02)",
          padding: "0.85rem",
          borderRadius: "8px",
        }}
      >
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Mulai Acara
          </dt>
          <dd>{formatDateTime(raw.start_at)}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Selesai Acara
          </dt>
          <dd>{formatDateTime(raw.end_at)}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            Jumlah Tamu
          </dt>
          <dd>{raw.guest_count ? `${raw.guest_count} orang` : "-"}</dd>
        </div>
        <div>
          <dt className="va-muted" style={{ fontSize: "0.75rem" }}>
            {raw.price
              ? "Harga Final"
              : isCustom
                ? "Budget Diajukan"
                : "Tarif Paket"}
          </dt>
          <dd style={{ fontWeight: 600, color: "var(--primary, #1b4332)" }}>
            {displayPrice}
          </dd>
        </div>
      </dl>

      {statusKey === "rejected" && raw.reject_reason && (
        <div
          style={{
            padding: "0.65rem 0.85rem",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.08)",
            color: "#dc2626",
            fontSize: "0.82rem",
          }}
        >
          <strong>Alasan Penolakan:</strong> {raw.reject_reason}
        </div>
      )}

      <div
        className="va-bk__foot"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(0,0,0,0.06)",
          paddingTop: "0.75rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <div>
          {confirmCancel ? (
            <span
              className="va-text"
              style={{ color: "#ef4444", fontSize: "0.85rem" }}
            >
              Batalkan pengajuan acara ini?
            </span>
          ) : (
            <span className="va-text" style={{ fontSize: "0.85rem" }}>
              {isAlreadyPaidInBookings
                ? "Sudah dibayar — tercatat di tab Event Booking."
                : canPay
                  ? "Pengajuan disetujui! Silakan lakukan pembayaran."
                  : statusKey === "pending"
                    ? "Menunggu konfirmasi dan penawaran dari admin."
                    : "Lihat detail pengajuan acara Anda."}
            </span>
          )}
        </div>

        <div
          className="va-bk__actions"
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
        >
          <button
            type="button"
            className="va-btn va-btn--ghost va-btn--sm"
            onClick={() => onViewDetail({ type: "event-request", data: raw })}
            style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}
          >
            <Eye size={15} /> Detail
          </button>

          {confirmCancel ? (
            <>
              <button
                type="button"
                className="va-btn va-btn--sm"
                style={{ background: "#ef4444", color: "#fff" }}
                disabled={busy}
                onClick={() => cancelRequestMutation.mutate()}
              >
                {cancelRequestMutation.isPending ? (
                  <Loader2 size={14} className="va-spin" />
                ) : null}{" "}
                Ya, batalkan
              </button>
              <button
                type="button"
                className="va-btn va-btn--ghost va-btn--sm"
                disabled={busy}
                onClick={() => setConfirmCancel(false)}
              >
                Kembali
              </button>
            </>
          ) : (
            <>
              {canPay && (
                <button
                  type="button"
                  className="va-btn va-btn--sm"
                  disabled={busy}
                  onClick={handlePayRequest}
                >
                  {paying ? <Loader2 size={14} className="va-spin" /> : null}{" "}
                  Bayar Sekarang
                </button>
              )}
              {canCancelReq && (
                <button
                  type="button"
                  className="va-btn va-btn--ghost va-btn--sm"
                  style={{ color: "#ef4444" }}
                  disabled={busy}
                  onClick={() => setConfirmCancel(true)}
                >
                  Batalkan
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function MyBookingsPage() {
  const { user } = useAuth();
  const { get } = useFetch();

  const [activeTab, setActiveTab] = useState("villa");
  const [modalTarget, setModalTarget] = useState(null);

  const {
    data: bookings = [],
    isLoading: loadingVilla,
    isError: errorVilla,
    error: errVilla,
  } = useMyBookings();

  const {
    data: eventBookings = [],
    isLoading: loadingEvent,
    isError: errorEvent,
    error: errEvent,
  } = useQuery({
    queryKey: ["my-event-bookings"],
    queryFn: async () => {
      const resp = await get("my-event-bookings?unpage=true&sort=desc");
      if (!resp.status)
        throw new Error(
          typeof resp.error === "string"
            ? resp.error
            : "Gagal memuat event bookings",
        );
      const raw = resp.data?.data ?? resp.data;
      return Array.isArray(raw) ? raw : [];
    },
    enabled: Boolean(user),
  });

  const {
    data: eventRequests = [],
    isLoading: loadingRequest,
    isError: errorRequest,
    error: errRequest,
  } = useQuery({
    queryKey: ["my-event-requests"],
    queryFn: async () => {
      const resp = await get("my-event-requests?unpage=true&sort=desc");
      if (!resp.status)
        throw new Error(
          typeof resp.error === "string"
            ? resp.error
            : "Gagal memuat event requests",
        );
      const raw = resp.data?.data ?? resp.data;
      return Array.isArray(raw) ? raw : [];
    },
    enabled: Boolean(user),
  });

  const { data: detailResp, isFetching: isFetchingVillaDetail } = useQuery({
    queryKey: ["booking-detail", modalTarget?.data?.id],
    queryFn: async () => {
      const resp = await get(`bookings/${modalTarget.data.id}`);
      if (!resp.status)
        throw new Error(
          typeof resp.error === "string" ? resp.error : "Gagal memuat detail",
        );
      return resp.data;
    },
    enabled: modalTarget?.type === "villa" && Boolean(modalTarget?.data?.id),
  });

  const { data: eventReqDetailResp, isFetching: isFetchingReqDetail } =
    useQuery({
      queryKey: ["event-request-detail", modalTarget?.data?.id],
      queryFn: async () => {
        const resp = await get(`event-requests/${modalTarget.data.id}`);
        if (!resp.status) return modalTarget.data;
        return resp.data?.data ?? resp.data;
      },
      enabled:
        modalTarget?.type === "event-request" && Boolean(modalTarget?.data?.id),
    });

  if (!user) return <Navigate to="/login" replace />;

  const isLoading = loadingVilla || loadingEvent || loadingRequest;
  const isError = errorVilla || errorEvent || errorRequest;
  const firstError = errVilla || errEvent || errRequest;

  if (isLoading)
    return (
      <SectionState tone="paper" full label="Memuat riwayat pesanan Anda…" />
    );
  if (isError)
    return (
      <SectionState
        tone="paper"
        full
        label="Pesanan gagal dimuat"
        error={firstError?.message}
      />
    );

  const villaDetailData = detailResp?.data || detailResp;
  const reqDetailData = eventReqDetailResp || modalTarget?.data;
  const eventDetailData = modalTarget?.data;

  const tabs = [
    { key: "villa", label: "Sewa Villa", count: bookings.length },
    { key: "event", label: "Event Booking", count: eventBookings.length },
    { key: "request", label: "Request Event", count: eventRequests.length },
  ];

  return (
    <main className="va-paper">
      <header className="va-ink va-page-hero">
        <div className="va-wrap va-page-hero__inner">
          <div>
            <span className="va-eyebrow">Akun saya</span>
            <h1 className="va-page-hero__title">Riwayat pesanan</h1>
          </div>
          <p className="va-lead">
            Pantau status pemesanan villa, event booking, dan pengajuan acara
            khusus Anda di satu tempat.
          </p>
        </div>
      </header>

      <section className="va-section">
        <div className="va-wrap">
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              paddingBottom: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            {tabs.map((t) => {
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={
                    active
                      ? "va-btn va-btn--sm"
                      : "va-btn va-btn--ghost va-btn--sm"
                  }
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                  }}
                >
                  <span>{t.label}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.05rem 0.45rem",
                      borderRadius: "999px",
                      background: active
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.08)",
                    }}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTab === "villa" && (
            <>
              {bookings.length === 0 ? (
                <div className="va-empty">
                  <strong>Belum ada pesanan villa</strong>
                  <p className="va-text">
                    Pesanan menginap Anda akan tampil di sini setelah melakukan
                    pemesanan.
                  </p>
                  <Link
                    to="/booking"
                    className="va-btn"
                    style={{ marginTop: "1rem" }}
                  >
                    Mulai pesan
                  </Link>
                </div>
              ) : (
                <div
                  className="va-bk-list"
                  style={{ display: "grid", gap: "1rem" }}
                >
                  {bookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      raw={b}
                      onViewDetail={(target) => setModalTarget(target)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "event" && (
            <>
              {eventBookings.length === 0 ? (
                <div className="va-empty">
                  <strong>Belum ada event booking</strong>
                  <p className="va-text">
                    Pemesanan paket event dan pengajuan yang telah dibayar akan
                    tampil di sini.
                  </p>
                  <Link
                    to="/#paket"
                    className="va-btn"
                    style={{ marginTop: "1rem" }}
                  >
                    Lihat paket event
                  </Link>
                </div>
              ) : (
                <div
                  className="va-bk-list"
                  style={{ display: "grid", gap: "1rem" }}
                >
                  {eventBookings.map((eb) => (
                    <EventBookingCard
                      key={eb.id}
                      raw={eb}
                      onViewDetail={(target) => setModalTarget(target)}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "request" && (
            <>
              {eventRequests.length === 0 ? (
                <div className="va-empty">
                  <strong>Belum ada pengajuan event</strong>
                  <p className="va-text">
                    Pengajuan paket custom atau request acara khusus Anda akan
                    tampil di sini.
                  </p>
                  <Link
                    to="/#paket"
                    className="va-btn"
                    style={{ marginTop: "1rem" }}
                  >
                    Ajukan acara
                  </Link>
                </div>
              ) : (
                <div
                  className="va-bk-list"
                  style={{ display: "grid", gap: "1rem" }}
                >
                  {eventRequests.map((er) => (
                    <EventRequestCard
                      key={er.id}
                      raw={er}
                      eventBookings={eventBookings}
                      onViewDetail={(target) => setModalTarget(target)}
                      onPaymentSuccess={() => setActiveTab("event")}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Dialog
        open={Boolean(modalTarget)}
        onOpenChange={(open) => !open && setModalTarget(null)}
      >
        <DialogContent
          className="va-paper va-modal"
          style={{
            maxWidth: "920px",
            width: "95vw",
            maxHeight: "85vh",
            display: "flex",
            flexDirection: "column",
            padding: 0,
            overflow: "hidden",
            zIndex: 9999,
            marginTop: "4rem",
          }}
        >
          {modalTarget?.type === "villa" && (
            <>
              <DialogHeader
                className="va-modal__head"
                style={{
                  padding: "1.25rem 1.5rem 0.75rem 1.5rem",
                  flexShrink: 0,
                }}
              >
                <DialogTitle
                  className="va-modal__title"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Detail Pemesanan #{modalTarget.data.id}</span>
                  {villaDetailData?.status && (
                    <span
                      className="va-status"
                      data-status={villaDetailData.status}
                    >
                      {STATUS_LABEL[villaDetailData.status] ??
                        villaDetailData.status}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="va-modal__desc">
                  Informasi lengkap reservasi villa, add-on, dan rincian biaya
                  Anda.
                </DialogDescription>
              </DialogHeader>

              {isFetchingVillaDetail ? (
                <div className="va-state" style={{ minHeight: "16rem" }}>
                  <Loader2 className="va-spin" size={24} />
                  <p>Memuat detail pemesanan…</p>
                </div>
              ) : villaDetailData ? (
                <div
                  className="va-modal__body"
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "1rem 1.5rem",
                    display: "grid",
                    gridTemplateColumns: "1fr 360px",
                    gap: "1.5rem",
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.25rem",
                      height: "100%",
                    }}
                  >
                    {villaDetailData.rental_option && (
                      <div
                        style={{
                          background: "rgba(0,0,0,0.03)",
                          padding: "1rem",
                          borderRadius: "8px",
                          display: "grid",
                          gap: "0.4rem",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                          {villaDetailData.rental_option.title}
                        </div>
                        <div
                          className="va-muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {villaDetailData.rental_option.subtitle}
                        </div>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            margin: 0,
                            color: "var(--muted)",
                          }}
                        >
                          {villaDetailData.rental_option.description}
                        </p>
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.75rem",
                        background: "rgba(0,0,0,0.02)",
                        padding: "0.85rem",
                        borderRadius: "8px",
                      }}
                    >
                      <div>
                        <span
                          className="va-muted"
                          style={{ fontSize: "0.75rem", display: "block" }}
                        >
                          Check-in
                        </span>
                        <strong>
                          {formatDate(villaDetailData.check_in_date)}
                        </strong>
                      </div>
                      <div>
                        <span
                          className="va-muted"
                          style={{ fontSize: "0.75rem", display: "block" }}
                        >
                          Check-out
                        </span>
                        <strong>
                          {formatDate(villaDetailData.check_out_date)}
                        </strong>
                      </div>
                      <div>
                        <span
                          className="va-muted"
                          style={{ fontSize: "0.75rem", display: "block" }}
                        >
                          Jumlah Tamu
                        </span>
                        <strong>{villaDetailData.guest_count} orang</strong>
                      </div>
                      <div>
                        <span
                          className="va-muted"
                          style={{ fontSize: "0.75rem", display: "block" }}
                        >
                          Keperluan
                        </span>
                        <strong>{villaDetailData.reason?.text || "-"}</strong>
                      </div>
                    </div>

                    <div
                      style={{
                        flex: 1,
                        background: "rgba(0,0,0,0.02)",
                        borderRadius: "8px",
                        border: "1px dashed rgba(0,0,0,0.08)",
                        padding: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "100px",
                      }}
                    >
                      <span
                        className="va-muted"
                        style={{ fontSize: "0.8rem", textAlign: "center" }}
                      >
                        Semua informasi reservasi telah dimuat sepenuhnya.
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gap: "1.25rem" }}>
                    {villaDetailData.booking_addons &&
                      villaDetailData.booking_addons.length > 0 && (
                        <div
                          style={{
                            background: "rgba(0,0,0,0.02)",
                            padding: "1rem",
                            borderRadius: "8px",
                            border: "1px solid rgba(0,0,0,0.05)",
                            display: "grid",
                            gap: "0.75rem",
                          }}
                        >
                          <span
                            className="va-label"
                            style={{
                              fontWeight: 600,
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                            }}
                          >
                            <PackagePlus size={16} /> Add-on & Fasilitas
                            Tambahan
                          </span>
                          <div style={{ display: "grid", gap: "0.5rem" }}>
                            {villaDetailData.booking_addons.map((item) => {
                              const addon = item.addon;
                              const qty = item.quantity || 1;
                              if (!addon) return null;

                              return (
                                <div
                                  key={item.id}
                                  style={{
                                    background: "#fff",
                                    padding: "0.75rem",
                                    borderRadius: "6px",
                                    border: "1px solid rgba(0,0,0,0.04)",
                                    display: "grid",
                                    gap: "0.3rem",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <div>
                                      <strong
                                        style={{
                                          fontSize: "0.9rem",
                                          color: "var(--fg)",
                                        }}
                                      >
                                        {addon.title}
                                      </strong>
                                      {addon.subtitle && (
                                        <div
                                          className="va-muted"
                                          style={{ fontSize: "0.75rem" }}
                                        >
                                          {addon.subtitle}
                                        </div>
                                      )}
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                      <span
                                        style={{
                                          fontWeight: 600,
                                          fontSize: "0.85rem",
                                          color: "var(--primary, #1b4332)",
                                        }}
                                      >
                                        {formatRupiah(addon.price * qty)}
                                      </span>
                                      <div
                                        className="va-muted"
                                        style={{ fontSize: "0.7rem" }}
                                      >
                                        {formatRupiah(addon.price)} × {qty}
                                      </div>
                                    </div>
                                  </div>
                                  {addon.description && (
                                    <p
                                      style={{
                                        fontSize: "0.78rem",
                                        margin: 0,
                                        color: "var(--muted)",
                                      }}
                                    >
                                      {addon.description}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    <div
                      style={{
                        background: "rgba(0,0,0,0.02)",
                        padding: "1rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(0,0,0,0.05)",
                        display: "grid",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <span
                          className="va-label"
                          style={{
                            fontWeight: 600,
                            display: "block",
                            marginBottom: "0.75rem",
                          }}
                        >
                          Rincian Biaya
                        </span>
                        <div
                          style={{
                            display: "grid",
                            gap: "0.5rem",
                            fontSize: "0.9rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className="va-muted">Harga Sewa:</span>
                            <span>
                              {formatRupiah(villaDetailData.booking_price)}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <span className="va-muted">Jumlah Deposit:</span>
                            <span>
                              {formatRupiah(villaDetailData.deposit_amount)}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              borderTop: "1px solid rgba(0,0,0,0.1)",
                              paddingTop: "0.5rem",
                              marginTop: "0.2rem",
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>
                              Total Harga:
                            </span>
                            <strong
                              style={{ color: "var(--primary, #1b4332)" }}
                            >
                              {formatRupiah(villaDetailData.total_price)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {villaDetailData.payments &&
                        villaDetailData.payments.length > 0 && (
                          <div
                            style={{
                              display: "grid",
                              gap: "0.5rem",
                              borderTop: "1px solid rgba(0,0,0,0.08)",
                              paddingTop: "0.75rem",
                            }}
                          >
                            <span
                              className="va-label"
                              style={{ fontWeight: 600, fontSize: "0.85rem" }}
                            >
                              Riwayat Pembayaran
                            </span>
                            <div style={{ display: "grid", gap: "0.4rem" }}>
                              {villaDetailData.payments.map((p) => (
                                <div
                                  key={p.id}
                                  style={{
                                    background: "#fff",
                                    padding: "0.6rem",
                                    borderRadius: "6px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    fontSize: "0.8rem",
                                    border: "1px solid rgba(0,0,0,0.04)",
                                  }}
                                >
                                  <div>
                                    <div
                                      style={{
                                        fontWeight: 600,
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      {p.kind}
                                    </div>
                                    <div
                                      className="va-muted"
                                      style={{ fontSize: "0.7rem" }}
                                    >
                                      {p.order_id}
                                    </div>
                                  </div>
                                  <div style={{ textAlign: "right" }}>
                                    <div style={{ fontWeight: 600 }}>
                                      {formatRupiah(p.amount)}
                                    </div>
                                    <span
                                      className="va-status"
                                      data-status={p.status}
                                      style={{
                                        fontSize: "0.65rem",
                                        padding: "0.1rem 0.3rem",
                                      }}
                                    >
                                      {p.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}

          {modalTarget?.type === "event-booking" && eventDetailData && (
            <>
              <DialogHeader
                className="va-modal__head"
                style={{
                  padding: "1.25rem 1.5rem 0.75rem 1.5rem",
                  flexShrink: 0,
                }}
              >
                <DialogTitle
                  className="va-modal__title"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Detail Event Booking #{eventDetailData.id}</span>
                  <span
                    className="va-status"
                    data-status={eventDetailData.status}
                  >
                    {EVENT_STATUS_LABEL[eventDetailData.status] ??
                      eventDetailData.status}
                  </span>
                </DialogTitle>
                <DialogDescription className="va-modal__desc">
                  Rincian jadwal pelaksanaan event dan informasi biaya yang
                  dipesan.
                </DialogDescription>
              </DialogHeader>

              <div
                className="va-modal__body"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "1.25rem 1.5rem",
                  display: "grid",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    background: "rgba(0,0,0,0.03)",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    {eventDetailData.title ||
                      eventDetailData.villa_package?.title ||
                      eventDetailData.package_title ||
                      "Paket Event"}
                  </div>
                  {eventDetailData.villa_package?.subtitle && (
                    <div
                      className="va-muted"
                      style={{ fontSize: "0.85rem", marginTop: "0.2rem" }}
                    >
                      {eventDetailData.villa_package.subtitle}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "0.85rem",
                    background: "rgba(0,0,0,0.02)",
                    padding: "1rem",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <span
                      className="va-muted"
                      style={{
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Calendar size={13} /> Waktu Mulai
                    </span>
                    <strong>{formatDateTime(eventDetailData.start_at)}</strong>
                  </div>
                  <div>
                    <span
                      className="va-muted"
                      style={{
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Clock size={13} /> Waktu Selesai
                    </span>
                    <strong>{formatDateTime(eventDetailData.end_at)}</strong>
                  </div>
                  <div>
                    <span
                      className="va-muted"
                      style={{
                        fontSize: "0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Users size={13} /> Jumlah Tamu
                    </span>
                    <strong>{eventDetailData.guest_count} orang</strong>
                  </div>
                  <div>
                    <span
                      className="va-muted"
                      style={{ fontSize: "0.75rem", display: "block" }}
                    >
                      Total Biaya
                    </span>
                    <strong style={{ color: "var(--primary, #1b4332)" }}>
                      {formatRupiah(
                        eventDetailData.total_price ??
                          eventDetailData.price ??
                          eventDetailData.villa_package?.price ??
                          0,
                      )}
                    </strong>
                  </div>
                  {eventDetailData.check_in_at && (
                    <div>
                      <span
                        className="va-muted"
                        style={{ fontSize: "0.75rem", display: "block" }}
                      >
                        Check-in Aktual
                      </span>
                      <strong>
                        {formatDateTime(eventDetailData.check_in_at)}
                      </strong>
                    </div>
                  )}
                  {eventDetailData.check_out_at && (
                    <div>
                      <span
                        className="va-muted"
                        style={{ fontSize: "0.75rem", display: "block" }}
                      >
                        Check-out Aktual
                      </span>
                      <strong>
                        {formatDateTime(eventDetailData.check_out_at)}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {modalTarget?.type === "event-request" && (
            <>
              <DialogHeader
                className="va-modal__head"
                style={{
                  padding: "1.25rem 1.5rem 0.75rem 1.5rem",
                  flexShrink: 0,
                }}
              >
                <DialogTitle
                  className="va-modal__title"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>Detail Pengajuan Event #{modalTarget.data.id}</span>
                  {reqDetailData?.status && (
                    <span
                      className="va-status"
                      data-status={reqDetailData.status}
                    >
                      {EVENT_STATUS_LABEL[reqDetailData.status] ??
                        reqDetailData.status}
                    </span>
                  )}
                </DialogTitle>
                <DialogDescription className="va-modal__desc">
                  Detail konsep acara, jadwal, serta status penawaran dan
                  pembayaran.
                </DialogDescription>
              </DialogHeader>

              {isFetchingReqDetail ? (
                <div className="va-state" style={{ minHeight: "14rem" }}>
                  <Loader2 className="va-spin" size={24} />
                  <p>Memuat detail pengajuan…</p>
                </div>
              ) : reqDetailData ? (
                <div
                  className="va-modal__body"
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    padding: "1.25rem 1.5rem",
                    display: "grid",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(0,0,0,0.03)",
                      padding: "1rem",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>
                      {reqDetailData.title}
                    </div>
                    {reqDetailData.description && (
                      <p
                        style={{
                          fontSize: "0.88rem",
                          marginTop: "0.5rem",
                          marginBottom: 0,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {reqDetailData.description}
                      </p>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                      gap: "0.85rem",
                      background: "rgba(0,0,0,0.02)",
                      padding: "1rem",
                      borderRadius: "8px",
                    }}
                  >
                    <div>
                      <span
                        className="va-muted"
                        style={{ fontSize: "0.75rem", display: "block" }}
                      >
                        Waktu Mulai
                      </span>
                      <strong>{formatDateTime(reqDetailData.start_at)}</strong>
                    </div>
                    <div>
                      <span
                        className="va-muted"
                        style={{ fontSize: "0.75rem", display: "block" }}
                      >
                        Waktu Selesai
                      </span>
                      <strong>{formatDateTime(reqDetailData.end_at)}</strong>
                    </div>
                    <div>
                      <span
                        className="va-muted"
                        style={{ fontSize: "0.75rem", display: "block" }}
                      >
                        Jumlah Tamu
                      </span>
                      <strong>{reqDetailData.guest_count} orang</strong>
                    </div>
                    {reqDetailData.budget != null && (
                      <div>
                        <span
                          className="va-muted"
                          style={{ fontSize: "0.75rem", display: "block" }}
                        >
                          Budget Diajukan
                        </span>
                        <strong>{formatRupiah(reqDetailData.budget)}</strong>
                      </div>
                    )}
                    {reqDetailData.price != null && (
                      <div>
                        <span
                          className="va-muted"
                          style={{ fontSize: "0.75rem", display: "block" }}
                        >
                          Harga Disetujui
                        </span>
                        <strong style={{ color: "var(--primary, #1b4332)" }}>
                          {formatRupiah(reqDetailData.price)}
                        </strong>
                      </div>
                    )}
                  </div>

                  {reqDetailData.reject_reason && (
                    <div
                      style={{
                        padding: "0.85rem",
                        borderRadius: "8px",
                        background: "rgba(239, 68, 68, 0.08)",
                        color: "#dc2626",
                        fontSize: "0.85rem",
                      }}
                    >
                      <strong>Alasan Penolakan:</strong>{" "}
                      {reqDetailData.reject_reason}
                    </div>
                  )}
                </div>
              ) : null}
            </>
          )}

          <DialogFooter
            className="va-modal__foot"
            style={{
              padding: "1rem 1.5rem",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              className="va-btn va-btn--ghost"
              onClick={() => setModalTarget(null)}
            >
              Tutup
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
