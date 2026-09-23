import { useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
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
import useFetch from "../../hooks/useFetch";

export default function GlobalDeleteModal({ open, onOpenChange, id, queryKey, path }) {
    const { destroy } = useFetch(); 
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState("");

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const resp = await destroy(`${path}/${id}`);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            onOpenChange(false);
            setErrorMsg("");
        },
        onError: (err) => {
            setErrorMsg(err.toString() || "Gagal menghapus data.");
        }
    });

    const handleDelete = (e) => {
        e.preventDefault();
        setErrorMsg("");
        if (id) {
            deleteMutation.mutate();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-zinc-950 border-slate-200/80 dark:border-zinc-800 rounded-3xl shadow-xl">
                <div className="p-6 sm:p-8 space-y-6">
                    <DialogHeader className="flex flex-col items-center text-center gap-2 space-y-0">
                        <div className="flex size-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/40 mb-2">
                            <AlertTriangle className="size-7" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                            Hapus Data?
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 dark:text-zinc-400">
                            Tindakan ini tidak dapat dibatalkan. Data pertanyaan dan jawaban ini akan dihapus secara permanen dari sistem.
                        </DialogDescription>
                    </DialogHeader>

                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium text-center">
                            {errorMsg}
                        </div>
                    )}

                    <DialogFooter className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3 sm:gap-3 pt-4 w-full">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={deleteMutation.isPending}
                            className="h-11 px-6 rounded-xl border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium transition-all shadow-sm cursor-pointer flex items-center gap-2 w-full sm:w-auto"
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                            <span>{deleteMutation.isPending ? "Menghapus..." : "Ya, Hapus Data"}</span>
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}