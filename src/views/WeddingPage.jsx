import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    AlertCircle,
    ArrowUpRight,
    BedDouble,
    ChevronLeft,
    ChevronRight,
    Images,
    MessageCircle,
    Mountain,
    Play,
    X,
} from 'lucide-react';
import useFetch from '../hooks/useFetch';
import '../assets/styles/villa.css';

// SESUAIKAN: endpoint konten wedding. Bentuk item yang diharapkan:
// { id, title, description, image (URL foto/video), type: 'image' | 'video', category }
const WEDDING_ENDPOINT = 'galleries?unpage=true';
// Ganti dengan nomor WhatsApp admin (format internasional, tanpa + atau spasi)
const WA_NUMBER = '6281234567890';

// Teks bisa diganti sesuai fakta villa
const HIGHLIGHTS = [
    {
        icon: Mountain,
        title: 'Suasana pegunungan',
        text: 'Udara sejuk Cisarua dan lanskap hijau menjadi latar alami untuk prosesi dan sesi foto.',
    },
    {
        icon: BedDouble,
        title: 'Hunian kayu yang hangat',
        text: 'Arsitektur kayu tradisional memberi nuansa intim untuk akad, resepsi kecil, dan keluarga yang menginap.',
    },
    {
        icon: MessageCircle,
        title: 'Konsultasi langsung',
        text: 'Tim kami membantu cek tanggal, kapasitas, dan kebutuhan acara lewat WhatsApp.',
    },
];

const isVideo = (item) => item?.type === 'video';
const srcOf = (item) => item?.image ?? item?.url ?? item?.video ?? '';

