import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import '../../assets/styles/villa.css';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useAuth();
    const { post } = useFetch();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});

        const value = Object.fromEntries(new FormData(e.target));
        const resp = await post('/auth/register', value);

        if (!resp.status) {
            setErrors(typeof resp.error === 'object' ? resp.error : { general: resp.error });
            return false;
        }

        register(resp.data);
        navigate('/');
    };

    return (
        <div className="va-auth">
            <aside className="va-ink va-auth__aside">
                <span className="va-brand">Villa Arira</span>
                <p className="va-auth__quote">
                    Bergabunglah bersama kami dan nikmati kemudahan pengelolaan inventaris serta peminjaman dalam satu genggaman.
                </p>
                <p className="va-auth__small">© {new Date().getFullYear()} Villa Arira Lembang</p>
            </aside>

            <main className="va-paper va-auth__main">
                <form className="va-auth__form" onSubmit={submit}>
                    <span className="va-brand va-auth__brand-m">Villa Arira</span>

                    <div>
                        <h1 className="va-auth__title">Buat akun baru</h1>
                        <p className="va-text">Lengkapi informasi di bawah untuk mendaftarkan akun Anda.</p>
                    </div>

                    {errors.general && (
                        <div className="va-alert" role="alert">
                            <AlertCircle size={16} />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <div className="va-field">
                        <label className="va-label" htmlFor="name">Nama lengkap</label>
                        <input
                            id="name"
                            name="username"
                            type="text"
                            autoComplete="name"
                            placeholder="Nama lengkap Anda"
                            className="va-input"
                            aria-invalid={Boolean(errors.username)}
                        />
                        {errors.username && <p className="va-error">{errors.username}</p>}
                    </div>

                    <div className="va-field">
                        <label className="va-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="nama@domain.com"
                            className="va-input"
                            aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && <p className="va-error">{errors.email}</p>}
                    </div>

                    <div className="va-field">
                        <label className="va-label" htmlFor="phone">Nomor telepon</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            placeholder="081234567890"
                            className="va-input"
                            aria-invalid={Boolean(errors.phone)}
                        />
                        {errors.phone && <p className="va-error">{errors.phone}</p>}
                    </div>

                    <div className="va-field">
                        <label className="va-label" htmlFor="password">Kata sandi</label>
                        <div className="va-input-wrap">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
                                placeholder="Buat kata sandi"
                                className="va-input"
                                aria-invalid={Boolean(errors.password)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                            >
                                {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                            </button>
                        </div>
                        {errors.password && <p className="va-error">{errors.password}</p>}
                    </div>

                    <button type="submit" className="va-btn va-btn--block" style={{ padding: '1.05rem' }}>
                        Daftar sekarang
                    </button>

                    <p className="va-text">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="va-link">Masuk di sini</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}