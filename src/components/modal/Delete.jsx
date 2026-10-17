import { useState } from 'react';
import { Trash2, Loader2, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFetch from '../../hooks/useFetch';
import '../../assets/styles/villa.css';

export default function GlobalDeleteModal({ open, onOpenChange, id, queryKey, path }) {
    const { destroy } = useFetch();
    const queryClient = useQueryClient();
    const [errorMsg, setErrorMsg] = useState('');

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const resp = await destroy(`${path}/${id}`);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            onOpenChange(false);
            setErrorMsg('');
        },
        onError: (err) => {
            setErrorMsg(err.toString() || 'Gagal menghapus data.');
        },
    });

    const handleDelete = (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (id) deleteMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="va-paper va-modal va-modal--sm">
                <DialogHeader className="va-modal__head">
                    <DialogTitle className="va-modal__title">Hapus data?</DialogTitle>
                    <DialogDescription className="va-modal__desc">
                        Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen dari sistem.
                    </DialogDescription>
                </DialogHeader>

                {errorMsg && (
                    <div className="va-modal__body">
                        <div className="va-alert" role="alert">
                            <AlertCircle size={16} />
                            <span>{errorMsg}</span>
                        </div>
                    </div>
                )}

                <DialogFooter className="va-modal__foot">
                    <button type="button" className="va-btn va-btn--ghost" onClick={() => onOpenChange(false)} disabled={deleteMutation.isPending}>
                        Batal
                    </button>
                    <button type="button" className="va-btn" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? <Loader2 className="va-spin" size={16} /> : <Trash2 size={16} />}
                        {deleteMutation.isPending ? 'Menghapus…' : 'Ya, hapus data'}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}