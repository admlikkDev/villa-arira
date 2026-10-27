import { useState, useEffect } from 'react';
import { MapPin, Dot } from 'lucide-react';
import { useVillaList, useVillaOne } from '../hooks/Usevillaquery';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

// Dipakai bila specification-gallery belum diisi dari panel admin
const FALLBACK_IMAGES = ['/images/17.jpg', '/images/16.jpg', '/images/15 (1).jpg'];
const altTexts = ['Villa Arira tampak utama', 'Fasilitas Villa Arira', 'Area Villa Arira'];

export default function InformasiSingkat() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const specsQuery = useVillaList('specifications');
    const galleryQuery = useVillaOne('specification-gallery');

    const gallery = galleryQuery.data;
    const apiImages = [gallery?.image1, gallery?.image2, gallery?.image3].filter(Boolean);
    const images = apiImages.length > 0 ? apiImages : FALLBACK_IMAGES;

    // Rotasi foto setiap 4 detik
    useEffect(() => {
        if (images.length < 2) return undefined;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    if (specsQuery.isLoading || galleryQuery.isLoading) {
        return <SectionState tone="ink" label="Memuat informasi villa…" />;
    }
    if (specsQuery.isError) {
        return <SectionState tone="ink" label="Informasi villa gagal dimuat" error={specsQuery.error.message} />;
    }

    const specs = specsQuery.data ?? [];
    const currentImages = [0, 1, 2].map((i) => images[(currentIndex + i) % images.length]);

    return (
        <section id="informasi" className="va-paper va-section">
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
                        {specs.map((item, index) => (
                            <li key={item.id ?? index}>
                                {item.logo?.image ? (
                                    <img
                                        src={item.logo.image}
                                        alt=""
                                        loading="lazy"
                                        style={{ width: 28, height: 28, objectFit: 'cover', flex: 'none', display: 'block' }}
                                    />
                                ) : (
                                    <Dot size={28} />
                                )}
                                {item.text}
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