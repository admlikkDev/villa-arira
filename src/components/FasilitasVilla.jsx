import { useVillaList } from '../hooks/Usevillaquery';
import { Sparkles } from 'lucide-react';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

export default function FasilitasVilla() {
    const { data: facilities = [], isLoading, isError, error } = useVillaList('facilities');

    if (isLoading) return <SectionState tone="ink" label="Memuat fasilitas…" />;
    if (isError) return <SectionState tone="ink" label="Fasilitas gagal dimuat" error={error.message} />;
    if (facilities.length === 0) return null;

    return (
        <section id="fasilitas" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Fasilitas villa</h2>
                    <p className="va-lead">
                        Setiap sudut dirancang untuk mendukung liburan keluarga, kebersamaan teman, serta gathering kantor yang berkesan.
                    </p>
                </div>

                <div className="va-cells va-cells--3">
                    {facilities.map((item, index) => (
                        <article key={item.id ?? index} className="va-cell va-fac">
                            {item.logo?.image ? (
                                <img
                                    src={item.logo.image}
                                    alt={item.title}
                                    loading="lazy"
                                    style={{ width: 48, height: 48, objectFit: 'cover', display: 'block' }}
                                />
                            ) : (
                                <Sparkles size={26} strokeWidth={1.5} />
                            )}
                            <div style={{ display: 'grid', gap: '0.6rem' }}>
                                <h3 className="va-h3">{item.title}</h3>
                                <p className="va-text">{item.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}