export default function Footer() {
    return (
        <footer style={{
            width: '100%',
            backgroundColor: '#0B0D0C',
            color: '#ECE2D8',
            padding: '6rem 3rem 3rem 3rem',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    @media (max-width: 1024px) {
                        .footer-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
                        .footer-bottom { flex-direction: column !important; gap: 1.5rem !important; text-align: center; }
                    }
                    .footer-link {
                        color: #DECDBD;
                        text-decoration: none;
                        transition: color 0.2s ease, padding-left 0.2s ease;
                        display: inline-block;
                    }
                    .footer-link:hover {
                        color: #F5EFEB;
                        padding-left: 4px;
                    }
                    .facility-pill {
                        background-color: rgba(222, 205, 189, 0.08);
                        border: 1px solid rgba(164, 123, 66, 0.25);
                        padding: 0.4rem 0.9rem;
                        borderRadius: 999px;
                        font-size: 0.78rem;
                        color: #DECDBD;
                        transition: all 0.2s ease;
                    }
                    .facility-pill:hover {
                        background-color: rgba(164, 123, 66, 0.2);
                        color: #F5EFEB;
                        border-color: #A47B42;
                    }
                    .social-btn:hover {
                        opacity: 0.85;
                        transform: translateY(-2px);
                    }
                `}
            </style>

            <div className="footer-grid" style={{
                maxWidth: '1280px',
                width: '100%',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr 1.2fr',
                gap: '4rem',
                alignItems: 'start',
            }}>
                {/* Kolom 1: Branding & Info Utama */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                    <h2 style={{
                        fontSize: '2.2rem',
                        fontFamily: '"Playfair Display", serif',
                        color: '#F5EFEB',
                        margin: 0,
                        fontWeight: '600',
                        letterSpacing: '1px',
                    }}>
                        VILLA ARIRA
                    </h2>
                    <p style={{
                        fontSize: '0.9rem',
                        color: '#DECDBD',
                        lineHeight: '1.7',
                        margin: 0,
                        opacity: 0.85,
                    }}>
                        Peristirahatan eksklusif dengan arsitektur kayu tradisional khas Sunda Jawa Barat di Cisarua, Lembang. Menghadirkan 6 kamar tidur, kolam renang privat, biliar, gazebo teratai, serta kapasitas 15 hingga 30 orang.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.4rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#DECDBD', margin: 0, lineHeight: '1.5' }}>
                            <strong style={{ color: '#F5EFEB' }}>Alamat:</strong> Jl. Mekartani No.59, Kertawangi, Kec. Cisarua, Kab. Bandung Barat 40551
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#DECDBD', margin: 0, lineHeight: '1.5' }}>
                            <strong style={{ color: '#F5EFEB' }}>Jam Operasional Admin:</strong> Setiap Hari 07:00 – 22:00 WIB
                        </p>
                        <p style={{ fontSize: '0.85rem', color: '#DECDBD', margin: 0, lineHeight: '1.5' }}>
                            <strong style={{ color: '#F5EFEB' }}>Email:</strong> info@villaarira.com
                        </p>
                    </div>

                    {/* Social Media & Contact Buttons */}
                    <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
                        {/* WhatsApp Button */}
                        <a 
                            href="https://wa.me/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '42px',
                                height: '42px',
                                backgroundColor: '#25D366',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.25)',
                                transition: 'all 0.2s ease',
                            }}
                            title="WhatsApp"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#0B0D0C" stroke="none">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.148-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                        </a>

                        {/* Instagram Button */}
                        <a 
                            href="https://instagram.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="social-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '42px',
                                height: '42px',
                                background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(220, 39, 67, 0.25)',
                                transition: 'all 0.2s ease',
                            }}
                            title="Instagram"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5EFEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>

                        {/* Email Button */}
                        <a 
                            href="mailto:info@villaarira.com"
                            className="social-btn"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '42px',
                                height: '42px',
                                backgroundColor: '#A47B42',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(164, 123, 66, 0.25)',
                                transition: 'all 0.2s ease',
                            }}
                            title="Email"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5EFEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Kolom 2: Navigasi Halaman */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <h4 style={{
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        color: '#A47B42',
                        margin: 0,
                    }}>
                        Navigasi Halaman
                    </h4>
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.8rem',
                        fontSize: '0.9rem',
                    }}>
                        <li><a href="#pilihan-sewa" className="footer-link">Pilihan Sewa</a></li>
                        <li><a href="#pricelist" className="footer-link">Pricelist Lengkap</a></li>
                        <li><a href="#fasilitas" className="footer-link">Fasilitas Properti</a></li>
                        <li><a href="#cek-jadwal" className="footer-link">Cek Ketersediaan Jadwal</a></li>
                        <li><a href="#faq" className="footer-link">Tanya Jawab (FAQ)</a></li>
                    </ul>
                </div>

                {/* Kolom 3: Fasilitas Unggulan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                    <h4 style={{
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        color: '#A47B42',
                        margin: 0,
                    }}>
                        Fasilitas Unggulan
                    </h4>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                        <span className="facility-pill">6 Kamar Nyaman</span>
                        <span className="facility-pill">Kapasitas 15–30 Pax</span>
                        <span className="facility-pill">Private Pool</span>
                        <span className="facility-pill">Parkiran Luas</span>
                        <span className="facility-pill">Billiard Area</span>
                        <span className="facility-pill">Gazebo Kolam Teratai</span>
                        <span className="facility-pill">Area BBQ Outdoor</span>
                    </div>
                </div>
            </div>

            {/* Garis Pembatas Bawah */}
            <div style={{
                maxWidth: '1280px',
                width: '100%',
                margin: '4rem auto 2rem auto',
                height: '1px',
                backgroundColor: 'rgba(164, 123, 66, 0.2)',
            }} />

            {/* Copyright & Tagline Bawah */}
            <div className="footer-bottom" style={{
                maxWidth: '1280px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
                color: '#DECDBD',
                opacity: 0.75,
            }}>
                <span>© 2026 Villa Arira. All rights reserved.</span>
                <span>Exclusive Wooden Sanctuary · Kertawangi, Cisarua, Lembang</span>
            </div>
        </footer>
    );
}