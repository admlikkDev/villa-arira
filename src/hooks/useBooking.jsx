import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useFetch from "./useFetch";
import { toArray, unwrap } from "./Usevillaquery";
import { formatStay } from "./stay";

export const BOOKING_PATH = "my-bookings"; // endpoint pelanggan
export const ADMIN_BOOKING_PATH = "bookings"; // endpoint admin (semua booking) — sesuaikan dengan backend
export const BOOKINGS_KEY = ["my-bookings"];
export const ADMIN_BOOKINGS_KEY = ["admin-bookings"];

// Method untuk endpoint aksi (cancel / check-in / complete). Ubah ke "post" jika backend memakai POST.
const ACTION_METHOD = "put";

/* ---------- helper ---------- */
export const errorText = (e) => {
  if (!e) return "Terjadi kesalahan.";
  if (typeof e === "string") return e;
  if (e instanceof Error) return e.message;
  if (typeof e === "object") {
    const first = Object.values(e)[0];
    return Array.isArray(first) ? first[0] : String(first ?? "Terjadi kesalahan.");
  }
  return String(e);
};

const pick = (obj, ...keys) => {
  for (const k of keys) if (obj?.[k] !== undefined && obj?.[k] !== null && obj?.[k] !== "") return obj[k];
  return undefined;
};

// Respons pembuatan booking bisa { booking, snap_token } atau data booking langsung
export const extractBooking = (body) => {
  const d = unwrap(body);
  if (d?.booking) return { ...d.booking, snap_token: d.snap_token ?? d.booking.snap_token };
  return d;
};

// Bentuk booking yang seragam untuk semua halaman (menerima snake_case / camelCase)
export const bookingFields = (b) => {
  const checkIn = pick(b, "check_in_date", "checkInDate");
  const checkOut = pick(b, "check_out_date", "checkOutDate");
  const status = String(b?.status ?? "").toLowerCase();

  return {
    id: b?.id ?? b?.booking_id,
    code: pick(b, "booking_code", "code", "order_id") ?? (b?.id ? `#${b.id}` : "-"),
    status: status === "canceled" ? "cancelled" : status,
    rentalTitle: b?.rental_option?.title ?? pick(b, "rental_option_name", "unit_name") ?? "-",
    checkIn,
    checkOut,
    stay: formatStay(checkIn, checkOut), // "2 hari 1 malam"
    guests: pick(b, "guest_count", "guestCount"),
    total: pick(b, "total_price", "total_amount", "grand_total", "total"),
    addons: b?.booking_addons ?? b?.addons ?? [],
    reason: b?.reason?.text ?? b?.reason?.title ?? pick(b, "reason_text"),
    customerName: b?.user?.username ?? b?.user?.name ?? pick(b, "guest_name", "customer_name", "name") ?? "-",
    customerEmail: b?.user?.email ?? pick(b, "email"),
    customerPhone: b?.user?.phone ?? pick(b, "phone", "phone_number"),
    checkedInAt: pick(b, "check_in_at", "checkInAt", "checked_in_at"),
    checkedOutAt: pick(b, "check_out_at", "checkOutAt", "checked_out_at"),
    createdAt: pick(b, "created_at", "createdAt"),
    snapToken: b?.snap_token,
  };
};

export const STATUS_LABEL = {
  pending: "Menunggu pembayaran",
  paid: "Lunas",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  expired: "Kedaluwarsa",
  failed: "Gagal",
};

// Aturan status (server tetap yang menentukan; ini untuk menyembunyikan tombol & pesan yang jelas)
export const canCancel = (b) => ["", "pending"].includes(bookingFields(b).status);
export const canCheckIn = (b) => {
  const f = bookingFields(b);
  return f.status === "paid" && !f.checkedInAt;
};
export const canComplete = (b) => {
  const f = bookingFields(b);
  return f.status === "paid" && !f.checkedOutAt;
};

/* ---------- query ---------- */
const sortNewest = (list) => [...list].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

export function useMyBookings() {
  const { get } = useFetch();
  return useQuery({
    queryKey: BOOKINGS_KEY,
    queryFn: async () => {
      const resp = await get(`${BOOKING_PATH}?unpage=true`);
      if (!resp.status) throw new Error(errorText(resp.error));
      return resp.data;
    },
    select: (body) => sortNewest(toArray(body)),
    staleTime: 30 * 1000,
    retry: 1,
  });
}

// Admin: semua booking dari semua pelanggan
export function useAdminBookings() {
  const { get } = useFetch();
  return useQuery({
    queryKey: ADMIN_BOOKINGS_KEY,
    queryFn: async () => {
      const resp = await get(`${ADMIN_BOOKING_PATH}?unpage=true`);
      if (!resp.status) throw new Error(errorText(resp.error));
      return resp.data;
    },
    select: (body) => sortNewest(toArray(body)),
    staleTime: 15 * 1000,
    retry: 1,
  });
}

export function useMyBooking(id) {
  const { get } = useFetch();
  return useQuery({
    queryKey: [...BOOKINGS_KEY, id],
    enabled: Boolean(id),
    queryFn: async () => {
      const resp = await get(`${BOOKING_PATH}/${id}`);
      if (!resp.status) throw new Error(errorText(resp.error));
      return resp.data;
    },
    select: (body) => extractBooking(body),
    retry: 1,
  });
}

/* ---------- aksi: cancel / check-in / complete ---------- */
function useBookingAction({ basePath, action, guard, guardMessage, successMessage }) {
  const { put, post } = useFetch();
  const queryClient = useQueryClient();
  const send = ACTION_METHOD === "post" ? post : put;

  return useMutation({
    // `target` boleh objek booking (dicek statusnya dulu) atau id saja
    mutationFn: async (target) => {
      const isObject = target && typeof target === "object";
      const id = isObject ? (target.id ?? target.booking_id) : target;
      if (!id) throw new Error("ID pemesanan tidak valid.");
      if (isObject && !guard(target)) throw new Error(guardMessage);

      const resp = await send(`${basePath}/${id}/${action}`, {});
      if (!resp.status) throw new Error(errorText(resp.error));
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY });
      queryClient.invalidateQueries({ queryKey: ADMIN_BOOKINGS_KEY });
      toast.success(successMessage);
    },
    onError: (err) => toast.error(err.message),
  });
}

// `basePath` default = endpoint pelanggan; admin memakai ADMIN_BOOKING_PATH.

// Batalkan booking — hanya jika status masih pending
export const useCancelBooking = (basePath = BOOKING_PATH) =>
  useBookingAction({
    basePath,
    action: "cancel",
    guard: canCancel,
    guardMessage: "Pemesanan hanya bisa dibatalkan selama statusnya masih menunggu pembayaran.",
    successMessage: "Pemesanan berhasil dibatalkan.",
  });

// Check-in di villa — hanya jika status paid
export const useCheckInBooking = (basePath = BOOKING_PATH) =>
  useBookingAction({
    basePath,
    action: "check-in",
    guard: canCheckIn,
    guardMessage: "Check-in hanya bisa dilakukan untuk pemesanan yang sudah lunas dan belum check-in.",
    successMessage: "Check-in berhasil.",
  });

// Selesai / check-out — hanya jika status paid
export const useCompleteBooking = (basePath = BOOKING_PATH) =>
  useBookingAction({
    basePath,
    action: "complete",
    guard: canComplete,
    guardMessage: "Check-out hanya bisa dilakukan untuk pemesanan yang sudah lunas.",
    successMessage: "Check-out berhasil.",
  });