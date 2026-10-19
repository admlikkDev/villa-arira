import { Check, Users } from 'lucide-react';
import { useVillaListWithLists, formatRupiah } from '../hooks/Usevillaquery';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

export default function PaketVilla() {
    const { data: packages = [], isLoading, isError, error } = useVillaListWithLists('villa-packages');

    if (isLoading) return <SectionState tone="paper" label="Memuat paket villa…" />;
    if (isError) return <SectionState tone="paper" label="Paket villa gagal dimuat" error={error.message} />;
    if (packages.length === 0) return null;

    return (
        <section id="paket" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Paket gathering, wedding & photoshoot</h2>
                    <p className="va-lead">
                        Wujudkan momen berharga bersama keluarga, rekan kerja, atau acara spesial Anda dengan penawaran paket eksklusif.
                    </p>
                </div>

                <div className="va-cells va-cells--2">
                    {packages.map((item, index) => (
                        <article key={item.id ?? index} className="va-cell">
                            <div className="va-cell__top">
                                <div>
                                    <h3 className="va-h3" style={{ fontSize: '2rem' }}>{item.title}</h3>
                                    <p className="va-muted" style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>{item.subtitle}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="va-price">{formatRupiah(item.price)}</span>
                                    <span className="va-price-note">Mulai dari</span>
                                </div>
                            </div>

                            {item.max_capacity ? (
                                <div className="va-meta">
                                    <Users size={17} strokeWidth={1.75} />
                                    Hingga {item.max_capacity} orang
                                </div>
                            ) : null}

                            <ul className="va-checks">
                                {item.lists.map((f, i) => (
                                    <li key={f.id ?? i}><Check size={16} strokeWidth={2} />{f.text}</li>
                                ))}
                            </ul>

                            <button
                                className="va-btn va-btn--ghost va-btn--block va-cell__push"
                                onClick={() => alert(`Pemesanan untuk ${item.title}`)}
                            >
                                Pesan paket ini
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}