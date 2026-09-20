import { LayoutTemplate, Pencil, Image as ImageIcon, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import useFetch from "../../../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import UpdateHeroModal from "./Update";
import { useState } from "react";

const formatTimeAgo = (isoString) => {
    if (!isoString) return "Belum diperbarui";

    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Baru saja";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;

    return date.toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });
};

export default function Index() {
    const { get } = useFetch();

    const fetchData = async () => {
        const resp = await get('hero-section');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const [isOpen, setIsOpen] = useState(false)

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-hero-section'],
        queryFn: fetchData
    });

    if (isLoading) {
        return (
            <AdminPanelLayout>
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                    <Loader2 className="size-6 animate-spin text-indigo-600" />
                    <p className="text-sm font-medium">Memuat data hero section...</p>
                </div>
            </AdminPanelLayout>
        );
    }

    if (isError) {
        return (
            <AdminPanelLayout>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 max-w-4xl">
                    <AlertCircle className="size-5 shrink-0" />
                    <p className="text-sm">Gagal memuat data: {error.message}</p>
                </div>
            </AdminPanelLayout>
        );
    }

    const heroContent = data?.data || data;

    return (
        <AdminPanelLayout>
            <UpdateHeroModal open={isOpen} onOpenChange={setIsOpen} data={heroContent} />

            <div className="space-y-6 max-w-4xl relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
                            <LayoutTemplate className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Manajemen Hero Section
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Atur dan kelola konten banner utama yang tampil di halaman depan website.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative pt-4 pb-2">
                    <div className="absolute -top-2 right-6 text-indigo-500/10 dark:text-indigo-400/10 pointer-events-none select-none z-0">
                        <ImageIcon className="size-36 stroke-[1.5]" />
                    </div>

                    <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:10px_10px] opacity-15 pointer-events-none z-0 rounded-full blur-xs" />

                    <div className="relative z-10 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all backdrop-blur-sm">
                        <div className="flex flex-col gap-6">
                            <div className="space-y-3 max-w-2xl pt-2">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                                    {heroContent?.title || "Judul belum diatur"}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50/60 dark:bg-zinc-950/50 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800/80">
                                    {heroContent?.subtitle || "Subtitle belum diatur."}
                                </p>
                            </div>

                            <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100 dark:border-zinc-800/80">
                                <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500">
                                    <Clock className="size-4" />
                                    <span>Terakhir diperbarui: {formatTimeAgo(heroContent?.updatedAt)}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setIsOpen(true)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm cursor-pointer self-end sm:self-auto"
                                >
                                    <Pencil className="size-4" />
                                    <span>Edit Konten Hero</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </AdminPanelLayout>
    );
}