import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  Globe,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import AdminPanelLayout from "../../layouts/AdminPanelLayout";
import "../../../assets/styles/villa.css";
import useFetch from "../../../hooks/useFetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function ApplicationIndex() {
  const { get, post, put } = useFetch();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    phone_number: "",
    email: "",
    instagram_link: "",
    tiktok_link: "",
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState("");
  const [errors, setErrors] = useState({});

  // Ambil data application yang sudah ada
  const {
    data: appData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["application-setting"],
    queryFn: async () => {
      const resp = await get("application");
      if (!resp.status) throw new Error(resp.error);
      // Mendukung struktur data array atau objek tunggal
      const raw = resp.data?.data ?? resp.data;
      return Array.isArray(raw) ? raw[0] : raw;
    },
  });

  // Isi form otomatis saat data berhasil dimuat
  useEffect(() => {
    if (appData) {
      setFormData({
        title: appData.title || "",
        phone_number: appData.phone_number || "",
        email: appData.email || "",
        instagram_link: appData.instagram_link || "",
        tiktok_link: appData.tiktok_link || "",
        logo: null, // File baru kosong secara default
      });
      setLogoPreview(appData.logo || "");
    }
  }, [appData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setLogoPreview(URL.createObjectURL(file)); // Preview gambar lokal
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const mutation = useMutation({
    mutationFn: async (payload) => {
      const isUpdate = Boolean(appData?.id);
      const endpoint = "application";

      // Karena ada file upload, gunakan FormData
      const fd = new FormData();
      Object.keys(payload).forEach((key) => {
        if (
          payload[key] !== null &&
          payload[key] !== undefined &&
          payload[key] !== ""
        ) {
          fd.append(key, payload[key]);
        }
      });

      // Gunakan PUT atau POST tergantung apakah data sudah ada
      const resp = isUpdate
        ? await put(endpoint, fd)
        : await post(endpoint, fd);
      if (!resp.status) throw resp.error;
      return resp.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["application-setting"] });
      toast.success("Pengaturan aplikasi berhasil diperbarui!");
      setTimeout(() => {
        location.reload()
      }, 1000);
    },
    onError: (err) => {
      if (typeof err === "object" && err !== null) {
        setErrors(err);
      } else {
        setErrors({ general: String(err) });
      }
      toast.error("Gagal menyimpan pengaturan aplikasi.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    mutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div>
        <div className="va-state" style={{ minHeight: "60vh" }}>
          <Loader2 className="va-spin" size={32} />
          <p>Memuat pengaturan aplikasi...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="va-alert" role="alert" style={{ margin: "2rem" }}>
          <AlertCircle size={20} />
          <span>Gagal memuat data: {error?.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="va-adm-head">
        <div>
          <h2 className="va-adm-title">Manajemen Application</h2>
          <p className="va-text">
            Kelola informasi umum, kontak, dan logo aplikasi.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="va-paper"
        style={{ padding: "2rem", borderRadius: "12px", maxWidth: "800px" }}
      >
        {errors.general && (
          <div
            className="va-alert"
            role="alert"
            style={{ marginBottom: "1.5rem" }}
          >
            <AlertCircle size={16} />
            <span>{errors.general}</span>
          </div>
        )}

        <div style={{ display: "grid", gap: "1.25rem" }}>
          {/* Title */}
          <div className="va-field">
            <label className="va-label" htmlFor="title">
              Title Application
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="title"
                name="title"
                type="text"
                className="va-input"
                placeholder="Input Title Application Here!"
                value={formData.title}
                onChange={handleChange}
                disabled={mutation.isPending}
              />
              <Building2
                size={18}
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.4,
                }}
              />
            </div>
            {errors.title && <p className="va-error">{errors.title}</p>}
          </div>

          {/* Phone Number & Email (Grid 2 Kolom) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="va-field">
              <label className="va-label" htmlFor="phone_number">
                Phone Number
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  className="va-input"
                  placeholder="Input Your Phone Number Here!"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                />
                <Phone
                  size={18}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.4,
                  }}
                />
              </div>
              {errors.phone_number && (
                <p className="va-error">{errors.phone_number}</p>
              )}
            </div>

            <div className="va-field">
              <label className="va-label" htmlFor="email">
                Email
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="va-input"
                  placeholder="Input Your Email Here!"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                />
                <Mail
                  size={18}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.4,
                  }}
                />
              </div>
              {errors.email && <p className="va-error">{errors.email}</p>}
            </div>
          </div>

          {/* Social Media Links (Instagram & Tiktok) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div className="va-field">
              <label className="va-label" htmlFor="instagram_link">
                Instagram Link
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="instagram_link"
                  name="instagram_link"
                  type="text"
                  className="va-input"
                  placeholder="Insert Instagram Link Here!"
                  value={formData.instagram_link}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                />
                <Globe
                  size={18}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.4,
                  }}
                />
              </div>
              {errors.instagram_link && (
                <p className="va-error">{errors.instagram_link}</p>
              )}
            </div>

            <div className="va-field">
              <label className="va-label" htmlFor="tiktok_link">
                Tiktok Link
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="tiktok_link"
                  name="tiktok_link"
                  type="text"
                  className="va-input"
                  placeholder="Insert Tiktok Link Here!"
                  value={formData.tiktok_link}
                  onChange={handleChange}
                  disabled={mutation.isPending}
                />
                <Video
                  size={18}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    opacity: 0.4,
                  }}
                />
              </div>
              {errors.tiktok_link && (
                <p className="va-error">{errors.tiktok_link}</p>
              )}
            </div>
          </div>

          {/* Logo Upload & Preview */}
          <div className="va-field">
            <label className="va-label" htmlFor="logo">
              Logo Aplikasi
            </label>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
                marginTop: "0.5rem",
              }}
            >
              {logoPreview && (
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.1)",
                    background: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <div style={{ flex: 1 }}>
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  className="va-input"
                  onChange={handleChange}
                  disabled={mutation.isPending}
                />
                <p
                  className="va-muted"
                  style={{ fontSize: "0.8rem", marginTop: "0.3rem" }}
                >
                  Unggah file gambar baru (PNG, JPG) jika ingin mengubah logo
                  aplikasi.
                </p>
              </div>
            </div>
            {errors.logo && <p className="va-error">{errors.logo}</p>}
          </div>
        </div>

        {/* Tombol Simpan */}
        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            type="submit"
            className="va-btn"
            disabled={mutation.isPending}
            style={{ padding: "0.75rem 2rem" }}
          >
            {mutation.isPending ? (
              <Loader2 className="va-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {mutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}
