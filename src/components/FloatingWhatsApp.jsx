import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import '../assets/styles/villa.css';

const chatTemplates = [
    'Halo Admin, saya ingin cek ketersediaan kamar Villa Arira untuk tanggal...',
    'Halo, apakah Villa Arira masih tersedia untuk acara gathering/keluarga?',
    'Halo min, boleh minta info pricelist lengkap dan detail fasilitasnya?',
];

const WhatsAppIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.148-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
);

export default function FloatingWhatsApp() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const popupRef = useRef(null);

    // Tutup popup saat klik di luar area
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        const text = message.trim() || chatTemplates[0];
        window.open(`https://wa.me/6281234567890?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="va-float va-float--right" ref={popupRef}>
            {isOpen && (
                <div className="va-pop va-chat">
                    <div className="va-chat__head">
                        <h4>Admin Villa Arira</h4>
                        <button onClick={() => setIsOpen(false)} aria-label="Tutup chat">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="va-chat__body">
                        <div className="va-chat__bubble">
                            Halo! Ada yang bisa kami bantu seputar reservasi atau fasilitas Villa Arira di Lembang? Pilih topik atau ketik pesan Anda.
                        </div>

                        <div className="va-chat__tpls">
                            <span>Topik pertanyaan</span>
                            {chatTemplates.map((tpl) => (
                                <button key={tpl} type="button" className="va-chat__tpl" onClick={() => setMessage(tpl)}>
                                    {tpl}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleSend} style={{ display: 'grid', gap: '0.6rem' }}>
                            <textarea
                                rows="2"
                                className="va-input"
                                placeholder="Ketik pesan Anda…"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button type="submit" className="va-btn va-btn--block">
                                Kirim ke WhatsApp
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <button className="va-fab" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                <WhatsAppIcon size={20} />
                Tanya villa
            </button>
        </div>
    );
}