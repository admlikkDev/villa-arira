import { useRef, useState, useEffect, useCallback } from 'react';
import { useVillaList, formatRupiah, formatCapacity } from '../hooks/Usevillaquery';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

// API belum menyediakan foto per tipe sewa, jadi foto dipasangkan berdasarkan urutan
const RENTAL_IMAGES = ['/images/15 (1).jpg', '/images/16.jpg', '/images/17.jpg'];

const byPrice = (a, b) => Number(a.weekday_price) - Number(b.weekday_price);

export default function PilihanSewa() {
    const { data: options = [], isLoading, isError, error } = useVillaList('pricelists', {
        query: 'unpage=true',
        sort: byPrice,
    });

    const trackRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);

    const updateArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        updateArrows();
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        return () => {
            el.removeEventListener('scroll', updateArrows);
            window.removeEventListener('resize', updateArrows);
        };
    }, [updateArrows, options.length]);

    const scrollByCard = (direction) => {
        const el = trackRef.current;
        if (!el) return;
        const card = el.querySelector('.va-rent');
        const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
        const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
        el.scrollBy({ left: direction * step, behavior: 'smooth' });
    };

    if (isLoading) return <SectionState tone="paper" label="Memuat pilihan sewa…" />;
    if (isError) return <SectionState tone="paper" label="Pilihan sewa gagal dimuat" error={error.message} />;
    if (options.length === 0) return null;

    return (
        <section id="pilihan-sewa" className="va-ink va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Pilihan sewa Villa Arira</h2>
                    <p className="va-lead">
                        Sesuaikan penginapan dengan jumlah rombongan dan kebutuhan kegiatan Anda di Cisarua, Lembang.
                    </p>
                </div>

                <div className="va-slider">
                    <button
                        type="button"
                        className="va-slider__btn va-slider__btn--prev"
                        onClick={() => scrollByCard(-1)}
                        disabled={!canPrev}
                        aria-label="Geser ke kiri"
                    >
                        ‹
                    </button>

                    <div className="va-slider__track" ref={trackRef}>
                        {options.map((item, index) => (
                            <article key={item.id ?? item.title} className="va-rent va-slider__item">
                                <div className="va-rent__img">
                                    <img
                                        src={RENTAL_IMAGES[index % RENTAL_IMAGES.length]}
                                        alt={item?.rental_option?.title}
                                        draggable={false}
                                    />
                                </div>
                                <div className="va-rent__body">
                                    <div>
                                        <h3 className="va-h3">{item?.rental_option?.title}</h3>
                                        <p className="va-muted" style={{ margin: '0.35rem 0 0', fontSize: '0.88rem', fontWeight: 600 }}>
                                            Kapasitas {formatCapacity(item?.rental_option?.max_capacity)}
                                        </p>
                                    </div>
                                    <p className="va-text">{item?.rental_option?.description}</p>
                                    <div>
                                        {/* {console.log(item?.rental_option)} */}
                                        <span className="va-price" style={{ fontSize: '1.6rem' }}>
                                            {formatRupiah(item.weekday_price)}
                                        </span>
                                        <span className="va-price-note">mulai dari / malam (weekday)</span>
                                    </div>
                                    <button
                                        className="va-btn va-btn--ghost va-btn--block va-cell__push"
                                        onClick={() => alert(`Detail untuk ${item?.rental_option?.title}`)}
                                    >
                                        Lihat detail
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="va-slider__btn va-slider__btn--next"
                        onClick={() => scrollByCard(1)}
                        disabled={!canNext}
                        aria-label="Geser ke kanan"
                    >
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}