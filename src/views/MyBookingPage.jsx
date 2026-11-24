import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Eye, Loader2, Package, Sparkles } from "lucide-react";
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

/* ---------- endpoint & key ---------- */
const EVENT_BOOKINGS_KEY = "my-event-bookings";
const EVENT_REQUESTS_KEY = "my-event-requests";
const eventBookingPayPath = (id) => `my-event-bookings/${id}/pay`; // sesuaikan jika endpoint berbeda

/* ---------- format ---------- */
const formatDate = (iso) =>
  iso
    ? new Date(`${String(iso).slice(0, 10)}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    : "-";

const formatDateTime = (iso) =>
  iso
    ? new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "-";

const LABEL = {
  ...STATUS_LABEL,
  pending: "Menunggu pembayaran",
  approved: "Disetujui",
  rejected: "Ditolak",
  paid: "Sudah dibayar",
  partially_paid: "Dibayar sebagian",
  awaiting_balance: "Menunggu pelunasan",
  checked_in: "Sedang berlangsung",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

/* ==========================================================
   Keterkaitan event booking <-> event request
   Event booking dianggap berasal dari request bila:
   (1) ada referensi langsung (event_request_id / request_id), atau
   (2) datanya sama: waktu mulai, waktu selesai, jumlah tamu (dan paket bila keduanya punya).
   ========================================================== */
const toTime = (v) => {
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
};
const pkgIdOf = (x) => x?.villa_package_id ?? x?.villa_package?.id ?? x?.package?.id ?? null;

export const findLinkedRequest = (booking, requests) => {
  const directId = booking.event_request_id ?? booking.request_id ?? booking.event_request?.id;
  if (directId != null) {
    return requests.find((r) => String(r.id) === String(directId)) ?? { id: directId };
  }

  const start = toTime(booking.start_at);
  const end = toTime(booking.end_at);
  if (start === null || end === null) return null;

  return (
    requests.find((r) => {
      if (toTime(r.start_at) !== start || toTime(r.end_at) !== end) return false;
      if (Number(r.guest_count) !== Number(booking.guest_count)) return false;
      const rp = pkgIdOf(r);
      const bp = pkgIdOf(booking);
      return rp == null || bp == null || String(rp) === String(bp);
    }) ?? null
  );
};

/* ---------- pembayaran Midtrans (dipakai semua kartu) ---------- */
const snapTokenFrom = (body) => {
  const d = body?.data ?? body;
  return d?.snap_token ?? d?.payments?.find((p) => p.status === "pending")?.snap_token ?? d?.payments?.[0]?.snap_token ?? null;
};

async function payWithSnap(token, onChange) {
  const snap = await loadSnap();
  snap.pay(token, {
    onSuccess: () => { toast.success("Pembayaran berhasil!"); onChange(); },
    onPending: () => { toast.info("Menunggu pembayaran selesai."); onChange(); },
    onError: () => toast.error("Pembayaran gagal."),
    onClose: () => toast.warning("Pembayaran belum selesai."),
  });
}

// Mutasi sederhana (PUT tanpa isi) yang me-refresh daftar terkait saat berhasil
function useEventAction({ path, success, invalidate }) {
  const { put } = useFetch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const resp = await put(path, {});
      if (!resp.status) throw new Error(errorText(resp.error));
      return resp.data;
    },
    onSuccess: () => {
      toast.success(success);
      invalidate.forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }));
    },
    onError: (err) => toast.error(err.message),
  });
}

/* ---------- kerangka kartu & kontrol bersama ---------- */
function Shell({ title, tags, subtitle, status, fields, notice, note, actions, focused, cardRef }) {
  return (
    <article className="va-bk" data-focus={focused ? "true" : undefined} ref={cardRef}>
      <div className="va-bk__head">
        <div>
          <div className="va-bk__title">
            <span className="va-bk__code">{title}</span>
            {tags}
          </div>
          <div className="va-muted" style={{ fontSize: "0.78rem", marginTop: "0.25rem" }}>{subtitle}</div>
        </div>
        <span className="va-status" data-status={status}>{LABEL[status] ?? (status || "-")}</span>
      </div>

      <dl className="va-bk__body">
        {fields.filter(([, v]) => v !== undefined && v !== null).map(([label, value]) => (
          <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
        ))}
      </dl>

      {notice && <div className="va-bk__notice">{notice}</div>}

      <div className="va-bk__foot">
        <span className="va-text">{note}</span>
        <div className="va-bk__actions">{actions}</div>
      </div>
    </article>
  );
}

function CancelControls({ confirming, setConfirming, onConfirm, pending, disabled, label = "Batalkan" }) {
  if (confirming) {
    return (
      <>
        <button type="button" className="va-btn va-btn--sm" disabled={disabled} onClick={onConfirm}>
          {pending ? <Loader2 size={14} className="va-spin" /> : null} Ya, batalkan
        </button>
        <button type="button" className="va-btn va-btn--ghost va-btn--sm" disabled={disabled} onClick={() => setConfirming(false)}>
          Kembali
        </button>
      </>
    );
  }
  return (
    <button type="button" className="va-btn va-btn--ghost va-btn--sm" disabled={disabled} onClick={() => setConfirming(true)}>
      {label}
    </button>
  );
}

const DetailButton = ({ onClick }) => (
  <button type="button" className="va-btn va-btn--ghost va-btn--sm" onClick={onClick}>
    <Eye size={15} /> Detail
  </button>
);

/* ==========================================================
   1) Sewa villa
   ========================================================== */
function VillaCard({ raw, onViewDetail }) {
  const f = bookingFields(raw);
  const { get, post } = useFetch();
  const queryClient = useQueryClient();
  const cancel = useCancelBooking();
  const [confirming, setConfirming] = useState(false);
  const [paying, setPaying] = useState(false);

  const busy = cancel.isPending || paying;
  const showPay = ["pending", "partially_paid", "awaiting_balance"].includes(f.status);

  const handlePay = async () => {
    try {
      setPaying(true);
      let token = null;

      if (f.status === "pending") {
        const resp = await get(`bookings/${raw.id}`);
        token = resp.status ? snapTokenFrom(resp.data) : null;
        token = token || f.snapToken; // detail gagal dimuat -> pakai token dari daftar
      } else {
        const resp = await post(`my-bookings/${raw.id}/balance`);
        if (!resp.status) throw new Error(errorText(resp.error) || "Gagal memproses pelunasan.");
        token = snapTokenFrom(resp.data);
      }
      if (!token) throw new Error("Token pembayaran tidak ditemukan.");

      await payWithSnap(token, () => queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY }));
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setPaying(false);
    }
  };

  return (
    <Shell
      title={f.code}
      subtitle={`Dipesan: ${formatDateTime(f.createdAt)}`}
      status={f.status}
      fields={[
        ["Tipe sewa", f.rentalTitle],
        ["Check-in", formatDate(f.checkIn)],
        ["Check-out", formatDate(f.checkOut)],
        ["Durasi", f.stay],
        ["Jumlah tamu", f.guests ? `${f.guests} orang` : "-"],
        ["Total harga", f.total ? formatRupiah(f.total) : "-"],
      ]}
      note={
        confirming
          ? "Batalkan pemesanan ini? Tindakan tidak dapat diurungkan."
          : showPay
            ? "Selesaikan pembayaran atau pelunasan tagihan Anda."
            : "Pesanan sedang diproses atau sudah selesai."
      }
      actions={
        <>
          <DetailButton onClick={() => onViewDetail({ type: "villa", data: raw })} />
          {!confirming && showPay && (
            <button type="button" className="va-btn va-btn--sm" disabled={busy} onClick={handlePay}>
              {paying ? <Loader2 size={14} className="va-spin" /> : null}
              {f.status === "pending" ? "Bayar sekarang" : "Bayar pelunasan"}
            </button>
          )}
          {canCancel(raw) && (
            <CancelControls
              confirming={confirming}
              setConfirming={setConfirming}
              pending={cancel.isPending}
              disabled={busy}
              onConfirm={() => cancel.mutate(raw, { onSettled: () => setConfirming(false) })}
            />
          )}
        </>
      }
    />
  );
}

/* ==========================================================
   2) Event booking
   - Jika datanya terkait request event: TIDAK ada tombol bayar/batal di sini;
     pembayaran dilakukan dari tab "Request event".
   - Jika murni booking langsung (tidak ada request terkait): tombol bayar tersedia.
   ========================================================== */
function EventBookingCard({ raw, linkedRequest, onViewDetail, onGoToRequest }) {
  const queryClient = useQueryClient();
  const { put } = useFetch();
  const [confirming, setConfirming] = useState(false);
  const [paying, setPaying] = useState(false);

  const pkg = raw.villa_package || raw.package || {};
  const status = String(raw.status || "pending").toLowerCase();
  const total = raw.total_price ?? raw.price ?? pkg.price ?? 0;
  const fromRequest = Boolean(linkedRequest);

  const refresh = () => queryClient.invalidateQueries({ queryKey: [EVENT_BOOKINGS_KEY] });

  const cancel = useEventAction({
    path: `my-event-bookings/${raw.id}/cancel`,
    success: "Event booking dibatalkan.",
    invalidate: [EVENT_BOOKINGS_KEY],
  });

  const handlePay = async () => {
    try {
      setPaying(true);
      const resp = await put(eventBookingPayPath(raw.id), {});
      if (!resp.status) throw new Error(errorText(resp.error) || "Gagal memproses pembayaran event.");
      const token = snapTokenFrom(resp.data);
      if (!token) throw new Error("Token pembayaran tidak ditemukan.");
      await payWithSnap(token, refresh);
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setPaying(false);
    }
  };

  const busy = paying || cancel.isPending;
  const canActDirectly = !fromRequest && status === "pending";

  return (
    <Shell
      title={raw.booking_code || `EVENT-#${raw.id}`}
      tags={
        fromRequest && (
          <span className="va-bk__tag"><Sparkles size={12} /> Dari request event</span>
        )
      }
      subtitle={`Dipesan: ${formatDateTime(raw.created_at)}`}
      status={status}
      fields={[
        ["Paket event", raw.title || pkg.title || raw.package_title || "Paket event"],
        ["Mulai acara", formatDateTime(raw.start_at)],
        ["Selesai acara", formatDateTime(raw.end_at)],
        ["Jumlah tamu", raw.guest_count ? `${raw.guest_count} orang` : "-"],
        ["Total harga", total ? formatRupiah(total) : "-"],
      ]}
      notice={
        fromRequest && status === "pending" ? (
          <div className="va-alert" role="status">
            <span>
              Pesanan ini berasal dari pengajuan event, jadi pembayarannya dilakukan di tab Request event.{" "}
              <button type="button" className="va-link" onClick={() => onGoToRequest(linkedRequest.id)}>
                Buka request <ArrowRight size={14} />
              </button>
            </span>
          </div>
        ) : null
      }
      note={
        confirming
          ? "Batalkan event booking ini?"
          : canActDirectly
            ? "Selesaikan pembayaran event booking Anda."
            : fromRequest
              ? "Status mengikuti pengajuan event terkait."
              : "Pesanan sedang diproses atau sudah selesai."
      }
      actions={
        <>
          <DetailButton onClick={() => onViewDetail({ type: "event-booking", data: raw, linkedRequest })} />
          {canActDirectly && !confirming && (
            <button type="button" className="va-btn va-btn--sm" disabled={busy} onClick={handlePay}>
              {paying ? <Loader2 size={14} className="va-spin" /> : null} Bayar sekarang
            </button>
          )}
          {canActDirectly && (
            <CancelControls
              confirming={confirming}
              setConfirming={setConfirming}
              pending={cancel.isPending}
              disabled={busy}
              onConfirm={() => cancel.mutate(undefined, { onSettled: () => setConfirming(false) })}
            />
          )}
        </>
      }
    />
  );
}

