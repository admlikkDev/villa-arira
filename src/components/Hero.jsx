import { useState } from 'react';

const buttonStyle = {
    marginTop: '3rem',
    padding: '0.75rem 2.5rem',
    borderRadius: '999px',
    border: '1px solid rgba(255, 255, 255, 0.7)',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(4px)',
    fontFamily: 'var(--font-serif, "Playfair Display", serif)',
};

const buttonHoverStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderColor: 'white',
};

const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
    zIndex: 1,
};

const textContainerStyle = {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    color: 'white',
    padding: '0 1rem',
};

const titleStyle = {
    fontSize: '4rem',
    fontWeight: '700',
    marginBottom: '1rem',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
    fontFamily: 'var(--font-serif, "Playfair Display", serif)',
};

const subtitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '400',
    maxWidth: '600px',
    lineHeight: '1.6',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
};

export default function Hero() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <section style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>

            <video
                src='/videos/villa-arira-hero-video.mp4'
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0
                }}
            />

            <div style={overlayStyle}></div>

            <div style={{ ...textContainerStyle, height: '100%', justifyContent: 'center' }}>
                <div>
                    <h1 style={titleStyle}>Villa Arira</h1>
                    <p style={subtitleStyle}>
                        Tempat peristirahatan eksklusif berarsitektur kayu tradisional Sunda, kolam teratai
                        nan syahdu, private pool, meja biliar, dan halaman lapang berhawa sejuk
                        pegunungan Lembang, Bandung Barat.
                    </p>

                    <a href="#cek-jadwal">
                        <button
                            style={isHovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            Cek Harga & Ketersediaan
                        </button>
                    </a>
                </div>

                <div className="animate-swipe" style={{ position: 'absolute', bottom: '40px', cursor: 'pointer' }}>
                    <p style={{ fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '5px', textTransform: 'uppercase' }}>Swipe Down</p>
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                    </svg>
                </div>
            </div>

        </section>
    );
}