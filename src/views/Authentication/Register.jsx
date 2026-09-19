import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trees, Eye, EyeOff, ArrowRight, Lock, Mail, User, Phone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../../hooks/useAuth";
import useFetch from "../../hooks/useFetch";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const { post } = useFetch();
    const navigate = useNavigate();
    const [errors, setErrors] = useState({}); 

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
    }

    return (
        <div className="w-full min-h-screen grid lg:grid-cols-2 bg-stone-950">
            <div className="hidden lg:flex flex-col justify-between bg-stone-900 text-stone-100 p-10 relative overflow-hidden border-r border-amber-900/20">
                <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-700/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-800/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center gap-3 z-10">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-amber-800 text-amber-100 shadow-md border border-amber-700/50">
                        <Trees className="size-5" />
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-tight text-amber-50">Villa Arira</span>
                        <span className="block text-xs text-amber-400/80 font-medium">Lembang, Bandung</span>
                    </div>
                </div>

                <div className="z-10 max-w-md my-auto space-y-4">
                    <blockquote className="space-y-3">
                        <p className="text-xl font-normal leading-relaxed text-stone-300 font-serif italic">
                            &ldquo;Bergabunglah bersama kami dan nikmati kemudahan pengelolaan inventaris serta peminjaman dalam satu genggaman.&rdquo;
                        </p>
                    </blockquote>
                </div>

                <div className="z-10 text-xs text-stone-500">
                    &copy; {new Date().getFullYear()} Villa Arira Lembang. All rights reserved.
                </div>
            </div>

            <form onSubmit={submit} className="flex items-center justify-center p-8 lg:p-12 bg-stone-900/50 backdrop-blur-sm">
                <div className="w-full max-w-md space-y-5 bg-stone-900/80 p-8 rounded-3xl border border-stone-800 shadow-xl">
                    <div className="flex lg:hidden items-center gap-2 mb-2">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-800 text-amber-100">
                            <Trees className="size-4" />
                        </div>
                        <span className="font-bold text-base text-stone-100">Villa Arira Lembang</span>
                    </div>

                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight text-stone-100">
                            Buat Akun Baru
                        </h1>
                        <p className="text-sm text-stone-400">
                            Lengkapi informasi di bawah untuk mendaftarkan akun Anda.
                        </p>
                    </div>

                    {/* Alert Error Umum (Jika error dari server bukan dari field spesifik) */}
                    {errors.general && (
                        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-red-950/40 border border-red-900/50 text-red-300 text-sm shadow-inner">
                            <AlertCircle className="size-4 shrink-0 text-red-400" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Nama Lengkap / Username */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-stone-300">Nama Lengkap</Label>
                            <div className="relative">
                                <Input
                                    name="username"
                                    id="name"
                                    type="text"
                                    placeholder="Nama lengkap Anda"
                                    className={`h-11 pl-10 rounded-xl bg-stone-950/60 border-stone-800 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-700 ${errors.username ? 'border-red-500/80 focus-visible:ring-red-500' : ''}`}
                                />
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
                            </div>
                            {errors.username && <p className="text-xs text-red-400 font-medium pl-1">{errors.username}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-stone-300">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="nama@domain.com"
                                    className={`h-11 pl-10 rounded-xl bg-stone-950/60 border-stone-800 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-700 ${errors.email ? 'border-red-500/80 focus-visible:ring-red-500' : ''}`}
                                />
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
                            </div>
                            {errors.email && <p className="text-xs text-red-400 font-medium pl-1">{errors.email}</p>}
                        </div>

                        {/* Nomor Telepon */}
                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-stone-300">Nomor Telepon</Label>
                            <div className="relative">
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="081234567890"
                                    className={`h-11 pl-10 rounded-xl bg-stone-950/60 border-stone-800 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-700 ${errors.phone ? 'border-red-500/80 focus-visible:ring-red-500' : ''}`}
                                />
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
                            </div>
                            {errors.phone && <p className="text-xs text-red-400 font-medium pl-1">{errors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-stone-300">Kata Sandi</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                                    className={`h-11 pl-10 pr-10 rounded-xl bg-stone-950/60 border-stone-800 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-700 ${errors.password ? 'border-red-500/80 focus-visible:ring-red-500' : ''}`}
                                />
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-500" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-400 font-medium pl-1">{errors.password}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-xl bg-amber-700 hover:bg-amber-600 text-stone-100 font-medium transition-all shadow-md cursor-pointer border border-amber-600/30 mt-3"
                        >
                            Daftar Sekarang
                            <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </div>

                    <div className="text-center pt-1">
                        <p className="text-sm text-stone-400">
                            Sudah punya akun?{" "}
                            <Link to="/login" className="font-semibold text-amber-500 hover:text-amber-400 underline">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}