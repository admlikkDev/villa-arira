import { HelpCircle, Plus, Pencil, Trash2, MessageSquareQuote, Loader2, AlertCircle, Edit, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useFetch from "../../hooks/useFetch";
import AdminPanelLayout from "../../views/layouts/AdminPanelLayout";
import GlobalDeleteModal from "./Delete";
import GlobalCreateUpdateModal from "./CreateAndUpdate";
import { useNavigate, useParams } from "react-router-dom";
import { VaultFreeIcons } from "@hugeicons/core-free-icons";
import { GlobalCardList } from "../GlobalUi/CardList";

export default function GlobalDetailCardIndex({ path, title, subtitle, tableHead, fields, initialValues, createButton = true, deleteButton = true, hasId = true, is_param = false, is_detail = false, pathDetail = null, navigatePath = null }) {
    const { get } = useFetch();
    const { idParam } = useParams()
    const navigate = useNavigate()

    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [id, setId] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);


    const fetchDataDetail = async () => {
        const resp = await get(`${path}/${idParam}`);
        if (!resp.status) throw new Error(resp.error);
        return resp.data?.data;
    };


    const { data, isPending, isError, error } = useQuery({
        queryKey: [`admin-${pathDetail}-section`],
        queryFn: is_detail ? fetchDataDetail : null
    });


    if (isPending) {
        return (
            <AdminPanelLayout>
                <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                    <Loader2 className="size-6 animate-spin text-indigo-600" />
                    <p className="text-sm font-medium">Memuat data {title}...</p>
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

    let items = [];
    let itemLists = []
    const rawData = data?.data || data;
    if (Array.isArray(rawData)) {
        items = rawData;
        itemLists = rawData?.lists;
    } else if (typeof rawData === 'object' && rawData !== null) {
        items = [rawData];
        itemLists = rawData?.lists;
    }


    return (
        <AdminPanelLayout>
            <GlobalCreateUpdateModal open={openModal} onOpenChange={setOpenModal} isCreate={isCreate} id={id} idParam={idParam} path={pathDetail} title={title} queryKey={pathDetail} fields={fields} initialValues={initialValues} hasId={hasId} isVillaPackageList={true} />
            <GlobalDeleteModal open={openDeleteModal} onOpenChange={setOpenDeleteModal} id={deleteId} path={pathDetail} queryKey={`admin-${pathDetail}-section`} />

            <div className="space-y-6 max-w-5xl relative">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
                            <MessageSquareQuote className="size-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                {items?.map(item => {
                                    return (
                                        <>
                                            Manajemen {title} ({item?.title})
                                        </>
                                    )
                                })}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {
                            <button
                                type="button"
                                onClick={() => { navigate(-1) }}
                                className="inline-flex items-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm cursor-pointer"
                            >
                                <ArrowLeft className="size-4" />
                                <span>Kembali</span>
                            </button>
                        }
                        {
                            createButton && <button
                                type="button"
                                onClick={() => { setOpenModal(true); setIsCreate(true); setId(null); }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all shadow-sm cursor-pointer"
                            >
                                <Plus className="size-4" />
                                <span>Tambah {title}</span>
                            </button>
                        }
                    </div>
                </div>

                <div className="relative pt-2 pb-2">
                    <div className="absolute -top-6 right-6 text-indigo-500/10 dark:text-indigo-400/10 pointer-events-none select-none z-0">
                        <HelpCircle className="size-36 stroke-[1.5]" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-24 h-24 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:10px_10px] opacity-15 pointer-events-none z-0 rounded-full blur-xs" />

                    <div className="relative z-10 rounded-3xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all backdrop-blur-sm overflow-hidden">


                        <div className="overflow-x-auto w-full grid-cols-3 grid">
                            {
                                itemLists?.map(item => (
                                    <GlobalCardList data={item}/>
                                ))
                            }
                        </div>


                    </div>
                </div>
            </div>
        </AdminPanelLayout>
    );
}