export default function FasilitasVilla() {
    const facilities = [
        {
            title: "6 Kamar Tidur & Water Heater",
            desc: "Kamar tidur luas dengan kasur berstandar hotel, selimut hangat untuk cuaca dingin Cisarua, serta kamar mandi dengan air panas stabil.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path>
                </svg>
            )
        },
        {
            title: "Private Pool & Sunbeds",
            desc: "Kolam renang pribadi dengan air pegunungan yang segar dan bersih, dilengkapi tempat bersantai di pinggir kolam.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                </svg>
            )
        },
        {
            title: "Meja Biliar Standar & Hiburan",
            desc: "Area game privat dengan meja biliar terawat dan stik lengkap di dalam ruang santai keluarga yang nyaman beratap kaca estetik.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="6" width="20" height="12" rx="2"></rect><path d="M12 12h.01"></path><path d="M7 12h.01"></path><path d="M17 12h.01"></path>
                </svg>
            )
        },
        {
            title: "Gazebo Etnik & Kolam Teratai",
            desc: "Suasana zen khas pedesaan dengan gazebo kayu di atas kolam teratai tenang, spot favorit untuk ngopi pagi dan relaksasi pikiran.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 7v14M21 7v14M12 3L2 12h3v9h14v-9h3L12 3z"></path>
                </svg>
            )
        },
        {
            title: "Dapur Lengkap Mandiri",
            desc: "Peralatan masak lengkap, rice cooker, kompor gas, kulkas besar, microwave, dispenser air galon, piring, dan gelas saji melimpah.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M12 6h.01"></path><path d="M12 12h.01"></path><path d="M8 18h8"></path>
                </svg>
            )
        },
        {
            title: "Area BBQ Luar Ruangan",
            desc: "Fasilitas pemanggang BBQ outdoor gratis untuk pesta barbeque malam hari dengan arang, kipas, dan jepitan daging siap pakai.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v8M4.93 10.93l4.24 4.24M2 18h20M6 22l6-6 6 6"></path>
                </svg>
            )
        },
        {
            title: "Courtyard Luas untuk Games",
            desc: "Pelataran berumput hijau yang cukup luas untuk aktivitas ice breaking, senam pagi, fun games gathering rombongan, atau lari anak.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            )
        },
        {
            title: "WiFi Cepat & Karaoke Sound",
            desc: "Koneksi internet serat optik berkecepatan tinggi, Smart TV untuk streaming YouTube / Netflix, serta speaker karaoke untuk bersenang-senang.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line>
                </svg>
            )
        },
        {
            title: "Parkiran Luas Berpagar",
            desc: "Keamanan terjamin dengan area parkir mandiri berpagar gerbang besi yang dapat menampung 6-8 unit mobil pribadi atau bus mini HiAce.",
            icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
            )
        }
    ];

    return (
        <section id="fasilitas" style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#F5EFEB',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 2rem 0 2rem',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            position: 'relative',
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    @media (max-width: 1024px) {
                        .fasilitas-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                    @media (max-width: 768px) {
                        .fasilitas-grid { grid-template-columns: 1fr !important; }
                    }
                    .fasilitas-card {
                        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .fasilitas-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 20px 40px rgba(11, 13, 12, 0.1) !important;
                    }
                `}
            </style>

            <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '750px' }}>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Fasilitas Villa
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#4A4D4C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Setiap sudut dirancang untuk mendukung kehangatan liburan keluarga, kebersamaan teman, serta acara gathering kantor yang berkesan.
                </p>
            </div>

            <div className="fasilitas-grid" style={{
                maxWidth: '1200px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                marginBottom: '6rem',
            }}>
                {facilities.map((item, index) => (
                    <div key={index} className="fasilitas-card" style={{
                        backgroundColor: '#ECE2D8',
                        borderRadius: '20px',
                        padding: '2.2rem 2rem',
                        boxShadow: '0 10px 30px rgba(11, 13, 12, 0.05)',
                        border: '1px solid rgba(164, 123, 66, 0.15)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.2rem',
                    }}>
                        <div style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            backgroundColor: '#DECDBD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 10px rgba(11, 13, 12, 0.04)',
                        }}>
                            {item.icon}
                        </div>

                        <div>
                            <h3 style={{
                                fontSize: '1.2rem',
                                fontFamily: '"Playfair Display", serif',
                                color: '#0B0D0C',
                                margin: '0 0 0.6rem 0',
                                fontWeight: '600',
                            }}>
                                {item.title}
                            </h3>

                            <p style={{
                                fontSize: '0.88rem',
                                color: '#3A3D3C',
                                lineHeight: '1.6',
                                margin: 0,
                            }}>
                                {item.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Divider HR */}
            <div style={{
                width: '100%',
                maxWidth: '1200px',
                height: '1px',
                backgroundColor: '#DECDBD',
                margin: '0 auto',
            }} />
        </section>
    );
}