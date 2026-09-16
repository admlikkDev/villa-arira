export default function ContactPage() {
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
                    
                    .contact-grid {
                        display: flex;
                        gap: 4rem;
                        justify-content: center;
                        align-items: flex-start;
                        padding: 6rem 5rem;
                        max-width: 1350px;
                        margin: 0 auto;
                        box-sizing: border-box;
                    }
                    .contact-input:focus {
                        outline: none;
                        border-color: #A47B42 !important;
                        box-shadow: 0 0 0 3px rgba(164, 123, 66, 0.15);
                    }
                    .submit-btn:hover {
                        background-color: #0B0D0C !important;
                        color: #F5EFEB !important;
                        transform: translateY(-2px);
                    }
                    .support-card {
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                    }
                    .support-card:hover {
                        transform: translateY(-4px);
                        box-shadow: 0 15px 30px rgba(11, 13, 12, 0.08);
                    }
                    @media (max-width: 1024px) {
                        .contact-grid { flex-direction: column !important; padding: 4rem 2rem !important; }
                        .form-column, .info-column { width: 100% !important; }
                    }
                `}
            </style>

            {/* Bagian Hero */}
            <header style={{
                position: 'relative',
                width: '100%',
                height: '60vh',
                minHeight: '400px',
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
                    Hubungi Kami
                </span>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#F5EFEB',
                    margin: '0 0 1rem 0',
                    fontWeight: '600',
                }}>
                    Pusat Bantuan & Reservasi
                </h1>
                <p style={{
                    fontSize: '1rem',
                    color: '#DECDBD',
                    maxWidth: '650px',
                    lineHeight: '1.6',
                    margin: 0,
                    opacity: 0.9,
                }}>
                    Punya pertanyaan seputar ketersediaan kamar, paket gathering, atau detail fasilitas Villa Arira? Tim kami siap membantu Anda.
                </p>
            </header>

            {/* Bagian Utama: Form & Info Support */}
            <div className="contact-grid">

                {/* Kolom Kiri: Formulir Kontak */}
                <div className="form-column" style={{
                    width: '55%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    backgroundColor: '#ECE2D8',
                    padding: '3rem',
                    borderRadius: '24px',
                    border: '1px solid rgba(164, 123, 66, 0.2)',
                    boxSizing: 'border-box',
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '2rem',
                            fontFamily: '"Playfair Display", serif',
                            color: '#0B0D0C',
                            margin: '0 0 0.5rem 0',
                            fontWeight: '600',
                        }}>
                            Kirim Pesan ke Admin
                        </h2>
                        <p style={{ fontSize: '0.92rem', color: '#3A3D3C', margin: 0, lineHeight: '1.5' }}>
                            Isi formulir di bawah ini untuk menanyakan jadwal kosong atau konsultasi acara spesial Anda.
                        </p>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); alert('Pesan berhasil dikirim!'); }} style={{ display: 'grid', gap: '1.2rem', marginTop: '0.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                                <label htmlFor="firstName" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0B0D0C' }}>Nama Depan</label>
                                <input
                                    type="text"
                                    placeholder="cth. Budi"
                                    id="firstName"
                                    className="contact-input"
                                    style={{ padding: '0.85rem 1rem', border: '1px solid rgba(164, 123, 66, 0.3)', backgroundColor: '#F5EFEB', borderRadius: '12px', fontSize: '0.9rem', color: '#0B0D0C', transition: 'all 0.2s ease' }}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
                                <label htmlFor="lastName" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0B0D0C' }}>Nama Belakang</label>
                                <input
                                    type="text"
                                    placeholder="cth. Santoso"
                                    id="lastName"
                                    className="contact-input"
                                    style={{ padding: '0.85rem 1rem', border: '1px solid rgba(164, 123, 66, 0.3)', backgroundColor: '#F5EFEB', borderRadius: '12px', fontSize: '0.9rem', color: '#0B0D0C', transition: 'all 0.2s ease' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                            <label htmlFor="workEmail" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0B0D0C' }}>Email / No. WhatsApp</label>
                            <input
                                type="text"
                                placeholder="cth. budi@gmail.com / 08123456789"
                                id="workEmail"
                                className="contact-input"
                                style={{ padding: '0.85rem 1rem', border: '1px solid rgba(164, 123, 66, 0.3)', backgroundColor: '#F5EFEB', borderRadius: '12px', fontSize: '0.9rem', color: '#0B0D0C', transition: 'all 0.2s ease' }}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                            <label htmlFor="message" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0B0D0C' }}>Pesan / Detail Kebutuhan</label>
                            <textarea
                                rows="4"
                                placeholder="Tuliskan tanggal rencana sewa atau pertanyaan Anda di sini..."
                                id="message"
                                className="contact-input"
                                style={{ padding: '0.85rem 1rem', border: '1px solid rgba(164, 123, 66, 0.3)', backgroundColor: '#F5EFEB', borderRadius: '12px', fontSize: '0.9rem', color: '#0B0D0C', resize: 'vertical', fontFamily: 'inherit', transition: 'all 0.2s ease' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            style={{
                                padding: '1rem',
                                borderRadius: '999px',
                                backgroundColor: '#A47B42',
                                color: '#F5EFEB',
                                border: 'none',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                transition: 'all 0.25s ease',
                                boxShadow: '0 4px 15px rgba(164, 123, 66, 0.25)',
                                marginTop: '0.5rem',
                            }}
                        >
                            Kirim Pesan Sekarang
                        </button>
                    </form>
                </div>

                {/* Kolom Kanan: Informasi / Bantuan Tambahan */}
                <div className="info-column" style={{
                    width: '45%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2rem',
                }}>
                    <div className="support-card" style={{
                        backgroundColor: '#ECE2D8',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(164, 123, 66, 0.2)',
                        boxSizing: 'border-box',
                    }}>
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontFamily: '"Playfair Display", serif',
                            color: '#0B0D0C',
                            margin: '0 0 0.6rem 0',
                            fontWeight: '600',
                        }}>
                            Respon Cepat via WhatsApp
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#3A3D3C', lineHeight: '1.6', margin: '0 0 1.2rem 0' }}>
                            Ingin fast response untuk pengecekan tanggal kosong dan kalkulasi harga rombongan? Hubungi admin operasional kami langsung melalui WhatsApp.
                        </p>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="wa-main-btn"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: '#25D366',
                                color: '#0B0D0C',
                                padding: '0.85rem 1.3rem',
                                borderRadius: '999px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.88rem',
                                boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
                            }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#0B0D0C" stroke="none">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.148-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            <span>Tanya Villa</span>
                        </button>
                    </div>

                    <div className="support-card" style={{
                        backgroundColor: '#ECE2D8',
                        padding: '2.5rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(164, 123, 66, 0.2)',
                        boxSizing: 'border-box',
                    }}>
                        <h3 style={{
                            fontSize: '1.4rem',
                            fontFamily: '"Playfair Display", serif',
                            color: '#0B0D0C',
                            margin: '0 0 0.6rem 0',
                            fontWeight: '600',
                        }}>
                            Panduan Lokasi & Alamat
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: '#3A3D3C', lineHeight: '1.6', margin: '0 0 1.2rem 0' }}>
                            Jl. Mekartani No.59, Kertawangi, Kec. Cisarua, Kab. Bandung Barat 40551. Akses jalan mudah dijangkau kendaraan roda empat dan bus pariwisata ukuran sedang.
                        </p>
                        <a
                            href="#lokasi"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                color: '#A47B42',
                                textDecoration: 'none',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                            }}
                        >
                            Lihat Petunjuk Google Maps →
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}