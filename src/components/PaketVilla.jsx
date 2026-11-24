import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    AlertCircle,
    ArrowUpRight,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Loader2,
    Minus,
    Plus,
    Sparkles,
    Users,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useVillaListWithLists, formatRupiah } from '../hooks/Usevillaquery';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../hooks/useAuth';
import { loadSnap } from '../hooks/useSnap';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

const BOOKING_ENDPOINT = 'my-event-bookings';
const REQUEST_ENDPOINT = 'my-event-requests';

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DOW = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const MODE_LABEL = {
    booking: 'Pesan paket event',
    request: 'Request khusus paket',
    custom: 'Ajukan paket custom',
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
    const { get, post } = useFetch();
    const { user } = useAuth();

    const today = new Date();
    const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

    const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('17:00');
    const [guests, setGuests] = useState(1);
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

    const sendAdminNotification = async (actionType, packageName) => {
        try {
            const appResp = await get('application');
            const appData = appResp.data?.data ?? appResp.data;
            const adminPhone = appData?.phone_number || appData?.phone || '0895334886338';

            const waMessage = `Halo Admin Villa Arira, ada ${actionType} baru untuk paket *${packageName}* pada tanggal ${fmtDate(start)} (${startTime} - ${endTime}) dengan jumlah tamu ${guests} orang. Mohon dicek. Terima kasih!`;

            await post('whatsapp/send-text', {
                message: waMessage,
                phone: adminPhone,
            });
        } catch (err) {
            console.error('Gagal mengirim notifikasi WhatsApp ke admin:', err);
        }
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

        if (mode === 'booking') {
            endpoint = BOOKING_ENDPOINT;
            payload = {
                ...base,
                villa_package_id: Number(pkg.id),
            };
        } else if (mode === 'request') {
            endpoint = REQUEST_ENDPOINT;
            payload = {
                title: title.trim(),
                description: description.trim(),
                ...base,
                villa_package_id: Number(pkg.id),
            };
        } else {
            endpoint = REQUEST_ENDPOINT;
            payload = {
                title: title.trim(),
                description: description.trim(),
                ...base,
                budget: Number(budget),
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

        const responseData = resp.data?.data ?? resp.data;
        const packageName = pkg?.title || title || 'Paket Custom Event';

        if (mode === 'booking') {
            const snapToken = responseData?.payment?.snap_token || responseData?.snap_token;
            
            if (snapToken) {
                setSubmitting(false);
                const snap = await loadSnap();
                snap.pay(snapToken, {
                    onSuccess: async () => {
                        toast.success('Pembayaran berhasil!');
                        await sendAdminNotification('pemesanan event & pembayaran sukses', packageName);
                        setDone(true);
                    },
                    onPending: async () => {
                        toast.info('Menunggu pembayaran selesai.');
                        await sendAdminNotification('pemesanan event (menunggu pembayaran)', packageName);
                        setDone(true);
                    },
                    onError: () => toast.error('Pembayaran gagal.'),
                    onClose: () => toast.warning('Pembayaran belum selesai.'),
                });
                return;
            }
        }

        // Untuk mode request / custom
        await sendAdminNotification('pengajuan request event', packageName);
        setSubmitting(false);
        toast.success('Permintaan event dikirim.');
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

    const heading = pkg?.title ?? 'Paket custom';

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
                                ? 'Pemesanan event Anda sudah kami terima. Notifikasi telah dikirimkan ke admin.'
                                : 'Permintaan event Anda sudah kami terima. Admin akan menghubungi Anda untuk membahas penawaran.'}
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
                                            <label className="va-label" htmlFor="vp-title">Judul acara</label>
                                            <input
                                                id="vp-title"
                                                type="text"
                                                className="va-input"
                                                placeholder="cth. Gathering keluarga besar"
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
                                                placeholder="Ceritakan konsep acara dan kebutuhan Anda..."
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
                                            placeholder="cth. 10000000"
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
                                    {submitting ? <><Loader2 size={16} className="va-spin" /> Memproses…</> : mode === 'booking' ? 'Bayar Sekarang' : 'Kirim permintaan'}
                                </button>
                            </div>
                        </footer>
                    </form>
                )}
            </div>
        </div>
    );
}

