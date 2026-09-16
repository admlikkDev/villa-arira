export default function ReviewVilla() {
    const reviewsData = [
        {
            name: "Rian Hidayat",
            role: "Family Gathering Rombongan Kantor",
            rating: 5,
            date: "Minggu lalu",
            comment: "Villa Arira sangat luar biasa! Suasana khas pegunungan Cisarua benar-benar terasa sejuk. Arsitektur kayunya estetik, bersih, dan fasilitas biliar serta kolam renangnya juara buat kumpul keluarga.",
            avatar: "RH"
        },
        {
            name: "Siti Rahmawati",
            role: "Penyelenggara Intimate Wedding",
            rating: 5,
            date: "2 minggu lalu",
            comment: "Tempat terbaik untuk acara pernikahan intim. Halamannya luas, udaranya dingin, dan banyak spot foto bagus dengan latar belakang bangunan kayu etnik Sunda. Tamu-tamu semua terkesan!",
            avatar: "SR"
        },
        {
            name: "Dimas Anggara",
            role: "Acara Lamaran / Engagement",
            rating: 5,
            date: "Sebulan lalu",
            comment: "Gazebo di atas kolam teratai jadi spot favorit saat acara lamaran kemarin. Suasananya privat, syahdu, dan adminnya sangat membantu dari awal koordinasi sampai selesai acara.",
            avatar: "DA"
        }
    ];

    return (
        <section id="review" style={{
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
                        .review-grid { grid-template-columns: 1fr !important; }
                    }
                    .review-card {
                        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .review-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 25px 50px rgba(11, 13, 12, 0.15) !important;
                    }
                `}
            </style>

            {/* Background Ornaments */}
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

            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '750px', position: 'relative', zIndex: 1 }}>
                <span style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#A47B42',
                    fontWeight: '700',
                }}>
                    Testimoni & Pengalaman Tamu
                </span>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0.4rem',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Apa Kata Mereka Tentang Villa Arira?
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#3A3D3C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Kepuasan tamu adalah prioritas kami. Simak ulasan autentik dari pengunjung yang telah menikmati momen berharga di Villa Arira Lembang.
                </p>
            </div>

            {/* Grid Review */}
            <div className="review-grid" style={{
                maxWidth: '1280px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                position: 'relative',
                zIndex: 1,
            }}>
                {reviewsData.map((item, index) => (
                    <div key={index} className="review-card" style={{
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
                            {/* Rating Bintang */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '1.2rem' }}>
                                {[...Array(item.rating)].map((_, i) => (
                                    <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#A47B42" stroke="none">
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                ))}
                            </div>

                            {/* Komentar */}
                            <p style={{
                                fontSize: '0.92rem',
                                color: '#3A3D3C',
                                lineHeight: '1.7',
                                margin: '0 0 2rem 0',
                                fontStyle: 'italic',
                            }}>
                                "{item.comment}"
                            </p>
                        </div>

                        {/* Profil Reviewer */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid rgba(164, 123, 66, 0.15)', paddingTop: '1.2rem' }}>
                            <div style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '50%',
                                backgroundColor: '#A47B42',
                                color: '#F5EFEB',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '0.95rem',
                                fontFamily: '"Playfair Display", serif',
                                flexShrink: 0,
                            }}>
                                {item.avatar}
                            </div>
                            <div>
                                <h4 style={{
                                    fontSize: '1rem',
                                    fontFamily: '"Playfair Display", serif',
                                    color: '#0B0D0C',
                                    margin: '0 0 0.2rem 0',
                                    fontWeight: '600',
                                }}>
                                    {item.name}
                                </h4>
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: '#A47B42',
                                    fontWeight: '600',
                                    display: 'block',
                                }}>
                                    {item.role}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}