import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import SectionState from './SectionState';
import { useVillaList } from '../hooks/Usevillaquery';
import '../assets/styles/villa.css';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const getInitials = (name) =>
    name ? name.split(' ').map((w) => w.charAt(0)).join('').toUpperCase().slice(0, 2) : 'VA';

export default function ReviewVilla() {
    const { data: reviewsData = [], isLoading, isError, error } = useVillaList('testimonies');

    if (isLoading) return <SectionState tone="ink" label="Memuat ulasan tamu…" />;
    if (isError) return <SectionState tone="ink" label="Ulasan gagal dimuat" error={error.message} />;
    if (reviewsData.length === 0) return null;

    return (
        <section id="review" className="va-paper va-section va-review">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Apa kata tamu tentang Villa Arira</h2>
                    <p className="va-lead">
                        Ulasan autentik dari tamu yang telah menikmati momen berharga di Villa Arira.
                    </p>
                </div>

                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    loop={reviewsData.length > 3}
                    autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    pagination={{ clickable: true }}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {reviewsData.map((item, index) => (
                        <SwiperSlide key={item.id ?? index}>
                            <figure className="va-review-card" style={{ margin: 0 }}>
                                <div>
                                    <div className="va-stars" aria-label={`Rating ${Number(item.star) || 5} dari 5`}>
                                        {[...Array(Number(item.star) || 5)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                                        ))}
                                    </div>
                                    <blockquote className="va-quote" style={{ margin: 0 }}>
                                        “{item.comment}”
                                    </blockquote>
                                </div>

                                <figcaption className="va-author">
                                    <div className="va-avatar">{getInitials(item.username)}</div>
                                    <div>
                                        <strong>{item.username}</strong>
                                        <span>Tamu Villa Arira</span>
                                    </div>
                                </figcaption>
                            </figure>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="va-review__nav">
                    <button className="va-icon-btn swiper-button-prev-custom" aria-label="Ulasan sebelumnya">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="va-icon-btn swiper-button-next-custom" aria-label="Ulasan berikutnya">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}