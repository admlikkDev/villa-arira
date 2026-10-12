import { Check, Plus } from 'lucide-react';
import '../assets/styles/villa.css';

const addonData = [
    {
        title: 'Extra bed tambahan',
        subtitle: 'Kenyamanan ekstra untuk rombongan besar',
        price: 'Rp 150.000',
        unit: 'per malam / unit',
        description: 'Kasur ekstra lengkap dengan bantal, selimut hangat, dan seprai bersih untuk kapasitas tidur yang lebih longgar di kamar.',
        features: ['Matras empuk berkualitas tinggi', 'Selimut tebal standar hotel', 'Termasuk bantal & sarung bersih'],
    },
    {
        title: 'Paket BBQ & charcoal set',
        subtitle: 'Malam keakraban lebih sempurna',
        price: 'Rp 250.000',
        unit: 'per set lengkap',
        description: 'Peralatan pemanggang lengkap dengan arang siap bakar, kipas, dan perlengkapan oles bumbu untuk pesta BBQ malam hari.',
        features: ['Panggang/grill set portable', 'Arang kayu bakar melimpah', 'Kuas, jepitan & kipas bambu'],
    },
    {
        title: 'Sewa sound system & mic',
        subtitle: 'Karaoke & acara makin meriah',
        price: 'Rp 350.000',
        unit: 'per hari / acara',
        description: 'Pengeras suara portabel lengkap dengan mikrofon wireless untuk karaoke keluarga atau acara sambutan.',
        features: ['Speaker aktif bluetooth & USB', '2 unit mic wireless jernih', 'Kabel koneksi & stand lengkap'],
    },
    {
        title: 'Breakfast / catering menu Sunda',
        subtitle: 'Kuliner khas pegunungan',
        price: 'Rp 50.000',
        unit: 'per pax / porsi',
        description: 'Sarapan atau makan siang/malam prasmanan dengan cita rasa masakan Sunda otentik yang hangat dan segar.',
        features: ['Menu prasmanan higienis', 'Pilihan masakan Sunda pilihan', 'Termasuk air mineral & buah'],
    },
];

export default function AddOnVilla() {
    return (
        <section id="add-on" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Add-on & fasilitas ekstra</h2>
                    <p className="va-lead">
                        Lengkapi kunjungan Anda di Villa Arira dengan layanan tambahan sesuai kebutuhan. Semuanya opsional.
                    </p>
                </div>

                <div className="va-addons">
                    {addonData.map((item) => (
                        <article key={item.title} className="va-addon">
                            <div>
                                <h3 className="va-h3">{item.title}</h3>
                                <p className="va-muted" style={{ margin: '0.4rem 0 0', fontSize: '0.88rem' }}>{item.subtitle}</p>
                            </div>

                            <div style={{ display: 'grid', gap: '1.25rem' }}>
                                <p className="va-text">{item.description}</p>
                                <ul className="va-checks">
                                    {item.features.map((f) => (
                                        <li key={f}><Check size={16} strokeWidth={2} />{f}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="va-addon__side">
                                <div>
                                    <span className="va-price">{item.price}</span>
                                    <span className="va-price-note">{item.unit}</span>
                                </div>
                                <button
                                    className="va-btn va-btn--ghost va-btn--sm"
                                    onClick={() => alert(`Menambahkan ${item.title} ke reservasi`)}
                                >
                                    <Plus size={16} /> Tambah
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}