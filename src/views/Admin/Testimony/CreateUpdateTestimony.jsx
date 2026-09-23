import { useState, useEffect } from "react";
import { Pencil, Save, PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";
import { useAuth } from "../../../hooks/useAuth";

export default function CreateUpdateTesimonyModal({ open, onOpenChange, isCreate, id }) {
    const [comment, setComment] = useState("");
    const [star, setStar] = useState("");
    const [username, setUsername] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [errors, setErrors] = useState({});
    const { user } = useAuth();

    const { post, put, get } = useFetch();
    const queryClient = useQueryClient();

    const { data, isLoading: isFetching } = useQuery({
        queryKey: ['testimony-detail', id],
        queryFn: async () => {
            const resp = await get(`testimonies/${id}`);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        enabled: open && !isCreate && !!id
    });

    useEffect(() => {
        if (open) {
            setErrors({});
            if (isCreate) {
                setComment("");
                setUsername("");
                setStar("");
                setSortOrder("");
            } else if (data) {
                const testimonyData = data.data || data;
                setComment(testimonyData.comment || "");
                setUsername(testimonyData.username || "");
                setStar(testimonyData.star ?? "");
                setSortOrder(testimonyData.sort_order ?? "");
            }
        }
    }, [open, isCreate, data]);

    const handleMutationSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-testimony-section'] });
        onOpenChange(false);
    };

    const handleMutationError = (errData) => {
        if (typeof errData === "object" && errData !== null) {
            setErrors(errData);
        } else {
            setErrors({ general: errData.toString() });
        }
    };

    const createMutation = useMutation({
        mutationFn: async (payload) => {
            const resp = await post('testimonies', payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: handleMutationError
    });

    const updateMutation = useMutation({
        mutationFn: async (payload) => {
            const resp = await put(`testimonies/${id}`, payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: handleMutationError
    });

    const submit = (e) => {
        e.preventDefault();
        setErrors({});

        // Pastikan tipe data angka dikonversi dengan benar agar tidak error 500 di server
        const payload = {
            comment,
            star: star === "" ? null : Number(star),
            username,
            sort_order: sortOrder === "" ? null : Number(sortOrder)
        };

        if (isCreate) {
            createMutation.mutate(payload);
        } else {
            updateMutation.mutate(payload);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white dark:bg-zinc-950 border-slate-200/80 dark:border-zinc-800 rounded-3xl shadow-xl">
                <div className="p-6 sm:p-8 space-y-6">
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-slate-100 dark:border-zinc-800 pb-5 text-left">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                            {isCreate ? <PlusCircle className="size-6" /> : <Pencil className="size-6" />}
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                {isCreate ? "Tambah Testimoni Baru" : "Edit Testimoni"}
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                                {isCreate ? "Masukkan ulasan dan informasi testimoni baru." : "Perbarui data testimoni yang sudah ada."}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
                            <Loader2 className="size-6 animate-spin text-indigo-600" />
                            <p className="text-sm font-medium">Memuat data...</p>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-5">
                            {errors.general && (
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
                                    <AlertCircle className="size-5 shrink-0" />
                                    <p className="text-sm font-medium">{errors.general}</p>
                                </div>
                            )}

                            {/* Comment */}
                            <div className="space-y-2">
                                <Label htmlFor="comment" className={`font-medium text-sm ${errors.comment ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                    Komentar
                                </Label>
                                <Input
                                    id="comment"
                                    name="comment"
                                    type="text"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Contoh: Pelayanannya sangat memuaskan!"
                                    disabled={isPending}
                                    className={`h-11 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 disabled:opacity-50 transition-colors ${
                                        errors.comment ? "border-red-300 focus-visible:ring-red-500" : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                    }`}
                                />
                                {errors.comment && (
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                        {Array.isArray(errors.comment) ? errors.comment[0] : errors.comment}
                                    </p>
                                )}
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username" className={`font-medium text-sm ${errors.username ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Contoh: Budi Santoso"
                                    disabled={isPending}
                                    className={`h-11 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 disabled:opacity-50 transition-colors ${
                                        errors.username ? "border-red-300 focus-visible:ring-red-500" : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                    }`}
                                />
                                {errors.username && (
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                        {Array.isArray(errors.username) ? errors.username[0] : errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Star */}
                            <div className="space-y-2">
                                <Label htmlFor="star" className={`font-medium text-sm ${errors.star ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                    Bintang (Star)
                                </Label>
                                <Input
                                    id="star"
                                    name="star"
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={star}
                                    onChange={(e) => setStar(e.target.value)}
                                    placeholder="Contoh: 5"
                                    disabled={isPending}
                                    className={`h-11 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 disabled:opacity-50 transition-colors ${
                                        errors.star ? "border-red-300 focus-visible:ring-red-500" : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                    }`}
                                />
                                {errors.star && (
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                        {Array.isArray(errors.star) ? errors.star[0] : errors.star}
                                    </p>
                                )}
                            </div>

                            {/* Sort Order */}
                            <div className="space-y-2">
                                <Label htmlFor="sortOrder" className={`font-medium text-sm ${errors.sort_order ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                    Urutan (Sort Order)
                                </Label>
                                <Input
                                    id="sortOrder"
                                    name="sort_order"
                                    type="number"
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}
                                    placeholder="Contoh: 1"
                                    disabled={isPending}
                                    className={`h-11 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 disabled:opacity-50 transition-colors ${
                                        errors.sort_order ? "border-red-300 focus-visible:ring-red-500" : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                    }`}
                                />
                                {errors.sort_order && (
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                        {Array.isArray(errors.sort_order) ? errors.sort_order[0] : errors.sort_order}
                                    </p>
                                )}
                            </div>

                            <DialogFooter className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800/80">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isPending}
                                    className="h-11 px-6 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer disabled:opacity-50"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                    <span>{isPending ? "Menyimpan..." : (isCreate ? "Tambah Testimoni" : "Simpan Perubahan")}</span>
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}