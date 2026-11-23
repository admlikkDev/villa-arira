import { Image as ImageIcon, Plus, Pencil, Trash2, Loader2, AlertCircle, Save } from 'lucide-react';
import AdminPanelLayout from '../../layouts/AdminPanelLayout';
import { useState, useEffect } from 'react';
import useFetch from '../../../hooks/useFetch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import Pagination from '../../../components/Pagination';
import '../../../assets/styles/villa.css';

const isBlank = (v) => v === null || v === undefined || v === "";

export default function GalleryIndex() {
    const { get, post, put, delete: destroy } = useFetch();
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    
    // State untuk Modal Create / Edit
    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(true);
    const [selectedId, setSelectedId] = useState(null);

    // State untuk Modal Delete
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // State Form Galeri
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        sort_order: "",
        image: null,
    });
    const [errors, setErrors] = useState({});

    // Fetch Data Galeri dengan Paginasi
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-galleries-section', page],
        queryFn: async () => {
            const resp = await get(`galleries?page=${page}&size=6`);
            if (!resp.status) throw new Error(resp.error);
            return resp.data;
        },
    });

    // Fetch Detail Galeri saat Edit
    const { data: detailData, isFetching: isFetchingDetail } = useQuery({
        queryKey: ['galleries-detail', selectedId],
        queryFn: async () => {
            const resp = await get(`galleries/${selectedId}`);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        enabled: openModal && !isCreate && !!selectedId,
    });

    // Sinkronisasi data saat modal edit dibuka
    useEffect(() => {
        if (!openModal) return;
        setErrors({});

        if (isCreate) {
            setFormData({ title: "", description: "", sort_order: "", image: null });
        } else if (detailData) {
            const item = detailData?.data || detailData;
            setFormData({
                title: item?.title || "",
                description: item?.description || "",
                sort_order: item?.sort_order ?? "",
                image: item?.image || null,
            });
        }
    }, [openModal, isCreate, detailData]);

    const handleFormChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Mutasi Create & Update
    const mutationSuccess = (msg) => {
        queryClient.invalidateQueries({ queryKey: ['admin-galleries-section'] });
        toast.success(msg);
        setOpenModal(false);
    };

    const mutationError = (err) => {
        if (typeof err === "object" && err !== null) setErrors(err);
        else setErrors({ general: String(err) });
        toast.error("Gagal menyimpan galeri.");
    };

    const createMutation = useMutation({
        mutationFn: async (payload) => {
            const resp = await post("galleries", payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: () => mutationSuccess("Galeri berhasil ditambahkan!"),
        onError: mutationError,
    });

    const updateMutation = useMutation({
        mutationFn: async (payload) => {
            const resp = await put(`galleries/${selectedId}`, payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: () => mutationSuccess("Galeri berhasil diperbarui!"),
        onError: mutationError,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const payload = new FormData();
        if (!isBlank(formData.title)) payload.append("title", formData.title);
        if (!isBlank(formData.description)) payload.append("description", formData.description);
        if (!isBlank(formData.sort_order)) payload.append("sort_order", Number(formData.sort_order));
        if (formData.image instanceof File) payload.append("image", formData.image);

        if (isCreate) createMutation.mutate(payload);
        else updateMutation.mutate(payload);
    };

    // Mutasi Delete
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const resp = await destroy(`galleries/${id}`);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-galleries-section'] });
            toast.success("Galeri berhasil dihapus!");
            setOpenDeleteModal(false);
            setDeleteId(null);
        },
        onError: (err) => {
            toast.error(typeof err === "string" ? err : "Gagal menghapus galeri.");
            setOpenDeleteModal(false);
        },
    });

    if (isLoading) {
        return (
            <div>
                <div className="va-state" style={{ minHeight: "50vh" }}>
                    <Loader2 className="va-spin" size={26} />
                    <p>Memuat data galeri…</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <div className="va-alert" role="alert" style={{ margin: "2rem" }}>
                    <AlertCircle size={16} />
                    <span>Gagal memuat data: {error.message}</span>
                </div>
            </div>
        );
    }

    const galleries = data?.data || data || [];
    const galleriePaginates = data?.pagination;
    const totalPages = galleriePaginates?.total_pages || 1;
    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <div>
            <header className="va-adm-head">
                <div>
                    <h2 className="va-adm-title">Manajemen galeri</h2>
                    <p className="va-text">
                        Kelola koleksi foto, judul, deskripsi, dan urutan tampil galeri website.
                        {galleriePaginates?.total_items ? <span className="va-adm-count"> · {galleriePaginates.total_items} foto</span> : null}
                    </p>
                </div>
                <div className="va-adm-actions">
                    <button
                        type="button"
                        className="va-btn va-btn--sm"
                        onClick={() => { setIsCreate(true); setSelectedId(null); setOpenModal(true); }}
                    >
                        <Plus size={16} /> Tambah galeri
                    </button>
                </div>
            </header>

            {galleries.length === 0 ? (
                <div className="va-empty">
                    <ImageIcon size={32} strokeWidth={1.25} />
                    <strong>Belum ada data galeri</strong>
                    <p className="va-text">Klik tombol tambah untuk mengunggah foto baru.</p>
                </div>
            ) : (
                <>
                    <div className="va-adm-cards">
                        {galleries.map((item) => (
                            <article key={item.id} className="va-adm-card">
                                <div className="va-adm-card__img">
                                    <img src={item.image} alt={item.title} loading="lazy" />
                                    <span className="va-adm-chip">Urutan {item.sort_order}</span>
                                </div>

                                <div className="va-adm-card__body">
                                    <h3 className="va-h3 va-clamp-1">{item.title}</h3>
                                    <p className="va-text va-clamp-2">{item.description || 'Tidak ada deskripsi.'}</p>
                                </div>

                                <div className="va-adm-card__foot">
                                    <button
                                        type="button"
                                        className="va-btn va-btn--ghost va-btn--sm"
                                        onClick={() => { setIsCreate(false); setSelectedId(item.id); setOpenModal(true); }}
                                    >
                                        <Pencil size={14} /> Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="va-btn va-btn--ghost va-btn--sm"
                                        style={{ color: "#ef4444" }}
                                        onClick={() => { setDeleteId(item.id); setOpenDeleteModal(true); }}
                                    >
                                        <Trash2 size={14} /> Hapus
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                        <Pagination page={page} totalPages={totalPages} onChange={(newPage) => setPage(newPage)} />
                    </div>
                </>
            )}

            {/* MODAL CREATE / UPDATE (2 Kolom: Kiri Form, Kanan Gambar & Tidak Terpotong) */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent
                    className="va-paper va-modal"
                    style={{
                        maxWidth: "720px",
                        width: "90vw",
                        maxHeight: "85vh",
                        height: "auto",
                        display: "flex",
                        flexDirection: "column",
                        padding: 0,
                        overflow: "hidden",
                    }}
                >
                    <DialogHeader className="va-modal__head" style={{ padding: "1.25rem 1.5rem 0.75rem 1.5rem", flexShrink: 0 }}>
                        <DialogTitle className="va-modal__title">
                            {isCreate ? "Tambah galeri baru" : "Edit galeri"}
                        </DialogTitle>
                        <DialogDescription className="va-modal__desc">
                            {isCreate ? "Unggah foto baru beserta judul dan deskripsinya." : "Perbarui informasi galeri yang sudah ada."}
                        </DialogDescription>
                    </DialogHeader>

                    {!isCreate && isFetchingDetail ? (
                        <div className="va-state" style={{ minHeight: "14rem" }}>
                            <Loader2 className="va-spin" size={24} />
                            <p>Memuat data…</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                            <div
                                className="va-modal__body"
                                style={{
                                    flex: 1,
                                    overflowY: "auto",
                                    padding: "1rem 1.5rem",
                                    display: "grid",
                                    gridTemplateColumns: "1fr 240px",
                                    gap: "1.5rem",
                                    alignItems: "start",
                                }}
                            >
                                {/* Kiri: Form Input Teks */}
                                <div style={{ display: "grid", gap: "1rem" }}>
                                    {errors.general && (
                                        <div className="va-alert" role="alert">
                                            <AlertCircle size={16} />
                                            <span>{errors.general}</span>
                                        </div>
                                    )}

                                    <div className="va-field" style={{ marginBottom: 0 }}>
                                        <label className="va-label" htmlFor="title">Judul galeri *</label>
                                        <input
                                            id="title"
                                            type="text"
                                            className="va-input"
                                            placeholder="Contoh: Suasana ruang tamu"
                                            value={formData.title}
                                            onChange={(e) => handleFormChange("title", e.target.value)}
                                            disabled={isPending}
                                        />
                                        {errors.title && <p className="va-error">{Array.isArray(errors.title) ? errors.title[0] : errors.title}</p>}
                                    </div>

                                    <div className="va-field" style={{ marginBottom: 0 }}>
                                        <label className="va-label" htmlFor="sort_order">Urutan tampil</label>
                                        <input
                                            id="sort_order"
                                            type="number"
                                            className="va-input"
                                            placeholder="1, 2, 3..."
                                            value={formData.sort_order}
                                            onChange={(e) => handleFormChange("sort_order", e.target.value)}
                                            disabled={isPending}
                                        />
                                        {errors.sort_order && <p className="va-error">{Array.isArray(errors.sort_order) ? errors.sort_order[0] : errors.sort_order}</p>}
                                    </div>

                                    <div className="va-field" style={{ marginBottom: 0 }}>
                                        <label className="va-label" htmlFor="description">Deskripsi singkat</label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            className="va-input"
                                            placeholder="Tuliskan keterangan mengenai foto ini..."
                                            value={formData.description}
                                            onChange={(e) => handleFormChange("description", e.target.value)}
                                            disabled={isPending}
                                        />
                                        {errors.description && <p className="va-error">{Array.isArray(errors.description) ? errors.description[0] : errors.description}</p>}
                                    </div>
                                </div>

                                {/* Kanan: Pratinjau & Upload File Gambar */}
                                <div style={{ display: "grid", gap: "0.75rem" }}>
                                    <div className="va-field" style={{ marginBottom: 0 }}>
                                        <label className="va-label" htmlFor="image">File gambar *</label>
                                        
                                        <div style={{ 
                                            width: "100%", 
                                            height: "150px", 
                                            borderRadius: "8px", 
                                            border: "1px dashed rgba(0,0,0,0.2)", 
                                            background: "rgba(0,0,0,0.02)", 
                                            display: "flex", 
                                            alignItems: "center", 
                                            justifyContent: "center", 
                                            overflow: "hidden",
                                            marginBottom: "0.5rem"
                                        }}>
                                            {formData.image instanceof File ? (
                                                <img src={URL.createObjectURL(formData.image)} alt="Preview Baru" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : typeof formData.image === "string" && formData.image ? (
                                                <img src={formData.image} alt="Preview Lama" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                <span className="va-muted" style={{ fontSize: "0.8rem", textAlign: "center", padding: "1rem" }}>Belum ada foto dipilih</span>
                                            )}
                                        </div>

                                        <input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            className="va-input"
                                            style={{ fontSize: "0.8rem", padding: "0.35rem" }}
                                            onChange={(e) => handleFormChange("image", e.target.files[0])}
                                            disabled={isPending}
                                        />
                                        {errors.image && <p className="va-error">{Array.isArray(errors.image) ? errors.image[0] : errors.image}</p>}
                                    </div>
                                </div>
                            </div>

                            <div
                                className="va-modal__foot"
                                style={{
                                    padding: "1rem 1.5rem",
                                    borderTop: "1px solid rgba(0,0,0,0.06)",
                                    flexShrink: 0,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: "0.5rem",
                                    background: "inherit",
                                }}
                            >
                                <button
                                    type="button"
                                    className="va-btn va-btn--ghost"
                                    onClick={() => setOpenModal(false)}
                                    disabled={isPending}
                                >
                                    Batal
                                </button>
                                <button type="submit" className="va-btn" disabled={isPending}>
                                    {isPending ? <Loader2 className="va-spin" size={16} /> : <Save size={16} />}
                                    {isPending ? "Menyimpan…" : isCreate ? "Tambah galeri" : "Simpan perubahan"}
                                </button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* MODAL KONFIRMASI DELETE */}
            {openDeleteModal && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "grid", placeItems: "center", zIndex: 50, padding: "1rem" }}>
                    <div className="va-paper" style={{ maxWidth: "400px", width: "100%", padding: "1.5rem", borderRadius: "12px", background: "var(--bg, #fff)" }}>
                        <h3 className="va-h3" style={{ marginBottom: "0.5rem" }}>Hapus Galeri?</h3>
                        <p className="va-text" style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                            Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin menghapus foto galeri ini?
                        </p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                            <button
                                type="button"
                                className="va-btn va-btn--ghost"
                                disabled={deleteMutation.isPending}
                                onClick={() => setOpenDeleteModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className="va-btn"
                                style={{ background: "#ef4444", color: "#fff" }}
                                disabled={deleteMutation.isPending}
                                onClick={() => deleteMutation.mutate(deleteId)}
                            >
                                {deleteMutation.isPending ? <Loader2 className="va-spin" size={16} /> : "Ya, Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}