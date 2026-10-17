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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useFetch from '../../hooks/useFetch';
import '../../assets/styles/villa.css';

export default function GlobalCreateUpdateModal({
    open, onOpenChange, isCreate, id, path, title, queryKey,
    initialValues = {}, fields = [], hasId = true,
    isVillaList = false, idParam = null, nameId = null
}) {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const { post, put, get } = useFetch();
    const queryClient = useQueryClient();

    const [logo_selected, setLogoSelected] = useState(null);

    const { data, isLoading: isFetching } = useQuery({
        queryKey: [`${path}-detail`, id],
        queryFn: async () => {
            const pathHadId = hasId ? `${path}/${id}` : path;
            const resp = await get(pathHadId);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        enabled: open && !isCreate && !!id,
    });

    useEffect(() => {
        if (open) {
            setErrors({});
            if (isCreate) {
                const resetValues = {};
                fields.forEach((field) => {
                    resetValues[field.name] = field.defaultValue || '';
                });
                setFormData(resetValues);
            } else if (data) {
                const itemData = data?.data?.data || data?.data || data;
                if (itemData && typeof itemData === 'object') {
                    const loadedValues = {};
                    fields.forEach((field) => {
                        loadedValues[field.name] = itemData[field.name] ?? '';
                    });
                    setFormData(loadedValues);
                }
            }
        }
    }, [open, isCreate, data, fields]);

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleMutationSuccess = () => {
        queryClient.invalidateQueries({ queryKey: [`admin-${path}-section`] });
        onOpenChange(false);
    };

    const handleMutationError = (errData) => {
        if (typeof errData === 'object' && errData !== null) setErrors(errData);
        else setErrors({ general: errData.toString() });
    };

    const createMutation = useMutation({
        mutationFn: async (payload) => {
            const resp = await post(path, payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
    });

    const updateMutation = useMutation({
        mutationFn: async (payload) => {
            const pathHadId = hasId ? `${path}/${id}` : path;
            const resp = await put(pathHadId, payload);
            if (!resp.status) throw resp.error;
            return resp.data;
        },
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
    });

    const { data: dataLogo, isLoading: isLoadingLogo } = useQuery({
        queryKey: ['logos'],
        queryFn: async () => {
            const resp = await get('logos?unpage=true')
            if (!resp.status) throw resp.error
            return resp?.data?.data
        }
    })

    const submit = (e) => {
        e.preventDefault();
        setErrors({});

        const hasFile = fields.some((field) => field.type === 'file');
        let payload;

        if (hasFile) {
            payload = new FormData();
            Object.keys(formData).forEach((key) => {
                const value = formData[key];
                const isFileField = fields.find((f) => f.name === key)?.type === 'file';

                if (isFileField && typeof value === 'string') return;

                if (value !== null && value !== undefined && value !== '') {
                    payload.append(key, value);
                }
            });
        } else {
            payload = { ...formData };
            Object.keys(payload).forEach((key) => {
                if (payload[key] === '') payload[key] = null;
            });
            fields.forEach((field) => {
                if (field.type === 'number' && payload[field.name] !== null) {
                    payload[field.name] = Number(payload[field.name]);
                }
            });
            if (isVillaList) payload[nameId] = Number(idParam);
            if (logo_selected) payload['logo_id'] = Number(logo_selected)
        }

        console.log(payload)
        if (isCreate) createMutation.mutate(payload);
        else updateMutation.mutate(payload);

        if(path === 'application') setTimeout(() => {
            location.reload()
        }, 2000);
    };

    const isPending = createMutation.isPending || updateMutation.isPending;
    const firstError = (e) => (Array.isArray(e) ? e[0] : e);
    const items = dataLogo

    useEffect(() => {
        // console.log(logo_selected)
    }, [logo_selected, setLogoSelected])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="va-paper va-modal">
                <DialogHeader className="va-modal__head">
                    <DialogTitle className="va-modal__title">
                        {isCreate ? `Tambah ${title} baru` : `Edit ${title}`}
                    </DialogTitle>
                    <DialogDescription className="va-modal__desc">
                        {isCreate
                            ? `Masukkan data ${title?.toLowerCase()} baru ke sistem.`
                            : `Perbarui informasi ${title?.toLowerCase()} yang sudah ada.`}
                    </DialogDescription>
                </DialogHeader>

                {isFetching ? (
                    <div className="va-state" style={{ minHeight: '14rem' }}>
                        <Loader2 className="va-spin" size={24} />
                        <p>Memuat data…</p>
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

                            {fields.map((field) => {
                                if (field.is_update && isCreate) return null;
                                const invalid = Boolean(errors[field.name]);

                                return (
                                    <div key={field.name} className="va-field">
                                        <label className="va-label" htmlFor={field.name}>{field.label}</label>

                                        {field.type === 'textarea' ? (
                                            <textarea
                                                id={field.name}
                                                name={field.name}
                                                rows={field.rows || 4}
                                                className="va-input"
                                                value={formData[field.name] ?? ''}
                                                onChange={(e) => handleChange(field.name, e.target.value)}
                                                placeholder={field.placeholder}
                                                disabled={isPending}
                                                aria-invalid={invalid}
                                            />
                                        ) : field.type === 'file' ? (
                                            <>
                                                {/* Pratinjau jika sudah ada file tersimpan dari database */}
                                                {typeof formData[field.name] === 'string' && formData[field.name] && (
                                                    <div className="va-current">
                                                        <img src={formData[field.name]} alt="Pratinjau" />
                                                        <div>
                                                            <strong>File saat ini</strong>
                                                            <p className="va-muted" style={{ margin: 0 }}>Unggah file baru jika ingin mengubahnya.</p>
                                                        </div>
                                                    </div>
                                                )}
                                                <input
                                                    id={field.name}
                                                    name={field.name}
                                                    type="file"
                                                    className="va-input"
                                                    onChange={(e) => handleChange(field.name, e.target.files[0])}
                                                    disabled={isPending}
                                                    aria-invalid={invalid}
                                                />
                                            </>
                                        ) : field.type === 'select' ? (
                                            <Select
                                                name={field?.name}
                                                value={formData[field.name] ? String(formData[field.name]) : '1'}
                                                onValueChange={(value) => {
                                                    handleChange(field.name, value);
                                                    if (field.name === 'logo_id' || field.name === 'logo') {
                                                        setLogoSelected(value);
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="va-input" aria-invalid={invalid}>
                                                    <SelectValue placeholder={field.placeholder || "Pilih opsi"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        {items?.map((item) => (
                                                            <SelectItem key={item.id} value={String(item.id)}>
                                                                <img src={item?.image} width={50} height={50} alt="" />
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type || 'text'}
                                                className="va-input"
                                                value={formData[field.name] ?? ''}
                                                onChange={(e) => {
                                                    let val = e.target.value;
                                                    if (field.type === 'number' && val !== '') val = Number(val);
                                                    handleChange(field.name, val);
                                                }}
                                                placeholder={field.placeholder}
                                                disabled={isPending}
                                                aria-invalid={invalid}
                                            />
                                        )}

                                        {invalid && <p className="va-error">{firstError(errors[field.name])}</p>}
                                    </div>
                                );
                            })}
                        </div>

                        <DialogFooter className="va-modal__foot">
                            <button type="button" className="va-btn va-btn--ghost" onClick={() => onOpenChange(false)} disabled={isPending}>
                                Batal
                            </button>
                            <button type="submit" className="va-btn" disabled={isPending}>
                                {isPending ? <Loader2 className="va-spin" size={16} /> : <Save size={16} />}
                                {isPending ? 'Menyimpan…' : isCreate ? `Tambah ${title}` : 'Simpan perubahan'}
                            </button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}