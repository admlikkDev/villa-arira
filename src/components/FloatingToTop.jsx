import { useState, useEffect } from 'react';

export default function FloatingToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Pantau posisi scroll halaman
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            left: '30px',
            zIndex: 9998,
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        }}>
            <style>
                {`
                    @keyframes fadeInUp {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .totop-btn {
                        animation: fadeInUp 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .totop-btn:hover {
                        transform: translateY(-4px);
                        background-color: #0B0D0C !important;
                        color: #F5EFEB !important;
                        box-shadow: 0 12px 30px rgba(11, 13, 12, 0.25);
                    }
                `}
            </style>

            <button
                onClick={scrollToTop}
                className="totop-btn"
                title="Kembali ke atas"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '46px',
                    height: '46px',
                    backgroundColor: '#ECE2D8',
                    color: '#0B0D0C',
                    borderRadius: '50%',
                    border: '1px solid rgba(164, 123, 66, 0.3)',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(11, 13, 12, 0.12)',
                    outline: 'none',
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            </button>
        </div>
    );
}