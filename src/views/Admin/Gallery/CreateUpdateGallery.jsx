import { useState, useEffect } from "react";
import { Image as ImageIcon, PlusCircle, Pencil, Save, Loader2, AlertCircle, UploadCloud, X } from "lucide-react";
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
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth"; // Sesuaikan path import useAuth jika berbeda

export default function CreateUpdateGalleryModal({ open, onOpenChange, isCreate, id }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const baseUrl = import.meta.env.VITE_APP_URL || import.meta.env.VITE_URL_APP;

    const formatAxiosError = (err) => {
        if (!err.response) return { general: 'Network error' };
        const responseData = err.response.data;
        if (responseData?.errors) {
            const formattedErrors = {};
            for (const [key, value] of Object.entries(responseData.errors)) {
                formattedErrors[key] = Array.isArray(value) ? value[0] : value;
            }
            return formattedErrors;
        }
        if (responseData?.message) {
            return { general: responseData.message };
        }
        return { general: err.response.statusText || 'Terjadi kesalahan pada server' };
    };

    const { data, isLoading: isFetching } = useQuery({
        queryKey: ['gallery-detail', id],
        queryFn: async () => {
            const resp = await axios.get(`${baseUrl}/galleries/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user?.token ? `Bearer ${user.token}` : ''
                }
            });
            return resp.data;
        },
        enabled: open && !isCreate && !!id
    });

    useEffect(() => {
        if (open) {
            setErrors({});
            setImageFile(null);
            if (isCreate) {
                setTitle("");
                setDescription("");
                setSortOrder("");
                setImagePreview(null);
            } else if (data) {
                const galleryData = data.data || data;
                setTitle(galleryData.title || "");
                setDescription(galleryData.description || "");
                setSortOrder(galleryData.sort_order ?? "");
                setImagePreview(galleryData.image || null);
            }
        }
    }, [open, isCreate, data]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMutationSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-galleries-section'] });
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
        mutationFn: async (formData) => {
            const resp = await axios.post(`${baseUrl}/galleries`, formData, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user?.token ? `Bearer ${user.token}` : ''
                }
            });
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: (err) => handleMutationError(formatAxiosError(err))
    });

    const updateMutation = useMutation({
        mutationFn: async (formData) => {
            const resp = await axios.put(`${baseUrl}/galleries/${id}`, formData, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user?.token ? `Bearer ${user.token}` : ''
                }
            });
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: (err) => handleMutationError(formatAxiosError(err))
    });

    const submit = (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        if (sortOrder !== "") {
            formData.append("sort_order", Number(sortOrder));
        }
        if (imageFile) {
            formData.append("image", imageFile);
        }

        if (isCreate) {
            createMutation.mutate(formData);
        } else {
            updateMutation.mutate(formData);
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result); 
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white dark:bg-zinc-950 border-slate-200/80 dark:border-zinc-800 rounded-3xl shadow-2xl">
                <div className="p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">

                    {/* Header Modal */}
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-slate-100 dark:border-zinc-800/80 pb-5 text-left">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-xs">
                            {isCreate ? <PlusCircle className="size-6" /> : <Pencil className="size-6" />}
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                {isCreate ? "Tambah Galeri Baru" : "Edit Galeri"}
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                                {isCreate ? "Unggah foto baru beserta judul dan deskripsinya." : "Perbarui informasi atau foto galeri yang sudah ada."}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    {isFetching ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                            <Loader2 className="size-6 animate-spin text-indigo-600" />
                            <p className="text-sm font-medium">Memuat data galeri...</p>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="space-y-5">
                            {errors.general && (
                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
                                    <AlertCircle className="size-5 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium">{errors.general}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2 space-y-2">
                                    <Label htmlFor="title" className={`font-medium text-sm ${errors.title ? "text-red-600" : "text-slate-700 dark:text-zinc-300"}`}>
                                        Judul Galeri <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Contoh: Suasana Ruang Keluarga"
                                        disabled={isPending}
                                        className={`h-11 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 transition-all ${errors.title ? "border-red-300 focus-visible:ring-red-500" : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                            }`}
                                    />
                                    {errors.title && <p className="text-xs text-red-600 font-medium">{Array.isArray(errors.title) ? errors.title[0] : errors.title}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="sort_order" className={`font-medium text-sm ${errors.sort_order ? "text-red-600" : "text-slate-700 dark:text-zinc-300"}`}>
                                        Urutan
                                    </Label>
                                    <Input
                                        id="sort_order"
                                        name="sort_order"
                                        type="number"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        placeholder="1, 2..."
                                        disabled={isPending}
                                        className={`h-11 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 transition-all ${errors.sort_order ? "border-red-300 focus-visible:ring-red-500" : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                            }`}
                                    />
                                    {errors.sort_order && <p className="text-xs text-red-600 font-medium">{Array.isArray(errors.sort_order) ? errors.sort_order[0] : errors.sort_order}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className={`font-medium text-sm ${errors.description ? "text-red-600" : "text-slate-700 dark:text-zinc-300"}`}>
                                    Deskripsi Singkat
                                </Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tuliskan keterangan mengenai foto ini..."
                                    disabled={isPending}
                                    className={`w-full p-3.5 rounded-xl bg-slate-50/50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 text-sm leading-relaxed resize-none transition-all border ${errors.description ? "border-red-300 focus:ring-red-500" : "border-slate-200 dark:border-zinc-800 focus:ring-indigo-600"
                                        }`}
                                />
                                {errors.description && <p className="text-xs text-red-600 font-medium">{Array.isArray(errors.description) ? errors.description[0] : errors.description}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label className={`font-medium text-sm ${errors.image ? "text-red-600" : "text-slate-700 dark:text-zinc-300"}`}>
                                    File Gambar <span className="text-red-500">*</span>
                                </Label>

                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={`relative group rounded-2xl border-2 border-dashed transition-all p-4 ${isDragging
                                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01]"
                                        : "border-slate-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-zinc-900/30"
                                        }`}
                                >
                                    {imagePreview ? (
                                        <div className="flex items-center gap-4">
                                            <div className="relative size-28 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 shrink-0 shadow-sm">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Gambar Terpilih</p>
                                                <p className="text-[11px] text-slate-500 dark:text-zinc-400">Seret foto baru ke sini atau klik tombol di bawah untuk mengganti.</p>
                                                <div className="pt-2">
                                                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 cursor-pointer shadow-2xs transition-all">
                                                        <span>Ganti Foto</span>
                                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isPending} />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center py-6 cursor-pointer space-y-2">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-2xs">
                                                <UploadCloud className="size-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                                                    Seret & letakkan foto di sini, <span className="text-indigo-600 dark:text-indigo-400">atau klik</span>
                                                </p>
                                                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">PNG, JPG, atau WEBP</p>
                                            </div>
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={isPending} />
                                        </label>
                                    )}
                                </div>
                                {errors.image && <p className="text-xs text-red-600 font-medium">{Array.isArray(errors.image) ? errors.image[0] : errors.image}</p>}
                            </div>

                            <DialogFooter className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-zinc-800/80">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isPending}
                                    className="h-11 px-6 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                                    <span>{isPending ? "Menyimpan..." : (isCreate ? "Tambah Galeri" : "Simpan Perubahan")}</span>
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}