import "../assets/styles/villa.css";
import { useVillaList } from "../hooks/Usevillaquery";
import SectionState from "./SectionState";

export default function AturanVilla({
  checkIn = "14.00",
  checkOut = "12.00",
}) {
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useVillaList("villa-rules");

  if (isLoading)
    return <SectionState tone="paper" label="Memuat data aturan villa…" />;
  if (isError)
    return (
      <SectionState
        tone="paper"
        label="Data aturan villa gagal dimuat"
        error={error.message}
      />
    );
  if (items.length === 0) return null;
  console.log(items);

  return (
    <section id="aturan" className="va-ink va-section">
      <div className="va-wrap va-rules-wrap">
        <div className="va-rules-side">
          <span className="va-label">Sebelum menginap</span>
          <h2 className="va-h2" style={{ margin: "0.6rem 0 1.25rem" }}>
            Aturan villa
          </h2>
          <p className="va-lead">
            Beberapa aturan sederhana agar semua tamu dapat menikmati villa
            dengan nyaman dan aman.
          </p>

          <div className="va-times">
            <div>
              <span className="va-label">Check-in</span>
              <strong>{checkIn}</strong>
            </div>
            <div>
              <span className="va-label">Check-out</span>
              <strong>{checkOut}</strong>
            </div>
          </div>
        </div>

        <div>
          <ol className="va-rules">
            {items.map((rule, i) => (
              <li key={rule.title}>
                <span className="va-rules__n">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  {/* <h3 className="va-h3">{rule.text}</h3> */}
                  <p className="va-h3">
                    {rule.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="va-note">
            Dengan melakukan pemesanan, tamu dianggap telah membaca dan
            menyetujui seluruh aturan di atas.
          </p>
        </div>
      </div>
    </section>
  );
}
