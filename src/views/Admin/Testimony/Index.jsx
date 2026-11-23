import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Star,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import useFetch from "../../../hooks/useFetch";
import { useVillaList } from "../../../hooks/Usevillaquery";
import Pagination from "../../../components/Pagination";
import GlobalCreateUpdateModal from "../../../components/modal/CreateAndUpdate";
import "../../../assets/styles/villa.css";

const PAGE_SIZE = 5;

export default function TestimonyIndex() {
  const { delete: destroy } = useFetch();
  const queryClient = useQueryClient();
  const { get } = useFetch();

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isCreate, setIsCreate] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const {
    data: rawData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["testimonies-admin-paginated", page, PAGE_SIZE],
    queryFn: async () => {
      const resp = await get(
        `testimonies?page=${page}&size=${PAGE_SIZE}&sort=asc`,
      );
      if (!resp.status)
        throw new Error(
          typeof resp.error === "string" ? resp.error : "Gagal memuat data",
        );
      return resp.data;
    },
    staleTime: 60 * 1000,
  });

  console.log(rawData);
  // Membaca data dan metadata pagination dengan benar sesuai JSON dari server
  const testimonies = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];
  const totalPages =
    rawData?.pagination?.total_pages ||
    Math.ceil(
      (rawData?.pagination?.total_items || testimonies.length) / PAGE_SIZE,
    ) ||
    1;

  // Filter pencarian lokal berdasarkan komentar atau username
  const filtered = testimonies.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      String(item?.comment ?? "")
        .toLowerCase()
        .includes(q) ||
      String(item?.username ?? "")
        .toLowerCase()
        .includes(q)
    );
  });

  // Mutasi Hapus Testimoni
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const resp = await destroy(`testimonies/${id}`);
      if (!resp.status) throw resp.error;
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-testimonies-section"],
      });
      toast.success("Testimoni berhasil dihapus!");
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(typeof err === "string" ? err : "Gagal menghapus testimoni.");
      setDeleteId(null);
    },
  });

  const handleOpenCreate = () => {
    setIsCreate(true);
    setSelectedId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (id) => {
    setIsCreate(false);
    setSelectedId(id);
    setModalOpen(true);
  };

  const fields = [
    {
      name: "comment",
      type: "textarea",
      label: "Comment",
      placeholder: "Input Comment Here!",
      rows: 3,
    },
    {
      name: "username",
      type: "text",
      label: "Username",
      placeholder: "Input Username Here!",
    },
    {
      name: "star",
      type: "number",
      label: "Star (1-5)",
      placeholder: "Input Star Here!",
    },
    {
      name: "sort_order",
      type: "number",
      label: "Order",
      placeholder: "Input Order Here!",
    },
  ];

  return (
    <div>
      <header className="va-adm-head">
        <div>
          <h2 className="va-adm-title">Manajemen Testimony</h2>
          <p className="va-text">
            Kelola daftar testimoni pengguna.{" "}
            {!isLoading && !isError && (
              <span className="va-adm-count">
                · {rawData?.pagination?.total_items ?? testimonies.length} data
              </span>
            )}
          </p>
        </div>
        <div
          className="va-adm-actions"
          style={{ display: "flex", gap: "0.75rem" }}
        >
          <button type="button" className="va-btn" onClick={handleOpenCreate}>
            <Plus size={16} /> Tambah Testimony
          </button>
        </div>
      </header>

      {/* Baris Pencarian */}
      <div
        className="va-field"
        style={{ maxWidth: "26rem", marginBottom: "1.5rem" }}
      >
        <label className="va-label" htmlFor="testi-search">
          Cari testimoni
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="testi-search"
            className="va-input"
            placeholder="Cari berdasarkan komentar atau username..."
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
            }}
          >
            <Search size={16} />
          </span>
        </div>
      </div>

      {isError ? (
        <div className="va-alert" role="alert">
          <AlertCircle size={16} />
          <span>Gagal memuat testimoni: {error?.message}</span>
        </div>
      ) : isLoading ? (
        <div style={{ display: "grid", gap: "1px" }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="va-skel" style={{ height: "3.5rem" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="va-empty">
          <strong>Tidak ada testimoni</strong>
          <p className="va-text">
            {query
              ? "Pencarian tidak ditemukan."
              : "Belum ada data testimoni yang ditambahkan."}
          </p>
        </div>
      ) : (
        <>
          <div className="va-adm-tablewrap">
            <table className="va-adm-table">
              <thead>
                <tr>
                  <th style={{ width: "4rem" }}>No</th>
                  <th>Comment</th>
                  <th>Username</th>
                  <th style={{ width: "8rem" }}>Star</th>
                  <th
                    className="is-right"
                    style={{ width: "8rem", textAlign: "right" }}
                  >
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <span
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {item.comment}
                      </span>
                    </td>
                    <td>
                      <strong>{item.username}</strong>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          color: "#f59e0b",
                        }}
                      >
                        <Star size={16} fill="#f59e0b" />
                        <span style={{ fontWeight: 600, color: "var(--fg)" }}>
                          {item.star ?? "-"}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div
                        className="va-adm-actions"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <button
                          type="button"
                          className="va-icon-btn va-icon-btn--sm"
                          title="Edit"
                          onClick={() => handleOpenEdit(item.id)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          className="va-icon-btn va-icon-btn--sm"
                          title="Hapus"
                          style={{ color: "#ef4444" }}
                          onClick={() => setDeleteId(item.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Komponen Paginasi */}
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
          </div>{" "}
        </>
      )}

      {/* Modal Tambah/Edit */}
      <GlobalCreateUpdateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        isCreate={isCreate}
        id={selectedId}
        path="testimonies"
        title="Testimony"
        fields={fields}
      />

      {/* Modal Konfirmasi Hapus */}
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
              background: "var(--bg, #fff)",
            }}
          >
            <h3 className="va-h3" style={{ marginBottom: "0.5rem" }}>
              Hapus Testimoni?
            </h3>
            <p
              className="va-text"
              style={{ marginBottom: "1.5rem", fontSize: "0.9rem" }}
            >
              Tindakan ini tidak dapat dibatalkan. Apakah Anda yakin ingin
              menghapus testimoni ini?
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
                disabled={deleteMutation.isPending}
                onClick={() => setDeleteId(null)}
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
                {deleteMutation.isPending ? (
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
