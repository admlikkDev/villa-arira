import '../assets/styles/villa.css';

const pricelistData = [
    {
        title: 'Arira Private Wing',
        subtitle: '3 kamar belakang + kamar mandi dalam & water heater',
        capacity: '6 – 12 orang',
        weekday: 'Rp 1.500.000',
        weekend: 'Rp 2.200.000',
        longWeekend: 'Rp 2.700.000',
        highSeason: 'Rp 3.500.000',
    },
    {
        title: 'Arira Main House',
        subtitle: '3 kamar utama + billiard, living room, gazebo',
        capacity: '15 – 20 orang',
        weekday: 'Rp 2.800.000',
        weekend: 'Rp 3.800.000',
        longWeekend: 'Rp 4.500.000',
        highSeason: 'Rp 5.500.000',
    },
    {
        title: 'Arira Exclusive',
        subtitle: 'Seluruh villa (6 kamar + pool privat + semua fasilitas)',
        capacity: '15 – 30 orang',
        weekday: 'Rp 4.000.000',
        weekend: 'Rp 5.500.000',
        longWeekend: 'Rp 6.800.000',
        highSeason: 'Rp 8.500.000',
    },
];

export default function PricelistVilla() {
    return (
        <section id="pricelist" className="va-ink va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Pricelist Villa Arira</h2>
                    <p className="va-lead">
                        Tarif transparan tanpa biaya tersembunyi untuk weekday, weekend, long weekend, dan high season libur nasional.
                    </p>
                </div>

                <div className="va-table-scroll">
                    <table className="va-table">
                        <thead>
                            <tr>
                                <th scope="col">Tipe sewa</th>
                                <th scope="col">Kapasitas</th>
                                <th scope="col" className="num">Weekday<small>Senin – Kamis</small></th>
                                <th scope="col" className="num">Weekend<small>Jumat – Minggu</small></th>
                                <th scope="col" className="num">Long weekend<small>Libur nasional</small></th>
                                <th scope="col" className="num">High season<small>Lebaran & nataru</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricelistData.map((item) => (
                                <tr key={item.title}>
                                    <td>
                                        <h3 className="va-table__title">{item.title}</h3>
                                        <span className="va-muted" style={{ fontSize: '0.84rem' }}>{item.subtitle}</span>
                                    </td>
                                    <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{item.capacity}</td>
                                    <td className="num">{item.weekday}</td>
                                    <td className="num">{item.weekend}</td>
                                    <td className="num">{item.longWeekend}</td>
                                    <td className="num">{item.highSeason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}