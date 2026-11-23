import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Trash2,
  Save,
  Loader2,
} from "lucide-react";
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
import useFetch from "../../hooks/useFetch";
import AdminPanelLayout from "../../views/layouts/AdminPanelLayout";
import "../../assets/styles/villa.css";
import { toast } from "sonner";

const PAGE_SIZE = 10;

// Daftar 4 tipe hari / musim secara lengkap
const DAY_TYPES = [
  { value: "weekday", label: "Weekday" },
  { value: "weekend", label: "Weekend" },
  { value: "long_weekend", label: "Long weekend" },
  { value: "high_season", label: "High season" },
];

const BASE_COLUMNS = [
  {
    key: "weekday",
    label: "Weekday",
    note: "Senin – Kamis",
    season: "reguler",
    day_type: "weekday",
  },
  {
    key: "weekend",
    label: "Weekend",
    note: "Jumat – Minggu",
    season: "reguler",
    day_type: "weekend",
  },
  {
    key: "long_weekend",
    label: "High Weekday",
    note: "Libur nasional",
    season: "high",
    day_type: "weekday",
  },
  {
    key: "high_season",
    label: "High Weekend",
    note: "Lebaran & nataru",
    season: "high",
    day_type: "weekend",
  },
];

const LOGO_FIELDS = ["logo", "logo_id"];
const isLogoField = (field) =>
  field.type === "select" && LOGO_FIELDS.includes(field.name);

const selectValueFrom = (itemData, field) => {
  if (isLogoField(field)) return itemData.logo_id ?? itemData.logo?.id ?? "";
  const v = itemData[field.name];
  return v && typeof v === "object" ? (v.id ?? "") : (v ?? "");
};

const humanize = (s) =>
  String(s ?? "-")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (c) => c.toUpperCase());

const formatRupiah = (value) => {
  const number = Number(value);
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number.isNaN(number)
  )
    return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

