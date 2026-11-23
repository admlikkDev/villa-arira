import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Users,
  CheckCircle2,
  Heart,
  ShieldCheck,
  ListChecks,
  GripVertical,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import useFetch from "../../../hooks/useFetch";
import { formatRupiah } from "../../../hooks/Usevillaquery";
import Pagination from "../../../components/Pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import "../../../assets/styles/villa.css";

const PAGE_SIZE = 6;

const INITIAL_FORM = {
  title: "",
  subtitle: "",
  price: "",
  max_capacity: "",
  type: "per_hour",
  requires_approval: true,
  is_wedding: false,
  sort_order: 1,
};

export default function PackageIndex() {
  const { get, post, put, delete: destroy } = useFetch();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  // State Modal Form Package (Create / Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  // State Modal Kelola List Rincian Paket (`villa-package-lists`)
  const [activePackage, setActivePackage] = useState(null);
  const [newListText, setNewListText] = useState("");
  const [newListOrder, setNewListOrder] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  // 1. Fetch Semua Paket Event
  const {
    data: rawData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-villa-packages-paginated", page, PAGE_SIZE],
    queryFn: async () => {
      const resp = await get(
        `villa-packages?page=${page}&size=${PAGE_SIZE}&sort=asc`,
      );
      if (!resp.status)
        throw new Error(
          typeof resp.error === "string" ? resp.error : "Gagal memuat data",
        );
      return resp.data;
    },
    staleTime: 60 * 1000,
  });

  const packages = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];

  const totalPages =
    rawData?.pagination?.total_pages ||
    Math.ceil(
      (rawData?.pagination?.total_items || packages.length) / PAGE_SIZE,
    ) ||
    1;

  const { data: packageLists = [], isFetching: isFetchingLists } = useQuery({
    queryKey: ["admin-villa-package-lists", activePackage?.id],
    enabled: Boolean(activePackage?.id),
    queryFn: async () => {
      const resp = await get(`villa-packages/${activePackage.id}`);
      if (!resp.status) throw new Error(resp.error || "Gagal memuat list");
      const detail = resp.data?.data ?? resp.data;
      const lists = detail?.lists || detail?.villa_package_lists || [];
      return [...lists].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
      );
    },
  });

  const filtered = packages.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(item?.title ?? "")
        .toLowerCase()
        .includes(q) ||
      String(item?.subtitle ?? "")
        .toLowerCase()
        .includes(q)
    );
  });

  const savePackage = useMutation({
    mutationFn: async (payload) => {
      const resp = editingItem
        ? await put(`villa-packages/${editingItem.id}`, payload)
        : await post("villa-packages", payload);
      if (!resp.status)
        throw resp.message || resp.error || "Gagal menyimpan paket";
      return resp.data;
    },
    onSuccess: () => {
      toast.success(
        editingItem ? "Paket berhasil diperbarui!" : "Paket berhasil dibuat!",
      );
      queryClient.invalidateQueries({
        queryKey: ["admin-villa-packages-paginated"],
      });
      closeFormModal();
    },
    onError: (err) =>
      toast.error(typeof err === "string" ? err : "Gagal menyimpan paket."),
  });

  // Mutasi Hapus Package
  const deletePackageMutation = useMutation({
    mutationFn: async (id) => {
      const resp = await destroy(`villa-packages/${id}`);
      if (!resp.status) throw resp.error;
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-villa-packages-paginated"],
      });
      toast.success("Paket berhasil dihapus!");
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(typeof err === "string" ? err : "Gagal menghapus paket.");
      setDeleteId(null);
    },
  });

  // Mutasi Tambah List Rincian (`villa-package-lists`)
  const addPackageList = useMutation({
    mutationFn: async () => {
      const resp = await post("villa-package-lists", {
        text: newListText.trim(),
        villa_package_id: Number(activePackage.id),
        sort_order: Number(newListOrder) || 1,
      });
      if (!resp.status) throw resp.message || "Gagal menambah rincian";
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Rincian ditambahkan!");
      setNewListText("");
      setNewListOrder((prev) => Number(prev) + 1);
      queryClient.invalidateQueries({
        queryKey: ["admin-villa-package-lists", activePackage?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-villa-packages-paginated"],
      });
    },
    onError: (err) => toast.error(err.message || "Gagal menambah rincian"),
  });

  // Mutasi Hapus List Rincian
  const deleteListMutation = useMutation({
    mutationFn: async (listId) => {
      const resp = await destroy(`villa-package-lists/${listId}`);
      if (!resp.status) throw resp.message || "Gagal menghapus rincian";
      return resp.data;
    },
    onSuccess: () => {
      toast.success("Rincian dihapus.");
      queryClient.invalidateQueries({
        queryKey: ["admin-villa-package-lists", activePackage?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-villa-packages-paginated"],
      });
    },
    onError: (err) => toast.error(err.message || "Gagal menghapus rincian"),
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setForm({ ...INITIAL_FORM, sort_order: packages.length + 1 });
    setModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setEditingItem(pkg);
    setForm({
      title: pkg.title || "",
      subtitle: pkg.subtitle || "",
      price: pkg.price ?? "",
      max_capacity: pkg.max_capacity ?? "",
      type: pkg.type === "one_time" ? "one_time" : "per_hour",
      requires_approval: Boolean(pkg.requires_approval),
      is_wedding: Boolean(pkg.is_wedding),
      sort_order: pkg.sort_order ?? 1,
    });
    setModalOpen(true);
  };

  const closeFormModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setForm(INITIAL_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Judul paket wajib diisi.");
    savePackage.mutate({
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      price: Number(form.price) || 0,
      max_capacity: Number(form.max_capacity) || 1,
      type: form.type,
      requires_approval: Boolean(form.requires_approval),
      is_wedding: Boolean(form.is_wedding),
      sort_order: Number(form.sort_order) || 1,
    });
  };

  return (
    <div>
      <header className="va-adm-head">
        <div>
          <h2 className="va-adm-title">Manajemen Villa Packages</h2>
          <p className="va-text">
            Kelola daftar paket event, wedding, dan rincian fasilitasnya.{" "}
            {!isLoading && !isError && (
              <span className="va-adm-count">
                · {rawData?.pagination?.total_items ?? packages.length} data
              </span>
            )}
          </p>
        </div>
        <div
          className="va-adm-actions"
          style={{ display: "flex", gap: "0.75rem" }}
        >
          <button type="button" className="va-btn" onClick={openCreateModal}>
            <Plus size={16} /> Tambah Villa Packages
          </button>
        </div>
      </header>

      {/* Baris Pencarian */}
      <div
        className="va-field"
        style={{ maxWidth: "26rem", marginBottom: "1.5rem" }}
      >
        <label className="va-label" htmlFor="package-search">
          Cari paket
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="package-search"
            className="va-input"
            placeholder="Cari berdasarkan judul atau subtitle..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span
            style={{
              position: "absolute",
              right: "0.8rem",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              display: "grid",
              opacity: 0.5,
              color: "var(--fg)",
            }}
          >
            <Search size={16} />
          </span>
        </div>
      </div>

      {isError ? (
        <div className="va-alert" role="alert">
          <AlertCircle size={16} />
          <span>Gagal memuat paket: {error?.message}</span>
        </div>
      ) : isLoading ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="va-skel" style={{ height: "6rem" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="va-empty">
          <strong>Belum ada Villa Packages</strong>
          <p className="va-text">
            {query
              ? "Pencarian tidak ditemukan."
              : "Tekan tombol tambah untuk membuat paket pertama."}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((pkg) => {
              const itemLists = pkg.lists || pkg.villa_package_lists || [];
              return (
                <div
                  key={pkg.id}
                  style={{
                    background: "var(--paper)",
                    border: "1px solid var(--border, rgba(0,0,0,0.1))",
                    borderRadius: "12px",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                        }}
                      >
                        {pkg.is_wedding ? (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              background: "rgba(239, 68, 68, 0.1)",
                              color: "#ef4444",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontWeight: 600,
                            }}
                          >
                            <Heart size={11} /> Wedding
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              background: "rgba(59, 130, 246, 0.1)",
                              color: "#3b82f6",
                              fontWeight: 600,
                            }}
                          >
                            Event Umum
                          </span>
                        )}

                        {pkg.requires_approval && (
                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "4px",
                              background: "rgba(245, 158, 11, 0.1)",
                              color: "#f59e0b",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontWeight: 600,
                            }}
                          >
                            <ShieldCheck size={11} /> Approval
                          </span>
                        )}
                      </div>
                      <span
                        style={{ fontSize: "0.75rem", color: "var(--muted)" }}
                      >
                        #{pkg.sort_order ?? pkg.id}
                      </span>
                    </div>

                    <div>
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: "var(--fg)",
                        }}
                      >
                        {pkg.title}
                      </h3>
                      {pkg.subtitle && (
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--muted)",
                            marginTop: "0.2rem",
                          }}
                        >
                          {pkg.subtitle}
                        </p>
                      )}
                    </div>

                    <div
                      style={{
                        background: "var(--bg)",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        border: "1px solid var(--border, rgba(0,0,0,0.05))",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "var(--fg)",
                          }}
                        >
                          {formatRupiah(pkg.price)}
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--muted)",
                            marginLeft: "0.25rem",
                          }}
                        >
                          /{" "}
                          {pkg.type === "per_hour"
                            ? "jam"
                            : pkg.type === "one_time"
                              ? "sekali bayar"
                              : pkg.type}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.8rem",
                          color: "var(--muted)",
                        }}
                      >
                        <Users size={14} /> Maks. {pkg.max_capacity} org
                      </div>
                    </div>

                    {/* Preview List Rincian */}
                    <div
                      style={{
                        fontSize: "0.8rem",
                        display: "grid",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 600,
                          color: "var(--muted)",
                          textTransform: "uppercase",
                          fontSize: "0.7rem",
                        }}
                      >
                        Rincian Fasilitas ({itemLists.length})
                      </span>
                      {itemLists.length > 0 ? (
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: 0,
                            listStyle: "none",
                            display: "grid",
                            gap: "0.2rem",
                          }}
                        >
                          {itemLists.slice(0, 2).map((l) => (
                            <li
                              key={l.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.35rem",
                                color: "var(--fg)",
                              }}
                            >
                              <CheckCircle2
                                size={12}
                                style={{ color: "var(--primary, #1b4332)" }}
                              />
                              <span
                                style={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {l.text}
                              </span>
                            </li>
                          ))}
                          {itemLists.length > 2 && (
                            <li
                              style={{
                                fontSize: "0.75rem",
                                color: "var(--muted)",
                                paddingLeft: "1rem",
                              }}
                            >
                              +{itemLists.length - 2} rincian lainnya...
                            </li>
                          )}
                        </ul>
                      ) : (
                        <span
                          style={{
                            color: "var(--muted)",
                            fontStyle: "italic",
                            fontSize: "0.75rem",
                          }}
                        >
                          Belum ada daftar rincian.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer Card Aksi */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid var(--border, rgba(0,0,0,0.06))",
                      paddingTop: "0.75rem",
                    }}
                  >
                    <button
                      type="button"
                      className="va-btn va-btn--ghost va-btn--sm"
                      onClick={() => {
                        setActivePackage(pkg);
                        setNewListOrder(itemLists.length + 1);
                      }}
                      style={{
                        display: "flex",
                        gap: "0.35rem",
                        alignItems: "center",
                      }}
                    >
                      <ListChecks size={14} /> Kelola List
                    </button>

                    <div style={{ display: "flex", gap: "0.25rem" }}>
                      <button
                        type="button"
                        className="va-icon-btn va-icon-btn--sm"
                        title="Edit"
                        onClick={() => openEditModal(pkg)}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        className="va-icon-btn va-icon-btn--sm"
                        title="Hapus"
                        style={{ color: "#ef4444" }}
                        onClick={() => setDeleteId(pkg.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginasi */}
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}

      {/* MODAL 1: TAMBAH / EDIT PACKAGE */}
      <Dialog
        open={modalOpen}
        onOpenChange={(open) => !open && closeFormModal()}
      >
        <DialogContent className="sm:max-w-lg bg-[#faf6f0] border-[#3b2416]/20 text-[#3b2416]">
          <DialogHeader>
            <DialogTitle className="text-[#3b2416]">
              {editingItem ? "Edit Villa Package" : "Tambah Villa Package"}
            </DialogTitle>
            <DialogDescription className="text-[#3b2416]/70">
              Atur tarif, kapasitas, tipe hitungan waktu, dan ketentuan event
              booking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#3b2416] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Intimate Wedding Package"
                  className="w-full px-3 py-2 bg-white border border-[#3b2416]/20 rounded text-sm"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#3b2416] mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Penggunaan area taman & aula utama"
                  className="w-full px-3 py-2 bg-white border border-[#3b2416]/20 rounded text-sm"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b2416] mb-1">
                  Price (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="1000000"
                  className="w-full px-3 py-2 bg-white border border-[#3b2416]/20 rounded text-sm"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b2416] mb-1">
                  Type *
                </label>
                <select
                  className="w-full px-3 py-2 bg-white border border-[#3b2416]/20 rounded text-sm"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="per_hour">Per Hour (per_hour)</option>
                  <option value="one_time">One Time (one_time)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b2416] mb-1">
                  Max Capacity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="50"
                  className="w-full px-3 py-2 bg-white border border-[#3b2416]/20 rounded text-sm"
                  value={form.max_capacity}
                  onChange={(e) =>
                    setForm({ ...form, max_capacity: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3b2416] mb-1">
                  Sort Order
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 bg-white border border-[#3b2416]/20 rounded text-sm"
                  value={form.sort_order}
                  onChange={(e) =>
                    setForm({ ...form, sort_order: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Toggle Boolean: is_wedding & requires_approval */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <label className="flex items-start gap-2.5 p-3 bg-white border border-[#3b2416]/15 rounded cursor-pointer hover:bg-[#3b2416]/[0.02]">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#3b2416]"
                  checked={form.is_wedding}
                  onChange={(e) =>
                    setForm({ ...form, is_wedding: e.target.checked })
                  }
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#3b2416] block">
                    Is Wedding
                  </span>
                  <span className="text-[#3b2416]/60">
                    Kategori khusus Wedding
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 bg-white border border-[#3b2416]/15 rounded cursor-pointer hover:bg-[#3b2416]/[0.02]">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#3b2416]"
                  checked={form.requires_approval}
                  onChange={(e) =>
                    setForm({ ...form, requires_approval: e.target.checked })
                  }
                />
                <div className="text-xs">
                  <span className="font-semibold text-[#3b2416] block">
                    Requires Approval
                  </span>
                  <span className="text-[#3b2416]/60">
                    Wajib persetujuan admin
                  </span>
                </div>
              </label>
            </div>

            <DialogFooter className="pt-4 border-t border-[#3b2416]/10">
              <button
                type="button"
                onClick={closeFormModal}
                className="px-4 py-2 text-sm text-[#3b2416]/70 hover:bg-[#3b2416]/10 rounded"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={savePackage.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#faf6f0] bg-[#3b2416] hover:bg-[#2a190f] rounded disabled:opacity-50"
              >
                {savePackage.isPending && (
                  <Loader2 size={14} className="animate-spin" />
                )}
                {editingItem ? "Simpan Perubahan" : "Simpan Paket"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: KELOLA DAFTAR RINCIAN PAKET (`villa-package-lists`) */}
      <Dialog
        open={Boolean(activePackage)}
        onOpenChange={(open) => !open && setActivePackage(null)}
      >
        <DialogContent className="sm:max-w-lg bg-[#faf6f0] border-[#3b2416]/20 text-[#3b2416]">
          <DialogHeader>
            <DialogTitle className="text-[#3b2416]">
              Kelola List Paket
            </DialogTitle>
            <DialogDescription className="text-[#3b2416]/70">
              Daftar rincian fasilitas untuk paket{" "}
              <strong className="text-[#3b2416]">{activePackage?.title}</strong>
              .
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newListText.trim()) return;
              addPackageList.mutate();
            }}
            className="flex gap-2 items-center mt-2"
          >
            <input
              type="text"
              placeholder="Input Text Here! (misal: Sound System)"
              className="flex-1 px-3 py-2 bg-white border border-[#3b2416]/20 rounded text-sm"
              value={newListText}
              onChange={(e) => setNewListText(e.target.value)}
            />
            <input
              type="number"
              min="1"
              title="Sort Order"
              className="w-16 px-2.5 py-2 bg-white border border-[#3b2416]/20 rounded text-sm text-center"
              value={newListOrder}
              onChange={(e) => setNewListOrder(e.target.value)}
            />
            <button
              type="submit"
              disabled={addPackageList.isPending || !newListText.trim()}
              className="px-3.5 py-2 bg-[#3b2416] hover:bg-[#2a190f] text-[#faf6f0] text-sm font-medium rounded disabled:opacity-50"
            >
              {addPackageList.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Tambah"
              )}
            </button>
          </form>

          <div className="mt-3 max-h-64 overflow-y-auto space-y-2 pr-1">
            {isFetchingLists ? (
              <div className="text-center py-8 text-sm text-[#3b2416]/60 flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Memuat list...
              </div>
            ) : packageLists.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#3b2416]/50 border border-dashed border-[#3b2416]/20 rounded">
                Belum ada list rincian untuk paket ini.
              </div>
            ) : (
              packageLists.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 bg-white rounded border border-[#3b2416]/15 text-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <GripVertical size={14} className="text-[#3b2416]/40" />
                    <span className="text-xs font-mono text-[#3b2416]/40">
                      #{item.sort_order}
                    </span>
                    <span className="text-[#3b2416]">{item.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteListMutation.mutate(item.id)}
                    disabled={deleteListMutation.isPending}
                    className="p-1 text-[#3b2416]/50 hover:text-red-700 transition"
                    title="Hapus"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-[#3b2416]/10">
            <button
              type="button"
              onClick={() => setActivePackage(null)}
              className="px-4 py-2 text-sm font-medium bg-[#3b2416]/10 hover:bg-[#3b2416]/20 text-[#3b2416] rounded"
            >
              Selesai
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Konfirmasi Hapus Paket */}
      {deleteId && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "grid",
            placeItems: "center",
            zIndex: 50,
            padding: "1rem",
          }}
        >
          <div
            className="va-paper"
            style={{
              maxWidth: "400px",
              width: "100%",
              padding: "1.5rem",
              borderRadius: "12px",
              background: "var(--paper)",
              color: "var(--fg)",
              border: "1px solid var(--border, rgba(0,0,0,0.1))",
            }}
          >
            <h3
              className="va-h3"
              style={{ marginBottom: "0.5rem", color: "var(--fg)" }}
            >
              Hapus Paket Villa?
            </h3>
            <p
              className="va-text"
              style={{
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
                color: "var(--muted)",
              }}
            >
              Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin
              menghapus paket ini beserta seluruh rinciannya?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                type="button"
                className="va-btn va-btn--ghost"
                disabled={deletePackageMutation.isPending}
                onClick={() => setDeleteId(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="va-btn"
                style={{ background: "#ef4444", color: "#fff" }}
                disabled={deletePackageMutation.isPending}
                onClick={() => deletePackageMutation.mutate(deleteId)}
              >
                {deletePackageMutation.isPending ? (
                  <Loader2 className="va-spin" size={16} />
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}