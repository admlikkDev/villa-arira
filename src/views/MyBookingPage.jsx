import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { formatRupiah } from "../hooks/Usevillaquery";
import {
  BOOKINGS_KEY,
  STATUS_LABEL,
  bookingFields,
  canCancel,
  canCheckIn,
  canComplete,
  errorText,
  useCancelBooking,
  useCheckInBooking,
  useCompleteBooking,
  useMyBookings,
} from "../hooks/useBooking";
import { loadSnap } from "../hooks/useSnap";
import SectionState from "../components/SectionState";
import "../assets/styles/villa.css";
import "../assets/styles/booking.css";

const formatDate = (iso) =>
  iso ? new Date(`${String(iso).slice(0, 10)}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-";

function BookingCard({ raw }) {
  const f = bookingFields(raw);
  const queryClient = useQueryClient();
  const cancel = useCancelBooking();
  const checkIn = useCheckInBooking();
  const complete = useCompleteBooking();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [paying, setPaying] = useState(false);

  const busy = cancel.isPending || checkIn.isPending || complete.isPending || paying;
  const refresh = () => queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });

  // Lanjutkan pembayaran untuk pesanan pending (jika server menyertakan snap_token)
  const pay = async () => {
    try {
      setPaying(true);
      const snap = await loadSnap();
      setPaying(false);
      snap.pay(f.snapToken, {
        onSuccess: () => { toast.success("Pembayaran berhasil!"); refresh(); },
        onPending: () => { toast.info("Menunggu pembayaran selesai."); refresh(); },
        onError: () => toast.error("Pembayaran gagal."),
        onClose: () => toast.warning("Pembayaran belum selesai."),
      });
    } catch (err) {
      setPaying(false);
      toast.error(errorText(err));
    }
  };

  return (
    <article className="va-bk">
      <div className="va-bk__head">
        <span className="va-bk__code">{f.code}</span>
        <span className="va-status" data-status={f.status}>{STATUS_LABEL[f.status] ?? (f.status || "-")}</span>
      </div>

      <dl className="va-bk__body">
        <div><dt>Tipe sewa</dt><dd>{f.rentalTitle}</dd></div>
        <div><dt>Check-in</dt><dd>{formatDate(f.checkIn)}</dd></div>
        <div><dt>Check-out</dt><dd>{formatDate(f.checkOut)}</dd></div>
        <div><dt>Durasi</dt><dd>{f.stay}</dd></div>
        <div><dt>Tamu</dt><dd>{f.guests ? `${f.guests} orang` : "-"}</dd></div>
        <div><dt>Total</dt><dd>{f.total ? formatRupiah(f.total) : "-"}</dd></div>
        {f.checkedInAt && <div><dt>Check-in aktual</dt><dd>{formatDate(f.checkedInAt)}</dd></div>}
        {f.checkedOutAt && <div><dt>Check-out aktual</dt><dd>{formatDate(f.checkedOutAt)}</dd></div>}
      </dl>

      {f.addons.length > 0 && (
        <p className="va-bk__addons">
          Add-on: {f.addons.map((a) => `${a.addon?.title ?? a.title ?? `Add-on #${a.addon_id ?? a.id}`} ×${a.quantity ?? 1}`).join(", ")}
        </p>
      )}

      {(canCancel(raw) || canCheckIn(raw) || canComplete(raw)) && (
        <div className="va-bk__foot">
          {confirmCancel ? (
            <>
              <span className="va-text">Batalkan pemesanan ini? Tindakan tidak dapat diurungkan.</span>
              <div className="va-bk__actions">
                <button type="button" className="va-btn va-btn--sm" disabled={busy} onClick={() => cancel.mutate(raw, { onSettled: () => setConfirmCancel(false) })}>
                  {cancel.isPending ? <Loader2 size={14} className="va-spin" /> : null} Ya, batalkan
                </button>
                <button type="button" className="va-btn va-btn--ghost va-btn--sm" disabled={busy} onClick={() => setConfirmCancel(false)}>
                  Kembali
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="va-text">
                {canCancel(raw) && "Selesaikan pembayaran atau batalkan pesanan ini."}
                {canCheckIn(raw) && "Sudah tiba di villa? Lakukan check-in."}
                {!canCheckIn(raw) && canComplete(raw) && "Sudah selesai menginap? Lakukan check-out."}
              </span>
              <div className="va-bk__actions">
                {canCancel(raw) && f.snapToken && (
                  <button type="button" className="va-btn va-btn--sm" disabled={busy} onClick={pay}>
                    {paying ? <Loader2 size={14} className="va-spin" /> : null} Bayar
                  </button>
                )}
                {canCancel(raw) && (
                  <button type="button" className="va-btn va-btn--ghost va-btn--sm" disabled={busy} onClick={() => setConfirmCancel(true)}>
                    Batalkan
                  </button>
                )}
                {canCheckIn(raw) && (
                  <button type="button" className="va-btn va-btn--sm" disabled={busy} onClick={() => checkIn.mutate(raw)}>
                    {checkIn.isPending ? <Loader2 size={14} className="va-spin" /> : null} Check-in
                  </button>
                )}
                {canComplete(raw) && (
                  <button type="button" className={`va-btn va-btn--sm${canCheckIn(raw) ? " va-btn--ghost" : ""}`} disabled={busy} onClick={() => complete.mutate(raw)}>
                    {complete.isPending ? <Loader2 size={14} className="va-spin" /> : null} Check-out
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </article>
  );
}

export default function MyBookingsPage() {
  const { user } = useAuth();
  const { data: bookings = [], isLoading, isError, error } = useMyBookings();

  if (!user) return <Navigate to="/login" replace />;
  if (isLoading) return <SectionState tone="paper" full label="Memuat pesanan Anda…" />;
  if (isError) return <SectionState tone="paper" full label="Pesanan gagal dimuat" error={error.message} />;

  return (
    <main className="va-paper">
      <header className="va-ink va-page-hero">
        <div className="va-wrap va-page-hero__inner">
          <div>
            <span className="va-eyebrow">Akun saya</span>
            <h1 className="va-page-hero__title">Riwayat pesanan</h1>
          </div>
          <p className="va-lead">Pantau status pemesanan, selesaikan pembayaran, atau lakukan check-in dan check-out.</p>
        </div>
      </header>

      <section className="va-section">
        <div className="va-wrap">
          {bookings.length === 0 ? (
            <div className="va-empty">
              <strong>Belum ada pesanan</strong>
              <p className="va-text">Pesanan Anda akan tampil di sini setelah melakukan pemesanan.</p>
              <Link to="/booking" className="va-btn" style={{ marginTop: "1rem" }}>Mulai pesan</Link>
            </div>
          ) : (
            <div className="va-bk-list">
              {bookings.map((b) => <BookingCard key={b.id} raw={b} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}