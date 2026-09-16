export default function Cart({ display = 'none', item = { name: 'Paket A - Family Gathering', desc: 'Sewa 1 Hari Full Villa Arira', price: 'Rp 6.500.000' }, onRemove, onCheckout }) {
    if (display === 'none') return null;

    return (
        <div style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            width: '360px',
            backgroundColor: '#F5EFEB',
            borderRadius: '20px',
            boxShadow: '0 20px 45px rgba(11, 13, 12, 0.15)',
            border: '1px solid rgba(164, 123, 66, 0.25)',
            overflow: 'hidden',
            animation: 'popupSlide 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
            display: 'flex',
            flexDirection: 'column',
            padding: '1.5rem',
            boxSizing: 'border-box',
            zIndex: 1000,
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        }}>
            <style>
                {`
                    @keyframes popupSlide {
                        0% { opacity: 0; transform: translateY(8px) scale(0.97); }
                        100% { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    .cart-remove-btn:hover {
                        color: #ff4d4d !important;
                        background-color: rgba(255, 77, 77, 0.1) !important;
                    }
                    .checkout-btn:hover {
                        opacity: 0.92;
                        transform: translateY(-1px);
                    }
                `}
            </style>

            <div style={{
                fontSize: '0.85rem',
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#A47B42',
                marginBottom: '1rem',
                borderBottom: '1px solid rgba(164, 123, 66, 0.15)',
                paddingBottom: '0.6rem',
            }}>
                Keranjang Reservasi
            </div>

            {/* Item Keranjang */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#ECE2D8',
                padding: '1rem',
                borderRadius: '14px',
                marginBottom: '1.2rem',
            }}>
                <img 
                    src="public/images/logo_villa.jpg" 
                    style={{ borderRadius: '12px', objectFit: 'cover' }} 
                    width={48} 
                    height={48} 
                    alt="Villa Arira" 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', fontFamily: '"Playfair Display", serif', color: '#0B0D0C', margin: 0, fontWeight: '600' }}>
                        {item.name}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#5A5D5C', margin: 0 }}>
                        {item.desc}
                    </p>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#A47B42', marginTop: '2px' }}>
                        {item.price}
                    </span>
                </div>

                <button
                    onClick={onRemove}
                    className="cart-remove-btn"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#888',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem',
                    }}
                    title="Hapus item"
                >
                    🗑
                </button>
            </div>

            {/* Tombol Checkout */}
            <button
                onClick={onCheckout}
                className="checkout-btn"
                style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '12px',
                    backgroundColor: '#A47B42',
                    color: '#F5EFEB',
                    border: 'none',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(164, 123, 66, 0.25)',
                    transition: 'all 0.2s ease',
                }}
            >
                Lanjut ke Pembayaran →
            </button>
        </div>
    );
}