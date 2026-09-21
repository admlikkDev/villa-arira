import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../hooks/useAuth"; // Sesuaikan path import useAuth jika berbeda

export default function DeleteGalleryModal({ open, onOpenChange, id }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const baseUrl = import.meta.env.VITE_APP_URL || import.meta.env.VITE_URL_APP;
    const [generalError, setGeneralError] = useState("");

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const resp = await axios.delete(`${baseUrl}/galleries/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': user?.token ? `Bearer ${user.token}` : ''
                }
            });
            return resp.data;
        },
        onSuccess: () => {
            // Segarkan data galeri setelah berhasil dihapus
            queryClient.invalidateQueries({ queryKey: ['admin-galleries-section'] });
            onOpenChange(false);
        },
        onError: (err) => {
            const msg = err.response?.data?.message || err.message || 'Gagal menghapus data galeri';
            setGeneralError(msg);
        }
    });

    const handleDelete = () => {
        setGeneralError("");
        deleteMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-zinc-950 border-slate-200/80 dark:border-zinc-800 rounded-3xl shadow-2xl">
                <div className="p-6 sm:p-8 space-y-6">
                    {/* Header Modal */}
                    <DialogHeader className="flex flex-row items-center gap-4 space-y-0 text-left">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40 shadow-xs">
                            <AlertTriangle className="size-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                                Hapus Galeri
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                                Apakah kamu yakin ingin menghapus foto galeri ini? Tindakan ini tidak dapat dibatalkan.
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    {/* Error Alert jika Gagal */}
                    {generalError && (
                        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-medium">
                            {generalError}
                        </div>
                    )}

                    {/* Footer Buttons */}
                    <DialogFooter className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={deleteMutation.isPending}
                            className="h-11 px-5 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer transition-all"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="h-11 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-sm cursor-pointer flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {deleteMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                            <span>{deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus"}</span>
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}