import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle } from 'lucide-react';

export default function GalleryPage() {
    const [selectedMedia, setSelectedMedia] = useState(null);
    const { get } = useFetch();

    const fetchData = async () => {
        const resp = await get('galleries');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['galleries-section'],
        queryFn: fetchData
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-[#F5EFEB] text-stone-500">
                <Loader2 className="size-8 animate-spin text-[#A47B42]" />
                <p className="text-sm font-medium tracking-wide">Memuat galeri Villa Arira...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F5EFEB] p-6">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 max-w-lg">
                    <AlertCircle className="size-5 shrink-0" />
                    <p className="text-sm">Gagal memuat data galeri: {error.message}</p>
                </div>
            </div>
        );
    }

    const galleryItems = data?.data || data || [];

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#F5EFEB',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            color: '#0B0D0C',
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    
                    .gallery-card {
                        transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .gallery-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 25px 50px rgba(11, 13, 12, 0.15) !important;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.97); }
                        to { opacity: 1; transform: scale(1); }
                    }
                    .modal-content {
                        animation: fadeIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                    }
                `}
            </style>

            {/* Bagian Hero Publik */}
            <header style={{
                position: 'relative',
                width: '100%',
                height: '65vh',
                minHeight: '450px',
                backgroundImage: 'linear-gradient(to bottom, rgba(11, 13, 12, 0.55), rgba(11, 13, 12, 0.75)), url("/images/17.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0 2rem',
                boxSizing: 'border-box',
            }}>
                <span style={{
                    fontSize: '0.8rem',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    color: '#DECDBD',
                    fontWeight: '700',
                    marginBottom: '0.8rem',
                }}>
                    Eksplorasi Keindahan Properti
                </span>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#F5EFEB',
                    margin: '0 0 1rem 0',
                    fontWeight: '600',
                }}>
                    Gallery Villa Arira
                </h1>
                {/* <p style={{
                    fontSize: '1rem',
                    color: '#DECDBD',
                    maxWidth: '650px',
                    lineHeight: '1.6',
                    margin: 0,
                    opacity: 0.9,
                }}>
                    Jelajahi potret keindahan arsitektur kayu tradisional, fasilitas mewah, dan suasana alam pegunungan Cisarua yang menenangkan.
                </p> */}
            </header>

            {/* Bagian Grid Gallery */}
            <section style={{
                maxWidth: '1280px',
                width: '100%',
                margin: '0 auto',
                padding: '5rem 2rem',
                boxSizing: 'border-box',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '2.2rem',
                }}>
                    {galleryItems?.map(item => (
                        <div
                            key={item.id}
                            className="gallery-card"
                            onClick={() => setSelectedMedia(item)}
                            style={{
                                backgroundColor: '#ECE2D8',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                border: '1px solid rgba(164, 123, 66, 0.2)',
                                boxShadow: '0 10px 30px rgba(11, 13, 12, 0.06)',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{
                                width: '100%',
                                height: '240px',
                                position: 'relative',
                                overflow: 'hidden',
                                backgroundColor: '#0B0D0C',
                            }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.5s ease',
                                    }}
                                />
                            </div>

                            <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                <h3 style={{
                                    fontSize: '1.2rem',
                                    fontFamily: '"Playfair Display", serif',
                                    color: '#0B0D0C',
                                    margin: 0,
                                    fontWeight: '600',
                                }}>
                                    {item.title}
                                </h3>
                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#4A4D4C',
                                    lineHeight: '1.6',
                                    margin: 0,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                }}>
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {selectedMedia && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(11, 13, 12, 0.85)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    boxSizing: 'border-box',
                }} onClick={() => setSelectedMedia(null)}>
                    <div
                        className="modal-content"
                        style={{
                            maxWidth: '900px',
                            width: '100%',
                            backgroundColor: '#F5EFEB',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedMedia(null)}
                            style={{
                                position: 'absolute',
                                top: '1.2rem',
                                right: '1.2rem',
                                zIndex: 10,
                                background: 'rgba(11, 13, 12, 0.7)',
                                border: 'none',
                                color: '#F5EFEB',
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ✕
                        </button>

                        <div style={{ width: '100%', maxHeight: '500px', backgroundColor: '#0B0D0C', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {selectedMedia.type === 'video' ? (
                                <video src={selectedMedia.image} controls autoPlay style={{ width: '100%', maxHeight: '500px' }} />
                            ) : (
                                <img src={selectedMedia.image} alt={selectedMedia.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
                            )}
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#A47B42', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {selectedMedia.category || 'Galeri Villa'}
                            </span>
                            <h2 style={{ fontSize: '1.8rem', fontFamily: '"Playfair Display", serif', color: '#0B0D0C', margin: '0.4rem 0 0.8rem 0' }}>
                                {selectedMedia.title}
                            </h2>
                            <p style={{ fontSize: '0.95rem', color: '#3A3D3C', lineHeight: '1.6', margin: 0 }}>
                                {selectedMedia.desc}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}