import { useState, useEffect } from 'react';
import Cart from './Cart';

const menuItems = [
    { name: 'Home', href: '/' },
    // { name: 'Informasi', href: '#informasi' },
    // { name: 'Pilihan Sewa', href: '#pilihan-sewa' },
    // { name: 'Pricelist', href: '#pricelist' },
    // { name: 'Fasilitas', href: '#fasilitas' },
    { name: 'Gallery', href: '/gallery' },
    // { name: 'Paket', href: '#paket' },
    // { name: 'Add-on', href: '#add-on' },
    // { name: 'Review', href: '#review' },
    // { name: 'Lokasi', href: '#lokasi' },
    // { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '/contact' },
];

const sewaDropdownItems = [
    { name: 'Full Villa Arira', href: '#full-unit' },
    { name: 'Kamar Belakang', href: '#kamar-belakang' },
    { name: 'Villa Utama', href: '#villa-utama' }
];

const informasiDropdownItems = [
    { name: 'Tentang Kami', href: '#tentang' },
    { name: 'Aturan & Ketentuan', href: '#aturan' },
    { name: 'Panduan Lokasi', href: '#panduan' }
];

export default function Navbar() {
    const [showNav, setShowNav] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setShowNav(true);
            } else {
                setShowNav(false);
                setActiveDropdown(null);
                setMobileMenuOpen(false);
            }
        };
        console.log(open)

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openCart = (e) => {
        e.stopPropagation()
        setOpen(open ? false : true)
    }

    const handleSmoothScroll = (e, href) => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);

        if (!href.startsWith('#')) {
            return;
        }

        e.preventDefault();

        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const navHeight = 90;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    window.addEventListener('click', () => {
        setOpen(false)
    })

    return (
        <>
            <style>
                {`
                    @media (max-width: 1350px) {
                        .desktop-menu { display: none !important; }
                        .hamburger-btn { display: flex !important; }
                    }
                    @keyframes slideFromTop {
                        0% { opacity: 0; transform: translateY(-100%); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes smoothDropdown {
                        0% { opacity: 0; transform: translateY(8px) scale(0.97); }
                        100% { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    html {
                        scroll-behavior: smooth;
                    }
                `}
            </style>
            <nav style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.4rem 5rem',
                backgroundColor: showNav ? 'rgba(236, 226, 216, 0.85)' : 'transparent',
                backdropFilter: showNav ? 'blur(16px)' : 'none',
                WebkitBackdropFilter: showNav ? 'blur(16px)' : 'none',
                boxShadow: showNav ? '0 10px 30px rgba(11, 13, 12, 0.06)' : 'none',
                zIndex: 1000,
                color: '#0B0D0C',
                animation: showNav ? 'slideFromTop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
                opacity: showNav ? 1 : 0,
                visibility: showNav ? 'visible' : 'hidden',
                willChange: 'transform, opacity',
                transition: 'opacity 0.3s ease, background-color 0.3s ease, visibility 0.3s ease',
                boxSizing: 'border-box',
                borderBottom: showNav ? '1px solid rgba(164, 123, 66, 0.12)' : 'none',
            }}>
                <div style={{
                    fontSize: '1.6rem',
                    fontWeight: '700',
                    letterSpacing: '1.5px',
                    fontFamily: '"Playfair Display", serif',
                    cursor: 'pointer',
                    color: '#0B0D0C',
                    transition: 'opacity 0.2s ease',
                    flexShrink: 0,
                }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                    onClick={(e) => handleSmoothScroll(e, '#')}
                >
                    VILLA ARIRA
                </div>

                <ul className="desktop-menu" style={{
                    display: 'flex',
                    gap: '1.6rem',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                    alignItems: 'center',
                    fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
                }}>
                    {menuItems.map((item, index) => {
                        const isSewa = item.name === 'Pilihan Sewa';
                        const isInfo = item.name === 'Informasi';
                        const hasDropdown = isSewa || isInfo;
                        const isDropdownOpen = activeDropdown === item.name;

                        return (
                            <li
                                key={index}
                                style={{ position: 'relative' }}
                                onMouseEnter={() => hasDropdown && setActiveDropdown(item.name)}
                                onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                            >
                                <a
                                    href={item.href}
                                    style={{
                                        color: hoveredMenu === index ? '#A47B42' : '#0B0D0C',
                                        textDecoration: 'none',
                                        fontSize: '0.92rem',
                                        fontWeight: '500',
                                        letterSpacing: '0.2px',
                                        transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        whiteSpace: 'nowrap',
                                        padding: '0.5rem 0',
                                    }}
                                    onMouseEnter={() => setHoveredMenu(index)}
                                    onMouseLeave={() => setHoveredMenu(null)}
                                    onClick={(e) => {
                                        if (hasDropdown) {
                                            e.preventDefault();
                                        } else {
                                            handleSmoothScroll(e, item.href);
                                        }
                                    }}
                                >
                                    {item.name}
                                    {hasDropdown && (
                                        <span style={{
                                            fontSize: '0.55rem',
                                            transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                                        }}>
                                            ▼
                                        </span>
                                    )}
                                </a>

                                {hasDropdown && isDropdownOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '-0.5rem',
                                        marginTop: '0.4rem',
                                        backgroundColor: 'rgba(245, 239, 235, 0.94)',
                                        backdropFilter: 'blur(16px)',
                                        WebkitBackdropFilter: 'blur(16px)',
                                        boxShadow: '0 15px 35px rgba(11, 13, 12, 0.08)',
                                        borderRadius: '12px',
                                        padding: '0.5rem 0',
                                        minWidth: '200px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        zIndex: 10,
                                        border: '1px solid rgba(164, 123, 66, 0.15)',
                                        transformOrigin: 'top',
                                        animation: 'smoothDropdown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                                    }}>
                                        {(isSewa ? sewaDropdownItems : informasiDropdownItems).map((subItem, subIndex) => (
                                            <a
                                                key={subIndex}
                                                href={subItem.href}
                                                style={{
                                                    padding: '0.7rem 1.2rem',
                                                    color: '#0B0D0C',
                                                    textDecoration: 'none',
                                                    fontSize: '0.95rem',
                                                    fontWeight: '500',
                                                    transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = 'rgba(222, 205, 189, 0.55)';
                                                    e.target.style.color = '#A47B42';
                                                    e.target.style.paddingLeft = '1.4rem';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = 'transparent';
                                                    e.target.style.color = '#0B0D0C';
                                                    e.target.style.paddingLeft = '1.2rem';
                                                }}
                                                onClick={(e) => handleSmoothScroll(e, subItem.href)}
                                            >
                                                {subItem.name}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexShrink: 0 }}>
                    <button
                        style={{
                            padding: '0.7rem 1.8rem',
                            borderRadius: '999px',
                            backgroundColor: '#A47B42',
                            color: '#F5EFEB',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            letterSpacing: '0.5px',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            boxShadow: '0 6px 16px rgba(164, 123, 66, 0.25)',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.opacity = '0.92';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 20px rgba(164, 123, 66, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 6px 16px rgba(164, 123, 66, 0.25)';
                        }}
                        onClick={() => alert('Navigasi ke halaman Booking')}
                    >
                        Booking
                    </button>

                    <button
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: '#DECDBD',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 10px rgba(11, 13, 12, 0.04)',
                            border: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.opacity = '0.92';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 20px rgba(164, 123, 66, 0.35)';
                            e.target.style.cursor = 'pointer'
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.opacity = '1';
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 6px 16px rgba(164, 123, 66, 0.25)';
                        }}
                        onClick={openCart}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A47B42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 4v16"></path><path d="M2 8h18a2 2 0 0 1 2 2v10"></path><path d="M2 17h20"></path><path d="M6 8v9"></path>
                        </svg>
                    </button>

                    <button
                        className="hamburger-btn"
                        style={{
                            display: 'none',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.5rem',
                            color: '#0B0D0C',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0.3rem',
                            transition: 'transform 0.2s ease',
                        }}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        backgroundColor: 'rgba(245, 239, 235, 0.98)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        boxShadow: '0 15px 35px rgba(11, 13, 12, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1.5rem 2.5rem',
                        gap: '0.9rem',
                        maxHeight: '75vh',
                        overflowY: 'auto',
                        borderTop: '1px solid rgba(164, 123, 66, 0.15)',
                        boxSizing: 'border-box',
                        animation: 'smoothDropdown 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                    }}>
                        {menuItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                onClick={(e) => handleSmoothScroll(e, item.href)}
                                style={{
                                    color: '#0B0D0C',
                                    textDecoration: 'none',
                                    fontSize: '1.05rem',
                                    fontWeight: '500',
                                    padding: '0.5rem 0',
                                    borderBottom: '1px solid rgba(164, 123, 66, 0.1)',
                                    transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.color = '#A47B42';
                                    e.target.style.paddingLeft = '6px';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.color = '#0B0D0C';
                                    e.target.style.paddingLeft = '0px';
                                }}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                )}
                <Cart display={open ? 'flex' : 'none'} />

            </nav>
        </>
    );
}