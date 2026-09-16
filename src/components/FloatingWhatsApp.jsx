import { useState, useRef, useEffect } from 'react';

export default function FloatingWhatsApp() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const popupRef = useRef(null);

    // Daftar template pesan cepat yang interaktif & natural
    const chatTemplates = [
        "Halo Admin, saya ingin cek ketersediaan kamar Villa Arira untuk tanggal...",
        "Halo, apakah Villa Arira masih tersedia untuk acara gathering/keluarga?",
        "Halo min, boleh minta info pricelist lengkap dan detail fasilitasnya?"
    ];

    // Tutup popup saat klik di luar area
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        const text = message.trim() || chatTemplates[0];
        const encodedText = encodeURIComponent(text);
        window.open(`https://wa.me/6281234567890?text=${encodedText}`, '_blank');
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        }} ref={popupRef}>
            <style>
                {`
                    @keyframes floatPulse {
                        0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); }
                        70% { box-shadow: 0 0 0 16px rgba(37, 211, 102, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
                    }
                    @keyframes popupSlide {
                        0% { opacity: 0; transform: translateY(12px) scale(0.95); }
                        100% { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .wa-main-btn {
                        animation: floatPulse 2.5s infinite;
                        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .wa-main-btn:hover {
                        transform: scale(1.08);
                    }
                    .template-chip:hover {
                        background-color: rgba(164, 123, 66, 0.15) !important;
                        border-color: #A47B42 !important;
                    }
                `}
            </style>

            {/* Kotak Chat Popup */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    bottom: '75px',
                    right: 0,
                    width: '330px',
                    backgroundColor: '#F5EFEB',
                    borderRadius: '24px',
                    boxShadow: '0 20px 45px rgba(11, 13, 12, 0.2)',
                    border: '1px solid rgba(164, 123, 66, 0.25)',
                    overflow: 'hidden',
                    animation: 'popupSlide 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {/* Header Chat */}
                    <div style={{
                        backgroundColor: '#0B0D0C',
                        padding: '1.2rem',
                        color: '#F5EFEB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                backgroundColor: '#25D366',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#0B0D0C',
                                fontSize: '1.1rem',
                            }}>
                                💬
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontFamily: '"Playfair Display", serif' }}>Admin Villa Arira</h4>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#DECDBD',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Body Chat */}
                    <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#ECE2D8' }}>
                        <div style={{
                            backgroundColor: '#F5EFEB',
                            padding: '0.9rem 1.1rem',
                            borderRadius: '16px 16px 16px 4px',
                            fontSize: '0.85rem',
                            color: '#0B0D0C',
                            boxShadow: '0 4px 12px rgba(11, 13, 12, 0.05)',
                            lineHeight: '1.5',
                        }}>
                            Halo! Ada yang bisa kami bantu seputar reservasi atau fasilitas Villa Arira di Lembang? Silakan pilih atau ketik pesan Anda di bawah 👇
                        </div>

                        {/* Template Cepat */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: '#A47B42', letterSpacing: '0.5px' }}>Topik Pertanyaan:</span>
                            {chatTemplates.map((tpl, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setMessage(tpl)}
                                    className="template-chip"
                                    style={{
                                        textAlign: 'left',
                                        fontSize: '0.78rem',
                                        padding: '0.5rem 0.8rem',
                                        borderRadius: '10px',
                                        backgroundColor: '#F5EFEB',
                                        border: '1px solid rgba(164, 123, 66, 0.2)',
                                        color: '#3A3D3C',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    {tpl}
                                </button>
                            ))}
                        </div>

                        {/* Form Input Pesan */}
                        <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.2rem' }}>
                            <textarea 
                                rows="2"
                                placeholder="Ketik pesan Anda..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '0.7rem',
                                    borderRadius: '12px',
                                    backgroundColor: '#F5EFEB',
                                    border: '1px solid rgba(164, 123, 66, 0.25)',
                                    color: '#0B0D0C',
                                    fontSize: '0.82rem',
                                    boxSizing: 'border-box',
                                    resize: 'none',
                                    outline: 'none',
                                    fontFamily: 'inherit',
                                }}
                            />
                            <button 
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '0.7rem',
                                    borderRadius: '12px',
                                    backgroundColor: '#25D366',
                                    color: '#0B0D0C',
                                    border: 'none',
                                    fontSize: '0.85rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                                    transition: 'opacity 0.2s ease',
                                }}
                            >
                                Kirim ke WhatsApp
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Tombol Mengambang Utama */}
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
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.148-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Tanya Villa</span>
            </button>
        </div>
    );
}