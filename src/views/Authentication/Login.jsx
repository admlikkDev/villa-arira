import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import '../../assets/styles/villa.css';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const { login } = useAuth();
    const { post } = useFetch();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});

        const value = Object.fromEntries(new FormData(e.target));
        const resp = await post('/auth/login', value);

        if (!resp.status) {
            setErrors(typeof resp.error === 'object' ? resp.error : { general: resp.error });
            return false;
        }

        login(resp.data.data);

        if (resp.data?.data?.user?.role === 'admin') {
            navigate('/admin/hero-section');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="va-auth">
            <aside className="va-ink va-auth__aside">
                <span className="va-brand">Villa Arira</span>
                <p className="va-auth__quote">
                    Kenyamanan hunian kayu berbalut sejuknya udara pegunungan Lembang, kini dalam satu sistem manajemen terpadu.
                </p>
                <p className="va-auth__small">© {new Date().getFullYear()} Villa Arira Lembang</p>
            </aside>

            <main className="va-paper va-auth__main">
                <form className="va-auth__form" onSubmit={submit}>
                    <span className="va-brand va-auth__brand-m">Villa Arira</span>

                    <div>
                        <h1 className="va-auth__title">Selamat datang</h1>
                        <p className="va-text">Masuk ke portal manajemen operasional villa.</p>
                    </div>

                    {errors.general && (
                        <div className="va-alert" role="alert">
                            <AlertCircle size={16} />
                            <span>{errors.general}</span>
                        </div>
                    )}

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
                        <div className="va-field__row">
                            <label className="va-label" htmlFor="password">Kata sandi</label>
                            <Link to="/forgot-password" className="va-link">Lupa kata sandi?</Link>
                        </div>
                        <div className="va-input-wrap">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                placeholder="Masukkan kata sandi"
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
                        Masuk
                    </button>

                    <p className="va-text">
                        Belum terdaftar?{' '}
                        <Link to="/register" className="va-link">Buat akun baru</Link>
                    </p>
                </form>
            </main>
        </div>
    );
}