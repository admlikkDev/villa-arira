import { AlertCircle, Eye, ImageOff, Inbox, MessageSquareQuote, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import AdminPanelLayout from "../../views/layouts/AdminPanelLayout";
import GlobalDeleteModal from "./Delete";
import GlobalCreateUpdateModal from "./CreateAndUpdate";
import { GlobalCardList } from "../GlobalUi/CardList";
import MasterIcon from "../icons/MasterIcon";

const formatRupiah = (value) => {
    const number = Number(value);
    if (value === null || value === undefined || value === "" || Number.isNaN(number)) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);
};

const iconBtn = "cursor-pointer rounded-lg p-2 text-slate-400 transition-colors dark:text-zinc-500";

function EmptyState({ title }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
                <Inbox className="size-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">Belum ada data {title}</p>
            <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-zinc-400">Tekan tombol tambah untuk membuat {title} pertama.</p>
        </div>
    );
}

export default function GlobalIndex({
    path, title, subtitle, tableHead, fields, initialValues,
    createButton = true, deleteButton = true, hasId = true, navigatePath = null, isCard = false,
    is_paginate = false
}) {
    const { get } = useFetch();
    const navigate = useNavigate();
    const [page, setPage] = useState(1)

    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [id, setId] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const { data, isPending, isError, error } = useQuery({
        queryKey: [`admin-${path}-section`, page],
        queryFn: async () => {
            const resp = await get(is_paginate ? `${path}?page=${String(page)}&size=6` : path);
            if (!resp.status) throw new Error(resp.error);
            return resp.data;
        },
    });

    let items = [];
    let itemPaginates;
    if (data) {
        const rawData = data?.data || data;
        if (Array.isArray(rawData)) { items = rawData, itemPaginates = data?.pagination }
        else if (typeof rawData === "object" && rawData !== null) { items = [rawData], itemPaginates = [data?.pagination] };
    }


    const visibleFields = (fields ?? []).filter((f) => !f.hide_in_table);

    const renderCell = (field, value) => {
        if (field.is_image) {
            return value ? (
                <img src={value} alt={field.label ?? field.name} className="size-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-zinc-700" />
            ) : (
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-300 dark:bg-zinc-800"><ImageOff className="size-5" /></div>
            );
        }
        if (field.name === "price") {
            return <span className="text-sm font-bold tabular-nums text-indigo-700 dark:text-indigo-300">{formatRupiah(value)}</span>;
        }

        if (field.name === "logo" || field.name === "icon" || field?.logo) {
            return <MasterIcon data={value} />;
        }

        return <p className="line-clamp-2 max-w-xs text-sm text-slate-700 dark:text-zinc-200">{value ?? "-"}</p>;
    };

    return (
        <AdminPanelLayout>
            <GlobalCreateUpdateModal open={openModal} onOpenChange={setOpenModal} isCreate={isCreate} id={id} path={path} title={title} queryKey={path} fields={fields} initialValues={initialValues} hasId={hasId} />
            <GlobalDeleteModal open={openDeleteModal} onOpenChange={setOpenDeleteModal} id={deleteId} path={path} queryKey={`admin-${path}-section`} />

            <div className="max-w-6xl space-y-8">
                <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600 dark:border-indigo-900/40 dark:bg-indigo-950/60 dark:text-indigo-400">
                            <MessageSquareQuote className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">Manajemen {title}</h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                {subtitle}
                                {!isPending && !isError && <span className="ml-2 font-semibold text-indigo-600 dark:text-indigo-400">{items.length} data</span>}
                            </p>
                        </div>
                    </div>
                    {createButton && (
                        <button
                            type="button"
                            onClick={() => { setOpenModal(true); setIsCreate(true); setId(null); }}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            <Plus className="size-4" />
                            Tambah {title}
                        </button>
                    )}
                </div>

                {isError ? (
                    <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                        <AlertCircle className="size-5 shrink-0" />
                        <p className="text-sm">Gagal memuat data: {error.message}</p>
                    </div>
                ) : isPending ? (
                    <div className={isCard ? "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
                        {[...Array(isCard ? 3 : 5)].map((_, i) => (
                            <div key={i} className={`animate-pulse rounded-2xl bg-slate-100 dark:bg-zinc-800 ${isCard ? "h-96" : "h-14"}`} />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700"><EmptyState title={title} /></div>
                ) : isCard ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item, index) => (
                            <GlobalCardList key={item?.id || index} data={item} path={path} title={title} fields={fields} initialValues={initialValues} hasId={hasId} />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead>
                                    <tr className="border-b-2 border-slate-900 dark:border-zinc-600">
                                        <th className="w-16 px-6 py-4 text-center text-sm font-semibold text-slate-900 dark:text-zinc-100">No</th>
                                        {tableHead?.map((head, i) => (
                                            <th key={i} className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-zinc-100">{head}</th>
                                        ))}
                                        <th className="w-32 px-6 py-4 text-right text-sm font-semibold text-slate-900 dark:text-zinc-100">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                                    {items.map((item, index) => (
                                        <tr key={item.id ?? index} className="group transition-colors hover:bg-indigo-50/50 dark:hover:bg-zinc-800/40">
                                            <td className="px-6 py-4 text-center text-sm tabular-nums text-slate-400">{index + 1}</td>
                                            {visibleFields.map((field, i) => (
                                                <td key={i} className="px-6 py-4 align-middle">{renderCell(field, item[field.name])}</td>
                                            ))}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-1 lg:opacity-0 lg:transition-opacity lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
                                                    <button type="button" title="Edit" aria-label="Edit" onClick={() => { setOpenModal(true); setId(item.id); setIsCreate(false); }} className={`${iconBtn} hover:bg-indigo-50 hover:text-indigo-700`}>
                                                        <Pencil className="size-4" />
                                                    </button>
                                                    {navigatePath && (
                                                        <button type="button" title="Detail" aria-label="Detail" onClick={() => navigate(`${navigatePath}/${item?.id}`)} className={`${iconBtn} hover:bg-slate-100 hover:text-slate-800`}>
                                                            <Eye className="size-4" />
                                                        </button>
                                                    )}
                                                    {deleteButton && (
                                                        <button type="button" title="Hapus" aria-label="Hapus" onClick={() => { setDeleteId(item.id); setOpenDeleteModal(true); }} className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}>
                                                            <Trash2 className="size-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <div className="flex justify-end gap-2">
                    {Array.from({ length: itemPaginates?.total_pages || 0 }).map((_, index) => {
                        const pageNumber = index + 1
                        const isActive = page === pageNumber

                        return (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setPage(pageNumber)}
                                className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 
                ${isActive ? "bg-indigo-800 ring-2 ring-indigo-400 ring-offset-2 dark:ring-offset-zinc-900" : "bg-indigo-600 hover:bg-indigo-700"}
                `}
                            >
                                {pageNumber}
                            </button>
                        )
                    })}
                </div>
            </div>
        </AdminPanelLayout>
    );
}