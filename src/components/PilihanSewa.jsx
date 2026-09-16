export default function PilihanSewa() {
    const rentalOptions = [
        {
            title: "Arira Private Wing",
            subtitle: "3 kamar belakang",
            desc: "Pilihan hemat dan privat bagi rombongan santai keluarga yang ingin menikmati udara sejuk tanpa menyewa seluruh kompleks villa.",
            image: "public/images/15 (1).jpg"
        },
        {
            title: "Arira Main House",
            subtitle: "3 kamar utama",
            desc: "Bangunan kayu etnik Sunda megah dengan ruang tengah super lapang, meja biliar, dan pemandangan langsung ke kolam teratai.",
            image: "public/images/16.jpg"
        },
        {
            title: "Arira Exclusive",
            subtitle: "Seluruh villa, 6 kamar",
            desc: "Seluruh properti Villa Arira eksklusif milik rombongan Anda. Tidak ada tamu lain, bebas berkumpul tanpa canggung bersama keluarga besar & rekan.",
            image: "public/images/17.jpg"
        }
    ];

    return (
        <section id="pilihan-sewa" style={{
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
                        .sewa-grid { grid-template-columns: 1fr !important; }
                    }
                    .sewa-card {
                        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .sewa-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 25px 50px rgba(11, 13, 12, 0.15) !important;
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
                backgroundSize: '36px 36px',
                pointerEvents: 'none',
            }} />

            <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                border: '1px solid rgba(164, 123, 66, 0.25)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-120px',
                left: '-120px',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                border: '1px solid rgba(164, 123, 66, 0.2)',
                pointerEvents: 'none',
            }} />

            <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '700px', position: 'relative', zIndex: 1 }}>
                <span style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#A47B42',
                    fontWeight: '700',
                }}>
                    Fleksibilitas Akomodasi
                </span>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0.4rem',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Pilihan Sewa Villa Arira
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#3A3D3C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Suaikan paket penginapan dengan jumlah rombongan dan kebutuhan kegiatan Anda di Cisarua, Lembang.
                </p>
            </div>

            <div className="sewa-grid" style={{
                maxWidth: '1200px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                position: 'relative',
                zIndex: 1,
            }}>
                {rentalOptions.map((item, index) => (
                    <div key={index} className="sewa-card" style={{
                        backgroundColor: '#F5EFEB',
                        borderRadius: '24px',
                        padding: '0',
                        boxShadow: '0 15px 35px rgba(11, 13, 12, 0.08)',
                        border: '1px solid rgba(164, 123, 66, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div>
                            <div style={{
                                width: '100%',
                                height: '210px',
                                overflow: 'hidden',
                                position: 'relative',
                            }}>
                                <img 
                                    src={item.image} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                    alt={item.title}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(to bottom, rgba(11,13,12,0.1), rgba(11,13,12,0.4))',
                                    pointerEvents: 'none',
                                }} />
                            </div>

                            <div style={{ padding: '2rem 2rem 1.5rem 2rem' }}>
                                <h3 style={{
                                    fontSize: '1.6rem',
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
                                    margin: '0 0 1rem 0',
                                    letterSpacing: '0.5px',
                                }}>
                                    {item.subtitle}
                                </p>

                                <p style={{
                                    fontSize: '0.9rem',
                                    color: '#3A3D3C',
                                    lineHeight: '1.6',
                                    margin: 0,
                                }}>
                                    {item.desc}
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '0 2rem 2rem 2rem' }}>
                            <button 
                                style={{
                                    width: '100%',
                                    padding: '0.8rem 1.5rem',
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
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0B0D0C';
                                    e.currentTarget.style.color = '#F5EFEB';
                                    e.currentTarget.style.borderColor = '#0B0D0C';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#0B0D0C';
                                    e.currentTarget.style.borderColor = '#0B0D0C';
                                }}
                                onClick={() => alert(`Detail untuk ${item.title}`)}
                            >
                                LIHAT DETAIL <span>→</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}