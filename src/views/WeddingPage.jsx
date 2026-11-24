import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    AlertCircle,
    ArrowUpRight,
    BedDouble,
    ChevronLeft,
    ChevronRight,
    Images,
    MessageCircle,
    Mountain,
    Play,
    X,
    Calendar,
    Users,
    Clock,
    Loader2,
    Check,
    Minus,
    Plus,
    Sparkles,
} from 'lucide-react';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import { formatRupiah } from '../hooks/Usevillaquery';
import '../assets/styles/villa.css';

const WEDDING_ENDPOINT = 'galleries?unpage=true';
const PACKAGES_ENDPOINT = 'villa-packages?unpage=true';
const BOOKING_ENDPOINT = 'my-event-bookings';
const REQUEST_ENDPOINT = 'my-event-requests';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DOW = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const MODE_LABEL = {
    booking: 'Pesan paket wedding',
    request: 'Request khusus paket wedding',
    custom: 'Ajukan paket custom wedding',
};

const pad = (n) => String(n).padStart(2, '0');
const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const fmtDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
const daysIn = (y, m) => new Date(y, m + 1, 0).getDate();
const firstDow = (y, m) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
};

const errMsg = (e) => {
    if (!e) return 'Terjadi kesalahan. Coba lagi.';
    if (typeof e === 'string') return e;
    if (typeof e === 'object') {
        const text = Object.values(e).flat().filter((x) => typeof x === 'string').join(' ');
        return text || 'Data yang dikirim tidak valid.';
    }
    return String(e);
};

