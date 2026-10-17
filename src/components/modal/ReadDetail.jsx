import { Plus, Pencil, Trash2, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useFetch from '../../hooks/useFetch';
import AdminPanelLayout from '../../views/layouts/AdminPanelLayout';
import GlobalDeleteModal from './Delete';
import GlobalCreateUpdateModal from './CreateAndUpdate';
import { useNavigate, useParams } from 'react-router-dom';
import '../../assets/styles/villa.css';

export default function GlobalDetailIndex({
    path, title, subtitle, tableHead, fields, initialValues,
    createButton = true, deleteButton = true, hasId = true,
    is_param = false, is_detail = false, pathDetail = null, navigatePath = null, nameId = null,
}) {
    const { get } = useFetch();
    const { idParam } = useParams();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [id, setId] = useState(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const fetchDataDetail = async () => {
        const resp = await get(`${path}/${idParam}`);
        if (!resp.status) throw new Error(resp.error);
        return resp.data?.data;
    };

    const { data, isPending, isError, error } = useQuery({
        queryKey: [`admin-${pathDetail}-section`],
        queryFn: is_detail ? fetchDataDetail : null,
    });

    if (isPending) {
        return (
            <AdminPanelLayout>
                <div className="va-state">
                    <Loader2 className="va-spin" size={26} />
                    <p>Memuat data {title}…</p>
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

    let items = [];
    let itemLists = [];
    const rawData = data?.data || data;
    if (Array.isArray(rawData)) {
        items = rawData;
        itemLists = rawData?.lists;
    } else if (typeof rawData === 'object' && rawData !== null) {
        items = [rawData];
        itemLists = rawData?.lists;
    }

    const visibleFields = fields.filter((f) => !f.hide_in_table);

    return (
        <AdminPanelLayout>
            <GlobalCreateUpdateModal open={openModal} onOpenChange={setOpenModal} isCreate={isCreate} id={id} idParam={idParam} path={pathDetail} title={title} queryKey={pathDetail} fields={fields} initialValues={initialValues} hasId={hasId} isVillaList={true} nameId={nameId} />
            <GlobalDeleteModal open={openDeleteModal} onOpenChange={setOpenDeleteModal} id={deleteId} path={pathDetail} queryKey={`admin-${pathDetail}-section`} />

            <header className="va-adm-head">
                <div>
                    <h2 className="va-adm-title">
                        Manajemen {title}
                        {items[0]?.title ? ` (${items[0].title})` : ''}
                    </h2>
                    <p className="va-text">{subtitle}</p>
                </div>
                <div className="va-adm-actions">
                    <button type="button" className="va-btn va-btn--ghost va-btn--sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> Kembali
                    </button>
                    {createButton && (
                        <button
                            type="button"
                            className="va-btn va-btn--sm"
                            onClick={() => { setOpenModal(true); setIsCreate(true); setId(null); }}
                        >
                            <Plus size={16} /> Tambah {title}
                        </button>
                    )}
                </div>
            </header>

            {itemLists?.length === 0 ? (
                <div className="va-empty">
                    <strong>Belum ada data {title}</strong>
                    <p className="va-text">Klik tombol tambah untuk membuat {title} baru.</p>
                </div>
            ) : (
                <div className="va-adm-tablewrap">
                    <table className="va-adm-table">
                        <thead>
                            <tr>
                                <th className="is-center">No</th>
                                {tableHead?.map((head) => <th key={head}>{head}</th>)}
                                <th className="is-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemLists?.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="is-center is-index">{index + 1}</td>
                                    {visibleFields.map((field) => {
                                        const cellValue = item[field.name];
                                        return (
                                            <td key={field.name}>
                                                {field.is_image ? (
                                                    <img src={cellValue} alt={field.label ?? field.name} className="va-adm-thumb" />
                                                ) : (
                                                    <p className="va-clamp-2" style={{ fontWeight: 500 }}>{cellValue ?? '-'}</p>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td>
                                        <div className="va-adm-actions">
                                            <button type="button" title="Edit" aria-label="Edit" className="va-icon-btn va-icon-btn--sm" onClick={() => { setOpenModal(true); setId(item?.id); setIsCreate(false); }}>
                                                <Pencil size={15} />
                                            </button>
                                            {deleteButton && (
                                                <button type="button" title="Hapus" aria-label="Hapus" className="va-icon-btn va-icon-btn--sm" onClick={() => { setDeleteId(item?.id); setOpenDeleteModal(true); }}>
                                                    <Trash2 size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminPanelLayout>
    );
}