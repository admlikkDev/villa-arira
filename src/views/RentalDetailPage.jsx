import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, ArrowUpRight, BedDouble, Users, CalendarDays, ImageOff, MessageCircle } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { formatRupiah, formatCapacity } from '../hooks/Usevillaquery';
import SectionState from '../components/SectionState';
import CtaBooking from '../components/CtaBooking';
import '../assets/styles/villa.css';

// Ganti dengan nomor WhatsApp admin (format internasional, tanpa + atau spasi)
const WA_NUMBER = '6281234567890';

const PRICE_ROWS = [
    { key: 'weekday_price', label: 'Weekday', note: 'Hari biasa' },
    { key: 'weekend_price', label: 'Weekend', note: 'Akhir pekan' },
    { key: 'long_weekend_price', label: 'Long weekend', note: 'Libur panjang' },
    { key: 'high_season_price', label: 'High season', note: 'Musim ramai' },
];

const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
const countNights = (start, end) =>
    Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000);

export default function RentalDetailPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { get } = useFetch();

    // Pencarian dari halaman Booking (opsional): ?in=2026-11-10&out=2026-11-12&guests=15
    const checkIn = searchParams.get('in');
    const checkOut = searchParams.get('out');
    const guests = Number(searchParams.get('guests')) || 0;
    const nights = checkIn && checkOut ? countNights(checkIn, checkOut) : 0;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['pricelist-detail', id],
        enabled: Boolean(id),
        queryFn: async () => {
            const resp = await get(`pricelists/${id}`);
            if (!resp.status) throw new Error(resp.error);
            return resp.data;
        },
    });

    if (isLoading) return <SectionState tone="paper" label="Memuat detail villa…" />;
    if (isError)
        return (
            <SectionState
                tone="paper"
                label="Detail villa gagal dimuat"
                error={String(error?.message ?? error)}
            />
        );

    const item = data?.data ?? data;
    const opt = item?.rental_option;
    if (!item || !opt) return <SectionState tone="paper" label="Data villa tidak ditemukan" />;

    const tooSmall = guests > 0 && Number.isFinite(Number(opt.max_capacity)) && guests > Number(opt.max_capacity);

    const waText =
        `Halo admin Villa Arira, saya tertarik dengan ${opt.title}.` +
        (nights > 0 ? `\nTanggal: ${formatDate(checkIn)} – ${formatDate(checkOut)} (${nights} malam)` : '') +
        (guests > 0 ? `\nEstimasi tamu: ${guests} orang` : '') +
        `\n\nMohon info ketersediaan dan total biayanya.`;

    return (
        <>
            {/* Hero */}
            <header className="va-ink va-page-hero">
                <div className="va-wrap">
                    <Link to="/booking" className="va-link" style={{ marginBottom: '2rem' }}>
                        <ArrowLeft size={16} /> Kembali ke booking
                    </Link>
                    <div className="va-page-hero__inner">
                        <div>
                            <span className="va-eyebrow">{opt.subtitle}</span>
                            <h1 className="va-page-hero__title">{opt.title}</h1>
                        </div>
                        <p className="va-lead">{opt.description}</p>
                    </div>
                </div>
            </header>

            {/* Gambar + ringkasan */}
            <section className="va-paper va-section">
                <div className="va-wrap va-detail">
                    <figure className="va-detail__img">
                        {opt.image ? (
                            <img src={opt.image} alt={opt.title} />
                        ) : (
                            <div className="va-img-fallback">
                                <ImageOff size={28} strokeWidth={1.5} />
                                <span>Foto belum tersedia</span>
                            </div>
                        )}
                    </figure>

                    <div className="va-detail__info">
                        <div>
                            <span className="va-label">Mulai dari</span>
                            <div className="va-price" style={{ fontSize: '2.8rem', marginTop: '0.4rem' }}>
                                {formatRupiah(Math.min(...PRICE_ROWS.map((r) => Number(item[r.key]) || Infinity)))}
                            </div>
                            <span className="va-price-note">per malam, tergantung musim</span>
                        </div>

                        <ul className="va-rowlist" style={{ margin: 0 }}>
                            <li>
                                <BedDouble size={20} strokeWidth={1.5} />
                                <span>{opt.room_count} kamar</span>
                            </li>
                            <li>
                                <Users size={20} strokeWidth={1.5} />
                                <span>Kapasitas {formatCapacity(opt.max_capacity)}</span>
                            </li>
                            {nights > 0 && (
                                <li>
                                    <CalendarDays size={20} strokeWidth={1.5} />
                                    <span>
                                        {formatDate(checkIn)} – {formatDate(checkOut)} · {nights} malam
                                    </span>
                                </li>
                            )}
                        </ul>

                        {tooSmall && (
                            <div className="va-alert" role="alert">
                                <Users size={16} />
                                <span>
                                    Estimasi {guests} tamu melebihi kapasitas unit ini. Pilih unit lain atau hubungi
                                    admin.
                                </span>
                            </div>
                        )}

                        <div className="va-detail__cta">
                            <a
                                className="va-btn va-btn--block"
                                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle size={18} /> Tanya ketersediaan
                            </a>
                            <Link to="/booking" className="va-btn va-btn--ghost va-btn--block">
                                Ubah tanggal <ArrowUpRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Daftar harga */}
            <section className="va-paper va-section" style={{ paddingTop: 0 }}>
                <div className="va-wrap">
                    <div className="va-head">
                        <h2 className="va-h2">Harga sewa</h2>
                        <p className="va-lead">
                            Harga per malam untuk {opt.title}. Total akhir mengikuti tanggal menginap dan akan
                            dikonfirmasi admin sebelum pembayaran.
                        </p>
                    </div>

                    <div className="va-cells va-cells--2">
                        {PRICE_ROWS.map((row) => (
                            <div key={row.key} className="va-cell">
                                <div className="va-cell__top">
                                    <div>
                                        <h3 className="va-h3">{row.label}</h3>
                                        <p className="va-text" style={{ marginTop: '0.35rem' }}>
                                            {row.note}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="va-price">{formatRupiah(item[row.key])}</span>
                                        <span className="va-price-note">per malam</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="va-note">
                        Harga dapat berubah mengikuti kalender libur dan musim ramai. Add-on seperti kolam, BBQ, atau
                        extra bed dihitung terpisah.
                    </p>
                </div>
            </section>

            <CtaBooking
                title={`Tertarik dengan ${opt.title}?`}
                text="Cek tanggal kosong dan pilih add-on sesuai kebutuhan rombongan Anda."
                label="Cek jadwal & booking"
            />
        </>
    );
}