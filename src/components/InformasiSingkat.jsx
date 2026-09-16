import { useState, useEffect } from 'react';

const images = [
    "public/images/17.jpg",
    "public/images/16.jpg",
    "public/images/15 (1).jpg"
];

const specs = [
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path>
            </svg>
        ),
        title: "Tersedia 6 Kamar Tidur",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
        ),
        title: "Kapasitas ±15-30 Orang",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
            </svg>
        ),
        title: "Tersedia Private Pool",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
        ),
        title: "Parkiran Luas & Aman",
    }
];

export default function InformasiSingkat() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setIsAnimating(false);
            }, 500);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const currentImages = [
        images[currentIndex],
        images[(currentIndex + 1) % images.length],
        images[(currentIndex + 2) % images.length]
    ];

    return (
        <section id="informasi" style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#F5EFEB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 3rem',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    @media (max-width: 1024px) {
                        .info-grid-container { grid-template-columns: 1fr !important; }
                    }
                    .info-img-box {
                        position: relative;
                        overflow: hidden;
                        border-radius: 18px;
                        box-shadow: 0 16px 32px rgba(11, 13, 12, 0.16);
                        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .info-img-box:hover {
                        transform: translateY(-4px);
                    }
                    .info-img-box::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(to bottom, rgba(11,13,12,0.2), rgba(11,13,12,0.65));
                        pointer-events: none;
                    }
                `}
            </style>

            <div className="info-grid-container" style={{
                maxWidth: '1280px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '1.25fr 1fr',
                gap: '3.5rem',
                alignItems: 'center',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.2rem',
                }}>
                    <div className="info-img-box" style={{ gridColumn: 'span 2', height: '340px' }}>
                        <img 
                            src={currentImages[0]} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                display: 'block',
                                transform: isAnimating ? 'scale(1.08)' : 'scale(1)',
                                opacity: isAnimating ? 0 : 1,
                                transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-in-out'
                            }}
                            alt="Villa Arira Utama"
                        />
                    </div>
                    <div className="info-img-box" style={{ height: '190px' }}>
                        <img 
                            src={currentImages[1]} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                display: 'block',
                                transform: isAnimating ? 'scale(1.08)' : 'scale(1)',
                                opacity: isAnimating ? 0 : 1,
                                transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-in-out'
                            }}
                            alt="Fasilitas Villa"
                        />
                    </div>
                    <div className="info-img-box" style={{ height: '190px' }}>
                        <img 
                            src={currentImages[2]} 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                display: 'block',
                                transform: isAnimating ? 'scale(1.08)' : 'scale(1)',
                                opacity: isAnimating ? 0 : 1,
                                transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-in-out'
                            }}
                            alt="Area Villa"
                        />
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#ECE2D8',
                    borderRadius: '24px',
                    padding: '2.8rem',
                    boxShadow: '0 20px 40px rgba(11, 13, 12, 0.08)',
                    border: '1px solid rgba(164, 123, 66, 0.18)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.6rem',
                }}>
                    <div>
                        <span style={{
                            fontSize: '0.75rem',
                            letterSpacing: '2.5px',
                            textTransform: 'uppercase',
                            color: '#A47B42',
                            fontWeight: '700',
                        }}>
                            Spesifikasi
                        </span>
                        <h2 style={{
                            fontSize: '2.2rem',
                            fontFamily: '"Playfair Display", serif',
                            color: '#0B0D0C',
                            marginTop: '0.2rem',
                            marginBottom: '0',
                            fontWeight: '600',
                        }}>
                            The Villa
                        </h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {specs.map((item, index) => (
                            <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.1rem',
                                paddingBottom: '1rem',
                                borderBottom: index !== specs.length - 1 ? '1px solid rgba(164, 123, 66, 0.15)' : 'none',
                            }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    backgroundColor: '#DECDBD',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 10px rgba(11, 13, 12, 0.04)',
                                }}>
                                    {item.icon}
                                </div>
                                <h4 style={{
                                    fontSize: '1.05rem',
                                    fontWeight: '600',
                                    color: '#0B0D0C',
                                    margin: 0,
                                }}>
                                    {item.title}
                                </h4>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        backgroundColor: '#DECDBD',
                        borderRadius: '14px',
                        padding: '1.1rem 1.3rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.9rem',
                        marginTop: '0.4rem',
                        boxShadow: '0 6px 15px rgba(11, 13, 12, 0.04)',
                    }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '1px',
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div>
                            <h5 style={{
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                color: '#0B0D0C',
                                margin: '0 0 0.2rem 0',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}>
                                Lokasi Tenang & Strategis
                            </h5>
                            <p style={{
                                fontSize: '0.82rem',
                                color: '#3A3D3C',
                                margin: 0,
                                lineHeight: '1.45',
                            }}>
                                Jl. Mekartani No.59, Kertawangi, Kec. Cisarua, Bandung Barat 40551
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}