function EventModal({ config, onClose }) {
    const { mode, pkg } = config;
    const { post, get } = useFetch();
    const { user } = useAuth();

    const today = new Date();
    const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

    const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('17:00');
    const [guests, setGuests] = useState(50);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && onClose();
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    const endEff = end || start;
    const startAt = start ? `${start} ${startTime}` : '';
    const endAt = endEff ? `${endEff} ${endTime}` : '';
    const durationMs = start ? new Date(`${endEff}T${endTime}:00`) - new Date(`${start}T${startTime}:00`) : 0;
    const hours = durationMs > 0 ? Math.ceil(durationMs / 3600000) : 0;

    const price = Number(pkg?.price);
    const estimate =
        pkg && Number.isFinite(price) ? (pkg.type === 'per_hour' ? price * hours : price) : null;
    const maxCap = Number(pkg?.max_capacity) || 0;
    const isRequestMode = mode === 'request' || mode === 'custom';

    const pickDate = (d) => {
        setError('');
        if (!start || end) {
            setStart(d);
            setEnd('');
        } else if (d < start) {
            setStart(d);
        } else {
            setEnd(d);
        }
    };

    const validate = () => {
        if (!start) return 'Pilih tanggal acara terlebih dahulu.';
        if (!(durationMs > 0)) return 'Jam selesai harus setelah jam mulai.';
        if (!(guests >= 1)) return 'Jumlah tamu minimal 1.';
        if (maxCap && guests > maxCap) return `Jumlah tamu melebihi kapasitas paket (${maxCap} orang).`;
        if (isRequestMode && !title.trim()) return 'Judul acara wajib diisi.';
        if (isRequestMode && !description.trim()) return 'Deskripsi acara wajib diisi.';
        if (mode === 'custom' && !(Number(budget) > 0)) return 'Masukkan budget yang valid.';
        return '';
    };

    const submit = async (e) => {
        e.preventDefault();
        const problem = validate();
        if (problem) {
            setError(problem);
            return;
        }

        const base = {
            start_at: startAt,
            end_at: endAt,
            guest_count: Number(guests),
        };

        let endpoint = BOOKING_ENDPOINT;
        let payload;

        // Cek apakah paket memerlukan approval atau jika mode custom
        const requiresApproval = pkg?.requires_approval === true || mode === 'custom';

        if (mode === 'booking' && !requiresApproval) {
            endpoint = BOOKING_ENDPOINT;
            payload = {
                ...base,
                villa_package_id: Number(pkg.id),
            };
        } else {
            endpoint = REQUEST_ENDPOINT;
            payload = {
                title: title.trim() || pkg?.title || 'Wedding Request',
                description: description.trim() || 'Pengajuan pemesanan paket wedding yang memerlukan approval.',
                ...base,
                ...(pkg?.id ? { villa_package_id: Number(pkg.id) } : {}),
                ...(mode === 'custom' && budget ? { budget: Number(budget) } : {}),
            };
        }

        setSubmitting(true);
        setError('');
        const resp = await post(endpoint, payload);

        if (!resp.status) {
            setSubmitting(false);
            setError(errMsg(resp.error));
            toast.error('Gagal mengirim.');
            return;
        }

        try {
            const appResp = await get('application');
            const appData = appResp.data?.data ?? appResp.data;
            const adminPhone = appData?.phone_number ;

            const actionType = endpoint === REQUEST_ENDPOINT ? 'pengajuan request' : 'pemesanan';
            const packageName = pkg?.title || title || 'Paket Custom Wedding';
            const waMessage = `Halo Admin Villa Arira, saya baru saja mengirimkan ${actionType} wedding untuk paket *${packageName}* pada tanggal ${fmtDate(start)} (${startTime} - ${endTime}) dengan jumlah tamu ${guests} orang. Mohon bantuannya untuk dicek. Terima kasih!`;

            await post('whatsapp/send-text', {
                message: waMessage,
                phone: adminPhone,
            });
        } catch (err) {
            console.error('Gagal mengambil nomor atau mengirim WhatsApp:', err);
        }

        setSubmitting(false);
        toast.success(endpoint === REQUEST_ENDPOINT ? 'Pengajuan wedding berhasil dikirim & pesan terkirim ke admin.' : 'Pemesanan wedding dikirim & pesan terkirim ke admin.');
        setDone(true);
    };

    const y = month.getFullYear();
    const m = month.getMonth();
    const cells = [];
    for (let i = 0; i < firstDow(y, m); i += 1) cells.push(<span key={`e${i}`} />);
    for (let d = 1; d <= daysIn(y, m); d += 1) {
        const iso = toISO(y, m, d);
        const isSel = iso === start || iso === end;
        const inRange = start && end && iso > start && iso < end;
        cells.push(
            <button
                key={iso}
                type="button"
                className="va-day"
                data-sel={isSel}
                data-range={Boolean(inRange)}
                data-today={iso === todayISO}
                disabled={iso < todayISO}
                onClick={() => pickDate(iso)}
            >
                {d}
            </button>,
        );
    }

    const heading = pkg?.title ?? 'Paket custom wedding';

    return (
        <div className="vp-overlay" onClick={onClose}>
            <div
                className="va-paper vp-modal"
                role="dialog"
                aria-modal="true"
                aria-label={heading}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="vp-modal__head">
                    <div>
                        <span className="va-label">{MODE_LABEL[mode]}</span>
                        <h3 className="va-h3" style={{ marginTop: '0.35rem' }}>{heading}</h3>
                    </div>
                    <button type="button" className="va-icon-btn" onClick={onClose} aria-label="Tutup">
                        <X size={18} strokeWidth={1.5} />
                    </button>
                </header>

                {done ? (
                    <div className="vp-done">
                        <span className="vp-done__icon"><Check size={26} strokeWidth={2} /></span>
                        <h3 className="va-h3">{mode === 'booking' ? 'Pemesanan terkirim' : 'Permintaan terkirim'}</h3>
                        <p className="va-text" style={{ maxWidth: '40ch' }}>
                            {mode === 'booking'
                                ? 'Pemesanan wedding Anda sudah kami terima. Admin akan mengonfirmasi jadwal dan langkah selanjutnya.'
                                : 'Permintaan wedding Anda sudah kami terima. Admin akan menghubungi Anda untuk membahas penawaran.'}
                        </p>
                        <button type="button" className="va-btn" onClick={onClose}>Tutup</button>
                    </div>
                ) : (
                    <form onSubmit={submit} noValidate>
                        <div className="vp-modal__body">
                            <div className="vp-cal">
                                <div className="va-cal__bar">
                                    <button type="button" className="va-icon-btn" onClick={() => setMonth(new Date(y, m - 1, 1))} aria-label="Bulan sebelumnya">
                                        <ChevronLeft size={18} />
                                    </button>
                                    <div className="va-cal__title" style={{ margin: 0 }}>{MONTHS[m]} {y}</div>
                                    <button type="button" className="va-icon-btn" onClick={() => setMonth(new Date(y, m + 1, 1))} aria-label="Bulan berikutnya">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                                <div className="va-cal__dow">{DOW.map((n) => <span key={n}>{n}</span>)}</div>
                                <div className="va-cal__days">{cells}</div>
                                <p className="vp-cal__hint">
                                    {start
                                        ? end
                                            ? `${fmtDate(start)} – ${fmtDate(end)}`
                                            : `${fmtDate(start)} (klik tanggal lain bila acara lebih dari sehari)`
                                        : 'Klik tanggal acara. Klik tanggal kedua untuk acara beberapa hari.'}
                                </p>
                            </div>

                            <div className="vp-fields">
                                <div className="vp-row">
                                    <div className="va-field">
                                        <label className="va-label" htmlFor="vp-start">Jam mulai</label>
                                        <input id="vp-start" type="time" className="va-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                    </div>
                                    <div className="va-field">
                                        <label className="va-label" htmlFor="vp-end">Jam selesai</label>
                                        <input id="vp-end" type="time" className="va-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                    </div>
                                </div>

                                <div className="va-field">
                                    <label className="va-label" htmlFor="vp-guests">
                                        Jumlah tamu{maxCap ? ` (maks. ${maxCap})` : ''}
                                    </label>
                                    <div className="vp-stepper">
                                        <button type="button" aria-label="Kurangi" onClick={() => setGuests((g) => Math.max(1, Number(g) - 1))}>
                                            <Minus size={16} />
                                        </button>
                                        <input
                                            id="vp-guests"
                                            type="number"
                                            min="1"
                                            max={maxCap || undefined}
                                            value={guests}
                                            onChange={(e) => setGuests(e.target.value === '' ? '' : Number(e.target.value))}
                                        />
                                        <button type="button" aria-label="Tambah" onClick={() => setGuests((g) => (maxCap ? Math.min(maxCap, Number(g) + 1) : Number(g) + 1))}>
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                {isRequestMode && (
                                    <>
                                        <div className="va-field">
                                            <label className="va-label" htmlFor="vp-title">Judul acara / Wedding</label>
                                            <input
                                                id="vp-title"
                                                type="text"
                                                className="va-input"
                                                placeholder="cth. Wedding Reception John & Jane"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="va-field">
                                            <label className="va-label" htmlFor="vp-desc">Deskripsi / kebutuhan</label>
                                            <textarea
                                                id="vp-desc"
                                                rows={4}
                                                className="va-input"
                                                placeholder="Ceritakan konsep pernikahan dan kebutuhan Anda..."
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                {mode === 'custom' && (
                                    <div className="va-field">
                                        <label className="va-label" htmlFor="vp-budget">Budget (Rp)</label>
                                        <input
                                            id="vp-budget"
                                            type="number"
                                            min="0"
                                            className="va-input"
                                            placeholder="cth. 15000000"
                                            value={budget}
                                            onChange={(e) => setBudget(e.target.value)}
                                        />
                                    </div>
                                )}

                                {!user && (
                                    <div className="va-alert" role="alert">
                                        <AlertCircle size={16} />
                                        <span>
                                            Anda perlu <Link to="/login" className="va-link">login</Link> terlebih dahulu untuk mengirim.
                                        </span>
                                    </div>
                                )}
                                {error && (
                                    <div className="va-alert" role="alert">
                                        <AlertCircle size={16} />
                                        <span>{error}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <footer className="vp-modal__foot">
                            <div className="vp-sum" aria-live="polite">
                                <span className="va-label">
                                    {start
                                        ? `${fmtDate(start)}${end ? ` – ${fmtDate(end)}` : ''} · ${startTime}–${endTime}`
                                        : 'Pilih tanggal acara'}
                                </span>
                                {mode === 'custom' ? (
                                    <strong>{Number(budget) > 0 ? `Budget ${formatRupiah(budget)}` : 'Budget belum diisi'}</strong>
                                ) : (
                                    <strong>
                                        {estimate !== null && (pkg.type !== 'per_hour' || hours > 0)
                                            ? `Estimasi ${formatRupiah(estimate)}`
                                            : 'Estimasi biaya'}
                                    </strong>
                                )}
                                {mode !== 'custom' && pkg?.type === 'per_hour' && hours > 0 && (
                                    <small className="va-muted">{formatRupiah(price)} × {hours} jam</small>
                                )}
                            </div>
                            <div className="vp-modal__actions">
                                <button type="button" className="va-btn va-btn--ghost" onClick={onClose} disabled={submitting}>Batal</button>
                                <button type="submit" className="va-btn" disabled={submitting || !user}>
                                    {submitting ? <><Loader2 size={16} className="va-spin" /> Mengirim…</> : mode === 'booking' ? 'Kirim pemesanan' : 'Kirim permintaan'}
                                </button>
                            </div>
                        </footer>
                    </form>
                )}
            </div>
        </div>
    );
}

const HIGHLIGHTS = [
    {
        icon: Mountain,
        title: 'Suasana pegunungan',
        text: 'Udara sejuk Cisarua dan lanskap hijau menjadi latar alami untuk prosesi dan sesi foto.',
    },
    {
        icon: BedDouble,
        title: 'Hunian kayu yang hangat',
        text: 'Arsitektur kayu tradisional memberi nuansa intim untuk akad, resepsi kecil, dan keluarga yang menginap.',
    },
    {
        icon: MessageCircle,
        title: 'Konsultasi langsung',
        text: 'Tim kami membantu cek tanggal, kapasitas, dan kebutuhan acara lewat WhatsApp.',
    },
];

const isVideo = (item) => item?.type === 'video';
const srcOf = (item) => item?.image ?? item?.url ?? item?.video ?? '';

export default function WeddingPage() {
    const { get } = useFetch();
    const [type, setType] = useState('all');
    const [cat, setCat] = useState('all');
    const [active, setActive] = useState(null);
    const [modal, setModal] = useState(null); // { mode: 'booking' | 'request' | 'custom', pkg }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['wedding-gallery'],
        queryFn: async () => {
            const resp = await get(WEDDING_ENDPOINT);
            if (!resp.status) throw new Error(resp.error);
            return resp.data;
        },
    });

    // Ambil paket wedding/event untuk pilihan modal
    const { data: packagesData } = useQuery({
        queryKey: ['wedding-packages-list'],
        queryFn: async () => {
            const resp = await get(PACKAGES_ENDPOINT);
            if (!resp.status) return [];
            const raw = resp.data?.data ?? resp.data;
            return Array.isArray(raw) ? raw : [];
        },
    });

    const defaultPkg = useMemo(() => {
        if (!packagesData || packagesData.length === 0) return null;
        return packagesData.find((p) => p.is_wedding) || packagesData[0];
    }, [packagesData]);

    const items = useMemo(() => {
        const raw = data?.data ?? data;
        return Array.isArray(raw) ? raw.filter((i) => srcOf(i)) : [];
    }, [data]);

    const categories = useMemo(() => [...new Set(items.map((i) => i.category).filter(Boolean))], [items]);
    const photoCount = items.filter((i) => !isVideo(i)).length;
    const videoCount = items.filter(isVideo).length;
    const heroMedia = items.find(isVideo) ?? items[0];

    const shown = useMemo(
        () =>
            items.filter(
                (i) =>
                    (type === 'all' || (type === 'video') === isVideo(i)) &&
                    (cat === 'all' || i.category === cat),
            ),
        [items, type, cat],
    );

    const current = active !== null ? shown[active] : null;

    const close = useCallback(() => setActive(null), []);
    const step = useCallback(
        (dir) => setActive((i) => (i === null ? i : (i + dir + shown.length) % shown.length)),
        [shown.length],
    );

    useEffect(() => {
        if (active === null) return undefined;
        const onKey = (e) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') step(-1);
            if (e.key === 'ArrowRight') step(1);
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [active, close, step]);

    const handleOpenBooking = () => {
        if (defaultPkg) {
            setModal({ mode: 'booking', pkg: defaultPkg });
        } else {
            setModal({ mode: 'custom', pkg: null });
        }
    };

    return (
        <>
            <header className="va-ink vw-hero">
                {heroMedia &&
                    (isVideo(heroMedia) ? (
                        <video className="vw-hero__bg" src={srcOf(heroMedia)} autoPlay muted loop playsInline />
                    ) : (
                        <img className="vw-hero__bg" src={srcOf(heroMedia)} alt="" />
                    ))}
                <div className="vw-hero__shade" />

                <div className="vw-hero__body">
                    <span className="vw-eyebrow">Wedding at Villa Arira</span>
                    <h1 className="vw-hero__title">
                        Hari bahagia,
                        <br />
                        <em>di antara pegunungan.</em>
                    </h1>
                    <p className="vw-hero__sub">
                        Rayakan pernikahan Anda di hunian kayu yang hangat, dikelilingi udara sejuk Cisarua.
                    </p>
                    <div className="vw-hero__cta">
                        <button type="button" className="va-btn" onClick={handleOpenBooking}>
                            <Calendar size={18} /> Booking Wedding
                        </button>
                    </div>
                </div>

                <a href="#momen" className="vw-hero__scroll">
                    Lihat momen
                </a>
            </header>

            <section className="va-paper va-section">
                <div className="va-wrap">
                    <p className="vw-statement">
                        Pernikahan yang sederhana, hangat, dan <em>tak terlupakan</em>, di tengah udara sejuk
                        Cisarua.
                    </p>
                    <div className="vw-stats">
                        <div className="vw-stat">
                            <strong>{photoCount}</strong>
                            <span>Foto momen</span>
                        </div>
                        <div className="vw-stat">
                            <strong>{videoCount}</strong>
                            <span>Video</span>
                        </div>
                        <div className="vw-stat">
                            <strong>Cisarua</strong>
                            <span>Bandung Barat</span>
                        </div>
                    </div>
                </div>
            </section>

            <section id="momen" className="va-ink vw-gallery">
                <div className="va-wrap">
                    <div className="vw-gallery__head">
                        <h2 className="vw-title">
                            Momen di <em>Villa Arira</em>
                        </h2>
                        <p className="va-lead">
                            Kumpulan foto dan video pernikahan yang pernah dirayakan di villa kami.
                        </p>
                    </div>

                    <div className="vw-filter">
                        <div className="vw-filter__group" role="group" aria-label="Jenis media">
                            {[
                                ['all', 'Semua'],
                                ['image', 'Foto'],
                                ['video', 'Video'],
                            ].map(([v, label]) => (
                                <button
                                    key={v}
                                    type="button"
                                    className="vw-chip"
                                    aria-pressed={type === v}
                                    onClick={() => setType(v)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {categories.length > 0 && (
                            <div className="vw-filter__group" role="group" aria-label="Kategori">
                                {['all', ...categories].map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className="vw-chip"
                                        aria-pressed={cat === c}
                                        onClick={() => setCat(c)}
                                    >
                                        {c === 'all' ? 'Semua kategori' : c}
                                    </button>
                                ))}
                            </div>
                        )}

                        <span className="vw-count" aria-live="polite">
                            {shown.length} item
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="vw-masonry">
                            {[260, 340, 220, 300, 360, 240].map((h, i) => (
                                <div key={i} className="va-skel vw-skel" style={{ height: h }} />
                            ))}
                        </div>
                    ) : isError ? (
                        <div className="va-alert" role="alert">
                            <AlertCircle size={16} />
                            <span>Gagal memuat galeri: {String(error?.message ?? error)}</span>
                        </div>
                    ) : shown.length === 0 ? (
                        <div className="va-empty">
                            <Images size={28} strokeWidth={1.5} />
                            <strong>Belum ada konten</strong>
                            <span className="va-text">Coba ubah filter di atas.</span>
                        </div>
                    ) : (
                        <div className="vw-masonry">
                            {shown.map((item, index) => (
                                <button
                                    key={item.id ?? index}
                                    type="button"
                                    className="vw-tile"
                                    style={{ '--i': index }}
                                    onClick={() => setActive(index)}
                                    aria-label={`Buka ${item.title ?? 'media'}`}
                                >
                                    <div className="vw-tile__media">
                                        {isVideo(item) ? (
                                            <video src={`${srcOf(item)}#t=0.1`} muted playsInline preload="metadata" />
                                        ) : (
                                            <img src={srcOf(item)} alt={item.title ?? ''} loading="lazy" />
                                        )}
                                        {isVideo(item) && (
                                            <span className="vw-tile__play" aria-hidden="true">
                                                <Play size={18} fill="currentColor" />
                                            </span>
                                        )}
                                    </div>
                                    {(item.title || item.category) && (
                                        <div className="vw-tile__cap">
                                            {item.category && <span>{item.category}</span>}
                                            {item.title && <strong>{item.title}</strong>}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="va-paper va-section">
                <div className="va-wrap">
                    <div className="va-head">
                        <h2 className="vw-title">
                            Mengapa <em>Arira</em>
                        </h2>
                        <p className="va-lead">
                            Tempat yang tenang dan hangat untuk memulai babak baru bersama keluarga dan orang-orang
                            tercinta.
                        </p>
                    </div>
                    <div className="vw-feats">
                        {HIGHLIGHTS.map(({ icon: Icon, title, text }, i) => (
                            <article key={title} className="vw-feat">
                                <span className="vw-feat__n">{String(i + 1).padStart(2, '0')}</span>
                                <Icon size={26} strokeWidth={1.5} />
                                <h3 className="va-h3">{title}</h3>
                                <p className="va-text">{text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="va-ink vw-cta">
                <div className="va-wrap">
                    <span className="vw-eyebrow">Mulai dari sini</span>
                    <h2 className="vw-cta__title">
                        Rencanakan <em>hari istimewa</em> Anda
                    </h2>
                    <p className="va-lead" style={{ margin: '0 auto' }}>
                        Tentukan tanggal dan pilih paket wedding impian Anda secara langsung di sini.
                    </p>
                    <div className="vw-hero__cta" style={{ marginTop: '1.5rem' }}>
                        <button type="button" className="va-btn" onClick={handleOpenBooking}>
                            <Calendar size={18} /> Booking Wedding
                        </button>
                    </div>
                </div>
            </section>

            {current && (
                <div className="va-ink vw-lb" role="dialog" aria-modal="true" aria-label={current.title ?? 'Media'} onClick={close}>
                    <button type="button" className="va-icon-btn vw-lb__close" onClick={close} aria-label="Tutup">
                        <X size={20} strokeWidth={1.5} />
                    </button>

                    {shown.length > 1 && (
                        <>
                            <button
                                type="button"
                                className="va-icon-btn vw-lb__btn vw-lb__btn--prev"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    step(-1);
                                }}
                                aria-label="Sebelumnya"
                            >
                                <ChevronLeft size={22} />
                            </button>
                            <button
                                type="button"
                                className="va-icon-btn vw-lb__btn vw-lb__btn--next"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    step(1);
                                }}
                                aria-label="Berikutnya"
                            >
                                <ChevronRight size={22} />
                            </button>
                        </>
                    )}

                    <figure className="vw-lb__fig" onClick={(e) => e.stopPropagation()}>
                        {isVideo(current) ? (
                            <video key={current.id} src={srcOf(current)} controls autoPlay playsInline />
                        ) : (
                            <img key={current.id} src={srcOf(current)} alt={current.title ?? ''} />
                        )}
                        <figcaption className="vw-lb__cap">
                            {current.category && <span className="va-label">{current.category}</span>}
                            {current.title && <strong className="va-h3">{current.title}</strong>}
                            {current.description && <p className="va-text">{current.description}</p>}
                            <span className="vw-lb__count">
                                {active + 1} / {shown.length}
                            </span>
                        </figcaption>
                    </figure>
                </div>
            )}

            {modal && <EventModal config={modal} onClose={() => setModal(null)} />}
        </>
    );
}