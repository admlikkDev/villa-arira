export default function PricelistVilla() {
    const pricelistData = [
        {
            title: "Arira Private Wing",
            subtitle: "3 kamar belakang + kamar mandi dalam & water heater",
            capacity: "6 – 12 Orang",
            weekday: "Rp 1.500.000",
            weekend: "Rp 2.200.000",
            longWeekend: "Rp 2.700.000",
            highSeason: "Rp 3.500.000"
        },
        {
            title: "Arira Main House",
            subtitle: "3 kamar utama + Billiard, Living Room, Gazebo",
            capacity: "15 – 20 Orang",
            weekday: "Rp 2.800.000",
            weekend: "Rp 3.800.000",
            longWeekend: "Rp 4.500.000",
            highSeason: "Rp 5.500.000"
        },
        {
            title: "Arira Exclusive",
            subtitle: "Seluruh villa (6 Kamar + Pool Privat + Semua Fasilitas)",
            capacity: "15 – 30 Orang",
            weekday: "Rp 4.000.000",
            weekend: "Rp 5.500.000",
            longWeekend: "Rp 6.800.000",
            highSeason: "Rp 8.500.000"
        }
    ];

    return (
        <section id="pricelist" style={{
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
                        .pricelist-table-container { overflow-x: auto; width: 100%; }
                    }
                    .price-row {
                        transition: background-color 0.2s ease;
                    }
                    .price-row:hover {
                        background-color: rgba(222, 205, 189, 0.35) !important;
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
                    Transparansi Tarif
                </span>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0.4rem',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Pricelist Villa Arira
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#3A3D3C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Pilihan tarif transparan tanpa biaya tersembunyi untuk Weekday, Weekend, Long Weekend, dan High Season libur nasional.
                </p>
            </div>

            <div className="pricelist-table-container" style={{
                maxWidth: '1200px',
                width: '100%',
                position: 'relative',
                zIndex: 1,
            }}>
                <div style={{
                    backgroundColor: '#F5EFEB',
                    borderRadius: '24px',
                    boxShadow: '0 20px 45px rgba(11, 13, 12, 0.1)',
                    border: '1px solid rgba(164, 123, 66, 0.2)',
                    overflow: 'hidden',
                    minWidth: '900px',
                }}>
                    {/* Header Tabel */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1.1fr 1.1fr 1.1fr 1.1fr',
                        backgroundColor: '#0B0D0C',
                        color: '#F5EFEB',
                        padding: '1.2rem 2rem',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                    }}>
                        <div>Tipe Sewa</div>
                        <div style={{ textAlign: 'center' }}>Kapasitas</div>
                        <div style={{ textAlign: 'center' }}>Weekday <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.7, fontWeight: '400', textTransform: 'none' }}>senin – kamis</span></div>
                        <div style={{ textAlign: 'center' }}>Weekend <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.7, fontWeight: '400', textTransform: 'none' }}>jumat – minggu</span></div>
                        <div style={{ textAlign: 'center' }}>Long Weekend <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.7, fontWeight: '400', textTransform: 'none' }}>libur nasional</span></div>
                        <div style={{ textAlign: 'center' }}>High Season <span style={{ display: 'block', fontSize: '0.68rem', opacity: 0.7, fontWeight: '400', textTransform: 'none' }}>lebaran & nataru</span></div>
                    </div>

                    {/* Baris Data Tabel */}
                    {pricelistData.map((item, index) => (
                        <div key={index} className="price-row" style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1.1fr 1.1fr 1.1fr 1.1fr',
                            padding: '1.6rem 2rem',
                            alignItems: 'center',
                            borderBottom: index !== pricelistData.length - 1 ? '1px solid rgba(164, 123, 66, 0.15)' : 'none',
                            backgroundColor: 'transparent',
                        }}>
                            <div>
                                <h4 style={{
                                    fontSize: '1.15rem',
                                    fontFamily: '"Playfair Display", serif',
                                    color: '#0B0D0C',
                                    margin: '0 0 0.25rem 0',
                                    fontWeight: '600',
                                }}>
                                    {item.title}
                                </h4>
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: '#5A5D5C',
                                    margin: 0,
                                    lineHeight: '1.4',
                                }}>
                                    {item.subtitle}
                                </p>
                            </div>

                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#3A3D3C',
                            }}>
                                {item.capacity}
                            </div>

                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.92rem',
                                fontWeight: '600',
                                color: '#0B0D0C',
                            }}>
                                {item.weekday}
                            </div>

                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.92rem',
                                fontWeight: '600',
                                color: '#A47B42',
                            }}>
                                {item.weekend}
                            </div>

                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.92rem',
                                fontWeight: '600',
                                color: '#0B0D0C',
                            }}>
                                {item.longWeekend}
                            </div>

                            <div style={{
                                textAlign: 'center',
                                fontSize: '0.92rem',
                                fontWeight: '700',
                                color: '#A47B42',
                            }}>
                                {item.highSeason}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}