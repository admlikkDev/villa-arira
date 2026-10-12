import { BedDouble, Waves, Gamepad2, Flower2, Utensils, Flame, Trees, Wifi, Car } from 'lucide-react';
import '../assets/styles/villa.css';

const facilities = [
    {
        icon: BedDouble,
        title: '6 kamar tidur & water heater',
        desc: 'Kamar tidur luas dengan kasur berstandar hotel, selimut hangat untuk cuaca dingin Cisarua, serta kamar mandi dengan air panas stabil.',
    },
    {
        icon: Waves,
        title: 'Private pool & sunbeds',
        desc: 'Kolam renang pribadi dengan air pegunungan yang segar dan bersih, dilengkapi tempat bersantai di pinggir kolam.',
    },
    {
        icon: Gamepad2,
        title: 'Meja biliar & hiburan',
        desc: 'Area game privat dengan meja biliar terawat dan stik lengkap di dalam ruang santai keluarga yang nyaman beratap kaca.',
    },
    {
        icon: Flower2,
        title: 'Gazebo etnik & kolam teratai',
        desc: 'Gazebo kayu di atas kolam teratai yang tenang, spot favorit untuk ngopi pagi dan relaksasi.',
    },
    {
        icon: Utensils,
        title: 'Dapur lengkap mandiri',
        desc: 'Peralatan masak lengkap, rice cooker, kompor gas, kulkas besar, microwave, dispenser galon, piring, dan gelas saji melimpah.',
    },
    {
        icon: Flame,
        title: 'Area BBQ luar ruangan',
        desc: 'Pemanggang BBQ outdoor gratis untuk pesta malam hari, dengan arang, kipas, dan jepitan daging siap pakai.',
    },
    {
        icon: Trees,
        title: 'Courtyard luas untuk games',
        desc: 'Pelataran berumput yang cukup luas untuk ice breaking, senam pagi, fun games rombongan, atau anak-anak berlarian.',
    },
    {
        icon: Wifi,
        title: 'WiFi cepat & karaoke',
        desc: 'Internet serat optik berkecepatan tinggi, Smart TV untuk streaming YouTube / Netflix, serta speaker karaoke.',
    },
    {
        icon: Car,
        title: 'Parkiran luas berpagar',
        desc: 'Area parkir mandiri berpagar besi yang menampung 6–8 mobil pribadi atau bus mini HiAce.',
    },
];

export default function FasilitasVilla() {
    return (
        <section id="fasilitas" className="va-ink va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Fasilitas villa</h2>
                    <p className="va-lead">
                        Setiap sudut dirancang untuk mendukung liburan keluarga, kebersamaan teman, serta gathering kantor yang berkesan.
                    </p>
                </div>

                <div className="va-cells va-cells--3">
                    {facilities.map(({ icon: Icon, title, desc }) => (
                        <article key={title} className="va-cell va-fac">
                            <Icon size={26} />
                            <div style={{ display: 'grid', gap: '0.6rem' }}>
                                <h3 className="va-h3">{title}</h3>
                                <p className="va-text">{desc}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}