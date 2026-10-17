import { Image as ImageIcon, Plus, Pencil, Trash2, Loader2, AlertCircle } from 'lucide-react';
import AdminPanelLayout from '../../layouts/AdminPanelLayout';
import { useState } from 'react';
import useFetch from '../../../hooks/useFetch';
import { useQuery } from '@tanstack/react-query';
import CreateUpdateGalleryModal from './CreateUpdateGallery';
import DeleteGalleryModal from './Delete';
import '../../../assets/styles/villa.css';

export default function GalleryIndex() {
    const { get } = useFetch();

    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [id, setId] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [page, setPage] = useState(1);

    const fetchData = async () => {
        const resp = await get(`galleries?page=${Number(page)}&size=6`);
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-galleries-section', page],
        queryFn: fetchData,
    });

    if (isLoading) {
        return (
            <AdminPanelLayout>
                <div className="va-state">
                    <Loader2 className="va-spin" size={26} />
                    <p>Memuat data galeri…</p>
                </div>
            </AdminPanelLayout>
        );
    }

    if (isError) {
        return (
            <AdminPanelLayout>
                <div className="va-alert" role="alert">
                    <AlertCircle size={16} />
                    <span>Gagal memuat data: {error.message}</span>
                </div>
            </AdminPanelLayout>
        );
    }

    const galleries = data?.data || data || [];
    const galleriePaginates = data?.pagination;

    return (
        <AdminPanelLayout>
            <DeleteGalleryModal open={openDeleteModal} onOpenChange={setOpenDeleteModal} id={deleteId} />
            <CreateUpdateGalleryModal open={openModal} onOpenChange={setOpenModal} isCreate={isCreate} id={id} />

            <header className="va-adm-head">
                <div>
                    <h2 className="va-adm-title">Manajemen galeri</h2>
                    <p className="va-text">Kelola koleksi foto, judul, deskripsi, dan urutan tampil galeri website.</p>
                </div>
                <div className="va-adm-actions">
                    <button
                        type="button"
                        className="va-btn va-btn--sm"
                        onClick={() => { setOpenModal(true); setIsCreate(true); setId(null); }}
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
                <div className="va-adm-cards">
                    {galleries.map((item) => (
                        <article key={item.id} className="va-adm-card">
                            <div className="va-adm-card__img">
                                <img src={item.image} alt={item.title} />
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
                                    onClick={() => { setOpenModal(true); setId(item.id); setIsCreate(false); }}
                                >
                                    <Pencil size={14} /> Edit
                                </button>
                                <button
                                    type="button"
                                    className="va-btn va-btn--ghost va-btn--sm"
                                    onClick={() => { setDeleteId(item.id); setOpenDeleteModal(true); }}
                                >
                                    <Trash2 size={14} /> Hapus
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <div className="va-pager">
                {Array.from({ length: galleriePaginates?.total_pages || 0 }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                        <button
                            key={pageNumber}
                            type="button"
                            aria-current={page === pageNumber ? 'page' : undefined}
                            onClick={() => setPage(pageNumber)}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
            </div>
        </AdminPanelLayout>
    );
}