import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useFetch from '../../../hooks/useFetch';
import '../../../assets/styles/villa.css';

const firstError = (e) => (Array.isArray(e) ? e[0] : e);

export default function UpdateHeroModal({ open, onOpenChange, data }) {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [errors, setErrors] = useState({});

    const { put } = useFetch();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (open) {
            setTitle(data?.title || '');
            setSubtitle(data?.subtitle || '');
            setErrors({});
        }
    }, [open, data]);

    const mutation = useMutation({
        mutationFn: async (payload) => {
            const resp = await put('hero-section', payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: () => {
            // Hero publik dan pratinjau admin memakai query key berbeda; segarkan keduanya
            queryClient.invalidateQueries({ queryKey: ['hero-section'] });
            queryClient.invalidateQueries({ queryKey: ['admin-hero-section'] });
            onOpenChange(false);
        },
        onError: (errData) => {
            if (typeof errData === 'object' && errData !== null) setErrors(errData);
            else setErrors({ general: errData.toString() });
        },
    });

    const submit = (e) => {
        e.preventDefault();
        setErrors({});
        mutation.mutate({ title, subtitle });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="va-paper va-modal">
                <DialogHeader className="va-modal__head">
                    <DialogTitle className="va-modal__title">Kelola hero section</DialogTitle>
                    <DialogDescription className="va-modal__desc">
                        Atur judul utama dan sub-judul yang tampil di halaman depan website.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="va-modal__body">
                        {errors.general && (
                            <div className="va-alert" role="alert">
                                <AlertCircle size={16} />
                                <span>{errors.general}</span>
                            </div>
                        )}

                        <div className="va-field">
                            <label className="va-label" htmlFor="title">Judul utama</label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                className="va-input"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Villa Arira"
                                disabled={mutation.isPending}
                                aria-invalid={Boolean(errors.title)}
                            />
                            {errors.title && <p className="va-error">{firstError(errors.title)}</p>}
                        </div>

                        <div className="va-field">
                            <label className="va-label" htmlFor="subtitle">Sub-judul (deskripsi singkat)</label>
                            <textarea
                                id="subtitle"
                                name="subtitle"
                                rows={4}
                                className="va-input"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder="Tuliskan deskripsi ringkas untuk bagian hero…"
                                disabled={mutation.isPending}
                                aria-invalid={Boolean(errors.subtitle)}
                            />
                            {errors.subtitle && <p className="va-error">{firstError(errors.subtitle)}</p>}
                        </div>
                    </div>

                    <DialogFooter className="va-modal__foot">
                        <button type="button" className="va-btn va-btn--ghost" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
                            Batal
                        </button>
                        <button type="submit" className="va-btn" disabled={mutation.isPending}>
                            {mutation.isPending ? <Loader2 className="va-spin" size={16} /> : <Save size={16} />}
                            {mutation.isPending ? 'Menyimpan…' : 'Simpan perubahan'}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}