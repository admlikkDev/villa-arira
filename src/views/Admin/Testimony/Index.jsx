import { HelpCircle, Plus, Pencil, Trash2, MessageSquareQuote, Loader2, AlertCircle } from "lucide-react";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import CreateUpdateTesimonyModal from "./CreateUpdateTestimony";
import GlobalDeleteModal from "../../../components/modal/Delete";
// import CreateUpdateFaqModal from "./CreateOrUpdate";
// import DeleteFaqModal from "./Delete";
export default function TestimonyIndex() {
    const { get } = useFetch();

    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [id, setId] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchData = async () => {
        const resp = await get('testimonies');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-testimony-section'],
        queryFn: fetchData
    });

    if (isLoading) {
        return (
            <AdminPanelLayout>
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                    <Loader2 className="size-6 animate-spin text-indigo-600" />
                    <p className="text-sm font-medium">Memuat data FAQ...</p>
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

    const testimonies = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

    return (
        <AdminPanelLayout>
            <CreateUpdateTesimonyModal open={openModal} onOpenChange={setOpenModal} isCreate={isCreate} id={id} />
            <GlobalDeleteModal open={openDeleteModal} onOpenChange={setOpenDeleteModal} id={deleteId} path={'testimonies'} queryKey={'admin-testimony-section'}/>
            {/* <DeleteFaqModal open={openDeleteModal} onOpenChange={setOpenDeleteModal} id={deleteId} /> */}

            <div className="space-y-6 max-w-5xl relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
                            <MessageSquareQuote className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Manajemen Testimonies
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Kelola daftar testimoni yang diberikan.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => { setOpenModal(true); setIsCreate(true); setId(null); }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Tambah Testimony</span>
                    </button>
                </div>

                <div className="relative pt-2 pb-2">
                    <div className="absolute -top-6 right-6 text-indigo-500/10 dark:text-indigo-400/10 pointer-events-none select-none z-0">
                        <HelpCircle className="size-36 stroke-[1.5]" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:10px_10px] opacity-15 pointer-events-none z-0 rounded-full blur-xs" />

                    <div className="relative z-10 rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all backdrop-blur-sm overflow-hidden">

                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-zinc-950/50 border-b border-slate-100 dark:border-zinc-800">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider w-16 text-center">
                                            No
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider w-1/3">
                                            Comment
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider w-1/2">
                                            Username
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider w-1/3">
                                            Star
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider w-1/3">
                                            Order
                                        </th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-right w-28">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                                    {testimonies.map((testimonie, index) => (
                                        <tr
                                            key={testimonie.id}
                                            className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors group"
                                        >
                                            <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-zinc-400 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                                                    {testimonie.comment}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">
                                                    {testimonie.username}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">
                                                    {testimonie.star}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-slate-600 dark:text-zinc-400 line-clamp-2">
                                                    {testimonie.sort_order}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setOpenModal(true); setId(testimonie.id); setIsCreate(false); }}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setDeleteId(testimonie.id); setOpenDeleteModal(true); }}
                                                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors cursor-pointer"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {testimonies.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <HelpCircle className="size-8 mx-auto text-slate-300 dark:text-zinc-600 mb-3" />
                                                <p className="text-sm font-medium text-slate-500 dark:text-zinc-400">Belum ada data testimonie</p>
                                                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">Klik tombol tambah untuk membuat FAQ baru.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AdminPanelLayout>
    );
}