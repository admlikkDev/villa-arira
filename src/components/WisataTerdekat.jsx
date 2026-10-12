import { ArrowUpRight } from 'lucide-react';
import '../assets/styles/villa.css';

// Urut dari yang paling dekat. Waktu tempuh adalah perkiraan berkendara
// dari villa — silakan sesuaikan bila perlu.
const places = [
    {
        name: 'Curug Cimahi',
        tag: 'Alam',
        minutes: 5,
        desc: 'Air terjun yang berada satu desa dengan villa, di Jl. Kolonel Masturi, Kertawangi. Cocok untuk jalan pagi sebelum sarapan.',
    },
    {
        name: 'Dusun Bambu',
        tag: 'Kuliner & keluarga',
        minutes: 20,
        desc: 'Kawasan hijau dengan restoran saung di tepi danau dan area bermain anak. Praktis untuk makan siang rombongan.',
    },
    {
        name: 'Floating Market Lembang',
        tag: 'Kuliner',
        minutes: 30,
        desc: 'Pasar terapung dengan jajanan Sunda, wahana perahu, dan spot foto di tepi danau.',
    },
    {
        name: 'Farmhouse Susu Lembang',
        tag: 'Keluarga',
        minutes: 30,
        desc: 'Bangunan bergaya Eropa dengan peternakan kecil dan susu segar. Ramai untuk foto keluarga.',
    },
    {
        name: 'Orchid Forest Cikole',
        tag: 'Alam',
        minutes: 40,
        desc: 'Hutan pinus dengan koleksi anggrek dan jembatan gantung. Nyaman untuk berjalan santai.',
    },
    {
        name: 'Gunung Tangkuban Perahu',
        tag: 'Alam',
        minutes: 50,
        desc: 'Kawah gunung berapi dengan udara dingin dan pemandangan luas. Berangkat pagi agar tidak berkabut dan antre.',
    },
];

const mapsUrl = (name) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Lembang`)}`;

export default function WisataTerdekat() {
    return (
        <section id="wisata-terdekat" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Wisata terdekat dari villa</h2>
                    <p className="va-lead">
                        Dari Kertawangi, air terjun, kebun, dan pusat wisata Lembang bisa dijangkau dalam hitungan menit. Siapkan itinerary sebelum atau sesudah menginap.
                    </p>
                </div>

                <ul className="va-places">
                    {places.map((p) => (
                        <li key={p.name} className="va-place">
                            <div className="va-place__time">
                                ±{p.minutes}
                                <small>menit berkendara</small>
                            </div>
                            <div>
                                <h3 className="va-h3">{p.name}</h3>
                                <span className="va-place__tag">{p.tag}</span>
                            </div>
                            <p className="va-text">{p.desc}</p>
                            <a className="va-link" href={mapsUrl(p.name)} target="_blank" rel="noopener noreferrer">
                                Lihat peta <ArrowUpRight size={15} />
                            </a>
                        </li>
                    ))}
                </ul>

                <p className="va-note">
                    Waktu tempuh adalah perkiraan dalam kondisi lalu lintas normal. Akhir pekan dan libur panjang di jalur Lembang bisa jauh lebih lama.
                </p>
            </div>
        </section>
    );
}