/* ==========================================================
   3) Request event (pembayaran event yang berasal dari request dilakukan di sini)
   ========================================================== */
function EventRequestCard({ raw, focused, onViewDetail }) {
  const queryClient = useQueryClient();
  const { put } = useFetch();
  const [confirming, setConfirming] = useState(false);
  const [paying, setPaying] = useState(false);
  const cardRef = useRef(null);

  // Saat dituju dari tab Event booking, gulir ke kartu ini
  useEffect(() => {
    if (focused) cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focused]);

  const pkgObj = raw.villa_package || raw.package;
  const pkgId = raw.villa_package_id ?? pkgObj?.id;
  const isCustom = raw.custom === true || (raw.budget != null && !pkgId && !pkgObj);
  const status = String(raw.status || "pending").toLowerCase();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [EVENT_REQUESTS_KEY] });
    queryClient.invalidateQueries({ queryKey: [EVENT_BOOKINGS_KEY] });
  };

  const cancel = useEventAction({
    path: `my-event-requests/${raw.id}/cancel`,
    success: "Pengajuan event berhasil dibatalkan.",
    invalidate: [EVENT_REQUESTS_KEY, EVENT_BOOKINGS_KEY],
  });

  const handlePay = async () => {
    try {
      setPaying(true);
      const resp = await put(`my-event-requests/${raw.id}/pay`, {});
      if (!resp.status) throw new Error(errorText(resp.error) || "Gagal memproses pembayaran pengajuan event.");

      const data = resp.data?.data ?? resp.data;
      const token = snapTokenFrom(resp.data);
      if (!token) {
        if (data?.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }
        throw new Error("Token pembayaran tidak ditemukan.");
      }
      await payWithSnap(token, refresh);
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setPaying(false);
    }
  };

  const busy = paying || cancel.isPending;
  const canPay = status === "approved";
  const canCancelRequest = status === "pending" || status === "approved";

  const price = raw.price
    ? formatRupiah(raw.price)
    : isCustom
      ? raw.budget ? `Budget: ${formatRupiah(raw.budget)}` : "-"
      : pkgObj?.price ? formatRupiah(pkgObj.price) : "Sesuai paket";

  return (
    <Shell
      cardRef={cardRef}
      focused={focused}
      title={raw.title || `REQ-#${raw.id}`}
      tags={
        <span className="va-bk__tag">
          {isCustom ? (<><Sparkles size={12} /> Custom event</>) : (<><Package size={12} /> {pkgObj?.title || "Paket event"}</>)}
        </span>
      }
      subtitle={`Diajukan: ${formatDateTime(raw.created_at)}`}
      status={status}
      fields={[
        ["Mulai acara", formatDateTime(raw.start_at)],
        ["Selesai acara", formatDateTime(raw.end_at)],
        ["Jumlah tamu", raw.guest_count ? `${raw.guest_count} orang` : "-"],
        [raw.price ? "Harga final" : isCustom ? "Budget diajukan" : "Tarif paket", price],
      ]}
      notice={
        status === "rejected" && raw.reject_reason ? (
          <div className="va-alert" role="alert"><span><strong>Alasan penolakan:</strong> {raw.reject_reason}</span></div>
        ) : null
      }
      note={
        confirming
          ? "Batalkan pengajuan acara ini?"
          : canPay
            ? "Pengajuan disetujui! Silakan lakukan pembayaran."
            : status === "pending"
              ? "Menunggu konfirmasi dan review dari admin."
              : "Lihat detail pengajuan acara Anda."
      }
      actions={
        <>
          <DetailButton onClick={() => onViewDetail({ type: "event-request", data: raw })} />
          {canPay && !confirming && (
            <button type="button" className="va-btn va-btn--sm" disabled={busy} onClick={handlePay}>
              {paying ? <Loader2 size={14} className="va-spin" /> : null} Bayar sekarang
            </button>
          )}
          {canCancelRequest && (
            <CancelControls
              confirming={confirming}
              setConfirming={setConfirming}
              pending={cancel.isPending}
              disabled={busy}
              onConfirm={() => cancel.mutate(undefined, { onSettled: () => setConfirming(false) })}
            />
          )}
        </>
      }
    />
  );
}

