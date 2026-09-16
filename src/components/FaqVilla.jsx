import { useState } from 'react';

const faqData = [
    {
        question: "Berapa jam check-in dan check-out di Villa Arira?",
        answer: "Waktu check-in standar dimulai pukul 14.00 WIB dan waktu check-out maksimal pukul 12.00 WIB. Jika Anda memerlukan penyesuaian waktu, silakan hubungi tim kami terlebih dahulu."
    },
    {
        question: "Apakah diperbolehkan membawa hewan peliharaan (pets)?",
        answer: "Demi menjaga kebersihan, kenyamanan, dan ketertiban seluruh tamu, Villa Arira tidak memperkenankan membawa hewan peliharaan ke dalam area properti."
    },
    {
        question: "Apakah peralatan masak dan makan sudah disediakan lengkap?",
        answer: "Ya, kami menyediakan peralatan dapur yang sangat lengkap mulai dari kompor gas, rice cooker, kulkas besar, microwave, dispenser air galon, hingga piring, mangkuk, dan gelas saji."
    },
    {
        question: "Bagaimana tata cara booking dan pembayaran?",
        answer: "Anda dapat memilih jadwal melalui formulir ketersediaan, lalu melanjutkan konfirmasi via WhatsApp. Pembayaran dilakukan melalui transfer bank atau gateway resmi dengan memberikan DP (Down Payment) sebagai tanda jadi."
    },
    {
        question: "Bagaimana jika ingin melakukan reschedule tanggal menginap?",
        answer: "Reschedule dapat dilakukan maksimal 7 hari sebelum tanggal check-in dengan ketentuan, selama jadwal pengganti masih tersedia dan mengikuti kebijakan penyesuaian tarif musim tertentu."
    }
];

export default function FaqVilla() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id="faq" style={{
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
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    .faq-item {
                        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .faq-item:hover {
                        border-color: rgba(164, 123, 66, 0.4) !important;
                        box-shadow: 0 10px 25px rgba(11, 13, 12, 0.06);
                    }
                `}
            </style>

            <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '750px' }}>
                <span style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#A47B42',
                    fontWeight: '700',
                }}>
                    Bantuan & Informasi
                </span>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0.4rem',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Pertanyaan yang Sering Diajukan (FAQ)
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#4A4D4C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Informasi penting terkait masa tinggal, reservasi, dan aturan umum di Villa Arira.
                </p>
            </div>

            <div style={{
                maxWidth: '900px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
            }}>
                {faqData.map((item, index) => {
                    const isOpen = activeIndex === index;
                    return (
                        <div 
                            key={index} 
                            className="faq-item"
                            style={{
                                backgroundColor: '#ECE2D8',
                                borderRadius: '16px',
                                border: '1px solid rgba(164, 123, 66, 0.2)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                            }}
                            onClick={() => toggleAccordion(index)}
                        >
                            <div style={{
                                padding: '1.4rem 1.8rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '1rem',
                            }}>
                                <h3 style={{
                                    fontSize: '1.05rem',
                                    fontWeight: '600',
                                    color: '#0B0D0C',
                                    margin: 0,
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                }}>
                                    {item.question}
                                </h3>
                                <span style={{
                                    fontSize: '1rem',
                                    color: '#A47B42',
                                    fontWeight: 'bold',
                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                    flexShrink: 0,
                                }}>
                                    ▼
                                </span>
                            </div>

                            {isOpen && (
                                <div style={{
                                    padding: '0 1.8rem 1.6rem 1.8rem',
                                    fontSize: '0.92rem',
                                    color: '#3A3D3C',
                                    lineHeight: '1.6',
                                    borderTop: '1px solid rgba(164, 123, 66, 0.1)',
                                    paddingTop: '1rem',
                                }}>
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}