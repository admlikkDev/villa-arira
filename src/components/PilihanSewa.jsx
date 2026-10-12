import '../assets/styles/villa.css';

const rentalOptions = [
    {
        title: 'Arira Private Wing',
        subtitle: '3 kamar belakang',
        desc: 'Pilihan hemat dan privat bagi rombongan santai keluarga yang ingin menikmati udara sejuk tanpa menyewa seluruh kompleks villa.',
        image: '/images/15 (1).jpg',
    },
    {
        title: 'Arira Main House',
        subtitle: '3 kamar utama',
        desc: 'Bangunan kayu etnik Sunda megah dengan ruang tengah super lapang, meja biliar, dan pemandangan langsung ke kolam teratai.',
        image: '/images/16.jpg',
    },
    {
        title: 'Arira Exclusive',
        subtitle: 'Seluruh villa, 6 kamar',
        desc: 'Seluruh properti Villa Arira eksklusif milik rombongan Anda. Tidak ada tamu lain, bebas berkumpul bersama keluarga besar & rekan.',
        image: '/images/17.jpg',
    },
];

export default function PilihanSewa() {
    return (
        <section id="pilihan-sewa" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Pilihan sewa Villa Arira</h2>
                    <p className="va-lead">
                        Sesuaikan penginapan dengan jumlah rombongan dan kebutuhan kegiatan Anda di Cisarua, Lembang.
                    </p>
                </div>

                <div className="va-cells va-cells--3">
                    {rentalOptions.map((item) => (
                        <article key={item.title} className="va-rent">
                            <div className="va-rent__img">
                                <img src={item.image} alt={item.title} />
                            </div>
                            <div className="va-rent__body">
                                <div>
                                    <h3 className="va-h3">{item.title}</h3>
                                    <p className="va-muted" style={{ margin: '0.35rem 0 0', fontSize: '0.88rem', fontWeight: 600 }}>
                                        {item.subtitle}
                                    </p>
                                </div>
                                <p className="va-text">{item.desc}</p>
                                <button
                                    className="va-btn va-btn--ghost va-btn--block va-cell__push"
                                    onClick={() => alert(`Detail untuk ${item.title}`)}
                                >
                                    Lihat detail
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}