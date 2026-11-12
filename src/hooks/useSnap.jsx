// Memuat Midtrans Snap sekali saja (tidak perlu <script> di index.html).
// .env: VITE_MIDTRANS_CLIENT_KEY=...   VITE_MIDTRANS_ENV=sandbox | production
const SNAP_URL =
  import.meta.env.VITE_MIDTRANS_ENV === "production"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

let loading = null;

export function loadSnap() {
  if (typeof window === "undefined") return Promise.reject(new Error("Snap hanya berjalan di browser"));
  if (window.snap) return Promise.resolve(window.snap);
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SNAP_URL;
    script.async = true;
    script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY ?? "");
    script.onload = () => (window.snap ? resolve(window.snap) : reject(new Error("Midtrans Snap tidak tersedia")));
    script.onerror = () => {
      loading = null; // izinkan mencoba lagi
      reject(new Error("Gagal memuat Midtrans Snap. Periksa koneksi internet Anda."));
    };
    document.head.appendChild(script);
  });

  return loading;
}