/* ---------- isi dialog detail ---------- */
function DetailRows({ rows }) {
  return (
    <dl className="va-result__box">
      {rows.filter(([, v]) => v !== undefined && v !== null && v !== "").map(([label, value]) => (
        <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
      ))}
    </dl>
  );
}

/* ==========================================================
   Halaman
   ========================================================== */
export default function MyBookingsPage() {
  const { user } = useAuth();
  const { get } = useFetch();

  const [activeTab, setActiveTab] = useState("villa");
  const [modalTarget, setModalTarget] = useState(null);
  const [focusRequestId, setFocusRequestId] = useState(null);

  const enabled = Boolean(user);

  const { data: bookings = [], isLoading: loadingVilla, isError: errorVilla, error: errVilla } =
    useMyBookings({ enabled });

  const listQuery = (key, path, failMessage) => ({
    queryKey: [key],
    enabled,
    queryFn: async () => {
      const resp = await get(`${path}?unpage=true&sort=desc`);
      if (!resp.status) throw new Error(errorText(resp.error) || failMessage);
      const raw = resp.data?.data ?? resp.data;
      return Array.isArray(raw) ? raw : [];
    },
  });

  const { data: eventBookings = [], isLoading: loadingEvent, isError: errorEvent, error: errEvent } =
    useQuery(listQuery(EVENT_BOOKINGS_KEY, "my-event-bookings", "Gagal memuat event bookings"));

  const { data: eventRequests = [], isLoading: loadingRequest, isError: errorRequest, error: errRequest } =
    useQuery(listQuery(EVENT_REQUESTS_KEY, "my-event-requests", "Gagal memuat event requests"));

  // Event booking -> request terkait (null bila murni booking langsung)
  const linkedByBooking = useMemo(
    () => new Map(eventBookings.map((eb) => [eb.id, findLinkedRequest(eb, eventRequests)])),
    [eventBookings, eventRequests],
  );

  const { data: villaDetail, isFetching: fetchingVilla } = useQuery({
    queryKey: ["booking-detail", modalTarget?.data?.id],
    enabled: modalTarget?.type === "villa" && Boolean(modalTarget?.data?.id),
    queryFn: async () => {
      const resp = await get(`bookings/${modalTarget.data.id}`);
      if (!resp.status) throw new Error(errorText(resp.error) || "Gagal memuat detail");
      return resp.data;
    },
  });

  const { data: requestDetail, isFetching: fetchingRequest } = useQuery({
    queryKey: ["event-request-detail", modalTarget?.data?.id],
    enabled: modalTarget?.type === "event-request" && Boolean(modalTarget?.data?.id),
    queryFn: async () => {
      const resp = await get(`event-requests/${modalTarget.data.id}`);
      if (!resp.status) return modalTarget.data; // detail gagal -> pakai data dari daftar
      return resp.data?.data ?? resp.data;
    },
  });

  if (!user) return <Navigate to="/login" replace />;

  const isLoading = loadingVilla || loadingEvent || loadingRequest;
  const firstError = errVilla || errEvent || errRequest;

  if (isLoading) return <SectionState tone="paper" full label="Memuat riwayat pesanan Anda…" />;
  if (errorVilla || errorEvent || errorRequest) {
    return <SectionState tone="paper" full label="Pesanan gagal dimuat" error={firstError?.message} />;
  }

  const goToRequest = (requestId) => {
    setFocusRequestId(requestId);
    setActiveTab("request");
  };

  const tabs = [
    { key: "villa", label: "Sewa villa", count: bookings.length },
    { key: "event", label: "Event booking", count: eventBookings.length },
    { key: "request", label: "Request event", count: eventRequests.length },
  ];

  const empty = {
    villa: { title: "Belum ada pesanan villa", text: "Pesanan menginap Anda akan tampil di sini setelah melakukan pemesanan.", to: "/booking", cta: "Mulai pesan" },
    event: { title: "Belum ada event booking", text: "Pemesanan paket event langsung akan tampil di sini.", to: "/#paket", cta: "Lihat paket event" },
    request: { title: "Belum ada pengajuan event", text: "Pengajuan paket custom atau request acara khusus Anda akan tampil di sini.", to: "/#paket", cta: "Ajukan acara" },
  };

  const lists = { villa: bookings, event: eventBookings, request: eventRequests };
  const current = lists[activeTab];

  const target = modalTarget;
  const villaData = { ...target?.data, ...(villaDetail?.data ?? villaDetail ?? {}) };
  const vf = bookingFields(villaData);
  const requestData = requestDetail || target?.data;

  const dialogTitle =
    target?.type === "villa" ? `Detail pesanan ${vf.code}`
    : target?.type === "event-booking" ? `Detail event booking #${target.data.id}`
    : target?.type === "event-request" ? `Detail pengajuan event #${target.data.id}`
    : "";

  return (
    <main className="va-paper">
      <header className="va-ink va-page-hero">
        <div className="va-wrap va-page-hero__inner">
          <div>
            <span className="va-eyebrow">Akun saya</span>
            <h1 className="va-page-hero__title">Riwayat pesanan</h1>
          </div>
          <p className="va-lead">
            Pantau status pemesanan villa, event booking, dan pengajuan acara khusus Anda di satu tempat.
          </p>
        </div>
      </header>

      <section className="va-section">
        <div className="va-wrap">
          <div className="va-tabs" role="tablist" aria-label="Jenis pesanan">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={activeTab === t.key}
                className="va-tab"
                onClick={() => setActiveTab(t.key)}
              >
                {t.label} <span className="va-muted">({t.count})</span>
              </button>
            ))}
          </div>

          {current.length === 0 ? (
            <div className="va-empty">
              <strong>{empty[activeTab].title}</strong>
              <p className="va-text">{empty[activeTab].text}</p>
              <Link to={empty[activeTab].to} className="va-btn" style={{ marginTop: "1rem" }}>{empty[activeTab].cta}</Link>
            </div>
          ) : (
            <div className="va-bk-list">
              {activeTab === "villa" &&
                bookings.map((b) => <VillaCard key={b.id} raw={b} onViewDetail={setModalTarget} />)}

              {activeTab === "event" &&
                eventBookings.map((eb) => (
                  <EventBookingCard
                    key={eb.id}
                    raw={eb}
                    linkedRequest={linkedByBooking.get(eb.id)}
                    onViewDetail={setModalTarget}
                    onGoToRequest={goToRequest}
                  />
                ))}

              {activeTab === "request" &&
                eventRequests.map((er) => (
                  <EventRequestCard
                    key={er.id}
                    raw={er}
                    focused={String(er.id) === String(focusRequestId)}
                    onViewDetail={setModalTarget}
                  />
                ))}
            </div>
          )}
        </div>
      </section>

      <Dialog open={Boolean(target)} onOpenChange={(open) => !open && setModalTarget(null)}>
        <DialogContent className="va-paper va-modal" style={{ width: "min(820px, calc(100vw - 2rem))", zIndex: 9999 }}>
          <DialogHeader className="va-modal__head">
            <DialogTitle className="va-modal__title">{dialogTitle}</DialogTitle>
            <DialogDescription className="va-modal__desc">
              {target?.type === "villa" && "Rincian menginap, add-on, dan pembayaran."}
              {target?.type === "event-booking" && "Rincian jadwal pelaksanaan event dan biaya yang dipesan."}
              {target?.type === "event-request" && "Konsep acara, jadwal, serta status penawaran dan pembayaran."}
            </DialogDescription>
          </DialogHeader>

          <div className="va-modal__body">
            {target?.type === "villa" &&
              (fetchingVilla ? (
                <div className="va-state" style={{ minHeight: "10rem" }}><Loader2 className="va-spin" size={24} /><p>Memuat detail…</p></div>
              ) : (
                <>
                  <DetailRows
                    rows={[
                      ["Status", LABEL[vf.status] ?? vf.status],
                      ["Tipe sewa", vf.rentalTitle],
                      ["Check-in", formatDate(vf.checkIn)],
                      ["Check-out", formatDate(vf.checkOut)],
                      ["Durasi", vf.stay],
                      ["Jumlah tamu", vf.guests ? `${vf.guests} orang` : null],
                      ["Keperluan", vf.reason],
                      ["Total", vf.total ? formatRupiah(vf.total) : null],
                    ]}
                  />
                  {vf.addons.length > 0 && (
                    <div>
                      <span className="va-label">Add-on</span>
                      <ul className="va-checks" style={{ marginTop: "0.6rem" }}>
                        {vf.addons.map((a, i) => (
                          <li key={a.id ?? i}>{a.addon?.title ?? a.title ?? `Add-on #${a.addon_id ?? a.id}`} × {a.quantity ?? 1}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {Array.isArray(villaData.payments) && villaData.payments.length > 0 && (
                    <div>
                      <span className="va-label">Pembayaran</span>
                      <DetailRows
                        rows={villaData.payments.map((p, i) => [
                          `Pembayaran ${i + 1}`,
                          `${LABEL[String(p.status).toLowerCase()] ?? p.status}${p.amount ?? p.gross_amount ? ` · ${formatRupiah(p.amount ?? p.gross_amount)}` : ""}`,
                        ])}
                      />
                    </div>
                  )}
                </>
              ))}

            {target?.type === "event-booking" && (
              <DetailRows
                rows={[
                  ["Status", LABEL[String(target.data.status).toLowerCase()] ?? target.data.status],
                  ["Paket", target.data.title || target.data.villa_package?.title || target.data.package_title || "Paket event"],
                  ["Mulai", formatDateTime(target.data.start_at)],
                  ["Selesai", formatDateTime(target.data.end_at)],
                  ["Jumlah tamu", target.data.guest_count ? `${target.data.guest_count} orang` : null],
                  ["Total biaya", formatRupiah(target.data.total_price ?? target.data.price ?? target.data.villa_package?.price ?? 0)],
                  ["Asal pesanan", target.linkedRequest ? `Pengajuan event${target.linkedRequest.title ? `: ${target.linkedRequest.title}` : ""} (bayar di tab Request event)` : "Booking langsung"],
                ]}
              />
            )}

            {target?.type === "event-request" &&
              (fetchingRequest ? (
                <div className="va-state" style={{ minHeight: "10rem" }}><Loader2 className="va-spin" size={24} /><p>Memuat detail pengajuan…</p></div>
              ) : (
                requestData && (
                  <>
                    <DetailRows
                      rows={[
                        ["Status", LABEL[String(requestData.status).toLowerCase()] ?? requestData.status],
                        ["Judul", requestData.title],
                        ["Mulai", formatDateTime(requestData.start_at)],
                        ["Selesai", formatDateTime(requestData.end_at)],
                        ["Jumlah tamu", requestData.guest_count ? `${requestData.guest_count} orang` : null],
                        ["Budget diajukan", requestData.budget != null ? formatRupiah(requestData.budget) : null],
                        ["Harga disetujui", requestData.price != null ? formatRupiah(requestData.price) : null],
                      ]}
                    />
                    {requestData.description && (
                      <div>
                        <span className="va-label">Deskripsi</span>
                        <p className="va-text" style={{ marginTop: "0.5rem", whiteSpace: "pre-line" }}>{requestData.description}</p>
                      </div>
                    )}
                    {requestData.reject_reason && (
                      <div className="va-alert" role="alert"><span><strong>Alasan penolakan:</strong> {requestData.reject_reason}</span></div>
                    )}
                  </>
                )
              ))}
          </div>

          <DialogFooter className="va-modal__foot">
            <button type="button" className="va-btn va-btn--ghost" onClick={() => setModalTarget(null)}>Tutup</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}