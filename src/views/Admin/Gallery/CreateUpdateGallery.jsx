import { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle, UploadCloud } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../../../hooks/useAuth'; // Sesuaikan path import useAuth jika berbeda
import '../../../assets/styles/villa.css';

const firstError = (e) => (Array.isArray(e) ? e[0] : e);

export default function CreateUpdateGalleryModal({ open, onOpenChange, isCreate, id }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);

    const { user } = useAuth();
    const queryClient = useQueryClient();
    const baseUrl = import.meta.env.VITE_APP_URL || import.meta.env.VITE_URL_APP;
    const authHeaders = {
        Accept: 'application/json',
        Authorization: user?.token ? `Bearer ${user.token}` : '',
    };

    const formatAxiosError = (err) => {
        if (!err.response) return { general: 'Network error' };
        const responseData = err.response.data;
        if (responseData?.errors) {
            const formatted = {};
            for (const [key, value] of Object.entries(responseData.errors)) {
                formatted[key] = Array.isArray(value) ? value[0] : value;
            }
            return formatted;
        }
        if (responseData?.message) return { general: responseData.message };
        return { general: err.response.statusText || 'Terjadi kesalahan pada server' };
    };

    const { data, isLoading: isFetching } = useQuery({
        queryKey: ['gallery-detail', id],
        queryFn: async () => {
            const resp = await axios.get(`${baseUrl}/galleries/${id}`, { headers: authHeaders });
            return resp.data;
        },
        enabled: open && !isCreate && !!id,
    });

    useEffect(() => {
        if (open) {
            setErrors({});
            setImageFile(null);
            if (isCreate) {
                setTitle('');
                setDescription('');
                setSortOrder('');
                setImagePreview(null);
            } else if (data) {
                const galleryData = data.data || data;
                setTitle(galleryData.title || '');
                setDescription(galleryData.description || '');
                setSortOrder(galleryData.sort_order ?? '');
                setImagePreview(galleryData.image || null);
            }
        }
    }, [open, isCreate, data]);

    const pickFile = (file) => {
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleMutationSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['admin-galleries-section'] });
        onOpenChange(false);
    };

    const handleMutationError = (errData) => {
        if (typeof errData === 'object' && errData !== null) setErrors(errData);
        else setErrors({ general: errData.toString() });
    };

    const createMutation = useMutation({
        mutationFn: async (formData) => (await axios.post(`${baseUrl}/galleries`, formData, { headers: authHeaders })).data,
        onSuccess: handleMutationSuccess,
        onError: (err) => handleMutationError(formatAxiosError(err)),
    });

    const updateMutation = useMutation({
        mutationFn: async (formData) => (await axios.put(`${baseUrl}/galleries/${id}`, formData, { headers: authHeaders })).data,
        onSuccess: handleMutationSuccess,
        onError: (err) => handleMutationError(formatAxiosError(err)),
    });

    const submit = (e) => {
        e.preventDefault();
        setErrors({});

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (sortOrder !== '') formData.append('sort_order', Number(sortOrder));
        if (imageFile) formData.append('image', imageFile);

        if (isCreate) createMutation.mutate(formData);
        else updateMutation.mutate(formData);
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="va-paper va-modal">
                <DialogHeader className="va-modal__head">
                    <DialogTitle className="va-modal__title">{isCreate ? 'Tambah galeri baru' : 'Edit galeri'}</DialogTitle>
                    <DialogDescription className="va-modal__desc">
                        {isCreate ? 'Unggah foto baru beserta judul dan deskripsinya.' : 'Perbarui informasi atau foto galeri yang sudah ada.'}
                    </DialogDescription>
                </DialogHeader>

                {isFetching ? (
                    <div className="va-state" style={{ minHeight: '16rem' }}>
                        <Loader2 className="va-spin" size={24} />
                        <p>Memuat data galeri…</p>
                    </div>
                ) : (
                    <form onSubmit={submit}>
                        <div className="va-modal__body">
                            {errors.general && (
                                <div className="va-alert" role="alert">
                                    <AlertCircle size={16} />
                                    <span>{errors.general}</span>
                                </div>
                            )}

                            <div className="va-modal__row">
                                <div className="va-field">
                                    <label className="va-label" htmlFor="title">Judul galeri *</label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        className="va-input"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Contoh: Suasana ruang keluarga"
                                        disabled={isPending}
                                        aria-invalid={Boolean(errors.title)}
                                    />
                                    {errors.title && <p className="va-error">{firstError(errors.title)}</p>}
                                </div>

                                <div className="va-field">
                                    <label className="va-label" htmlFor="sort_order">Urutan</label>
                                    <input
                                        id="sort_order"
                                        name="sort_order"
                                        type="number"
                                        className="va-input"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        placeholder="1, 2…"
                                        disabled={isPending}
                                        aria-invalid={Boolean(errors.sort_order)}
                                    />
                                    {errors.sort_order && <p className="va-error">{firstError(errors.sort_order)}</p>}
                                </div>
                            </div>

                            <div className="va-field">
                                <label className="va-label" htmlFor="description">Deskripsi singkat</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="va-input"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tuliskan keterangan mengenai foto ini…"
                                    disabled={isPending}
                                    aria-invalid={Boolean(errors.description)}
                                />
                                {errors.description && <p className="va-error">{firstError(errors.description)}</p>}
                            </div>

                            <div className="va-field">
                                <span className="va-label">File gambar *</span>
                                <div
                                    className="va-drop"
                                    data-drag={isDragging}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); pickFile(e.dataTransfer.files[0]); }}
                                >
                                    {imagePreview ? (
                                        <div className="va-drop__preview">
                                            <img src={imagePreview} alt="Pratinjau" />
                                            <div>
                                                <p><strong>Gambar terpilih</strong></p>
                                                <p className="va-muted">Seret foto baru ke sini atau klik tombol untuk mengganti.</p>
                                                <label className="va-btn va-btn--ghost va-btn--sm" style={{ marginTop: '0.5rem' }}>
                                                    Ganti foto
                                                    <input type="file" accept="image/*" hidden disabled={isPending} onChange={(e) => pickFile(e.target.files[0])} />
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <label className="va-drop__empty">
                                            <UploadCloud size={28} strokeWidth={1.5} />
                                            <span><strong>Seret & letakkan foto di sini</strong>, atau klik untuk memilih</span>
                                            <span className="va-muted" style={{ fontSize: '0.78rem' }}>PNG, JPG, atau WEBP</span>
                                            <input type="file" accept="image/*" hidden disabled={isPending} onChange={(e) => pickFile(e.target.files[0])} />
                                        </label>
                                    )}
                                </div>
                                {errors.image && <p className="va-error">{firstError(errors.image)}</p>}
                            </div>
                        </div>

                        <DialogFooter className="va-modal__foot">
                            <button type="button" className="va-btn va-btn--ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
                                Batal
                            </button>
                            <button type="submit" className="va-btn" disabled={isPending}>
                                {isPending ? <Loader2 className="va-spin" size={16} /> : <Save size={16} />}
                                {isPending ? 'Menyimpan…' : isCreate ? 'Tambah galeri' : 'Simpan perubahan'}
                            </button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}