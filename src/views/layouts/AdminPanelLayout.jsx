import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutTemplate,
    Images,
    MessageSquareQuote,
    MessageCircleQuestion,
    Package,
    BedDouble,
    PackagePlus,
    Shapes,
    ConciergeBell,
    ClipboardList,
    MapPinned,
    BadgeCheck,
    Users,
    Inbox,
    Settings,
    MessageSquareText,
    ExternalLink,
    LogOut,
    ChevronsUpDown,
    ChevronDown,
    Clock,
    PanelLeft,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../../assets/styles/villa.css';

// Menu dikelompokkan; setiap menu punya ikon yang berbeda dan sesuai fungsinya.
const menuItems = {
    admin: [
        {
            label: 'Konten halaman',
            items: [
                { title: 'Hero section', icon: LayoutTemplate, url: '/admin/hero-section' },
                { title: 'Gallery', icon: Images, url: '/admin/gallery' },
                { title: 'Testimony', icon: MessageSquareQuote, url: '/admin/testimony' },
                { title: 'Faq section', icon: MessageCircleQuestion, url: '/admin/faq-section' },
            ],
        },
        {
            label: 'Data villa',
            items: [
                { title: 'Package', icon: Package, url: '/admin/package' },
                { title: 'Rental Options', icon: BedDouble, url: '/admin/rental-options' },
                { title: 'Addon', icon: PackagePlus, url: '/admin/addon' },
                { title: 'Facility', icon: ConciergeBell, url: '/admin/facility' },
                { title: 'Specification', icon: ClipboardList, url: '/admin/specification' },
                { title: 'Logo', icon: Shapes, url: '/admin/logo' },
                { title: 'Wisata Terdekat', icon: MapPinned, url: '/admin/wisata-terdekat' },
                { title: 'Kelola Alasan', icon: BadgeCheck, url: '/admin/reasons' },
            ],
        },
        {
            label: 'Data user',
            items: [
                { title: 'Users', icon: Users, url: '/admin/users' },
                { title: 'Messages', icon: Inbox, url: '/admin/messages' },
            ],
        },
        {
            label: 'Pengaturan',
            items: [
                { title: 'Application Setting', icon: Settings, url: '/admin/application' },
                { title: 'Whatsapp Template Setting', icon: MessageSquareText, url: '/admin/whatsapp-template' },
            ],
        },
    ],
};

const GROUPS_KEY = 'va_sb_groups';

const readGroupState = () => {
    try {
        return JSON.parse(localStorage.getItem(GROUPS_KEY)) ?? {};
    } catch {
        return {};
    }
};

// Logo villa; jika file belum ada, tampilkan huruf "V"
function BrandMark() {
    const [failed, setFailed] = useState(false);
    return (
        <span className="va-sb__mark">
            {failed ? 'V' : <img src="/images/logo_villa.jpg" alt="Villa Arira" onError={() => setFailed(true)} />}
        </span>
    );
}

export default function AdminPanelLayout({ children, role = 'admin' }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const [now, setNow] = useState(new Date());
    const [collapsed, setCollapsed] = useState(false); // desktop: mode ikon
    const [mobileOpen, setMobileOpen] = useState(false); // mobile: drawer
    const [menuOpen, setMenuOpen] = useState(false); // menu akun
    const [groupState, setGroupState] = useState(readGroupState); // grup yang dilipat
    const footRef = useRef(null);

    const groups = menuItems[role] ?? [];

    // Menu aktif juga berlaku untuk halaman turunannya (mis. /admin/package/3)
    const isActive = (url) => location.pathname === url || location.pathname.startsWith(`${url}/`);
    const activeGroup = groups.find((g) => g.items.some((i) => isActive(i.url)));
    const activeItem = activeGroup?.items.find((i) => isActive(i.url));

    const isGroupOpen = (label) => groupState[label] !== false;

    const toggleGroup = (label) => {
        setGroupState((prev) => {
            const next = { ...prev, [label]: prev[label] === false };
            try {
                localStorage.setItem(GROUPS_KEY, JSON.stringify(next));
            } catch { /* abaikan jika storage penuh / dinonaktifkan */ }
            return next;
        });
    };

    useEffect(() => {
        if (!user) navigate('/');
    }, [user, navigate]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (activeGroup && groupState[activeGroup.label] === false) toggleGroup(activeGroup.label);
    }, [location.pathname]);

    useEffect(() => {
        const onDown = (e) => {
            if (footRef.current && !footRef.current.contains(e.target)) setMenuOpen(false);
        };
        const onKey = (e) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                setMobileOpen(false);
            }
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, []);

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

    const menuItemStyle = {
        width: '100%',
        background: 'transparent',
        border: 0,
        color: 'inherit',
        font: 'inherit',
        textDecoration: 'none',
    };

    return (
        <div className="va-shell">
            <div className="va-sb-overlay" data-open={mobileOpen} onClick={() => setMobileOpen(false)} />

            <aside className="va-ink va-sb" data-collapsed={collapsed} data-open={mobileOpen}>
                <div className="va-sb__head">
                    <BrandMark />
                    <div className="va-sb__brand va-sb__label">
                        <strong>Villa Arira</strong>
                        <small>{role} panel</small>
                    </div>
                </div>

                <nav className="va-sb__nav" aria-label="Menu admin">
                    {groups.map((group) => {
                        const open = isGroupOpen(group.label);
                        return (
                            <div key={group.label} className="va-sb__group" data-open={open}>
                                <button
                                    type="button"
                                    className="va-sb__grouphead va-sb__label"
                                    aria-expanded={open}
                                    onClick={() => toggleGroup(group.label)}
                                >
                                    {group.label}
                                    <ChevronDown size={14} />
                                </button>

                                <div className="va-sb__listwrap">
                                    <ul className="va-sb__list">
                                        {group.items.map((item) => (
                                            <li key={item.url}>
                                                <Link
                                                    to={item.url}
                                                    className="va-sb__link"
                                                    data-active={isActive(item.url)}
                                                    aria-current={isActive(item.url) ? 'page' : undefined}
                                                    title={item.title}
                                                    tabIndex={open ? 0 : -1}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    <item.icon size={18} strokeWidth={1.6} />
                                                    <span className="va-sb__label">{item.title}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </nav>

                <div className="va-sb__foot" ref={footRef}>
                    {menuOpen && (
                        <div className="va-pop va-menu va-sb__menu">
                            <div className="va-menu__label">{email || displayName}</div>
                            <a className="va-menu__item" style={menuItemStyle} href="/" target="_blank" rel="noopener noreferrer">
                                <ExternalLink size={16} />
                                <span>Lihat website</span>
                            </a>
                            <button type="button" className="va-menu__item" style={menuItemStyle} onClick={exit}>
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
                        <div className="va-crumb">
                            {activeGroup && <span>{activeGroup.label} /</span>}
                            <strong>{activeItem?.title ?? 'Admin dashboard'}</strong>
                        </div>
                    </div>

                    <div className="va-adm-top__right">
                        <a className="va-btn va-btn--ghost va-btn--sm va-hide-sm" href="/" target="_blank" rel="noopener noreferrer">
                            Lihat website <ExternalLink size={14} />
                        </a>
                        <div className="va-adm-clock">
                            <Clock size={16} strokeWidth={1.5} />
                            <span className="va-adm-date va-hide-sm">
                                {now.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                            {now
                                .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                .replace(/\./g, ':')}
                        </div>
                    </div>
                </header>

                <div className="va-adm-body">{children}</div>
            </main>
        </div>
    );
}