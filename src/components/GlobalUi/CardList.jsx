import {
  ArrowUpRight,
  BedDouble,
  Check,
  ImageOff,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import GlobalCreateUpdateModal from "../modal/CreateAndUpdate";
import GlobalDeleteModal from "../modal/Delete";
import "../../assets/styles/villa.css";

const formatRupiah = (value) => {
  const number = Number(value);
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    Number.isNaN(number)
  )
    return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);
};

// Daftar centang dengan batas tampilan agar tinggi kartu tetap seragam
function CheckList({ label, items, getText, emptyText, limit = 4 }) {
  const visible = items.slice(0, limit);
  const rest = items.length - visible.length;

  return (
    <div className="va-adm-card__group">
      <div className="va-adm-card__grouphead">
        <span>{label}</span>
        <span>{items.length}</span>
      </div>
      {items.length > 0 ? (
        <>
          <ul className="va-checks">
            {visible.map((item, index) => (
              <li key={item?.id ?? index}>
                <Check size={16} strokeWidth={2} />
                <span>{getText(item) ?? "-"}</span>
              </li>
            ))}
          </ul>
          {rest > 0 && <span className="va-adm-card__more">+{rest} lainnya</span>}
        </>
      ) : (
        <p className="va-muted" style={{ margin: 0, fontSize: "0.88rem" }}>
          {emptyText}
        </p>
      )}
    </div>
  );
}

export function GlobalCardList({
  data = null,
  path,
  title,
  fields,
  initialValues,
  hasId,
  isDetail = false,
  isPackagePage = false,
  isRentalOptionPage = false,
  isWisataTerdekatPage = false
}) {
  const navigate = useNavigate();

  // Hooks harus dipanggil sebelum early return
  const [openModal, setOpenModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [id, setId] = useState(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [imgFailed, setImgFailed] = useState(false);

  if (!data) return null;

  const heading = data?.title ?? data?.text ?? "Untitled";
  const price = formatRupiah(data?.price);
  const lists = Array.isArray(data?.lists) ? data.lists : [];
  const transports = Array.isArray(data?.transports) ? data.transports : [];

  const hasImageSlot = data?.image !== undefined;
  const hasFacts = data?.max_capacity !== undefined || data?.room_count !== undefined;

  // Satu tombol detail; tujuan mengikuti jenis data (sama seperti sebelumnya)
//   const detailPath = isDetail
//     ? `/admin/${path}/${data?.id}`
//     : data
//       ? `/admin/package/${data?.id}`
//       :  `/admin/wisata-terdekat/${data?.id}`

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

      {hasImageSlot && (
        <div className="va-adm-card__img">
          {data?.image && !imgFailed ? (
            <img
              src={data.image}
              alt={heading}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="va-img-fallback">
              <ImageOff size={24} strokeWidth={1.5} />
              <span>Foto belum tersedia</span>
            </div>
          )}
          {data?.sort_order !== undefined && (
            <span className="va-adm-chip">#{data.sort_order}</span>
          )}
        </div>
      )}

      <div className="va-adm-card__body">
        <div>
          {data?.subtitle && (
            <span className="va-label" style={{ display: "block", marginBottom: "0.35rem" }}>
              {data.subtitle}
            </span>
          )}
          <h3 className="va-h3">{heading}</h3>
        </div>

        {data?.description && (
          <p className="va-text va-clamp-3">{data.description}</p>
        )}

        {hasFacts && (
          <div className="va-adm-card__facts">
            {data?.room_count !== undefined && (
              <span>
                <BedDouble size={16} strokeWidth={1.5} /> {data.room_count} kamar
              </span>
            )}
            {data?.max_capacity !== undefined && (
              <span>
                <Users size={16} strokeWidth={1.5} /> Maks. {data.max_capacity} orang
              </span>
            )}
          </div>
        )}

        {data?.price !== undefined && (
          <div className="va-adm-card__price">
            <span className="va-price-note" style={{ marginTop: 0 }}>
              Harga
            </span>
            {price ? (
              <span className="va-price">{price}</span>
            ) : (
              <span className="va-muted" style={{ fontSize: "0.88rem" }}>
                Harga belum diatur
              </span>
            )}
          </div>
        )}

        {data?.lists !== undefined && (
          <CheckList
            label="Isi paket"
            items={lists}
            getText={(item) => item?.text}
            emptyText="Belum ada isi paket"
          />
        )}

        {data?.transports !== undefined && (
          <CheckList
            label="Transportasi"
            items={transports}
            getText={(item) => item?.vehicle}
            emptyText="Belum ada transportasi"
          />
        )}
      </div>

      <div className="va-adm-card__foot">
        {/* {detailPath && ( */}
          <button
            type="button"
            className="va-btn va-btn--sm va-adm-card__detail"
            onClick={() => navigate(isPackagePage ? `/admin/package/${data?.id}` : isRentalOptionPage ? `/admin/rental-options/${data?.id}` : isWisataTerdekatPage ? `/admin/wisata-terdekat/${data?.id}` : `/admin/${path}/${data?.id}`)}
          >
            {isPackagePage ? "Tambahkan List Paket" : isRentalOptionPage ? "Tambahkan Harga Sewa" : isWisataTerdekatPage ? "Tambahkan Transportasi" : "Detail"} <ArrowUpRight size={14} />
          </button>
        {/* )} */}
        <button
          type="button"
          className="va-btn va-btn--ghost va-btn--sm"
          onClick={() => {
            setOpenModal(true);
            setId(data?.id);
            setIsCreate(false);
          }}
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          type="button"
          className="va-btn va-btn--ghost va-btn--sm"
          onClick={() => {
            setDeleteId(data?.id);
            setOpenDeleteModal(true);
          }}
        >
          <Trash2 size={14} /> Hapus
        </button>
      </div>
    </article>
  );
}