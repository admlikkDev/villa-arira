import { Book, Check, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import GlobalCreateUpdateModal from "../modal/CreateAndUpdate"
import GlobalDeleteModal from "../modal/Delete"

const formatRupiah = (value) => {
    const number = Number(value)
    if (value === null || value === undefined || value === "" || Number.isNaN(number)) return null
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(number)
}

export function GlobalCardList({ data = null, path, title, fields, initialValues, hasId }) {
    const navigate = useNavigate()

    // Hooks harus dipanggil sebelum early return
    const [openModal, setOpenModal] = useState(false)
    const [isCreate, setIsCreate] = useState(false)
    const [id, setId] = useState(null)

    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const [deleteId, setDeleteId] = useState(null)

    if (!data) return null

    const price = formatRupiah(data?.price)
    const lists = Array.isArray(data?.lists) ? data.lists : []

    return (
        <Card className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg">
            <GlobalCreateUpdateModal
                open={openModal}
                onOpenChange={setOpenModal}
                isCreate={isCreate}
                id={id}
                path={path}
                title={title}
                queryKey={path}
                fields={fields}
                initialValues={initialValues}
                hasId={hasId}
            />
            <GlobalDeleteModal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                id={deleteId}
                path={path}
                queryKey={`admin-${path}-section`}
            />

            {/* Garis aksen di sisi atas */}
            <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400" />

            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold leading-tight tracking-tight text-slate-900">
                    {data?.title ?? "Untitled"}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {data?.subtitle ?? "Tidak ada deskripsi"}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 pb-4">
                {/* Harga */}
                <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-inset ring-slate-100">
                    <p className="text-xs font-medium text-slate-500">Harga</p>
                    {price ? (
                        <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-blue-700">
                            {price}
                        </p>
                    ) : (
                        <p className="mt-0.5 text-sm italic text-slate-400">Harga belum diatur</p>
                    )}
                </div>

                <ul className="flex max-h-25 flex-col gap-2 overflow-y-auto pr-2 text-sm [scrollbar-width:thin] [scrollbar-color:theme(colors.slate.300)_transparent]">
                    {lists.length > 0 ? (
                        lists.map((item, index) => (
                            <li key={index} className="flex items-start gap-2.5 text-slate-700">
                                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                    <Check className="h-3 w-3" strokeWidth={3} />
                                </span>
                                <span className="leading-snug">{item?.text ?? "-"}</span>
                            </li>
                        ))
                    ) : (
                        <li className="text-xs italic text-slate-400">Tidak ada paket</li>
                    )}
                </ul>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5 border-t border-slate-100 bg-slate-50/60 pt-4">
                <div className="flex w-full gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-1/2 border-slate-300 font-medium text-slate-700 hover:bg-white hover:text-blue-700"
                        onClick={() => {
                            setOpenModal(true)
                            setId(data?.id)
                            setIsCreate(false)
                        }}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        type="button"
                        className="w-1/2 bg-blue-600 font-medium text-white hover:bg-blue-700"
                        onClick={() => navigate(`/admin/package/${data?.id}`)}
                    >
                        <Book className="mr-2 h-4 w-4" />
                        Detail
                    </Button>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    className="w-full font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                        setDeleteId(data?.id)
                        setOpenDeleteModal(true)
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                </Button>
            </CardFooter>
        </Card>
    )
}