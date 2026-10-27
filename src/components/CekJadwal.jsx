import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import '../assets/styles/villa.css';

const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

const toISO = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // minggu dimulai Senin
};

export default function CekJadwal() {
    const today = new Date();
    const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [villaType, setVillaType] = useState('Arira Exclusive');
    const [purpose, setPurpose] = useState('Liburan Keluarga');
    const [guestCount, setGuestCount] = useState('');
    const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCekJadwal = (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            alert('Mohon pilih tanggal check-in dan check-out terlebih dahulu.');
            return;
        }
        alert(`Mengecek jadwal untuk ${villaType} (${purpose}) dari ${startDate} sampai ${endDate} untuk ${guestCount || '0'} orang`);
    };

    const handleDateClick = (dateStr) => {
        if (!startDate || endDate) {
            setStartDate(dateStr);
            setEndDate('');
        } else if (dateStr <= startDate) {
            setStartDate(dateStr);
        } else {
            setEndDate(dateStr);
        }
    };

    const shiftMonth = (delta) =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1));

    const months = [0, 1].map((i) => {
        const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + i, 1);
        return { year: d.getFullYear(), month: d.getMonth() };
    });

    const renderDays = ({ year, month }) => {
        const cells = [];
        for (let i = 0; i < getFirstDayOfMonth(year, month); i++) {
            cells.push(<span key={`e-${i}`} />);
        }
        for (let d = 1; d <= getDaysInMonth(year, month); d++) {
            const dateStr = toISO(year, month, d);
            const isSel = dateStr === startDate || dateStr === endDate;
            const inRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
            cells.push(
                <button
                    key={dateStr}
                    type="button"
                    className="va-day"
                    data-sel={isSel}
                    data-range={Boolean(inRange)}
                    disabled={dateStr < todayISO}
                    onClick={() => handleDateClick(dateStr)}
                >
                    {d}
                </button>
            );
        }
        return cells;
    };

    const displayText =
        startDate && endDate
            ? `${formatDate(startDate)} – ${formatDate(endDate)}`
            : startDate
            ? `${formatDate(startDate)} – pilih check-out`
            : 'Pilih check-in & check-out';

    return (
        <section id="cek-jadwal" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Cek ketersediaan villa</h2>
                    <p className="va-lead">
                        Pilih tanggal dan tipe unit untuk melihat ketersediaan sebelum melakukan pemesanan.
                    </p>
                </div>

                <form className="va-booking" onSubmit={handleCekJadwal}>
                    <div className="va-form-grid">
                        {/* Tanggal */}
                        <div className="va-field" ref={dropdownRef}>
                            <label className="va-label" htmlFor="cj-date">Tanggal menginap</label>
                            <button
                                id="cj-date"
                                type="button"
                                className="va-input va-input--btn"
                                aria-expanded={isOpen}
                                onClick={() => setIsOpen(!isOpen)}
                                style={{ color: startDate ? 'var(--fg)' : 'var(--muted)' }}
                            >
                                <span>{displayText}</span>
                                <Calendar size={18} strokeWidth={1.5} />
                            </button>

                            {isOpen && (
                                <div className="va-pop va-cal">
                                    <div className="va-cal__bar">
                                        <button type="button" className="va-icon-btn" onClick={() => shiftMonth(-1)} aria-label="Bulan sebelumnya">
                                            <ChevronLeft size={18} />
                                        </button>
                                        <button type="button" className="va-icon-btn" onClick={() => shiftMonth(1)} aria-label="Bulan berikutnya">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>

                                    <div className="va-cal__months">
                                        {months.map((m) => (
                                            <div key={`${m.year}-${m.month}`}>
                                                <div className="va-cal__title">{monthNames[m.month]} {m.year}</div>
                                                <div className="va-cal__dow">
                                                    {dayNames.map((n) => <span key={n}>{n}</span>)}
                                                </div>
                                                <div className="va-cal__days">{renderDays(m)}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="va-cal__foot">
                                        <span>
                                            {startDate && endDate
                                                ? `Check-in ${formatDate(startDate)}, check-out ${formatDate(endDate)}`
                                                : 'Pilih tanggal check-in dan check-out'}
                                        </span>
                                        <button
                                            type="button"
                                            className="va-btn va-btn--sm"
                                            disabled={!startDate || !endDate}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Terapkan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tipe villa */}
                        <div className="va-field">
                            <label className="va-label" htmlFor="cj-villa">Tipe villa</label>
                            <div className="va-select">
                                <select id="cj-villa" className="va-input" value={villaType} onChange={(e) => setVillaType(e.target.value)}>
                                    <option value="Arira Private Wing">Arira Private Wing</option>
                                    <option value="Arira Main House">Arira Main House</option>
                                    <option value="Arira Exclusive">Arira Exclusive</option>
                                </select>
                                <ChevronDown size={18} strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Keperluan */}
                        <div className="va-field">
                            <label className="va-label" htmlFor="cj-purpose">Keperluan</label>
                            <div className="va-select">
                                <select id="cj-purpose" className="va-input" value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                                    <option value="Liburan Keluarga">Liburan keluarga</option>
                                    <option value="Gathering Kantor">Gathering kantor</option>
                                    <option value="Acara Reunian / Arisan">Reuni / arisan</option>
                                    <option value="Staycation / Istirahat">Staycation / istirahat</option>
                                </select>
                                <ChevronDown size={18} strokeWidth={1.5} />
                            </div>
                        </div>

                        {/* Jumlah tamu */}
                        <div className="va-field">
                            <label className="va-label" htmlFor="cj-guest">Estimasi tamu</label>
                            <input
                                id="cj-guest"
                                type="number"
                                min="1"
                                max="50"
                                placeholder="Contoh: 15"
                                className="va-input"
                                value={guestCount}
                                onChange={(e) => setGuestCount(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="va-btn va-btn--block" style={{ padding: '1.1rem' }}>
                        <Search size={18} /> Cek jadwal sekarang
                    </button>
                </form>
            </div>
        </section>
    );
}