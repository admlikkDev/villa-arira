import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutTemplate,
    MessageCircleQuestion,
    LogOut,
    ChevronsUpDown,
    Clock,
    Image,
    Quote,
    Sliders,
    Layers,
    FileText,
    ImagePlus,
    Sparkles,
    PlusCircle,
    PanelLeft,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/villa.css';
import { Money } from '@hugeicons/core-free-icons';

const menuItems = {
    admin: [
        { title: 'Hero section', icon: LayoutTemplate, url: '/admin/hero-section' },
        { title: 'Faq section', icon: MessageCircleQuestion, url: '/admin/faq-section' },
        { title: 'Gallery', icon: Image, url: '/admin/gallery' },
        { title: 'Testimony', icon: Quote, url: '/admin/testimony' },
        { title: 'Application Setting', icon: Sliders, url: '/admin/application' },
        { title: 'Package', icon: Layers, url: '/admin/package' },
        { title: 'Specification', icon: FileText, url: '/admin/specification' },
        { title: 'Image Specification', icon: ImagePlus, url: '/admin/specification/image' },
        { title: 'Logo', icon: PlusCircle, url: '/admin/logo' },
        { title: 'Facility', icon: Sparkles, url: '/admin/facility' },
        { title: 'Addon', icon: PlusCircle, url: '/admin/addon' },
        { title: 'Pricelist', icon: PlusCircle, url: '/admin/pricelist' },
    ],
};

export default function AdminPanelLayout({ children, role = 'admin' }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const [currentTime, setCurrentTime] = useState(new Date());
    const [collapsed, setCollapsed] = useState(false); // desktop: mode ikon
    const [mobileOpen, setMobileOpen] = useState(false); // mobile: drawer
    const [menuOpen, setMenuOpen] = useState(false); // menu akun
    const footRef = useRef(null);

    useEffect(() => {
        if (!user) navigate('/');
    }, [user, navigate]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Tutup menu akun saat klik di luar
    useEffect(() => {
        const onDown = (e) => {
            if (footRef.current && !footRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        return () => document.removeEventListener('mousedown', onDown);
    }, []);

    // Data profil dari user yang login
    const profile = user?.user ?? user ?? {};
    const displayName = profile.username || profile.name || 'Admin';
    const email = profile.email || '';
    const initials =
        displayName.split(' ').map((w) => w.charAt(0)).join('').toUpperCase().slice(0, 2) || 'AD';

    const toggleSidebar = () => {
        if (window.innerWidth <= 900) setMobileOpen((o) => !o);
        else setCollapsed((c) => !c);
    };

    const exit = () => {
        logout();
        setTimeout(() => navigate('/'), 1000);
    };

    return (
        <div className="va-shell">
            <div className="va-sb-overlay" data-open={mobileOpen} onClick={() => setMobileOpen(false)} />

            <aside className="va-ink va-sb" data-collapsed={collapsed} data-open={mobileOpen}>
                <div className="va-sb__head">
                    <span className="va-sb__mark">V</span>
                    <div className="va-sb__brand va-sb__label">
                        <strong>Villa Arira</strong>
                        <small>{role} panel</small>
                    </div>
                </div>

                <ul className="va-sb__nav">
                    {menuItems[role]?.map((item) => (
                        <li key={item.url}>
                            <Link
                                to={item.url}
                                className="va-sb__link"
                                data-active={location.pathname === item.url}
                                title={item.title}
                                onClick={() => setMobileOpen(false)}
                            >
                                <item.icon size={18} strokeWidth={1.6} />
                                <span className="va-sb__label">{item.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="va-sb__foot" ref={footRef}>
                    {menuOpen && (
                        <div className="va-pop va-menu va-sb__menu">
                            <div className="va-menu__label">{email || displayName}</div>
                            <button type="button" className="va-menu__item" style={{ width: '100%', background: 'transparent', border: 0, color: 'inherit', font: 'inherit' }} onClick={exit}>
                                <LogOut size={16} />
                                <span>Keluar</span>
                            </button>
                        </div>
                    )}
                    <button type="button" className="va-sb__user" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
                        <span className="va-sb__avatar">{initials}</span>
                        <span className="va-sb__who va-sb__label">
                            <strong>{displayName}</strong>
                            <small>{email || `Role: ${role}`}</small>
                        </span>
                        <ChevronsUpDown size={16} className="va-sb__label" style={{ flex: 'none' }} />
                    </button>
                </div>
            </aside>

            <main className="va-paper va-adm-main">
                <header className="va-adm-top">
                    <div className="va-adm-top__left">
                        <button type="button" className="va-icon-btn va-icon-btn--sm" onClick={toggleSidebar} aria-label="Buka/tutup sidebar">
                            <PanelLeft size={18} strokeWidth={1.6} />
                        </button>
                        <span>Admin dashboard</span>
                    </div>
                    <div className="va-adm-clock">
                        <Clock size={16} strokeWidth={1.5} />
                        {currentTime
                            .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                            .replace(/\./g, ':')}
                    </div>
                </header>

                <div className="va-adm-body">{children}</div>
            </main>
        </div>
    );
}