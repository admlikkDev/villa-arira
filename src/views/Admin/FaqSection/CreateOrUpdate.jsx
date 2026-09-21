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

export default function CreateUpdateFaqModal({ open, onOpenChange, isCreate, id }) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const [errors, setErrors] = useState({});
    
    const { post, put, get } = useFetch();
    const queryClient = useQueryClient();

    const { data, isLoading: isFetching } = useQuery({
        queryKey: ['faq-detail', id],
        queryFn: async () => {
            const resp = await get(`faqs/${id}`);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        enabled: open && !isCreate && !!id
    });

    useEffect(() => {
        if (open) {
            setErrors({});
            if (isCreate) {
                setQuestion("");
                setAnswer("");
                setSortOrder("");
            } else if (data) {
                const faqData = data.data || data;
                setQuestion(faqData.question || "");
                setAnswer(faqData.answer || "");
                setSortOrder(faqData.sort_order ?? "");
            }
        }
    }, [open, isCreate, data]);

    const handleMutationSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-faqs-section'] });
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
            const resp = await post('faqs', payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: handleMutationError
    });

    const updateMutation = useMutation({
        mutationFn: async (payload) => {
            const resp = await put(`faqs/${id}`, payload);
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
            question, 
            answer,
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
                                {isCreate ? "Tambah FAQ Baru" : "Edit FAQ"} 
                            </DialogTitle>
                            <DialogDescription className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
                                {isCreate ? "Masukkan pertanyaan yang sering diajukan beserta jawabannya." : "Perbarui pertanyaan atau jawaban FAQ yang sudah ada."}
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

                            <div className="space-y-2">
                                <Label htmlFor="question" className={`font-medium text-sm ${errors.question ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                    Pertanyaan
                                </Label>
                                <Input
                                    id="question"
                                    name="question"
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Contoh: Jam berapa standar waktu check-in?"
                                    disabled={isPending}
                                    className={`h-11 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 disabled:opacity-50 transition-colors ${
                                        errors.question 
                                        ? "border-red-300 focus-visible:ring-red-500 dark:border-red-900/50" 
                                        : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                    }`}
                                />
                                {errors.question && (
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                        {Array.isArray(errors.question) ? errors.question[0] : errors.question}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="answer" className={`font-medium text-sm ${errors.answer ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-zinc-300"}`}>
                                    Jawaban
                                </Label>
                                <textarea
                                    id="answer"
                                    name="answer"
                                    rows={5}
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Tuliskan jawaban secara lengkap dan jelas..."
                                    disabled={isPending}
                                    className={`w-full p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 text-sm leading-relaxed resize-none disabled:opacity-50 transition-colors border ${
                                        errors.answer 
                                        ? "border-red-300 focus:ring-red-500 dark:border-red-900/50" 
                                        : "border-slate-200 dark:border-zinc-800 focus:ring-indigo-600"
                                    }`}
                                />
                                {errors.answer && (
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                        {Array.isArray(errors.answer) ? errors.answer[0] : errors.answer}
                                    </p>
                                )}
                            </div>

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
                                        errors.sort_order 
                                        ? "border-red-300 focus-visible:ring-red-500 dark:border-red-900/50" 
                                        : "border-slate-200 dark:border-zinc-800 focus-visible:ring-indigo-600"
                                    }`}
                                />
                                {errors.sort_order && (
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                                        {Array.isArray(errors.sort_order) ? errors.sort_order[0] : errors.sort_order}
                                    </p>
                                )}
                            </div>

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
                                    <span>{isPending ? "Menyimpan..." : (isCreate ? "Tambah FAQ" : "Simpan Perubahan")}</span>
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}