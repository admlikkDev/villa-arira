import { useState, useEffect } from "react";
import { History, Menu, ShoppingBag, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Cart from "./Cart";
import "../assets/styles/villa.css";
import { useAuth } from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Booking", href: "/booking" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

// Booking milik user yang sedang login (GET /api/my-bookings)
const MY_BOOKINGS_ENDPOINT = "my-bookings";
const HISTORY_PATH = "/riwayat-pesanan";

// Ganti dengan jumlah item keranjang yang sebenarnya
const cartCount = 2;

export default function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user, logout } = useAuth();
  const { get } = useFetch();
  const navigate = useNavigate();

  // console.log(user?.user?.username)

  // Cek apakah user pernah booking (hanya saat login)
  const { data: bookingData } = useQuery({
    queryKey: ["my-bookings-exists", user?.data?.user?.id ?? user?.data?.user?.username],
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

  // Navbar muncul setelah scroll 80px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setShowNav(true);
      } else {
        setShowNav(false);
        setMobileMenuOpen(false);
        setCartOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Klik di mana saja menutup keranjang (didaftarkan sekali, bukan di setiap render)
  useEffect(() => {
    const close = () => setCartOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const toggleCart = (e) => {
    e.stopPropagation();
    setCartOpen((prev) => !prev);
  };

  const handleSmoothScroll = (e, href) => {
    setMobileMenuOpen(false);
    if (!href.startsWith("#")) return;

    e.preventDefault();
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.getElementById(href.substring(1));
    if (target) {
      const navHeight = 80;
      const top =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const exit = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <nav className="va-nav" data-visible={showNav}>
      <a
        href="#"
        className="va-brand"
        onClick={(e) => handleSmoothScroll(e, "#")}
      >
        Villa Arira
      </a>

      <ul className="va-nav__menu">
        {menuItems.map((item) => (
          <li key={item.name}>
            <a
              href={item.href}
              className="va-nav__link"
              onClick={(e) => handleSmoothScroll(e, item.href)}
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>

      <div className="va-nav__actions">
        {user ? (
          <>
            <p>{user?.user?.username}</p>
            {hasBooked && (
              <button
                className="va-btn va-btn--ghost va-btn--sm"
                onClick={() => navigate(HISTORY_PATH)}
              >
                <History size={15} /> Riwayat Booking
              </button>
            )}
            <button
              className="va-btn va-btn--sm"
              onClick={() => (location.href = "/booking#cek-jadwal")}
            >
              Booking
            </button>
            <button className="va-btn va-btn--sm" onClick={exit}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="va-btn va-btn--sm"
              onClick={() => (location.href = "/login")}
            >
              Login
            </button>
            <button
              className="va-btn va-btn--sm"
              onClick={() => (location.href = "/register")}
            >
              Register
            </button>
          </>
        )}

        {/* <button className="va-icon-btn" onClick={toggleCart} aria-label="Buka keranjang" aria-expanded={cartOpen}>
                    <ShoppingBag size={20} strokeWidth={1.5} />
                    {cartCount > 0 && <span className="va-badge">{cartCount}</span>}
                </button> */}

        <button
          className="va-icon-btn va-nav__burger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="va-nav__panel">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
            >
              {item.name}
            </a>
          ))}
          {hasBooked && (
            <a href={HISTORY_PATH} onClick={() => setMobileMenuOpen(false)}>
              Riwayat Booking
            </a>
          )}
        </div>
      )}

      <Cart display={cartOpen ? "flex" : "none"} />
    </nav>
  );
}