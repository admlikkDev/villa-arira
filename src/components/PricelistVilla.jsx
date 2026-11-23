import {
  useVillaList,
  formatRupiah,
  formatCapacity,
} from "../hooks/Usevillaquery";
import SectionState from "./SectionState";
import "../assets/styles/villa.css";

const bySortOrder = (a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0);

const findPrice = (prices = [], season, dayType) => {
  if (!Array.isArray(prices)) return null;
  const found = prices.find(
    (p) =>
      String(p.season).toLowerCase() === season &&
      String(p.day_type).toLowerCase() === dayType
  );
  return found ? found.price : null;
};

export default function PricelistVilla() {
  const {
    data: rentalOptions = [],
    isLoading,
    isError,
    error,
  } = useVillaList("rental-options", {
    query: "unpage=true",
    sort: bySortOrder,
  });

  if (isLoading) return <SectionState tone="ink" label="Memuat pricelist…" />;
  if (isError)
    return (
      <SectionState
        tone="ink"
        label="Pricelist gagal dimuat"
        error={error.message}
      />
    );
  if (rentalOptions.length === 0) {
    return <SectionState tone="paper" label="Data pricelist belum tersedia" />;
  }

  return (
    <section id="pricelist" className="va-paper va-section">
      <div className="va-wrap">
        <div className="va-head">
          <h2 className="va-h2">Pricelist Villa Arira</h2>
          <p className="va-lead">
            Tarif transparan tanpa biaya tersembunyi untuk weekday, weekend, dan
            high season libur nasional.
          </p>
        </div>

        <div className="va-table-scroll">
          <table className="va-table">
            <thead>
              <tr>
                <th scope="col">Tipe sewa</th>
                <th scope="col">Kapasitas</th>
                <th scope="col" className="num">
                  Weekday<small>Reguler (Senin – Kamis)</small>
                </th>
                <th scope="col" className="num">
                  Weekend<small>Reguler (Jumat – Minggu)</small>
                </th>
                <th scope="col" className="num">
                  High Season<small>Weekday</small>
                </th>
                <th scope="col" className="num">
                  High Season<small>Weekend & Libur Nasional</small>
                </th>
              </tr>
            </thead>
            <tbody>
              {rentalOptions.map((item) => {
                const regWeekday = findPrice(item.prices, "reguler", "weekday");
                const regWeekend = findPrice(item.prices, "reguler", "weekend");
                const highWeekday = findPrice(item.prices, "high", "weekday");
                const highWeekend = findPrice(item.prices, "high", "weekend");

                return (
                  <tr key={item.id ?? item.title}>
                    <td>
                      <h3 className="va-table__title">{item.title}</h3>
                      {item.subtitle && (
                        <div
                          style={{
                            fontSize: "0.82rem",
                            fontWeight: 500,
                            marginBottom: "0.15rem",
                          }}
                        >
                          {item.subtitle}
                        </div>
                      )}
                      <span
                        className="va-muted"
                        style={{ fontSize: "0.84rem" }}
                      >
                        {item.description}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      {formatCapacity(item.max_capacity)}
                    </td>
                    <td className="num">
                      {regWeekday !== null ? formatRupiah(regWeekday) : "-"}
                    </td>
                    <td className="num">
                      {regWeekend !== null ? formatRupiah(regWeekend) : "-"}
                    </td>
                    <td className="num">
                      {highWeekday !== null ? formatRupiah(highWeekday) : "-"}
                    </td>
                    <td className="num">
                      {highWeekend !== null ? formatRupiah(highWeekend) : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}