import { useState } from 'react';

export default function GalleryPage() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedMedia, setSelectedMedia] = useState(null);

    const categories = [
        { id: 'all', label: 'Semua Media' },
        { id: 'foto', label: 'Foto Villa' },
        { id: 'video', label: 'Video Cinematic' }
    ];

    const galleryItems = [
        {
            id: 1,
            type: 'foto',
            title: 'Arira Main House & Living Room',
            category: 'Interior',
            src: 'public/images/16.jpg',
            desc: 'Ruang tengah megah dengan arsitektur kayu etnik Sunda dan fasilitas biliar standar.'
        },
        {
            id: 2,
            type: 'foto',
            title: 'Private Pool & Pegunungan Cisarua',
            category: 'Outdoor',
            src: 'public/images/17.jpg',
            desc: 'Kolam renang pribadi berair jernih dengan suasana sejuk khas pegunungan Lembang.'
        },
        {
            id: 3,
            type: 'video',
            title: 'Cinematic Tour Villa Arira',
            category: 'Video Virtual',
            src: 'https://www.w3schools.com/html/mov_bbb.mp4', // Contoh video placeholder
            desc: 'Video tur lengkap mengelilingi seluruh sudut kawasan Villa Arira.'
        },
        {
            id: 4,
            type: 'foto',
            title: 'Gazebo Etnik di Atas Kolam Teratai',
            category: 'Spot Santai',
            src: 'public/images/15 (1).jpg',
            desc: 'Spot favorit untuk menikmati secangkir kopi hangat di pagi hari dengan ketenangan alam.'
        },
        {
            id: 5,
            type: 'foto',
            title: 'Kamar Tidur Utama & Water Heater',
            category: 'Kamar Tidur',
            src: 'public/images/16.jpg',
            desc: 'Kamar tidur luas berstandar hotel dengan selimut hangat dan kamar mandi air panas.'
        },
        {
            id: 6,
            type: 'video',
            title: 'Suasana Malam & Area BBQ Outdoor',
            category: 'Video Virtual',
            src: 'https://www.w3schools.com/html/movie.mp4', // Contoh video placeholder
            desc: 'Keseruan malam hari di area halaman luas dengan fasilitas barbeque gratis.'
        }
    ];

    const filteredItems = activeFilter === 'all' 
        ? galleryItems 
        : galleryItems.filter(item => item.type === activeFilter);

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
                    .filter-btn {
                        transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .filter-btn:hover {
                        background-color: rgba(164, 123, 66, 0.2) !important;
                        color: #0B0D0C !important;
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

            {/* Bagian Hero (Sesuai gaya sebelumnya, berupa foto statis dengan teks di tengah) */}
            <header style={{
                position: 'relative',
                width: '100%',
                height: '65vh',
                minHeight: '450px',
                backgroundImage: 'linear-gradient(to bottom, rgba(11, 13, 12, 0.55), rgba(11, 13, 12, 0.75)), url("public/images/17.jpg")',
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
                <p style={{
                    fontSize: '1rem',
                    color: '#DECDBD',
                    maxWidth: '650px',
                    lineHeight: '1.6',
                    margin: 0,
                    opacity: 0.9,
                }}>
                    Jelajahi potret keindahan arsitektur kayu tradisional, fasilitas mewah, dan suasana alam pegunungan Cisarua yang menenangkan.
                </p>
            </header>

            {/* Bagian Filter & Grid Gallery */}
            <section style={{
                maxWidth: '1280px',
                width: '100%',
                margin: '0 auto',
                padding: '5rem 2rem',
                boxSizing: 'border-box',
            }}>
                {/* Tombol Kategori Filter */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '3.5rem',
                    flexWrap: 'wrap',
                }}>
                    {categories.map((cat) => {
                        const isActive = activeFilter === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveFilter(cat.id)}
                                className="filter-btn"
                                style={{
                                    padding: '0.7rem 1.6rem',
                                    borderRadius: '999px',
                                    backgroundColor: isActive ? '#0B0D0C' : '#ECE2D8',
                                    color: isActive ? '#F5EFEB' : '#3A3D3C',
                                    border: '1px solid rgba(164, 123, 66, 0.3)',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: isActive ? '0 8px 20px rgba(11, 13, 12, 0.15)' : 'none',
                                }}
                            >
                                {cat.label}
                            </button>
                        );
                    })}
                </div>

                {/* Grid Konten Foto & Video */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                    gap: '2.2rem',
                }}>
                    {filteredItems.map((item) => (
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
                                {item.type === 'foto' ? (
                                    <img 
                                        src={item.src} 
                                        alt={item.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease',
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                    }}>
                                        <video 
                                            src={item.src}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(164, 123, 66, 0.9)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#F5EFEB',
                                            fontSize: '1.2rem',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                        }}>
                                            ▶
                                        </div>
                                    </div>
                                )}
                                <span style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    backgroundColor: 'rgba(11, 13, 12, 0.75)',
                                    color: '#DECDBD',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '999px',
                                    fontSize: '0.72rem',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    backdropFilter: 'blur(4px)',
                                }}>
                                    {item.category}
                                </span>
                            </div>

                            <div style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
                                    fontSize: '0.88rem',
                                    color: '#4A4D4C',
                                    lineHeight: '1.6',
                                    margin: 0,
                                }}>
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Modal Lightbox Preview */}
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
                            {selectedMedia.type === 'foto' ? (
                                <img src={selectedMedia.src} alt={selectedMedia.title} style={{ width: '100%', maxHeight: '500px', objectFit: 'contain' }} />
                            ) : (
                                <video src={selectedMedia.src} controls autoPlay style={{ width: '100%', maxHeight: '500px' }} />
                            )}
                        </div>

                        <div style={{ padding: '2rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#A47B42', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {selectedMedia.category}
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