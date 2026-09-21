import { Image as ImageIcon, Plus, Pencil, Trash2, Loader2, AlertCircle, Layers } from "lucide-react";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import CreateUpdateGalleryModal from "./CreateUpdateGallery";
import DeleteGalleryModal from "./Delete";

export default function GalleryIndex() {
    const { get } = useFetch();

    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [id, setId] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = async () => {
        const resp = await get('galleries');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-galleries-section'],
        queryFn: fetchData
    });

    if (isLoading) {
        return (
            <AdminPanelLayout>
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                    <Loader2 className="size-6 animate-spin text-indigo-600" />
                    <p className="text-sm font-medium">Memuat data galeri...</p>
                </div>
            </AdminPanelLayout>
        );
    }

    if (isError) {
        return (
            <AdminPanelLayout>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 max-w-5xl">
                    <AlertCircle className="size-5 shrink-0" />
                    <p className="text-sm">Gagal memuat data: {error.message}</p>
                </div>
            </AdminPanelLayout>
        );
    }

    const galleries = data?.data || data || [];

    return (
        <AdminPanelLayout>
            <DeleteGalleryModal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                id={deleteId}
            />
            <CreateUpdateGalleryModal open={openModal} onOpenChange={setOpenModal} isCreate={isCreate} id={id} />
            <div className="space-y-6 max-w-6xl relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
                            <Layers className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Manajemen Galeri
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Kelola koleksi foto, judul, deskripsi, dan urutan tampil galeri website.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => { setOpenModal(true); setIsCreate(true); setId(null); }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Galeri</span>
                    </button>
                </div>

                <div className="relative pt-2 pb-2">
                    <div className="absolute -top-6 right-6 text-indigo-500/10 dark:text-indigo-400/10 pointer-events-none select-none z-0">
                        <ImageIcon className="size-36 stroke-[1.5]" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:10px_10px] opacity-15 pointer-events-none z-0 rounded-full blur-xs" />

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleries.map((item) => (
                            <div
                                key={item.id}
                                className="group rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md"
                            >
                                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-zinc-950">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10">
                                        Urutan: #{item.sort_order}
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-1.5">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight line-clamp-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                            {item.description || "Tidak ada deskripsi."}
                                        </p>
                                    </div>

                                    <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-zinc-800/80">
                                        <button
                                            type="button"
                                            onClick={() => { setOpenModal(true); setId(item.id); setIsCreate(false); }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                        >
                                            <Pencil className="size-3.5" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setDeleteId(item.id);
                                                setOpenDeleteModal(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-zinc-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="size-3.5" />
                                            <span>Hapus</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {galleries.length === 0 && (
                        <div className="relative z-10 rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-12 text-center">
                            <ImageIcon className="size-10 mx-auto text-slate-300 dark:text-zinc-600 mb-3" />
                            <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Belum ada data galeri</p>
                            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Klik tombol tambah di atas untuk mengunggah foto baru.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminPanelLayout>
    );
}