export default function PaketVilla() {
    const { data: packages = [], isLoading, isError, error } = useVillaListWithLists('villa-packages');
    const [modal, setModal] = useState(null);

    if (isLoading) return <SectionState tone="paper" label="Memuat paket villa…" />;
    if (isError) return <SectionState tone="paper" label="Paket villa gagal dimuat" error={error.message} />;

    return (
        <section id="paket" className="va-ink va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <div>
                        <span className="va-eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Reservasi Event &amp; Acara Spesial
                        </span>
                        <h2 className="va-h2">Paket gathering, wedding &amp; photoshoot</h2>
                    </div>
                    <p className="va-lead">
                        Ingin mengadakan acara privat atau booking event di Villa Arira? Pilih paket yang sesuai,
                        tentukan tanggal dan jumlah tamu. Butuh konsep sendiri? Ajukan paket custom dan kami susun
                        penawarannya.
                    </p>
                </div>

                <div className="vp-grid">
                    {packages.map((item, index) => {
                        const requiresApproval = Boolean(item.requires_approval);

                        return (
                            <article
                                key={item.id ?? index}
                                className={`vp-card${item.is_wedding ? ' va-paper vp-card--wedding' : ''}`}
                            >
                                <div className="vp-card__head">
                                    <span className="vp-card__n">{String(index + 1).padStart(2, '0')}</span>
                                </div>

                                <div>
                                    <h3 className="va-h3 vp-card__title">{item.title}</h3>
                                    {item.subtitle && <p className="va-text" style={{ marginTop: '0.4rem' }}>{item.subtitle}</p>}
                                </div>

                                <div>
                                    <span className="va-price">{formatRupiah(item.price)}</span>
                                    <span className="va-price-note">{item.type === 'per_hour' ? 'per jam' : 'sekali acara'}</span>
                                </div>

                                <div className="vp-facts">
                                    {item.max_capacity ? (
                                        <span><Users size={16} strokeWidth={1.6} /> Hingga {item.max_capacity} orang</span>
                                    ) : null}
                                    <span><Clock size={16} strokeWidth={1.6} /> {item.type === 'per_hour' ? 'Tarif per jam' : 'Tarif tetap'}</span>
                                </div>

                                {item.lists?.length > 0 && (
                                    <ul className="va-checks">
                                        {item.lists.map((f, i) => (
                                            <li key={f.id ?? i}><Check size={16} strokeWidth={2} />{f.text}</li>
                                        ))}
                                    </ul>
                                )}

                                <div className="vp-card__foot">
                                    {item.is_wedding ? (
                                        <Link to="/wedding" className="va-btn va-btn--block" style={{ textAlign: 'center', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}>
                                            Lihat halaman wedding <ArrowUpRight size={16} />
                                        </Link>
                                    ) : requiresApproval ? (
                                        <button
                                            type="button"
                                            className="va-btn va-btn--block"
                                            onClick={() => setModal({ mode: 'request', pkg: item })}
                                        >
                                            Ajukan request khusus paket ini
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="va-btn va-btn--block"
                                            onClick={() => setModal({ mode: 'booking', pkg: item })}
                                        >
                                            Pilih tanggal &amp; pesan
                                        </button>
                                    )}
                                </div>
                            </article>
                        );
                    })}

                    <article className="vp-card vp-card--custom">
                        <div className="vp-card__head">
                            <span className="vp-card__n"><Sparkles size={22} strokeWidth={1.5} /></span>
                        </div>
                        <div>
                            <h3 className="va-h3 vp-card__title">Paket custom</h3>
                            <p className="va-text" style={{ marginTop: '0.4rem' }}>
                                Punya konsep acara sendiri? Ceritakan kebutuhan dan budget Anda.
                            </p>
                        </div>
                        <ul className="va-checks">
                            <li><Check size={16} strokeWidth={2} />Atur sendiri tanggal, durasi, dan jumlah tamu</li>
                            <li><Check size={16} strokeWidth={2} />Tentukan budget yang Anda siapkan</li>
                            <li><Check size={16} strokeWidth={2} />Admin menghubungi Anda untuk penawaran</li>
                        </ul>
                        <div className="vp-card__foot">
                            <button
                                type="button"
                                className="va-btn va-btn--ghost va-btn--block"
                                onClick={() => setModal({ mode: 'custom', pkg: null })}
                            >
                                Ajukan paket custom
                            </button>
                        </div>
                    </article>
                </div>
            </div>

            {modal && <EventModal config={modal} onClose={() => setModal(null)} />}
        </section>
    );
}