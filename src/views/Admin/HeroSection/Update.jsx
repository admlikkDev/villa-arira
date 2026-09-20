import { useState, useEffect } from "react";
import { LayoutTemplate, Save, Loader2, AlertCircle } from "lucide-react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "../../../hooks/useFetch";

export default function UpdateHeroModal({ open, onOpenChange, data }) {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    
    const [errors, setErrors] = useState({});
    
    const { put } = useFetch();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (open) {
            setTitle(data?.title || "");
            setSubtitle(data?.subtitle || "");
            setErrors({}); 
        }
    }, [open, data]);

    const mutation = useMutation({
        mutationFn: async (payload) => {
            const resp = await put("hero-section", payload);
            if (!resp.status) {
                throw resp.error;
            }
            return resp.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hero-section"] });
            onOpenChange(false);
        },
        onError: (errData) => {
            if (typeof errData === "object" && errData !== null) {
                setErrors(errData);
            } else {
                setErrors({ general: errData.toString() });
            }
        }
    });

    const submit = (e) => {
        e.preventDefault();
        setErrors({}); 
        mutation.mutate({ title, subtitle });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-white dark:bg-zinc-950 border-slate-200/80 dark:border-zinc-800 rounded-3xl shadow-xl">
                <div className="p-6 sm:p-8 space-y-6">
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0 border-b border-slate-100 dark:border-zinc-800 pb-5 text-left">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                            <LayoutTemplate className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Kelola Hero Section
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                                Atur judul utama dan sub-judul yang tampil di halaman depan website.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <form onSubmit={submit} className="space-y-5">
                        {errors.general && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
                                <AlertCircle className="size-5 shrink-0" />
                                <p className="text-sm font-medium">{errors.general}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="title" className={`font-medium text-sm ${errors.title ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                Judul Utama (Title)
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Villa Arira"
                                disabled={mutation.isPending}
                                className={`h-11 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 disabled:opacity-50 transition-colors ${
                                    errors.title 
                                    ? "border-red-300 focus-visible:ring-red-500 dark:border-red-900/50" 
                                    : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                }`}
                            />
                            {errors.title && (
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    {Array.isArray(errors.title) ? errors.title[0] : errors.title}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subtitle" className={`font-medium text-sm ${errors.subtitle ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                Sub-Judul (Subtitle / Deskripsi Singkat)
                            </Label>
                            <textarea
                                id="subtitle"
                                name="subtitle"
                                rows={4}
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder="Tuliskan deskripsi ringkas untuk bagian hero..."
                                disabled={mutation.isPending}
                                className={`w-full p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 text-sm leading-relaxed resize-none disabled:opacity-50 transition-colors border ${
                                    errors.subtitle 
                                    ? "border-red-300 focus:ring-red-500 dark:border-red-900/50" 
                                    : "border-slate-200 dark:border-zinc-800 focus:ring-indigo-600"
                                }`}
                            />
                            {errors.subtitle && (
                                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    {Array.isArray(errors.subtitle) ? errors.subtitle[0] : errors.subtitle}
                                </p>
                            )}
                        </div>

                        <DialogFooter className="pt-4 flex items-center justify-end gap-3 sm:gap-3 border-t border-slate-100 dark:border-zinc-800/80">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={mutation.isPending}
                                className="h-11 px-6 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer disabled:opacity-50"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={mutation.isPending}
                                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {mutation.isPending ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Save className="size-4" />
                                )}
                                <span>{mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}</span>
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}