export default function AddOnVilla() {
    const addonData = [
        {
            title: "Extra Bed Tambahan",
            subtitle: "Kenyamanan Ekstra untuk Rombongan Besar",
            price: "Rp 150.000",
            unit: "per malam / unit",
            description: "Kasur ekstra lengkap dengan bantal, selimut hangat, dan seprai bersih untuk kapasitas tidur yang lebih longgar di kamar.",
            features: [
                "Matras empuk berkualitas tinggi",
                "Selimut tebal standar hotel",
                "Termasuk bantal & sarung bersih"
            ]
        },
        {
            title: "Paket BBQ & Charcoal Set",
            subtitle: "Malam Keakraban Lebih Sempurna",
            price: "Rp 250.000",
            unit: "per set lengkap",
            description: "Peralatan pemanggang (grill) lengkap dengan arang siap bakar, kipas, dan perlengkapan oles bumbu untuk pesta BBQ malam hari.",
            features: [
                "Panggang/grill set portable",
                "Arang kayu bakar melimpah",
                "Kuas, jepitan & kipas bambu"
            ]
        },
        {
            title: "Sewa Sound System & Mic",
            subtitle: "Karaoke & Acara Makin Meriah",
            price: "Rp 350.000",
            duration: "per hari / acara",
            unit: "per hari / acara",
            description: "Perangkat pengeras suara portabel lengkap dengan mikrofon wireless untuk hiburan karaoke keluarga atau acara sambutan.",
            features: [
                "Speaker aktif bluetooth & USB",
                "2 Unit Mic wireless jernih",
                "Kabel koneksi & stand lengkap"
            ]
        },
        {
            title: "Breakfast / Catering Menu Sunda",
            subtitle: "Nikmatnya Kuliner Khas Pegunungan",
            price: "Rp 50.000",
            unit: "per pax / porsi",
            description: "Penyediaan menu sarapan atau makan siang/malam prasmanan dengan cita rasa masakan Sunda otentik yang hangat dan segar.",
            features: [
                "Menu prasmanan higienis",
                "Pilihan masakan Sunda pilihan",
                "Termasuk air mineral & buah"
            ]
        }
    ];

    return (
        <section id="add-on" style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#F5EFEB',
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
                        .addon-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                    @media (max-width: 768px) {
                        .addon-grid { grid-template-columns: 1fr !important; }
                    }
                    .addon-card {
                        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .addon-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 25px 50px rgba(11, 13, 12, 0.12) !important;
                    }
                    .addon-btn:hover {
                        background-color: #A47B42 !important;
                        color: #F5EFEB !important;
                        border-color: #A47B42 !important;
                    }
                `}
            </style>

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '750px', position: 'relative', zIndex: 1 }}>
                <span style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#A47B42',
                    fontWeight: '700',
                }}>
                    Layanan Tambahan Opsional
                </span>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0.4rem',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Add-on & Fasilitas Ekstra
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#3A3D3C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Lengkapi kenyamanan kunjungan Anda di Villa Arira dengan memilih berbagai fasilitas tambahan berkualitas sesuai kebutuhan.
                </p>
            </div>

            {/* Grid Add-on */}
            <div className="addon-grid" style={{
                maxWidth: '1280px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '2rem',
                position: 'relative',
                zIndex: 1,
            }}>
                {addonData.map((item, index) => (
                    <div key={index} className="addon-card" style={{
                        backgroundColor: '#ECE2D8',
                        borderRadius: '24px',
                        padding: '2.5rem',
                        boxShadow: '0 15px 35px rgba(11, 13, 12, 0.06)',
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
                                        fontSize: '1.4rem',
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
                                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0B0D0C', fontFamily: '"Playfair Display", serif', display: 'block' }}>{item.price}</span>
                                    <span style={{ fontSize: '0.7rem', color: '#5A5D5C', fontWeight: '600' }}>{item.unit}</span>
                                </div>
                            </div>

                            <p style={{
                                fontSize: '0.88rem',
                                color: '#3A3D3C',
                                lineHeight: '1.6',
                                margin: '1rem 0 1.5rem 0',
                            }}>
                                {item.description}
                            </p>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 2rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.7rem',
                            }}>
                                {item.features.map((feature, fIndex) => (
                                    <li key={fIndex} style={{
                                        fontSize: '0.88rem',
                                        color: '#3A3D3C',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <button 
                            className="addon-btn"
                            style={{
                                width: '100%',
                                padding: '0.85rem 1.5rem',
                                borderRadius: '999px',
                                backgroundColor: 'transparent',
                                color: '#0B0D0C',
                                border: '1px solid #0B0D0C',
                                fontSize: '0.88rem',
                                fontWeight: '600',
                                letterSpacing: '0.5px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            }}
                            onClick={() => alert(`Menambahkan ${item.title} ke reservasi`)}
                        >
                            TAMBAH ADD-ON <span>+</span>
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}