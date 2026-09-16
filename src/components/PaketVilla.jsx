export default function PaketVilla() {
    const paketData = [
        {
            title: "Paket Family Gathering",
            subtitle: "Kehangatan & Kebersamaan Rombongan",
            price: "Rp 6.500.000",
            capacity: "Hingga 30 Orang",
            features: [
                "Eksklusif seluruh area Villa Arira (6 Kamar)",
                "Akses penuh Private Pool & kolam teratai",
                "Fasilitas Biliar standar & Karaoke sound",
                "Peralatan BBQ outdoor lengkap dengan arang",
                "Free WiFi berkecepatan tinggi"
            ]
        },
        {
            title: "Paket Intimate Wedding",
            subtitle: "Pernikahan Impian Bernuansa Kayu Etnik",
            price: "Rp 12.500.000",
            capacity: "Maksimal 100 Tamu (Standing)",
            features: [
                "Sewa area halaman luas & pendopo / gazebo",
                "Penginapan 6 kamar tidur untuk keluarga inti",
                "Area parkir luas untuk tamu undangan",
                "Listrik tambahan & spot foto estetik",
                "Koordinasi vendor & layout fleksibel"
            ]
        },
        {
            title: "Paket Lamaran & Engagement",
            subtitle: "Momen Sakral Penuh Keintiman",
            price: "Rp 5.000.000",
            capacity: "50 – 60 Orang",
            features: [
                "Penggunaan Main House & Gazebo Etnik",
                "Set meja dan kursi dekorasi standar",
                "Kamar persiapan khusus keluarga",
                "Suasana alam pegunungan Cisarua yang privat",
                "Area parkir mandiri berpagar"
            ]
        },
        {
            title: "Paket Commercial Photoshoot",
            subtitle: "Sesi Foto Katalog, Prewed & Production",
            price: "Rp 2.500.000",
            capacity: "Kru & Tim Maksimal 15 Orang",
            features: [
                "Akses seluruh spot arsitektur kayu estetik",
                "Ruang ganti & makeup khusus",
                "Pencahayaan alami melimpah",
                "Kawasan villa tenang bebas gangguan",
                "Izin lokasi resmi & privat"
            ]
        }
    ];

    return (
        <section id="paket" style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#DECDBD',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 2rem',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    @media (max-width: 1024px) {
                        .paket-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                    @media (max-width: 768px) {
                        .paket-grid { grid-template-columns: 1fr !important; }
                    }
                    .paket-card {
                        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .paket-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 25px 50px rgba(11, 13, 12, 0.15) !important;
                    }
                    .paket-btn:hover {
                        background-color: #0B0D0C !important;
                        color: #F5EFEB !important;
                        border-color: #0B0D0C !important;
                    }
                `}
            </style>

            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'radial-gradient(rgba(164, 123, 66, 0.2) 1.5px, transparent 1.5px)',
                backgroundSize: '36px 36px',
                pointerEvents: 'none',
            }} />

            <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '750px', position: 'relative', zIndex: 1 }}>
                <span style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#A47B42',
                    fontWeight: '700',
                }}>
                    Solusi Acara Spesial
                </span>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0.4rem',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Paket Gathering, Wedding & Photoshoot
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#3A3D3C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Wujudkan momen berharga bersama keluarga, rekan kerja, atau acara spesial Anda di Villa Arira dengan penawaran paket eksklusif.
                </p>
            </div>

            <div className="paket-grid" style={{
                maxWidth: '1280px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem',
                position: 'relative',
                zIndex: 1,
            }}>
                {paketData.map((item, index) => (
                    <div key={index} className="paket-card" style={{
                        backgroundColor: '#F5EFEB',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        boxShadow: '0 15px 35px rgba(11, 13, 12, 0.08)',
                        border: '1px solid rgba(164, 123, 66, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxSizing: 'border-box',
                    }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                                <div>
                                    <h3 style={{
                                        fontSize: '1.5rem',
                                        fontFamily: '"Playfair Display", serif',
                                        color: '#0B0D0C',
                                        margin: '0 0 0.3rem 0',
                                        fontWeight: '600',
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        color: '#A47B42',
                                        margin: 0,
                                        letterSpacing: '0.5px',
                                    }}>
                                        {item.subtitle}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#7A7D7C', display: 'block', fontWeight: '700' }}>Mulai Dari</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0B0D0C', fontFamily: '"Playfair Display", serif' }}>{item.price}</span>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                margin: '1.2rem 0',
                                padding: '0.8rem 1rem',
                                backgroundColor: '#ECE2D8',
                                borderRadius: '12px',
                                fontSize: '0.82rem',
                                color: '#3A3D3C',
                                fontWeight: '600',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="9" cy="7" r="4"></circle>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span>{item.capacity}</span>
                            </div>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '1.5rem 0 2rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.8rem',
                            }}>
                                {item.features.map((feature, fIndex) => (
                                    <li key={fIndex} style={{
                                        fontSize: '0.9rem',
                                        color: '#3A3D3C',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button 
                            className="paket-btn"
                            style={{
                                width: '100%',
                                padding: '0.9rem 1.5rem',
                                borderRadius: '999px',
                                backgroundColor: 'transparent',
                                color: '#0B0D0C',
                                border: '1px solid #0B0D0C',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            }}
                            onClick={() => alert(`Pemesanan untuk ${item.title}`)}
                        >
                            PESAN PAKET INI <span>→</span>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}