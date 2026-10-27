import { useState, useEffect } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import Cart from "./Cart";
import "../assets/styles/villa.css";
import { useAuth } from "../hooks/useAuth";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Booking", href: "/booking" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

// Ganti dengan jumlah item keranjang yang sebenarnya
const cartCount = 2;

export default function Navbar() {
  const [showNav, setShowNav] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { user } = useAuth();

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
          <button
            className="va-btn va-btn--sm"
            onClick={() => (location.href = "/booking#cek-jadwal")}
          >
            Booking
          </button>
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
        </div>
      )}

      <Cart display={cartOpen ? "flex" : "none"} />
    </nav>
  );
}
