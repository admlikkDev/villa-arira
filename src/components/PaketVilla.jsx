import { Check, Users } from 'lucide-react';
import '../assets/styles/villa.css';

const paketData = [
    {
        title: 'Paket Family Gathering',
        subtitle: 'Kehangatan & kebersamaan rombongan',
        price: 'Rp 6.500.000',
        capacity: 'Hingga 30 orang',
        features: [
            'Eksklusif seluruh area Villa Arira (6 kamar)',
            'Akses penuh private pool & kolam teratai',
            'Fasilitas biliar standar & karaoke sound',
            'Peralatan BBQ outdoor lengkap dengan arang',
            'Free WiFi berkecepatan tinggi',
        ],
    },
    {
        title: 'Paket Intimate Wedding',
        subtitle: 'Pernikahan bernuansa kayu etnik',
        price: 'Rp 12.500.000',
        capacity: 'Maksimal 100 tamu (standing)',
        features: [
            'Sewa area halaman luas & pendopo / gazebo',
            'Penginapan 6 kamar tidur untuk keluarga inti',
            'Area parkir luas untuk tamu undangan',
            'Listrik tambahan & spot foto estetik',
            'Koordinasi vendor & layout fleksibel',
        ],
    },
    {
        title: 'Paket Lamaran & Engagement',
        subtitle: 'Momen sakral yang intim',
        price: 'Rp 5.000.000',
        capacity: '50 – 60 orang',
        features: [
            'Penggunaan Main House & gazebo etnik',
            'Set meja dan kursi dekorasi standar',
            'Kamar persiapan khusus keluarga',
            'Suasana alam pegunungan Cisarua yang privat',
            'Area parkir mandiri berpagar',
        ],
    },
    {
        title: 'Paket Commercial Photoshoot',
        subtitle: 'Foto katalog, prewed & production',
        price: 'Rp 2.500.000',
        capacity: 'Kru & tim maksimal 15 orang',
        features: [
            'Akses seluruh spot arsitektur kayu estetik',
            'Ruang ganti & makeup khusus',
            'Pencahayaan alami melimpah',
            'Kawasan villa tenang bebas gangguan',
            'Izin lokasi resmi & privat',
        ],
    },
];

export default function PaketVilla() {
    return (
        <section id="paket" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Paket gathering, wedding & photoshoot</h2>
                    <p className="va-lead">
                        Wujudkan momen berharga bersama keluarga, rekan kerja, atau acara spesial Anda dengan penawaran paket eksklusif.
                    </p>
                </div>

                <div className="va-cells va-cells--2">
                    {paketData.map((item) => (
                        <article key={item.title} className="va-cell">
                            <div className="va-cell__top">
                                <div>
                                    <h3 className="va-h3" style={{ fontSize: '2rem' }}>{item.title}</h3>
                                    <p className="va-muted" style={{ margin: '0.4rem 0 0', fontSize: '0.9rem' }}>{item.subtitle}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="va-price">{item.price}</span>
                                    <span className="va-price-note">Mulai dari</span>
                                </div>
                            </div>

                            <div className="va-meta">
                                <Users size={17} strokeWidth={1.75} />
                                {item.capacity}
                            </div>

                            <ul className="va-checks">
                                {item.features.map((f) => (
                                    <li key={f}><Check size={16} strokeWidth={2} />{f}</li>
                                ))}
                            </ul>

                            <button
                                className="va-btn va-btn--ghost va-btn--block va-cell__push"
                                onClick={() => alert(`Pemesanan untuk ${item.title}`)}
                            >
                                Pesan paket ini
                            </button>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}