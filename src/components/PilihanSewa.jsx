import { useVillaList, formatRupiah, formatCapacity } from '../hooks/Usevillaquery';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

// API belum menyediakan foto per tipe sewa, jadi foto dipasangkan berdasarkan urutan
const RENTAL_IMAGES = ['/images/15 (1).jpg', '/images/16.jpg', '/images/17.jpg'];

// Data tipe sewa diambil dari endpoint yang sama dengan pricelist (cache dipakai bersama)
const byPrice = (a, b) => Number(a.weekday_price) - Number(b.weekday_price);

export default function PilihanSewa() {
    const { data: options = [], isLoading, isError, error } = useVillaList('pricelists', { query: '', sort: byPrice });

    if (isLoading) return <SectionState tone="paper" label="Memuat pilihan sewa…" />;
    if (isError) return <SectionState tone="paper" label="Pilihan sewa gagal dimuat" error={error.message} />;
    if (options.length === 0) return null;

    return (
        <section id="pilihan-sewa" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Pilihan sewa Villa Arira</h2>
                    <p className="va-lead">
                        Sesuaikan penginapan dengan jumlah rombongan dan kebutuhan kegiatan Anda di Cisarua, Lembang.
                    </p>
                </div>

                <div className="va-cells va-cells--3">
                    {options.map((item, index) => (
                        <article key={item.id ?? item.title} className="va-rent">
                            <div className="va-rent__img">
                                <img src={RENTAL_IMAGES[index % RENTAL_IMAGES.length]} alt={item.title} />
                            </div>
                            <div className="va-rent__body">
                                <div>
                                    <h3 className="va-h3">{item.title}</h3>
                                    <p className="va-muted" style={{ margin: '0.35rem 0 0', fontSize: '0.88rem', fontWeight: 600 }}>
                                        Kapasitas {formatCapacity(item.min_capacity, item.max_capacity)}
                                    </p>
                                </div>
                                <p className="va-text">{item.description}</p>
                                <div>
                                    <span className="va-price" style={{ fontSize: '1.6rem' }}>{formatRupiah(item.weekday_price)}</span>
                                    <span className="va-price-note">mulai dari / malam (weekday)</span>
                                </div>
                                <button
                                    className="va-btn va-btn--ghost va-btn--block va-cell__push"
                                    onClick={() => alert(`Detail untuk ${item.title}`)}
                                >
                                    Lihat detail
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}