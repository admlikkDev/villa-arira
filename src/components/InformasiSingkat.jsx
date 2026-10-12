import { useState, useEffect } from 'react';
import { BedDouble, Users, Waves, Car, MapPin } from 'lucide-react';
import '../assets/styles/villa.css';

const images = ['/images/17.jpg', '/images/16.jpg', '/images/15 (1).jpg'];

const specs = [
    { icon: BedDouble, title: 'Tersedia 6 kamar tidur' },
    { icon: Users, title: 'Kapasitas ±15–30 orang' },
    { icon: Waves, title: 'Tersedia private pool' },
    { icon: Car, title: 'Parkiran luas & aman' },
];

const altTexts = ['Villa Arira tampak utama', 'Fasilitas Villa Arira', 'Area Villa Arira'];

export default function InformasiSingkat() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Rotasi foto setiap 4 detik
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const currentImages = [0, 1, 2].map((i) => images[(currentIndex + i) % images.length]);

    return (
        <section id="informasi" className="va-ink va-section">
            <div className="va-wrap va-info">
                <div className="va-collage">
                    {currentImages.map((src, i) => (
                        <figure key={i}>
                            <img key={`${i}-${currentIndex}`} src={src} alt={altTexts[i]} />
                        </figure>
                    ))}
                </div>

                <div>
                    <h2 className="va-h2">The Villa Experience</h2>

                    <ul className="va-rowlist">
                        {specs.map(({ icon: Icon, title }) => (
                            <li key={title}>
                                <Icon size={20} strokeWidth={1.5} />
                                {title}
                            </li>
                        ))}
                    </ul>

                    <div className="va-address">
                        <MapPin size={20} strokeWidth={1.5} />
                        <p className="va-text" style={{ color: 'inherit' }}>
                            <strong>Lokasi tenang & strategis</strong>
                            Jl. Mekartani No.59, Kertawangi, Kec. Cisarua, Bandung Barat 40551
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}