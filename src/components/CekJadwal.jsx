import { useState, useRef, useEffect } from 'react';

export default function CekJadwal() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [villaType, setVillaType] = useState('Arira Exclusive');
    const [purpose, setPurpose] = useState('Liburan Keluarga');
    const [guestCount, setGuestCount] = useState('');

    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8)); 
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCekJadwal = (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            alert('Mohon pilih tanggal Check-In dan Check-Out terlebih dahulu.');
            return;
        }
        alert(`Mengecek jadwal untuk ${villaType} (${purpose}) dari ${startDate} sampai ${endDate} untuk ${guestCount || '0'} orang`);
    };

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const year1 = currentMonth.getFullYear();
    const month1 = currentMonth.getMonth();
    
    const nextMonthDate = new Date(year1, month1 + 1, 1);
    const year2 = nextMonthDate.getFullYear();
    const month2 = nextMonthDate.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handleDateClick = (dateStr) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(dateStr);
            setEndDate('');
        } else if (startDate && !endDate) {
            if (dateStr < startDate) {
                setStartDate(dateStr);
            } else {
                setEndDate(dateStr);
            }
        }
    };

    const renderCalendarGrid = (y, m) => {
        const daysInMonth = getDaysInMonth(y, m);
        const firstDay = getFirstDayOfMonth(y, m);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} style={{ height: '36px' }} />);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const formattedMonth = String(m + 1).padStart(2, '0');
            const formattedDay = String(d).padStart(2, '0');
            const dateStr = `${y}-${formattedMonth}-${formattedDay}`;

            const isStart = startDate === dateStr;
            const isEnd = endDate === dateStr;
            const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;

            days.push(
                <div 
                    key={dateStr}
                    onClick={() => handleDateClick(dateStr)}
                    className="calendar-day"
                    style={{
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.88rem',
                        fontWeight: (isStart || isEnd) ? '700' : '500',
                        backgroundColor: (isStart || isEnd) ? '#0B0D0C' : isInRange ? 'rgba(164, 123, 66, 0.15)' : 'transparent',
                        color: (isStart || isEnd) ? '#F5EFEB' : '#0B0D0C',
                        borderRadius: isStart && !endDate ? '50% 0 0 50%' : isEnd ? '0 50% 50% 0' : (isStart && endDate) ? '50%' : '8px',
                        transition: 'background-color 0.2s ease, transform 0.15s ease',
                    }}
                >
                    <span>{d}</span>
                </div>
            );
        }
        return days;
    };

    const displayText = startDate && endDate 
        ? `${startDate} → ${endDate}` 
        : startDate 
        ? `${startDate} → Pilih Check-Out` 
        : 'Pilih Tanggal Check-In & Check-Out';

    return (
        <section id="cek-jadwal" style={{
            width: '100%',
            backgroundColor: '#F5EFEB',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 2rem',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    @media (max-width: 1100px) {
                        .booking-form-grid { grid-template-columns: repeat(2, 1fr) !important; }
                    }
                    @media (max-width: 768px) {
                        .booking-form-grid { grid-template-columns: 1fr !important; }
                    }
                    .booking-input:focus, .booking-select:focus {
                        border-color: #A47B42 !important;
                        outline: none;
                        box-shadow: 0 0 0 3px rgba(164, 123, 66, 0.15);
                    }
                    .check-btn:hover {
                        opacity: 0.92;
                        transform: translateY(-1px);
                    }
                    .calendar-day:hover {
                        background-color: rgba(164, 123, 66, 0.2) !important;
                        border-radius: 8px;
                    }
                    .nav-btn:hover {
                        background-color: rgba(164, 123, 66, 0.2) !important;
                    }
                    @keyframes smoothDropdown {
                        0% { opacity: 0; transform: translateY(8px) scale(0.98); }
                        100% { opacity: 1; transform: translateY(0) scale(1); }
                    }
                `}
            </style>

            <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '750px' }}>
                <span style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#A47B42',
                    fontWeight: '700',
                }}>
                    Reservasi Cepat
                </span>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0.4rem',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Cek Ketersediaan Villa
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#4A4D4C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Pilih tanggal dan tipe unit yang Anda inginkan untuk melihat ketersediaan secara langsung sebelum melakukan pemesanan.
                </p>
            </div>

            <div style={{
                maxWidth: '1200px',
                width: '100%',
                backgroundColor: '#ECE2D8',
                borderRadius: '24px',
                padding: '2.5rem 3rem',
                boxShadow: '0 20px 45px rgba(11, 13, 12, 0.08)',
                border: '1px solid rgba(164, 123, 66, 0.18)',
                boxSizing: 'border-box',
            }}>
                <form onSubmit={handleCekJadwal} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.8rem',
                }}>
                    <div className="booking-form-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: '1.6fr 1.1fr 1.1fr 1fr',
                        gap: '1.2rem',
                    }}>
                        {/* Custom Range Datepicker Airbnb Style */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }} ref={dropdownRef}>
                            <label style={{
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: '#0B0D0C',
                            }}>
                                Tanggal Menginap (Check-In & Check-Out)
                            </label>
                            
                            <div 
                                onClick={() => setIsOpen(!isOpen)}
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.1rem',
                                    borderRadius: '12px',
                                    backgroundColor: '#F5EFEB',
                                    border: '1px solid rgba(164, 123, 66, 0.25)',
                                    color: startDate ? '#0B0D0C' : '#7A7D7C',
                                    fontSize: '0.9rem',
                                    boxSizing: 'border-box',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    userSelect: 'none',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <span>{displayText}</span>
                                {/* <span style={{ fontSize: '0.75rem', color: '#A47B42' }}>📅</span> */}
                            </div>

                            {isOpen && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 8px)',
                                    left: 0,
                                    width: '640px',
                                    backgroundColor: '#F5EFEB',
                                    borderRadius: '20px',
                                    boxShadow: '0 20px 45px rgba(11, 13, 12, 0.15)',
                                    border: '1px solid rgba(164, 123, 66, 0.2)',
                                    padding: '1.8rem',
                                    zIndex: 100,
                                    animation: 'smoothDropdown 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <button 
                                            type="button" 
                                            onClick={handlePrevMonth}
                                            className="nav-btn"
                                            style={{
                                                background: '#ECE2D8',
                                                border: '1px solid rgba(164, 123, 66, 0.2)',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                color: '#0B0D0C',
                                                transition: 'background-color 0.2s ease',
                                            }}
                                        >
                                            ❮
                                        </button>
                                        <div style={{ fontWeight: '700', fontSize: '1rem', fontFamily: '"Playfair Display", serif', color: '#0B0D0C' }}>
                                            {monthNames[month1]} {year1} &nbsp;&nbsp;|&nbsp;&nbsp; {monthNames[month2]} {year2}
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={handleNextMonth}
                                            className="nav-btn"
                                            style={{
                                                background: '#ECE2D8',
                                                border: '1px solid rgba(164, 123, 66, 0.2)',
                                                borderRadius: '50%',
                                                width: '32px',
                                                height: '32px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: 'bold',
                                                color: '#0B0D0C',
                                                transition: 'background-color 0.2s ease',
                                            }}
                                        >
                                            ❯
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div>
                                            <div style={{ textAlign: 'center', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.8rem', color: '#A47B42' }}>
                                                {monthNames[month1]} {year1}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', fontSize: '0.7rem', fontWeight: '700', color: '#7A7D7C', textAlign: 'center', marginBottom: '0.5rem' }}>
                                                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '4px' }}>
                                                {renderCalendarGrid(year1, month1)}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ textAlign: 'center', fontWeight: '600', fontSize: '0.85rem', marginBottom: '0.8rem', color: '#A47B42' }}>
                                                {monthNames[month2]} {year2}
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', fontSize: '0.7rem', fontWeight: '700', color: '#7A7D7C', textAlign: 'center', marginBottom: '0.5rem' }}>
                                                <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', rowGap: '4px' }}>
                                                {renderCalendarGrid(year2, month2)}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(164, 123, 66, 0.2)', paddingTop: '1rem' }}>
                                        <span style={{ fontSize: '0.8rem', color: '#5A5D5C' }}>
                                            {startDate && endDate ? `Check-in ${startDate} · Check-out ${endDate}` : 'Pilih tanggal check-in & check-out secara lengkap'}
                                        </span>
                                        <button 
                                            type="button"
                                            disabled={!startDate || !endDate}
                                            onClick={() => {
                                                if (startDate && endDate) setIsOpen(false);
                                            }}
                                            style={{
                                                padding: '0.5rem 1.2rem',
                                                borderRadius: '8px',
                                                backgroundColor: startDate && endDate ? '#0B0D0C' : '#C4C7C6',
                                                color: '#F5EFEB',
                                                border: 'none',
                                                fontSize: '0.8rem',
                                                fontWeight: '700',
                                                cursor: startDate && endDate ? 'pointer' : 'not-allowed',
                                                transition: 'background-color 0.2s ease',
                                            }}
                                        >
                                            Terapkan
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tipe Villa */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: '#0B0D0C',
                            }}>
                                Tipe Villa
                            </label>
                            <select 
                                value={villaType}
                                onChange={(e) => setVillaType(e.target.value)}
                                className="booking-select"
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.1rem',
                                    borderRadius: '12px',
                                    backgroundColor: '#F5EFEB',
                                    border: '1px solid rgba(164, 123, 66, 0.25)',
                                    color: '#0B0D0C',
                                    fontSize: '0.9rem',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="Arira Private Wing">Arira Private Wing</option>
                                <option value="Arira Main House">Arira Main House</option>
                                <option value="Arira Exclusive">Arira Exclusive</option>
                            </select>
                        </div>

                        {/* Keperluan */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: '#0B0D0C',
                            }}>
                                Keperluan
                            </label>
                            <select 
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                className="booking-select"
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.1rem',
                                    borderRadius: '12px',
                                    backgroundColor: '#F5EFEB',
                                    border: '1px solid rgba(164, 123, 66, 0.25)',
                                    color: '#0B0D0C',
                                    fontSize: '0.9rem',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="Liburan Keluarga">Liburan Keluarga</option>
                                <option value="Gathering Kantor">Gathering Kantor</option>
                                <option value="Acara Reunian / Arisan">Acara Reunian / Arisan</option>
                                <option value="Staycation / Istirahat">Staycation / Istirahat</option>
                            </select>
                        </div>

                        {/* Estimasi Jumlah Tamu */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{
                                fontSize: '0.72rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: '#0B0D0C',
                            }}>
                                Estimasi Tamu
                            </label>
                            <input 
                                type="number"
                                placeholder="Contoh: 15"
                                min="1"
                                max="50"
                                value={guestCount}
                                onChange={(e) => setGuestCount(e.target.value)}
                                className="booking-input"
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 1.1rem',
                                    borderRadius: '12px',
                                    backgroundColor: '#F5EFEB',
                                    border: '1px solid rgba(164, 123, 66, 0.25)',
                                    color: '#0B0D0C',
                                    fontSize: '0.9rem',
                                    boxSizing: 'border-box',
                                    transition: 'all 0.2s ease',
                                }}
                            />
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <button 
                        type="submit"
                        className="check-btn"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '12px',
                            backgroundColor: '#A47B42',
                            color: '#F5EFEB',
                            border: 'none',
                            fontSize: '0.92rem',
                            fontWeight: '700',
                            letterSpacing: '0.8px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 6px 16px rgba(164, 123, 66, 0.25)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        Cek Jadwal Sekarang
                    </button>
                </form>
            </div>
        </section>
    );
}