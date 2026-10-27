import { useState } from 'react';
import { ArrowUpRight, ImageOff, Car, Bike, MapPin } from 'lucide-react';
import { useVillaList, formatRupiah } from '../hooks/Usevillaquery';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

const bySortOrder = (a, b) => Number(a.sort_order) - Number(b.sort_order);

// Waktu dalam menit -> "45 menit" / "2 jam" / "1 jam 30 menit"
const formatDuration = (minutes) => {
    const m = Number(minutes);
    if (!Number.isFinite(m) || m <= 0) return '-';
    if (m < 60) return `${m} menit`;
    const h = Math.floor(m / 60);
    const rest = m % 60;
    return rest ? `${h} jam ${rest} menit` : `${h} jam`;
};

const formatDistance = (km) => {
    const d = Number(km);
    return Number.isFinite(d) ? `${d} km` : '-';
};

const vehicleIcon = (vehicle = '') => {
    const v = vehicle.toLowerCase();
    if (v.includes('motor')) return Bike;
    if (v.includes('mobil')) return Car;
    return MapPin;
};

// Jika foto gagal dimuat, tampilkan penanda kosong alih-alih ikon gambar rusak
function PlaceImage({ src, alt }) {
    const [failed, setFailed] = useState(false);

    if (!src || failed) {
        return (
            <div className="va-img-fallback">
                <ImageOff size={24} strokeWidth={1.25} />
                <span>Foto belum tersedia</span>
            </div>
        );
    }

    return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

export default function WisataTerdekat() {
    const { data: places = [], isLoading, isError, error } = useVillaList('attractions', {
        query: 'unpage=true',
        sort: bySortOrder,
    });

    if (isLoading) return <SectionState tone="paper" label="Memuat wisata terdekat…" />;
    if (isError) return <SectionState tone="paper" label="Wisata terdekat gagal dimuat" error={error.message} />;
    if (places.length === 0) return null;

    return (
        <section id="wisata-terdekat" className="va-ink va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Wisata terdekat dari villa</h2>
                    <p className="va-lead">
                        Dari Kertawangi, air terjun, kebun, dan pusat wisata Lembang bisa dijangkau dalam hitungan menit. Siapkan itinerary sebelum atau sesudah menginap.
                    </p>
                </div>

                <div className="va-cells va-cells--3">
                    {places.map((p) => {
                        const transports = [...(p.transports ?? [])].sort(bySortOrder);
                        const fastest = transports.length
                            ? Math.min(...transports.map((t) => Number(t.time_required)))
                            : null;

                        return (
                            <article key={p.id} className="va-rent">
                                <div className="va-rent__img">
                                    <PlaceImage src={p.image} alt={p.title} />
                                    {fastest !== null && Number.isFinite(fastest) && (
                                        <span className="va-chip">±{formatDuration(fastest)}</span>
                                    )}
                                </div>

                                <div className="va-rent__body">
                                    <div>
                                        <h3 className="va-h3">{p.title}</h3>
                                        {p.subtitle && <p className="va-place-meta">{p.subtitle}</p>}
                                    </div>

                                    <p className="va-text">
                                        Tiket masuk{' '}
                                        <strong>{Number(p.price) > 0 ? formatRupiah(p.price) : 'Gratis'}</strong>
                                    </p>

                                    {transports.length > 0 && (
                                        <ul className="va-transport">
                                            {transports.map((t) => {
                                                const Icon = vehicleIcon(t.vehicle);
                                                return (
                                                    <li key={t.id} className='flex flex-row gap-2 items-center'>
                                                        <Icon size={15} />
                                                        <span className="va-transport__name">{t.vehicle}</span>
                                                        <span>
                                                            {formatDistance(t.distance)} · {formatDuration(t.time_required)}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}

                                    {p.map && (
                                        <a
                                            className="va-link va-cell__push"
                                            href={p.map}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ alignSelf: 'flex-start' }}
                                        >
                                            Lihat peta <ArrowUpRight size={15} />
                                        </a>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>

                <p className="va-note">
                    Waktu tempuh adalah perkiraan dalam kondisi lalu lintas normal. Akhir pekan dan libur panjang di jalur Lembang bisa jauh lebih lama.
                </p>
            </div>
        </section>
    );
}