import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Loader2, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ReviewVilla() {
    const { get } = useFetch();

    const fetchData = async () => {
        const resp = await get('testimonies');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-testimony-section'],
        queryFn: fetchData
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-72 gap-3 text-stone-500 bg-[#DECDBD]">
                <Loader2 className="size-8 animate-spin text-[#A47B42]" />
                <p className="text-sm font-medium tracking-wide">Memuat ulasan tamu...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] bg-[#DECDBD] p-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 max-w-lg shadow-sm">
                    <AlertCircle className="size-5 shrink-0" />
                    <p className="text-sm">Gagal memuat ulasan: {error.message}</p>
                </div>
            </div>
        );
    }

    const reviewsData = data?.data || data || [];

    return (
        <section id="review" style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#DECDBD',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '7rem 2rem',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    
                    .review-card {
                        transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                        height: 100%;
                    }
                    .review-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 30px 60px rgba(11, 13, 12, 0.12) !important;
                    }
                    /* Kustomisasi titik pagination Swiper */
                    .swiper-pagination-bullet {
                        background: #0B0D0C !important;
                        opacity: 0.3;
                        width: 10px;
                        height: 10px;
                        transition: all 0.3s ease;
                    }
                    .swiper-pagination-bullet-active {
                        opacity: 1;
                        width: 25px;
                        border-radius: 5px;
                        background: #A47B42 !important;
                    }
                `}
            </style>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(rgba(164, 123, 66, 0.25) 1.5px, transparent 1.5px)',
                backgroundSize: '40px 40px',
                pointerEvents: 'none',
            }} />

            <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '750px', position: 'relative', zIndex: 1 }}>
                <span style={{
                    fontSize: '0.8rem',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: '#A47B42',
                    fontWeight: '700',
                    display: 'block',
                    marginBottom: '0.6rem',
                }}>
                    Testimoni & Pengalaman Tamu
                </span>
                <h2 style={{
                    fontSize: '3rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    margin: '0 0 1rem 0',
                    fontWeight: '600',
                }}>
                    Apa Kata Mereka Tentang Villa Arira?
                </h2>
                <p style={{
                    fontSize: '1rem',
                    color: '#4A4D4C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Kepuasan dan kenyamanan Anda adalah prioritas kami. Simak ulasan autentik dari para tamu yang telah menikmati momen berharga di Villa Arira.
                </p>
            </div>

            <div style={{ maxWidth: '1280px', width: '100%', position: 'relative', zIndex: 1, paddingBottom: '3.5rem' }}>
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    loop={reviewsData.length > 3}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                    }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    style={{ paddingBottom: '2rem' }}
                >
                    {reviewsData.map((item, index) => (
                        <SwiperSlide key={item.id || index} style={{ height: 'auto', display: 'flex' }}>
                            <div className="review-card" style={{
                                backgroundColor: '#F5EFEB',
                                borderRadius: '24px',
                                padding: '2.8rem 2.4rem',
                                boxShadow: '0 20px 40px rgba(11, 13, 12, 0.06)',
                                border: '1px solid rgba(164, 123, 66, 0.25)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxSizing: 'border-box',
                                position: 'relative',
                                width: '100%',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: '1.8rem',
                                    right: '2rem',
                                    color: 'rgba(164, 123, 66, 0.15)',
                                }}>
                                    <Quote size={40} />
                                </div>

                                <div>
                                    {/* Bintang Rating */}
                                    <div style={{ display: 'flex', gap: '5px', marginBottom: '1.5rem' }}>
                                        {[...Array(Number(item.star) || 5)].map((_, i) => (
                                            <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#A47B42" stroke="none">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Komentar */}
                                    <p style={{
                                        fontSize: '0.95rem',
                                        color: '#3A3D3C',
                                        lineHeight: '1.8',
                                        margin: '0 0 2.5rem 0',
                                        fontStyle: 'italic',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}>
                                        "{item.comment}"
                                    </p>
                                </div>

                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '1.2rem', 
                                    borderTop: '1px solid rgba(164, 123, 66, 0.2)', 
                                    paddingTop: '1.5rem' 
                                }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '50%',
                                        backgroundColor: '#0B0D0C',
                                        color: '#DECDBD',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        fontFamily: '"Playfair Display", serif',
                                        flexShrink: 0,
                                        boxShadow: '0 4px 10px rgba(11, 13, 12, 0.15)',
                                    }}>
                                        {item.username
                                            ? item.username
                                                  .split(' ')
                                                  .map(word => word.charAt(0))
                                                  .join('')
                                                  .toUpperCase()
                                                  .slice(0, 2)
                                            : 'VA'}
                                    </div>
                                    <div>
                                        <h4 style={{
                                            fontSize: '1.05rem',
                                            fontFamily: '"Playfair Display", serif',
                                            color: '#0B0D0C',
                                            margin: '0 0 0.2rem 0',
                                            fontWeight: '600',
                                        }}>
                                            {item.username}
                                        </h4>
                                        <span style={{
                                            fontSize: '0.78rem',
                                            color: '#A47B42',
                                            fontWeight: '600',
                                            letterSpacing: '0.5px',
                                            display: 'block',
                                            textTransform: 'uppercase',
                                        }}>
                                            Tamu Villa Arira
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                    <button className="swiper-button-prev-custom" style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        backgroundColor: '#F5EFEB',
                        border: '1px solid rgba(164, 123, 66, 0.4)',
                        color: '#0B0D0C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(11, 13, 12, 0.08)'
                    }}>
                        <ChevronLeft size={20} />
                    </button>
                    <button className="swiper-button-next-custom" style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        backgroundColor: '#F5EFEB',
                        border: '1px solid rgba(164, 123, 66, 0.4)',
                        color: '#0B0D0C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(11, 13, 12, 0.08)'
                    }}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}