const getPageItems = (current, total, siblings = 1) => {
  const maxShown = siblings * 2 + 5;
  if (total <= maxShown) return range(1, total);
  const left = Math.max(current - siblings, 2);
  const right = Math.min(current + siblings, total - 1);
  const edge = 3 + siblings * 2;
  if (!(left > 2)) return [...range(1, edge), "dots-r", total];
  if (!(right < total - 1))
    return [1, "dots-l", ...range(total - edge + 1, total)];
  return [1, "dots-l", ...range(left, right), "dots-r", total];
};

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="va-pager-wrap">
      <p className="va-text">
        Halaman {page} dari {totalPages}
      </p>
      <nav className="va-pager" aria-label="Pagination">
        <button
          type="button"
          aria-label="Halaman sebelumnya"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {getPageItems(page, totalPages).map((item) =>
          typeof item === "string" ? (
            <span key={item} className="va-pager__dots" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              aria-current={page === item ? "page" : undefined}
              onClick={() => onChange(item)}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          aria-label="Halaman berikutnya"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}

function GlobalCreateUpdateModal({
  open,
  onOpenChange,
  isCreate,
  id,
  path,
  title,
  initialValues = {},
  fields = [],
  hasId = true,
  isVillaList = false,
  idParam = null,
  nameId = null,
  selectLogo = false,
  pathDetail = null,
  is_price = false,
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

  const showLoading = !isCreate && isFetchingDetail;

  useEffect(() => {
    if (!open) return;
    setErrors({});

    if (isCreate) {
      const resetValues = {};
      fields.forEach((field) => {
        resetValues[field.name] = field.defaultValue || "";
      });
      setFormData({ ...resetValues, ...initialValues });
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

        loadedValues.season = itemData.season ?? initialValues?.season ?? "";
        loadedValues.day_type =
          itemData.day_type ?? initialValues?.day_type ?? "";
        loadedValues.rental_option_id =
          itemData.rental_option_id ?? initialValues?.rental_option_id ?? "";

        setFormData(loadedValues);
      }
    }
  }, [open, isCreate, data, isFetchingDetail, fields, initialValues]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMutationSuccess = () => {
    queryClient.invalidateQueries({ queryKey: [`admin-${path}-section`] });
    queryClient.removeQueries({ queryKey: [`${path}-detail`] });
    toast.success(
      isCreate
        ? `${title} berhasil ditambahkan!`
        : `${title} berhasil diperbarui!`,
    );
    onOpenChange(false);
  };

  const handleMutationError = (errData) => {
    if (typeof errData === "object" && errData !== null) setErrors(errData);
    else setErrors({ general: errData.toString() });

    toast.error(
      isCreate ? `Gagal menambahkan ${title}.` : `Gagal memperbarui ${title}.`,
    );
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

      if (is_price) {
        let currentSeason =
          formData["season"] || initialValues?.season || "reguler";
        let currentDayType =
          formData["day_type"] || initialValues?.day_type || currentSeason;

        payload = {
          day_type: String(currentDayType),
          season: String(currentSeason),
          rental_option_id: Number(
            initialValues?.rental_option_id || formData["rental_option_id"],
          ),
          price: Number(payload["price"]),
        };
      }
    }

    if (isCreate) createMutation.mutate(payload);
    else updateMutation.mutate(payload);
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

// ==========================================
// MODAL DELETE (In-file)
// ==========================================
function GlobalDeleteModal({
  open,
  onOpenChange,
  id,
  queryKey,
  path,
  title = "Data",
}) {
  const { destroy, del } = useFetch();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");

  const deleteFunction = destroy || del;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const resp = await deleteFunction(`${path}/${id}`);
      if (!resp.status) throw resp.error;
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      onOpenChange(false);
      setErrorMsg("");
      toast.success(`${title} berhasil dihapus!`);
    },
    onError: (err) => {
      toast.error(`Gagal menghapus ${title}.`);
      setErrorMsg(err?.toString() || "Gagal menghapus data.");
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (id) deleteMutation.mutate();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDelete(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="va-paper va-modal va-modal--sm"
        onKeyDown={handleKeyDown}
      >
        <DialogHeader className="va-modal__head">
          <DialogTitle className="va-modal__title">Hapus {title}?</DialogTitle>
          <DialogDescription className="va-modal__desc">
            Tindakan ini tidak dapat dibatalkan. Data akan dihapus permanen dari
            sistem.
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
          <button
            type="button"
            className="va-btn va-btn--ghost"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
          >
            Batal
          </button>
          <button
            type="button"
            className="va-btn"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <Loader2 className="va-spin" size={16} />
            ) : (
              <Trash2 size={16} />
            )}
            {deleteMutation.isPending ? "Menghapus…" : "Ya, hapus data"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ==========================================
// HALAMAN UTAMA ADMIN RENTAL PRICES
// ==========================================
export default function AdminRentalPrices() {
  const { id: rentalOptionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { get } = useFetch();

  const path = `rental-options/${rentalOptionId}/rental-prices`;
  const pathCreate = `rental-prices`;
  const sectionKey = `admin-${path}-section`;

  const [view, setView] = useState("pricelist"); // pricelist | list
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [editId, setEditId] = useState(null);
  const [prefill, setPrefill] = useState({});
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: [sectionKey] });

  // Data harga unit ini
  const { data, isPending, isError, error } = useQuery({
    queryKey: [sectionKey],
    queryFn: async () => {
      const resp = await get(path);
      if (!resp.status) throw new Error(resp.error);
      return resp.data;
    },
  });

  // Info unit (judul, deskripsi, kapasitas)
  const { data: optionData } = useQuery({
    queryKey: ["admin-rental-option-title", rentalOptionId],
    retry: false,
    queryFn: async () => {
      const resp = await get(`rental-options/${rentalOptionId}`);
      if (!resp.status) throw new Error(resp.error);
      return resp.data;
    },
  });

  const option = optionData?.data ?? optionData ?? {};
  const optionTitle = option?.title ?? `Unit #${rentalOptionId}`;

  const items = useMemo(() => {
    const raw = data?.data || data;
    return Array.isArray(raw) ? raw : [];
  }, [data]);

  const seasonNames = useMemo(() => {
    return [...new Set(items.map((i) => i.season))];
  }, [items]);

  const columns = BASE_COLUMNS;

  // Pencocokan data harga ke masing-masing 4 kolom secara fleksibel
  const entriesFor = (col) =>
    items.filter((i) => {
      const itemSeason = String(i.season ?? "")
        .trim()
        .toLowerCase();
      const colSeason = String(col.season ?? "")
        .trim()
        .toLowerCase();
      const itemDayType = String(i.day_type ?? "")
        .trim()
        .toLowerCase();
      const colDayType = String(col.day_type ?? "")
        .trim()
        .toLowerCase();

      return itemSeason === colSeason && itemDayType === colDayType;
    });

  const formFields = useMemo(() => {
    return [{ name: "price", label: "Harga per malam (Rp)", type: "number" }];
  }, []);

  const listItems = useMemo(() => {
    const filtered =
      seasonFilter === "all"
        ? items
        : items.filter((i) => i.season === seasonFilter);
    return [...filtered].sort(
      (a, b) =>
        String(a.season).localeCompare(String(b.season)) ||
        String(a.day_type).localeCompare(String(b.day_type)) ||
        Number(a.price) - Number(b.price),
    );
  }, [items, seasonFilter]);

  const totalPages = Math.max(1, Math.ceil(listItems.length / PAGE_SIZE));
  const pagedItems = listItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openCreate = (values = {}) => {
    setPrefill(values);
    setIsCreate(true);
    setEditId(null);
    setOpenModal(true);
  };
  const openEdit = (itemId) => {
    setIsCreate(false);
    setEditId(itemId);
    setOpenModal(true);
  };
  const openRemove = (itemId) => {
    setDeleteId(itemId);
    setOpenDelete(true);
  };

  const prefillFor = (col) => ({
    season: col.season,
    day_type: col.day_type,
  });

  const initialValues = {
    rental_option_id: Number(rentalOptionId),
    season: prefill.season ?? "reguler",
    day_type: prefill.day_type ?? "weekday",
    price: "",
  };

  const renderActions = (item) => (
    <div className="va-adm-actions">
      <button
        type="button"
        title="Edit"
        aria-label="Edit"
        className="va-icon-btn va-icon-btn--sm"
        onClick={() => openEdit(item.id)}
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        title="Hapus"
        aria-label="Hapus"
        className="va-icon-btn va-icon-btn--sm"
        onClick={() => openRemove(item.id)}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );

  return (
    <div>
      <GlobalCreateUpdateModal
        open={openModal}
        onOpenChange={(o) => {
          setOpenModal(o);
          if (!o) refresh();
        }}
        isCreate={isCreate}
        id={editId}
        path={pathCreate}
        title="Harga"
        fields={formFields}
        initialValues={initialValues}
        hasId
        is_price={true}
      />
      <GlobalDeleteModal
        open={openDelete}
        onOpenChange={(o) => {
          setOpenDelete(o);
          if (!o) refresh();
        }}
        id={deleteId}
        path={pathCreate}
        queryKey={sectionKey}
        title="Harga"
      />

      <header className="va-adm-head">
        <div>
          <h2 className="va-adm-title">Harga {optionTitle}</h2>
          <p className="va-text">
            Kelola pricelist weekday, weekend, long weekend, dan high season
            {!isPending && !isError && (
              <span className="va-adm-count"> · {items.length} data</span>
            )}
          </p>
        </div>
        <div className="va-adm-actions">
          <button
            type="button"
            className="va-btn va-btn--ghost va-btn--sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Kembali
          </button>
        </div>
      </header>

      {isError ? (
        <div className="va-alert" role="alert">
          <AlertCircle size={16} />
          <span>Gagal memuat data: {String(error?.message ?? error)}</span>
        </div>
      ) : isPending ? (
        <div style={{ display: "grid", gap: "1px" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="va-skel" style={{ height: "4.5rem" }} />
          ))}
        </div>
      ) : (
        <>
          <div className="va-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              className="va-tab"
              aria-selected={view === "pricelist"}
              onClick={() => setView("pricelist")}
            >
              <LayoutGrid
                size={15}
                style={{ verticalAlign: "-2px", marginRight: "0.5rem" }}
              />
              Pricelist
            </button>
            <button
              type="button"
              role="tab"
              className="va-tab"
              aria-selected={view === "list"}
              onClick={() => setView("list")}
            >
              <List
                size={15}
                style={{ verticalAlign: "-2px", marginRight: "0.5rem" }}
              />
              Semua data
            </button>
          </div>

          {view === "pricelist" ? (
            <>
              <div className="va-table-scroll">
                <table
                  className="va-table"
                  style={{ minWidth: `${560 + columns.length * 170}px` }}
                >
                  <thead>
                    <tr>
                      <th>Tipe sewa</th>
                      <th>Kapasitas</th>
                      {columns.map((col) => (
                        <th key={col.key} className="num">
                          {col.label}
                          <small>{col.note}</small>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ maxWidth: "26rem" }}>
                        <h3 className="va-table__title">{optionTitle}</h3>
                        {option?.description && (
                          <p className="va-text va-clamp-2">
                            {option.description}
                          </p>
                        )}
                      </td>
                      <td
                        style={{
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          paddingTop: "1.9rem",
                        }}
                      >
                        {option?.max_capacity
                          ? `${option.max_capacity} orang`
                          : "-"}
                      </td>
                      {columns.map((col) => {
                        const entries = entriesFor(col);
                        return (
                          <td key={col.key} className="num">
                            <div className="va-pc">
                              {entries.length === 0 ? (
                                <button
                                  type="button"
                                  className="va-pm__add"
                                  onClick={() => openCreate(prefillFor(col))}
                                >
                                  <Plus size={14} /> Tambah
                                </button>
                              ) : (
                                entries.map((entry) => (
                                  <div key={entry.id} className="va-pc__entry">
                                    <span className="va-pc__price">
                                      {formatRupiah(entry.price)}
                                    </span>
                                    <div className="va-pm__acts">
                                      {renderActions(entry)}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="va-note">
                Kelola tarif sewa secara transparan untuk weekday, weekend, long
                weekend, dan high season.
              </p>
            </>
          ) : (
            <>
              <div className="va-filter" role="group" aria-label="Filter musim">
                {["all", ...seasonNames].map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={seasonFilter === s}
                    onClick={() => {
                      setSeasonFilter(s);
                      setPage(1);
                    }}
                  >
                    {s === "all" ? "Semua" : humanize(s)}
                  </button>
                ))}
              </div>

              {listItems.length === 0 ? (
                <div className="va-empty">
                  <strong>Belum ada harga</strong>
                  <p className="va-text">
                    Tambahkan harga pertama untuk {optionTitle}.
                  </p>
                  <button
                    type="button"
                    className="va-btn va-btn--sm"
                    style={{ marginTop: "0.75rem" }}
                    onClick={() => openCreate()}
                  >
                    <Plus size={16} /> Tambah harga
                  </button>
                </div>
              ) : (
                <div className="va-adm-tablewrap">
                  <table className="va-adm-table">
                    <thead>
                      <tr>
                        <th className="is-center">No</th>
                        <th>Musim</th>
                        <th>Tipe hari</th>
                        <th>Harga / malam</th>
                        <th>Diperbarui</th>
                        <th className="is-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedItems.map((item, index) => (
                        <tr key={item.id}>
                          {console.log("item", item)}
                          <td className="is-center is-index">
                            {(page - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td>{humanize(item.season)}</td>
                          {/* <td>{humanize(item.season)}</td> */}
                          <td>{humanize(item.day_type)}</td>
                          <td>
                            <span className="va-adm-price">
                              {formatRupiah(item.price)}
                            </span>
                          </td>
                          <td className="va-muted">
                            {formatDate(item.updated_at)}
                          </td>
                          <td>{renderActions(item)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={setPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
