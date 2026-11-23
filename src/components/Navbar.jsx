import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  ChevronRight,
  Heart,
  History,
  Home,
  Images,
  LogIn,
  LogOut,
  Mail,
  Menu,
  User,
  UserPlus,
} from "lucide-react";
import Cart from "./Cart";
import "../assets/styles/villa.css";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";

// Booking milik user yang sedang login (GET /api/my-bookings)
const MY_BOOKINGS_ENDPOINT = "my-bookings";
const HISTORY_PATH = "/riwayat-pesanan";

// Halaman dengan hero layar penuh: navbar desktop baru muncul setelah scroll
const HERO_PAGES = ["/", "/wedding"];

// Menu desktop
const menuItems = [
  { name: "Home", to: "/", end: true },
  { name: "Booking", to: "/booking" },
  { name: "Wedding", to: "/wedding", highlight: true },
  { name: "Gallery", to: "/gallery" },
  { name: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user, logout } = useAuth();
  const { get } = useFetch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const username = user?.user?.username;

  // Cek apakah user pernah booking (hanya saat login)
  const { data: bookingData } = useQuery({
    queryKey: ["my-bookings-exists", user?.user?.id ?? username],
    enabled: Boolean(user),
    retry: false,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const resp = await get(`${MY_BOOKINGS_ENDPOINT}?page=1&size=1`);
      if (!resp.status) throw new Error(resp.error);
      return resp.data;
    },
  });

  const bookingList = bookingData?.data ?? bookingData;
  const totalBookings =
    bookingData?.pagination?.total_items ??
    (Array.isArray(bookingList) ? bookingList.length : 0);
  const hasBooked = Boolean(user) && totalBookings > 0;

  // Navbar desktop: selalu tampil, kecuali di halaman hero (muncul setelah scroll 80px)
  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 80;
      setScrolled(s);
      if (!s) setCartOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  const showNav = !HERO_PAGES.includes(pathname) || scrolled;

  // Klik di mana saja menutup keranjang
  useEffect(() => {
    const close = () => setCartOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // Sheet "Lainnya" (HP): tutup saat pindah halaman atau tekan Escape
  useEffect(() => {
    setSheetOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!sheetOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setSheetOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheetOpen]);

  const exit = () => {
    setSheetOpen(false);
    logout();
    setTimeout(() => navigate("/"), 1000);
  };

  const brandClick = () => {
    if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const moreActive =
    sheetOpen || pathname === "/contact" || pathname === HISTORY_PATH;
  // console.log(user?.user?.role)
  return (
    <>
      {/* ===== DESKTOP: navbar atas ===== */}
      <nav
        className="va-nav"
        data-visible={showNav}
        aria-label="Navigasi utama"
      >
        <Link to="/" className="va-brand" onClick={brandClick}>
          Villa Arira
        </Link>

        <ul className="va-nav__menu">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.highlight ? (
                <Link to={item.to} className="va-nav__wedding">
                  <Heart size={15} /> {item.name}
                </Link>
              ) : (
                <NavLink to={item.to} end={item.end} className="va-nav__link">
                  {item.name}
                </NavLink>
              )}
            </li>
          ))}
        </ul>

        <div className="va-nav__actions">
          {user ? (
            <>
              <span className="va-nav__user">
                <User size={15} /> {username}
              </span>
              {hasBooked && (
                <Link
                  to={HISTORY_PATH}
                  className="va-btn va-btn--ghost va-btn--sm"
                >
                  <History size={15} /> Riwayat
                </Link>
              )}
              {user?.user?.role == "admin" ? (
                <>
                  <Link to="/admin/hero-section" className="va-btn va-btn--sm">
                    Dashboard
                  </Link>
                </>
              ) : (
                <></>
              )}
              <Link to="/booking#cek-jadwal" className="va-btn va-btn--sm">
                Booking
              </Link>
              <button
                className="va-btn va-btn--ghost va-btn--sm"
                onClick={exit}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="va-btn va-btn--ghost va-btn--sm">
                Login
              </Link>
              <Link to="/register" className="va-btn va-btn--sm">
                Register
              </Link>
            </>
          )}
        </div>

        <Cart display={cartOpen ? "flex" : "none"} />
      </nav>

      {/* ===== HP: tab bar bawah ===== */}
      <nav className="va-paper va-tabbar" aria-label="Navigasi utama">
        <NavLink to="/" end className="va-tab-item">
          <Home size={20} strokeWidth={1.6} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/booking" className="va-tab-item">
          <CalendarCheck size={20} strokeWidth={1.6} />
          <span>Booking</span>
        </NavLink>
        <NavLink to="/wedding" className="va-tab-item va-tab-item--wedding">
          <span className="va-tab-item__icon">
            <Heart size={22} />
          </span>
          <span>Wedding</span>
        </NavLink>
        <NavLink to="/gallery" className="va-tab-item">
          <Images size={20} strokeWidth={1.6} />
          <span>Galeri</span>
        </NavLink>
        <button
          type="button"
          className="va-tab-item"
          aria-current={moreActive ? "page" : undefined}
          aria-expanded={sheetOpen}
          aria-haspopup="dialog"
          onClick={() => setSheetOpen((o) => !o)}
        >
          <Menu size={20} strokeWidth={1.6} />
          <span>Lainnya</span>
        </button>
      </nav>

      {/* ===== HP: sheet "Lainnya" ===== */}
      {sheetOpen && (
        <>
          <div
            className="va-sheet-overlay"
            onClick={() => setSheetOpen(false)}
          />
          <div
            className="va-paper va-sheet"
            role="dialog"
            aria-label="Menu lainnya"
          >
            {user && (
              <div className="va-sheet__user">
                <span className="va-sb__avatar">
                  {(username ?? "?").charAt(0).toUpperCase()}
                </span>
                <div>
                  <strong>{username}</strong>
                  <small>Akun Anda</small>
                </div>
              </div>
            )}

            <Link to="/contact" className="va-sheet__link">
              <Mail size={20} strokeWidth={1.5} /> Contact
              <ChevronRight size={18} />
            </Link>
            {hasBooked && (
              <Link to={HISTORY_PATH} className="va-sheet__link">
                <History size={20} strokeWidth={1.5} /> Riwayat Booking
                <ChevronRight size={18} />
              </Link>
            )}

            {user ? (
              <button type="button" className="va-sheet__link" onClick={exit}>
                <LogOut size={20} strokeWidth={1.5} /> Logout
              </button>
            ) : (
              <div className="va-sheet__auth">
                <Link to="/login" className="va-btn va-btn--ghost">
                  <LogIn size={16} /> Login
                </Link>
                <Link to="/register" className="va-btn">
                  <UserPlus size={16} /> Register
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
