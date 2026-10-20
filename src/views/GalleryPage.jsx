import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertCircle, X, ArrowUpRight, Images } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import '../assets/styles/villa.css';

export default function GalleryPage() {
    const [selectedMedia, setSelectedMedia] = useState(null);
    const { get } = useFetch();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['galleries-section'],
        queryFn: async () => {
            const resp = await get('galleries');
            if (!resp.status) throw new Error(resp.error);
            return resp.data;
        },
    });

    // Tutup lightbox dengan tombol Escape
    useEffect(() => {
        if (!selectedMedia) return;
        const onKey = (e) => e.key === 'Escape' && setSelectedMedia(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedMedia]);

    if (isLoading) {
        return (
            <div className="va-paper va-state va-state--full">
                <Loader2 className="va-spin" size={28} strokeWidth={1.5} />
                <p className="va-text">Memuat galeri Villa Arira...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="va-paper va-state va-state--full">
                <div className="va-alert" role="alert">
                    <AlertCircle size={16} />
                    <span>Gagal memuat data galeri: {error.message}</span>
                </div>
            </div>
        );
    }

    const galleryItems = data?.data || data || [];
    const isVideo = (item) => item.type === 'video';

    return (
        <>
            {/* Hero */}
            <header className="va-ink va-page-hero">
                <div className="va-wrap va-page-hero__inner">
                    <div>
                        <span className="va-eyebrow">Eksplorasi keindahan properti</span>
                        <h1 className="va-page-hero__title">Galeri Villa Arira</h1>
                    </div>
                    <p className="va-lead">
                        Potret hunian kayu, fasilitas, dan suasana pegunungan Cisarua yang menenangkan.
                    </p>
                </div>
            </header>

            {/* Grid */}
            <section className="va-paper va-section">
                <div className="va-wrap">
                    {galleryItems.length === 0 ? (
                        <div className="va-empty">
                            <Images size={28} strokeWidth={1.5} />
                            <strong>Belum ada foto</strong>
                            <span className="va-text">Galeri akan segera diperbarui.</span>
                        </div>
                    ) : (
                        <div className="va-cells va-cells--3">
                            {galleryItems.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className="va-gal"
                                    onClick={() => setSelectedMedia(item)}
                                >
                                    <div className="va-gal__img">
                                        {isVideo(item) ? (
                                            <video src={item.image} muted playsInline preload="metadata" />
                                        ) : (
                                            <img src={item.image} alt={item.title} loading="lazy" />
                                        )}
                                    </div>
                                    <div className="va-gal__body">
                                        <h3 className="va-h3">{item.title}</h3>
                                        <p className="va-text va-clamp-2">{item.description}</p>
                                        <span className="va-gal__more">
                                            Lihat detail <ArrowUpRight size={16} />
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            {selectedMedia && (
                <div className="va-lightbox" onClick={() => setSelectedMedia(null)}>
                    <div
                        className="va-pop va-lightbox__panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label={selectedMedia.title}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="va-icon-btn va-lightbox__close"
                            onClick={() => setSelectedMedia(null)}
                            aria-label="Tutup"
                        >
                            <X size={18} strokeWidth={1.5} />
                        </button>

                        <div className="va-lightbox__media">
                            {isVideo(selectedMedia) ? (
                                <video src={selectedMedia.image} controls autoPlay />
                            ) : (
                                <img src={selectedMedia.image} alt={selectedMedia.title} />
                            )}
                        </div>

                        <div className="va-lightbox__body">
                            <span className="va-label">{selectedMedia.category || 'Galeri Villa'}</span>
                            <h2 className="va-h3">{selectedMedia.title}</h2>
                            <p className="va-text">{selectedMedia.desc || selectedMedia.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}