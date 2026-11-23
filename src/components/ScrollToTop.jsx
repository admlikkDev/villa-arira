import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Jika URL memiliki hash (misal: /#paket), arahkan ke elemen tersebut
    if (hash) {
      const target = document.getElementById(hash.replace("#", ""));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Jika tidak ada hash, kembalikan scroll ke paling atas
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Gunakan "instant" agar langsung di atas tanpa animasi lambat
    });
  }, [pathname, hash]);

  return null;
}