import { useState } from 'react';
import { ArrowUpRight, ImageOff } from 'lucide-react';
import '../assets/styles/villa.css';

// Urut dari yang paling dekat. Waktu tempuh adalah perkiraan berkendara
// dari villa — silakan sesuaikan bila perlu.
// Simpan foto di public/images/wisata/ dengan nama file sesuai `image` di bawah.
const places = [
    {
        name: 'Curug Cimahi',
        tag: 'Alam',
        minutes: 5,
        image: '/images/wisata/curug-cimahi.jpg',
        desc: 'Air terjun yang berada satu desa dengan villa, di Jl. Kolonel Masturi, Kertawangi. Cocok untuk jalan pagi sebelum sarapan.',
    },
    {
        name: 'Dusun Bambu',
        tag: 'Kuliner & keluarga',
        minutes: 20,
        image: '/images/wisata/dusun-bambu.jpg',
        desc: 'Kawasan hijau dengan restoran saung di tepi danau dan area bermain anak. Praktis untuk makan siang rombongan.',
    },
    {
        name: 'Floating Market Lembang',
        tag: 'Kuliner',
        minutes: 30,
        image: '/images/wisata/floating-market.jpg',
        desc: 'Pasar terapung dengan jajanan Sunda, wahana perahu, dan spot foto di tepi danau.',
    },
    {
        name: 'Farmhouse Susu Lembang',
        tag: 'Keluarga',
        minutes: 30,
        image: '/images/wisata/farmhouse.jpg',
        desc: 'Bangunan bergaya Eropa dengan peternakan kecil dan susu segar. Ramai untuk foto keluarga.',
    },
    {
        name: 'Orchid Forest Cikole',
        tag: 'Alam',
        minutes: 40,
        image: '/images/wisata/orchid-forest.jpg',
        desc: 'Hutan pinus dengan koleksi anggrek dan jembatan gantung. Nyaman untuk berjalan santai.',
    },
    {
        name: 'Gunung Tangkuban Perahu',
        tag: 'Alam',
        minutes: 50,
        image: '/images/wisata/tangkuban-perahu.jpg',
        desc: 'Kawah gunung berapi dengan udara dingin dan pemandangan luas. Berangkat pagi agar tidak berkabut dan antre.',
    },
];

const mapsUrl = (name) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} Lembang`)}`;

// Jika file foto belum ada, tampilkan penanda kosong alih-alih ikon gambar rusak
function PlaceImage({ src, alt }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <div className="va-img-fallback">
                <ImageOff size={24} strokeWidth={1.25} />
                <span>Foto belum tersedia</span>
            </div>
        );
    }

    return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

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

                <div className="va-cells va-cells--3">
                    {places.map((p) => (
                        <article key={p.name} className="va-rent">
                            <div className="va-rent__img">
                                <PlaceImage src={p.image} alt={p.name} />
                                <span className="va-chip">±{p.minutes} menit</span>
                            </div>

                            <div className="va-rent__body">
                                <div>
                                    <h3 className="va-h3">{p.name}</h3>
                                    <p className="va-place-meta">{p.tag} · berkendara dari villa</p>
                                </div>
                                <p className="va-text">{p.desc}</p>
                                <a
                                    className="va-link va-cell__push"
                                    href={mapsUrl(p.name)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ alignSelf: 'flex-start' }}
                                >
                                    Lihat peta <ArrowUpRight size={15} />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>

                <p className="va-note">
                    Waktu tempuh adalah perkiraan dalam kondisi lalu lintas normal. Akhir pekan dan libur panjang di jalur Lembang bisa jauh lebih lama.
                </p>
            </div>
        </section>
    );
}