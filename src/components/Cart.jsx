import { Trash2 } from 'lucide-react';
import '../assets/styles/villa.css';

export default function Cart({
    display = 'none',
    item = { name: 'Paket A - Family Gathering', desc: 'Sewa 1 hari full Villa Arira', price: 'Rp 6.500.000' },
    onRemove,
    onCheckout,
}) {
    if (display === 'none') return null;

    return (
        // stopPropagation: klik di dalam keranjang tidak menutup keranjang
        <div className="va-pop va-cart" onClick={(e) => e.stopPropagation()}>
            <h3 className="va-cart__title">Keranjang reservasi</h3>

            <div className="va-cart__item">
                <img src="/images/logo_villa.jpg" alt="Villa Arira" />
                <div>
                    <h4>{item.name}</h4>
                    <p>{item.desc}</p>
                    <strong>{item.price}</strong>
                </div>
                <button className="va-icon-btn" onClick={onRemove} title="Hapus item" aria-label="Hapus item">
                    <Trash2 size={16} />
                </button>
            </div>

            <button className="va-btn va-btn--block" onClick={onCheckout}>
                Lanjut ke pembayaran
            </button>
        </div>
    );
}