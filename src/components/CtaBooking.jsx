import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import '../assets/styles/villa.css';

export default function CtaBooking({
    title = 'Siap menginap di Villa Arira?',
    text = 'Cek tanggal kosong, pilih unit dan paket, lalu tambahkan add-on sesuai kebutuhan rombongan Anda.',
    to = '/booking',
    label = 'Cek jadwal & booking',
}) {
    return (
        <section className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head" style={{ marginBottom: 0 }}>
                    <h2 className="va-h2">{title}</h2>
                    <div style={{ display: 'grid', gap: '1.5rem', justifyItems: 'start' }}>
                        <p className="va-lead">{text}</p>
                        <Link to={to} className="va-btn">
                            {label} <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}