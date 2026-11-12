// Aturan durasi: hari check-in dan hari check-out sama-sama dihitung.
// Contoh: 20 Nov → 21 Nov = 2 hari 1 malam; 20 Nov → 22 Nov = 3 hari 2 malam.
const DAY_MS = 86400000;
const parse = (iso) => new Date(`${String(iso).slice(0, 10)}T00:00:00`);

export const countNights = (start, end) =>
  !start || !end ? 0 : Math.max(Math.round((parse(end) - parse(start)) / DAY_MS), 0);

export const countDays = (start, end) => {
  const n = countNights(start, end);
  return n > 0 ? n + 1 : 0;
};

export const stayLabel = (nights) => (nights > 0 ? `${nights + 1} hari ${nights} malam` : "-");
export const formatStay = (start, end) => stayLabel(countNights(start, end));

// Semua tanggal yang dikenai tarif: check-in sampai check-out (inklusif), format YYYY-MM-DD
export const eachDay = (start, end) => {
  const days = countDays(start, end);
  const out = [];
  for (let i = 0; i < days; i++) {
    const d = parse(start);
    d.setDate(d.getDate() + i);
    out.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }
  return out;
};