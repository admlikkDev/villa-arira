import { Check, Plus } from 'lucide-react';
import { useVillaListWithLists, formatRupiah } from '../hooks/useVillaQuery';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

export default function AddOnVilla() {
    const { data: addons = [], isLoading, isError, error } = useVillaListWithLists('addons');

    if (isLoading) return <SectionState tone="paper" label="Memuat add-on…" />;
    if (isError) return <SectionState tone="paper" label="Add-on gagal dimuat" error={error.message} />;
    if (addons.length === 0) return null;

    return (
        <section id="add-on" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Add-on & fasilitas ekstra</h2>
                    <p className="va-lead">
                        Lengkapi kunjungan Anda di Villa Arira dengan layanan tambahan sesuai kebutuhan. Semuanya opsional.
                    </p>
                </div>

                <div className="va-addons">
                    {addons.map((item, index) => (
                        <article key={item.id ?? index} className="va-addon">
                            <div>
                                <h3 className="va-h3">{item.title}</h3>
                                <p className="va-muted" style={{ margin: '0.4rem 0 0', fontSize: '0.88rem' }}>{item.subtitle}</p>
                            </div>

                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                <p className="va-text">{item.description}</p>
                                {item.lists.length > 0 && (
                                    <ul className="va-checks">
                                        {item.lists.map((f, i) => (
                                            <li key={f.id ?? i}><Check size={16} strokeWidth={2} />{f.text}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="va-addon__side">
                                <div>
                                    <span className="va-price">{formatRupiah(item.price)}</span>
                                    {item.unit && <span className="va-price-note">{item.unit}</span>}
                                </div>
                                <button
                                    className="va-btn va-btn--ghost va-btn--sm"
                                    onClick={() => alert(`Menambahkan ${item.title} ke reservasi`)}
                                >
                                    <Plus size={16} /> Tambah
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}