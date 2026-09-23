import { useState, useEffect } from "react";
import { Pencil, Save, PlusCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "../../hooks/useFetch";

export default function GlobalCreateUpdateModal({ open, onOpenChange, isCreate, id, path, title, queryKey, initialValues = {}, fields = [], hasId = true }) {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const { post, put, get } = useFetch();
    const queryClient = useQueryClient();

    const { data, isLoading: isFetching } = useQuery({
        queryKey: [`${path}-detail`, id],
        queryFn: async () => {
            const pathHadId = hasId ? `${path}/${id}` : path
            const resp = await get(pathHadId);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        enabled: open && !isCreate && !!id
    });

    useEffect(() => {
        if (open) {
            setErrors({});
            if (isCreate) {
                const resetValues = {};
                fields.forEach(field => {
                    resetValues[field.name] = field.defaultValue || "";
                });
                setFormData(resetValues);
            } else if (data) {
                const itemData = data?.data?.data || data?.data || data;

                if (itemData && typeof itemData === 'object') {
                    const loadedValues = {};
                    fields.forEach(field => {
                        loadedValues[field.name] = itemData[field.name] ?? "";
                    });
                    setFormData(loadedValues);
                }
            }
        }
    }, [open, isCreate, data, fields]);

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMutationSuccess = () => {
        queryClient.invalidateQueries({ queryKey: [`admin-${path}-section`] });
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
            const resp = await post(path, payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: handleMutationError
    });

    const updateMutation = useMutation({
        mutationFn: async (payload) => {
            const pathHadId = hasId ? `${path}/${id}` : path
            const resp = await put(pathHadId, payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: handleMutationError
    });

    const submit = (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            ...formData,
            sort_order: formData.sort_order !== "" && formData.sort_order !== null
                ? Number(formData.sort_order)
                : null
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
                                {isCreate ? `Tambah ${title} Baru` : `Edit ${title}`}
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                                {isCreate ? `Masukkan data ${title.toLowerCase()} baru ke sistem.` : `Perbarui informasi ${title.toLowerCase()} yang sudah ada.`}
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

                            {fields.map((field) => {
                                if (field.is_update && isCreate) return null;

                                return (
                                    <div key={field.name} className="space-y-2">
                                        <Label htmlFor={field.name} className={`font-medium text-sm ${errors[field.name] ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                            {field.label}
                                        </Label>

                                        {field.type === "textarea" ? (
                                            <textarea
                                                id={field.name}
                                                name={field.name}
                                                rows={field.rows || 4}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                disabled={isPending}
                                                className={`w-full p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 text-sm leading-relaxed resize-none disabled:opacity-50 transition-colors border ${errors[field.name]
                                                    ? "border-red-300 focus:ring-red-500 dark:border-red-900/50"
                                                    : "border-slate-200 dark:border-zinc-800 focus:ring-indigo-600"
                                                    }`}
                                            />
                                        ) : field.type === "file" ? (
                                            <div className="space-y-3">
                                                {/* Pratinjau gambar jika ada URL gambar yang tersimpan dari database */}
                                                {typeof formData[field.name] === "string" && formData[field.name] && (
                                                    <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
                                                        <img
                                                            src={formData[field.name]}
                                                            alt="Preview"
                                                            className="size-12 object-cover rounded-lg border border-slate-200 dark:border-zinc-700"
                                                        />
                                                        <div className="text-xs">
                                                            <p className="font-medium text-slate-700 dark:text-zinc-300">File saat ini</p>
                                                            <p className="text-slate-400 dark:text-zinc-500">Unggah file baru jika ingin mengubahnya.</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="file"
                                                    onChange={(e) => handleChange(field.name, e.target.files[0])}
                                                    disabled={isPending}
                                                    className={`file:mr-4 file:py-1.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-950 dark:file:text-indigo-300 h-11 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 disabled:opacity-50 transition-colors cursor-pointer ${errors[field.name]
                                                        ? "border-red-300 focus-visible:ring-red-500 dark:border-red-900/50"
                                                        : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                                        }`}
                                                />
                                            </div>
                                        ) : (
                                            <Input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type || "text"}
                                                value={formData[field.name] || ""}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                disabled={isPending}
                                                className={`h-11 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 disabled:opacity-50 transition-colors ${errors[field.name]
                                                    ? "border-red-300 focus-visible:ring-red-500 dark:border-red-900/50"
                                                    : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                                    }`}
                                            />
                                        )}

                                        {errors[field.name] && (
                                            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                                {Array.isArray(errors[field.name]) ? errors[field.name][0] : errors[field.name]}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}

                            <DialogFooter className="pt-4 flex items-center justify-end gap-3 sm:gap-3 border-t border-slate-100 dark:border-zinc-800/80">
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
                                    <span>{isPending ? "Menyimpan..." : (isCreate ? `Tambah ${title}` : "Simpan Perubahan")}</span>
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}