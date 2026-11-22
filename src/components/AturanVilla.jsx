import '../assets/styles/villa.css';

// CONTOH: ganti seluruh isi aturan ini dengan aturan villa yang sebenarnya.
const DEFAULT_RULES = [
    {
        title: 'Check-in dan check-out',
        text: 'Check-in dan check-out mengikuti jam yang tertera di atas. Keterlambatan check-out dapat dikenakan biaya tambahan.',
    },
    {
        title: 'Jam tenang',
        text: 'Mohon menjaga ketenangan pada malam hari demi kenyamanan tamu lain dan warga sekitar.',
    },
    {
        title: 'Kapasitas tamu',
        text: 'Jumlah tamu menginap tidak boleh melebihi kapasitas tipe villa yang dipesan.',
    },
    {
        title: 'Area bebas rokok',
        text: 'Dilarang merokok di dalam bangunan. Gunakan area terbuka yang disediakan.',
    },
    {
        title: 'Api dan BBQ',
        text: 'Penggunaan BBQ atau api terbuka hanya di area yang telah ditentukan dan dalam pengawasan.',
    },
    {
        title: 'Kebersihan dan fasilitas',
        text: 'Jaga kebersihan villa. Kerusakan atau kehilangan fasilitas menjadi tanggung jawab penyewa.',
    },
    {
        title: 'Hewan peliharaan',
        text: 'Hewan peliharaan tidak diperkenankan kecuali atas persetujuan admin sebelumnya.',
    },
    {
        title: 'Parkir kendaraan',
        text: 'Parkirkan kendaraan di area yang tersedia. Bus pariwisata ukuran sedang dapat menjangkau lokasi.',
    },
];

export default function AturanVilla({
    rules = DEFAULT_RULES,
    checkIn = '14.00',
    checkOut = '12.00',
}) {
    return (
        <section id="aturan" className="va-ink va-section">
            <div className="va-wrap va-rules-wrap">
                <div className="va-rules-side">
                    <span className="va-label">Sebelum menginap</span>
                    <h2 className="va-h2" style={{ margin: '0.6rem 0 1.25rem' }}>
                        Aturan villa
                    </h2>
                    <p className="va-lead">
                        Beberapa aturan sederhana agar semua tamu dapat menikmati villa dengan nyaman dan aman.
                    </p>

                    <div className="va-times">
                        <div>
                            <span className="va-label">Check-in</span>
                            <strong>{checkIn}</strong>
                        </div>
                        <div>
                            <span className="va-label">Check-out</span>
                            <strong>{checkOut}</strong>
                        </div>
                    </div>
                </div>

                <div>
                    <ol className="va-rules">
                        {rules.map((rule, i) => (
                            <li key={rule.title}>
                                <span className="va-rules__n">{String(i + 1).padStart(2, '0')}</span>
                                <div>
                                    <h3 className="va-h3">{rule.title}</h3>
                                    <p className="va-text" style={{ marginTop: '0.45rem' }}>
                                        {rule.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                    <p className="va-note">
                        Dengan melakukan pemesanan, tamu dianggap telah membaca dan menyetujui seluruh aturan di atas.
                    </p>
                </div>
            </div>
        </section>
    );
}