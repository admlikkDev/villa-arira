import { Check, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import GlobalCreateUpdateModal from '../modal/CreateAndUpdate';
import GlobalDeleteModal from '../modal/Delete';
import '../../assets/styles/villa.css';

const formatRupiah = (value) => {
    const number = Number(value);
    if (value === null || value === undefined || value === '' || Number.isNaN(number)) return null;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
};

export function GlobalCardList({ data = null, path, title, fields, initialValues, hasId }) {
    const navigate = useNavigate();
    console.log(hasId)

    // Hooks harus dipanggil sebelum early return
    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [id, setId] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    if (!data) return null;

    const price = formatRupiah(data?.price);
    const lists = Array.isArray(data?.lists) ? data.lists : [];
    const transports = Array.isArray(data?.transports) ? data.transports : [];

    return (
        <article className="va-adm-card">
            <GlobalCreateUpdateModal
                open={openModal}
                onOpenChange={setOpenModal}
                isCreate={isCreate}
                id={id}
                path={path}
                title={title}
                queryKey={path}
                fields={fields}
                initialValues={initialValues}
                hasId={hasId}
            />
            <GlobalDeleteModal
                open={openDeleteModal}
                onOpenChange={setOpenDeleteModal}
                id={deleteId}
                path={path}
                queryKey={`admin-${path}-section`}
            />

            <div className="va-adm-card__body">
                <h3 className="va-h3">{data?.title ?? data?.text ?? 'Untitled'}</h3>
                {data?.subtitle !== undefined && (
                    <p className="va-text va-clamp-2">{data?.subtitle || 'Tidak ada deskripsi'}</p>
                )}

                {data?.price !== undefined && (
                    <div style={{ padding: '0.9rem 0', borderBlock: '1px solid var(--line)' }}>
                        <span className="va-price-note" style={{ marginTop: 0, marginBottom: '0.3rem' }}>Harga</span>
                        {price ? (
                            <span className="va-price">{price}</span>
                        ) : (
                            <span className="va-muted" style={{ fontSize: '0.88rem' }}>Harga belum diatur</span>
                        )}
                    </div>
                )}

                {data?.lists !== undefined && (
                    <ul className="va-checks va-adm-list">
                        {lists.length > 0 ? (
                            lists.map((item, index) => (
                                <li key={item?.id ?? index}>
                                    <Check size={16} strokeWidth={2} />
                                    <span>{item?.text ?? '-'}</span>
                                </li>
                            ))
                        ) : (
                            <li className="va-muted">Tidak ada paket</li>
                        )}
                    </ul>
                )}

                {data?.transports !== undefined && (
                    <ul className="va-checks va-adm-list">
                        {transports.length > 0 ? (
                            transports.map((item, index) => (
                                <li key={item?.id ?? index}>
                                    <Check size={16} strokeWidth={2} />
                                    <span>{item?.vehicle ?? '-'}</span>
                                </li>
                            ))
                        ) : (
                            <li className="va-muted">Tidak ada paket</li>
                        )}
                    </ul>
                )}
            </div>

            <div className="va-adm-card__foot">
                <button
                    type="button"
                    className="va-btn va-btn--ghost va-btn--sm"
                    onClick={() => { setOpenModal(true); setId(data?.id); setIsCreate(false); }}
                >
                    <Pencil size={14} /> Edit
                </button>
                {data?.lists !== undefined && (
                    <button
                        type="button"
                        className="va-btn va-btn--sm"
                        onClick={() => navigate(`/admin/package/${data?.id}`)}
                    >
                        Detail
                    </button>
                )}
                {data?.transports !== undefined && (
                    <button
                        type="button"
                        className="va-btn va-btn--sm"
                        onClick={() => navigate(`/admin/wisata-terdekat/${data?.id}`)}
                    >
                        Detail
                    </button>
                )}
                <button
                    type="button"
                    className="va-btn va-btn--ghost va-btn--sm"
                    onClick={() => { setDeleteId(data?.id); setOpenDeleteModal(true); }}
                >
                    <Trash2 size={14} /> Hapus
                </button>
            </div>
        </article>
    );
}