export default function WeddingPage() {
    const { get } = useFetch();
    const [type, setType] = useState('all'); // all | image | video
    const [cat, setCat] = useState('all');
    const [active, setActive] = useState(null); // indeks di daftar terfilter

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['wedding-gallery'],
        queryFn: async () => {
            const resp = await get(WEDDING_ENDPOINT);
            if (!resp.status) throw new Error(resp.error);
            return resp.data;
        },
    });

    const items = useMemo(() => {
        const raw = data?.data ?? data;
        return Array.isArray(raw) ? raw.filter((i) => srcOf(i)) : [];
    }, [data]);

    const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))], [items]);
    const photoCount = items.filter((i) => !isVideo(i)).length;
    const videoCount = items.filter(isVideo).length;
    const heroMedia = items.find(isVideo) ?? items[0];

    const shown = useMemo(
        () =>
            items.filter(
                (i) =>
                    (type === 'all' || (type === 'video') === isVideo(i)) &&
                    (cat === 'all' || i.category === cat),
            ),
        [items, type, cat],
    );

    const current = active !== null ? shown[active] : null;

    const close = useCallback(() => setActive(null), []);
    const step = useCallback(
        (dir) => setActive((i) => (i === null ? i : (i + dir + shown.length) % shown.length)),
        [shown.length],
    );

    // Keyboard + kunci scroll saat lightbox terbuka
    useEffect(() => {
        if (active === null) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') step(-1);
            if (e.key === 'ArrowRight') step(1);
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [active, close, step]);

    const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
        'Halo admin Villa Arira, saya ingin konsultasi acara pernikahan.',
    )}`;

    return (
        <>
            {/* HERO */}
            <header className="va-ink vw-hero">
                {heroMedia &&
                    (isVideo(heroMedia) ? (
                        <video className="vw-hero__bg" src={srcOf(heroMedia)} autoPlay muted loop playsInline />
                    ) : (
                        <img className="vw-hero__bg" src={srcOf(heroMedia)} alt="" />
                    ))}
                <div className="vw-hero__shade" />

                <div className="vw-hero__body">
                    <span className="vw-eyebrow">Wedding at Villa Arira</span>
                    <h1 className="vw-hero__title">
                        Hari bahagia,
                        <br />
                        <em>di antara pegunungan.</em>
                    </h1>
                    <p className="vw-hero__sub">
                        Rayakan pernikahan Anda di hunian kayu yang hangat, dikelilingi udara sejuk Cisarua.
                    </p>
                    <div className="vw-hero__cta">
                        <a className="va-btn" href={waLink} target="_blank" rel="noopener noreferrer">
                            <MessageCircle size={18} /> Konsultasi wedding
                        </a>
                        <Link to="/booking#cek-jadwal" className="va-btn va-btn--ghost">
                            Cek jadwal villa <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>

                <a href="#momen" className="vw-hero__scroll">
                    Lihat momen
                </a>
            </header>

            {/* PERNYATAAN + STATISTIK */}
            <section className="va-paper va-section">
                <div className="va-wrap">
                    <p className="vw-statement">
                        Pernikahan yang sederhana, hangat, dan <em>tak terlupakan</em>, di tengah udara sejuk
                        Cisarua.
                    </p>
                    <div className="vw-stats">
                        <div className="vw-stat">
                            <strong>{photoCount}</strong>
                            <span>Foto momen</span>
                        </div>
                        <div className="vw-stat">
                            <strong>{videoCount}</strong>
                            <span>Video</span>
                        </div>
                        <div className="vw-stat">
                            <strong>Cisarua</strong>
                            <span>Bandung Barat</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* GALERI */}
            <section id="momen" className="va-ink vw-gallery">
                <div className="va-wrap">
                    <div className="vw-gallery__head">
                        <h2 className="vw-title">
                            Momen di <em>Villa Arira</em>
                        </h2>
                        <p className="va-lead">
                            Kumpulan foto dan video pernikahan yang pernah dirayakan di villa kami.
                        </p>
                    </div>

                    <div className="vw-filter">
                        <div className="vw-filter__group" role="group" aria-label="Jenis media">
                            {[
                                ['all', 'Semua'],
                                ['image', 'Foto'],
                                ['video', 'Video'],
                            ].map(([v, label]) => (
                                <button
                                    key={v}
                                    type="button"
                                    className="vw-chip"
                                    aria-pressed={type === v}
                                    onClick={() => setType(v)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {categories.length > 0 && (
                            <div className="vw-filter__group" role="group" aria-label="Kategori">
                                {['all', ...categories].map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className="vw-chip"
                                        aria-pressed={cat === c}
                                        onClick={() => setCat(c)}
                                    >
                                        {c === 'all' ? 'Semua kategori' : c}
                                    </button>
                                ))}
                            </div>
                        )}

                        <span className="vw-count" aria-live="polite">
                            {shown.length} item
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="vw-masonry">
                            {[260, 340, 220, 300, 360, 240].map((h, i) => (
                                <div key={i} className="va-skel vw-skel" style={{ height: h }} />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="va-alert" role="alert">
                            <AlertCircle size={16} />
                            <span>Gagal memuat galeri: {String(error?.message ?? error)}</span>
                        </div>
                    ) : shown.length === 0 ? (
                        <div className="va-empty">
                            <Images size={28} strokeWidth={1.5} />
                            <strong>Belum ada konten</strong>
                            <span className="va-text">Coba ubah filter di atas.</span>
                        </div>
                    ) : (
                        <div className="vw-masonry">
                            {shown.map((item, index) => (
                                <button
                                    key={item.id ?? index}
                                    type="button"
                                    className="vw-tile"
                                    style={{ '--i': index }}
                                    onClick={() => setActive(index)}
                                    aria-label={`Buka ${item.title ?? 'media'}`}
                                >
                                    <div className="vw-tile__media">
                                        {isVideo(item) ? (
                                            <video src={`${srcOf(item)}#t=0.1`} muted playsInline preload="metadata" />
                                        ) : (
                                            <img src={srcOf(item)} alt={item.title ?? ''} loading="lazy" />
                                        )}
                                        {isVideo(item) && (
                                            <span className="vw-tile__play" aria-hidden="true">
                                                <Play size={18} fill="currentColor" />
                                            </span>
                                        )}
                                    </div>
                                    {(item.title || item.category) && (
                                        <div className="vw-tile__cap">
                                            {item.category && <span>{item.category}</span>}
                                            {item.title && <strong>{item.title}</strong>}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* KEUNGGULAN */}
            <section className="va-paper va-section">
                <div className="va-wrap">
                    <div className="va-head">
                        <h2 className="vw-title">
                            Mengapa <em>Arira</em>
                        </h2>
                        <p className="va-lead">
                            Tempat yang tenang dan hangat untuk memulai babak baru bersama keluarga dan orang-orang
                            tercinta.
                        </p>
                    </div>
                    <div className="vw-feats">
                        {HIGHLIGHTS.map(({ icon: Icon, title, text }, i) => (
                            <article key={title} className="vw-feat">
                                <span className="vw-feat__n">{String(i + 1).padStart(2, '0')}</span>
                                <Icon size={26} strokeWidth={1.5} />
                                <h3 className="va-h3">{title}</h3>
                                <p className="va-text">{text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="va-ink vw-cta">
                <div className="va-wrap">
                    <span className="vw-eyebrow">Mulai dari sini</span>
                    <h2 className="vw-cta__title">
                        Rencanakan <em>hari istimewa</em> Anda
                    </h2>
                    <p className="va-lead" style={{ margin: '0 auto' }}>
                        Ceritakan tanggal dan jumlah tamu yang Anda rencanakan, kami bantu cek ketersediaannya.
                    </p>
                    <div className="vw-hero__cta">
                        <a className="va-btn" href={waLink} target="_blank" rel="noopener noreferrer">
                            <MessageCircle size={18} /> Konsultasi via WhatsApp
                        </a>
                        <Link to="/booking#cek-jadwal" className="va-btn va-btn--ghost">
                            Cek jadwal villa <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* LIGHTBOX */}
            {current && (
                <div className="va-ink vw-lb" role="dialog" aria-modal="true" aria-label={current.title ?? 'Media'} onClick={close}>
                    <button type="button" className="va-icon-btn vw-lb__close" onClick={close} aria-label="Tutup">
                        <X size={20} strokeWidth={1.5} />
                    </button>

                    {shown.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="va-icon-btn vw-lb__btn vw-lb__btn--prev"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    step(-1);
                                }}
                                aria-label="Sebelumnya"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <button
                                type="button"
                                className="va-icon-btn vw-lb__btn vw-lb__btn--next"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    step(1);
                                }}
                                aria-label="Berikutnya"
                            >
                                <ChevronRight size={22} />
                            </button>
                        </>
                    )}

                    <figure className="vw-lb__fig" onClick={(e) => e.stopPropagation()}>
                        {isVideo(current) ? (
                            <video key={current.id} src={srcOf(current)} controls autoPlay playsInline />
                        ) : (
                            <img key={current.id} src={srcOf(current)} alt={current.title ?? ''} />
                        )}
                        <figcaption className="vw-lb__cap">
                            {current.category && <span className="va-label">{current.category}</span>}
                            {current.title && <strong className="va-h3">{current.title}</strong>}
                            {current.description && <p className="va-text">{current.description}</p>}
                            <span className="vw-lb__count">
                                {active + 1} / {shown.length}
                            </span>
                        </figcaption>
                    </figure>
                </div>
            )}
        </>
    );
}