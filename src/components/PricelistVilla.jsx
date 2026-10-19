import { useVillaList, formatRupiah, formatCapacity } from '../hooks/Usevillaquery';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

// Endpoint pricelists tidak memakai pagination; urutkan dari harga weekday terendah
const byPrice = (a, b) => Number(a.weekday_price) - Number(b.weekday_price);

export default function PricelistVilla() {
    const { data: pricelist = [], isLoading, isError, error } = useVillaList('pricelists', { query: '', sort: byPrice });

    if (isLoading) return <SectionState tone="ink" label="Memuat pricelist…" />;
    if (isError) return <SectionState tone="ink" label="Pricelist gagal dimuat" error={error.message} />;
    if (pricelist.length === 0) return null;

    return (
        <section id="pricelist" className="va-ink va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Pricelist Villa Arira</h2>
                    <p className="va-lead">
                        Tarif transparan tanpa biaya tersembunyi untuk weekday, weekend, long weekend, dan high season libur nasional.
                    </p>
                </div>

                <div className="va-table-scroll">
                    <table className="va-table">
                        <thead>
                            <tr>
                                <th scope="col">Tipe sewa</th>
                                <th scope="col">Kapasitas</th>
                                <th scope="col" className="num">Weekday<small>Senin – Kamis</small></th>
                                <th scope="col" className="num">Weekend<small>Jumat – Minggu</small></th>
                                <th scope="col" className="num">Long weekend<small>Libur nasional</small></th>
                                <th scope="col" className="num">High season<small>Lebaran & nataru</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricelist.map((item) => (
                                <tr key={item.id ?? item.title}>
                                    <td>
                                        <h3 className="va-table__title">{item.title}</h3>
                                        <span className="va-muted" style={{ fontSize: '0.84rem' }}>{item.description}</span>
                                    </td>
                                    <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                                        {formatCapacity(item.min_capacity, item.max_capacity)}
                                    </td>
                                    <td className="num">{formatRupiah(item.weekday_price)}</td>
                                    <td className="num">{formatRupiah(item.weekend_price)}</td>
                                    <td className="num">{formatRupiah(item.long_weekend_price)}</td>
                                    <td className="num">{formatRupiah(item.high_season_price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}