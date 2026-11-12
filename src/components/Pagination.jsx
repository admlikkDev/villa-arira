import { ChevronLeft, ChevronRight } from "lucide-react";
import "../assets/styles/villa.css";

// 1 … 7 8 9 … 20
const getPageItems = (current, total, siblings = 1) => {
  const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
  if (total <= siblings * 2 + 5) return range(1, total);

  const left = Math.max(current - siblings, 1);
  const right = Math.min(current + siblings, total);
  const dotsLeft = left > 2;
  const dotsRight = right < total - 1;
  const edge = 3 + siblings * 2;

  if (!dotsLeft && dotsRight) return [...range(1, edge), "dots-right", total];
  if (dotsLeft && !dotsRight) return [1, "dots-left", ...range(total - edge + 1, total)];
  return [1, "dots-left", ...range(left, right), "dots-right", total];
};

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <nav className="va-pager" aria-label="Navigasi halaman">
      <span className="va-pager__info">Halaman {page} dari {totalPages}</span>
      <button type="button" aria-label="Halaman sebelumnya" disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft size={16} />
      </button>
      {getPageItems(page, totalPages).map((item) =>
        typeof item === "string" ? (
          <span key={item} className="va-pager__dots" aria-hidden="true">…</span>
        ) : (
          <button key={item} type="button" aria-label={`Halaman ${item}`} aria-current={page === item ? "page" : undefined} onClick={() => onChange(item)}>
            {item}
          </button>
        ),
      )}
      <button type="button" aria-label="Halaman berikutnya" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}