import { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "../../hooks/useFetch";
import "../../assets/styles/villa.css";
import { toast } from "sonner";

// Field select yang menyimpan pilihan logo dan dikirim ke API sebagai `logo_id`
const LOGO_FIELDS = ["logo", "logo_id"];
const isLogoField = (field) =>
  field.type === "select" && LOGO_FIELDS.includes(field.name);

// Nilai select dari API bisa berupa objek ({ id, image, ... }); ambil id-nya saja
const selectValueFrom = (itemData, field) => {
  if (isLogoField(field)) return itemData.logo_id ?? itemData.logo?.id ?? "";
  const v = itemData[field.name];
  return v && typeof v === "object" ? (v.id ?? "") : (v ?? "");
};

export default function GlobalCreateUpdateModal({
  open,
  onOpenChange,
  isCreate,
  id,
  path,
  title,
  queryKey,
  initialValues = {},
  fields = [],
  hasId = true,
  isVillaList = false,
  idParam = null,
  nameId = null,
  selectLogo = false,
  pathDetail = null,
  is_imageSpecification = false
}) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const { post, put, get } = useFetch();
  const queryClient = useQueryClient();

  const hasSelect = fields.some((f) => f.type === "select");

  const { data, isFetching: isFetchingDetail } = useQuery({
    queryKey: [`${path}-detail`, id],
    queryFn: async () => {
      const pathHadId = hasId ? `${path}/${id}` : path;
      const resp = await get(pathHadId);
      if (!resp.status) throw resp.error;
      return resp.data;
    },
    enabled: open && !isCreate && !!id,
    retry: 1,
  });

  const { data: dataLogo } = useQuery({
    queryKey: [
      selectLogo ? "admin-logos-section" : `admin-${path}-section`,
      "all",
    ],
    queryFn: async () => {
      const resp = await get(
        selectLogo ? "logos?unpage=true" : `${pathDetail}?unpage=true`,
      );
      if (!resp.status) throw resp.error;
      return resp?.data?.data;
    },
    enabled: open && hasSelect,
    staleTime: 5 * 60 * 1000,
  });


  // Selama edit, tampilkan spinner sampai data TERBARU tiba (bukan cache lama)
  const showLoading = !isCreate && isFetchingDetail;

  useEffect(() => {
    if (!open) return;
    setErrors({});

    if (isCreate) {
      const resetValues = {};
      fields.forEach((field) => {
        resetValues[field.name] = field.defaultValue || "";
      });
      setFormData(resetValues);
    } else if (data && !isFetchingDetail) {
      const itemData = data?.data?.data || data?.data || data;
      if (itemData && typeof itemData === "object") {
        const loadedValues = {};
        fields.forEach((field) => {
          loadedValues[field.name] =
            field.type === "select"
              ? selectValueFrom(itemData, field)
              : (itemData[field.name] ?? "");
        });
        setFormData(loadedValues);
      }
    }
  }, [open, isCreate, data, isFetchingDetail, fields]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [`admin-${path}-section`] });
    queryClient.removeQueries({ queryKey: [`${path}-detail`] });
    toast.success(isCreate ? `${title} berhasil ditambahkan!` : `${title} berhasil diperbarui!`);
    onOpenChange(false);
  };

  const handleMutationError = (errData) => {
    if (typeof errData === "object" && errData !== null) setErrors(errData);
    else setErrors({ general: errData.toString() });

    toast.error(isCreate ? `Gagal menambahkan ${title}.` : `Gagal memperbarui ${title}.`);
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

  const submit = (e) => {
    e.preventDefault();
    setErrors({});

    const hasFile = fields.some((field) => field.type === "file");
    const logoField = fields.find(isLogoField);
    const logoValue = logoField ? formData[logoField.name] : null;
    let payload;

    if (hasFile) {
      payload = new FormData();
      Object.keys(formData).forEach((key) => {
        const field = fields.find((f) => f.name === key);
        const value = formData[key];

        if (field && isLogoField(field)) return; 
        if (field?.type === "file" && typeof value === "string") return;

        if (value !== null && value !== undefined && value !== "") {
          payload.append(key, value);
        }
      });
      if (logoField && logoValue) payload.append("logo_id", Number(logoValue));
    } else {
      payload = { ...formData };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") payload[key] = null;
      });
      fields.forEach((field) => {
        if (payload[field.name] === null || payload[field.name] === undefined)
          return;

        if (field.type === "number") {
          payload[field.name] = Number(payload[field.name]);
        }
        if (field.type === "select" && !isLogoField(field)) {
          payload[field.name] = Number(payload[field.name]);
        }
      });
      if (isVillaList) payload[nameId] = Number(idParam);

      if (logoField) {
        delete payload[logoField.name];
        payload.logo_id = logoValue ? Number(logoValue) : null;
      }
    }

    if (isCreate) createMutation.mutate(payload);
    else updateMutation.mutate(payload);

    if (path === "application")
      setTimeout(() => {
        location.reload();
      }, 2000);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const firstError = (e) => (Array.isArray(e) ? e[0] : e);
  const logos = dataLogo;

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

        {showLoading ? (
          <div className="va-state" style={{ minHeight: "14rem" }}>
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
                const invalid = Boolean(
                  errors[field.name] || (isLogoField(field) && errors.logo_id),
                );
                const errorText =
                  errors[field.name] ??
                  (isLogoField(field) ? errors.logo_id : null);

                return (
                  <div key={field.name} className="va-field">
                    <label className="va-label" htmlFor={field.name}>
                      {field.label}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        rows={field.rows || 4}
                        className="va-input"
                        value={formData[field.name] ?? ""}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        placeholder={field.placeholder}
                        disabled={isPending}
                        aria-invalid={invalid}
                      />
                    ) : field.type === "file" ? (
                      <>
                        {typeof formData[field.name] === "string" &&
                          formData[field.name] && (
                            <div className="va-current">
                              <img src={formData[field.name]} alt="Pratinjau" />
                              <div>
                                <strong>File saat ini</strong>
                                <p className="va-muted" style={{ margin: 0 }}>
                                  Unggah file baru jika ingin mengubahnya.
                                </p>
                              </div>
                            </div>
                          )}
                        <input
                          id={field.name}
                          name={field.name}
                          type="file"
                          className="va-input"
                          onChange={(e) =>
                            handleChange(field.name, e.target.files[0])
                          }
                          disabled={isPending}
                          aria-invalid={invalid}
                        />
                      </>
                    ) : field.type === "select" ? (
                      <Select
                        name={field.name}
                        value={
                          formData[field.name]
                            ? String(formData[field.name])
                            : ""
                        }
                        onValueChange={(value) =>
                          handleChange(field.name, value)
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger
                          className="va-input"
                          aria-invalid={invalid}
                        >
                          <SelectValue
                            placeholder={field.placeholder || "Pilih opsi"}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {logos?.map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                {
                                  console.log(selectLogo)
                                }
                                {selectLogo ? (
                                  <img
                                    src={item?.image}
                                    width={40}
                                    height={40}
                                    alt={`Logo ${item.id}`}
                                    loading="lazy"
                                    style={{ objectFit: "cover" }}
                                  />
                                ) : (
                                  <p style={{ fontWeight: 500, margin: 0 }}>
                                    {item?.title}
                                  </p>
                                )}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type || "text"}
                        className="va-input"
                        value={formData[field.name] ?? ""}
                        onChange={(e) => {
                          let val = e.target.value;
                          if (field.type === "number" && val !== "")
                            val = Number(val);
                          handleChange(field.name, val);
                        }}
                        placeholder={field.placeholder}
                        disabled={isPending}
                        aria-invalid={invalid}
                      />
                    )}

                    {invalid && (
                      <p className="va-error">{firstError(errorText)}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <DialogFooter className="va-modal__foot">
              <button
                type="button"
                className="va-btn va-btn--ghost"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Batal
              </button>
              <button type="submit" className="va-btn" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="va-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                {isPending
                  ? "Menyimpan…"
                  : isCreate
                    ? `Tambah ${title}`
                    : "Simpan perubahan"}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
