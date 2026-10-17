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
import axios from 'axios';
import { useAuth } from '../../../hooks/useAuth'; // Sesuaikan path import useAuth jika berbeda
import '../../../assets/styles/villa.css';

export default function DeleteGalleryModal({ open, onOpenChange, id }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const baseUrl = import.meta.env.VITE_APP_URL || import.meta.env.VITE_URL_APP;
    const [generalError, setGeneralError] = useState('');

    const deleteMutation = useMutation({
        mutationFn: async () => {
            const resp = await axios.delete(`${baseUrl}/galleries/${id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: user?.token ? `Bearer ${user.token}` : '',
                },
            });
            return resp.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-galleries-section'] });
            onOpenChange(false);
        },
        onError: (err) => {
            setGeneralError(err.response?.data?.message || err.message || 'Gagal menghapus data galeri');
        },
    });

    const handleDelete = () => {
        setGeneralError('');
        deleteMutation.mutate();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="va-paper va-modal va-modal--sm">
                <DialogHeader className="va-modal__head">
                    <DialogTitle className="va-modal__title">Hapus galeri</DialogTitle>
                    <DialogDescription className="va-modal__desc">
                        Foto galeri ini akan dihapus permanen dan tidak dapat dikembalikan.
                    </DialogDescription>
                </DialogHeader>

                {generalError && (
                    <div className="va-modal__body">
                        <div className="va-alert" role="alert">
                            <AlertCircle size={16} />
                            <span>{generalError}</span>
                        </div>
                    </div>
                )}

                <DialogFooter className="va-modal__foot">
                    <button type="button" className="va-btn va-btn--ghost" onClick={() => onOpenChange(false)} disabled={deleteMutation.isPending}>
                        Batal
                    </button>
                    <button type="button" className="va-btn" onClick={handleDelete} disabled={deleteMutation.isPending}>
                        {deleteMutation.isPending ? <Loader2 className="va-spin" size={16} /> : <Trash2 size={16} />}
                        {deleteMutation.isPending ? 'Menghapus…' : 'Ya, hapus'}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}