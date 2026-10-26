import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  ImageOff,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import AdminPanelLayout from "../../views/layouts/AdminPanelLayout";
import GlobalDeleteModal from "./Delete";
import GlobalCreateUpdateModal from "./CreateAndUpdate";
import { GlobalCardList } from "../GlobalUi/CardList";
import MasterIcon from "../icons/MasterIcon";
import "../../assets/styles/villa.css";
import { GlobalCardImage } from "../GlobalUi/CardImage";

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

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Contoh hasil: [1, 'dots-l', 4, 5, 6, 'dots-r', 20]
const getPageItems = (current, total, siblings = 1) => {
  const maxShown = siblings * 2 + 5;
  if (total <= maxShown) return range(1, total);

  const left = Math.max(current - siblings, 2);
  const right = Math.min(current + siblings, total - 1);
  const showLeftDots = left > 2;
  const showRightDots = right < total - 1;
  const edge = 3 + siblings * 2;

  if (!showLeftDots) return [...range(1, edge), "dots-r", total];
  if (!showRightDots) return [1, "dots-l", ...range(total - edge + 1, total)];
  return [1, "dots-l", ...range(left, right), "dots-r", total];
};

function EmptyState({ title }) {
  return (
    <div className="va-empty">
      <strong>Belum ada data {title}</strong>
      <p className="va-text">
        Tekan tombol tambah untuk membuat {title} pertama.
      </p>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

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
          onClick={() => onChange(Math.max(1, page - 1))}
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
          onClick={() => onChange(Math.min(totalPages, page + 1))}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}

export default function GlobalIndex({
  path,
  title,
  subtitle,
  tableHead,
  fields,
  initialValues,
  createButton = true,
  deleteButton = true,
  hasId = true,
  navigatePath = null,
  isCard = false,
  is_paginate = false,
  is_logo = false,
  imageSpecification = false,
  tabs = null,
  pathDetail,
  editButton = true,
  selectLogo = false,
  param = null,
}) {
  const { get } = useFetch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [id, setId] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    setPage(1);
    setOpenModal(false);
    setOpenDeleteModal(false);
  }, [path]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: [`admin-${path}-section`, page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const resp = await get(
        is_paginate ? `${path}?page=${page}&size=6${param ?? ""}` : path,
      );
      if (!resp.status) throw new Error(resp.error);
      return resp.data;
    },
  });

  let items = [];
  let itemPaginates;
  if (data) {
    const rawData = data?.data || data;
    if (Array.isArray(rawData)) {
      items = rawData;
      itemPaginates = data?.pagination;
    } else if (typeof rawData === "object" && rawData !== null) {
      items = [rawData];
      itemPaginates = [data?.pagination];
    }
  }

  const visibleFields = (tableHead ?? []).filter((f) => !f.hide_in_table);

  const renderCell = (field, value) => {
    const name = typeof field === "string" ? field : field.name;

    if (field?.is_image) {
      return value ? (
        <img src={value} alt={field.label ?? name} className="va-adm-thumb" />
      ) : (
        <div className="va-adm-thumb va-adm-thumb--empty">
          <ImageOff size={18} />
        </div>
      );
    }
    if (name === "price") {
      return <span className="va-adm-price">{formatRupiah(value)}</span>;
    }
    if (name === "logo" || name === "icon" || field?.logo) {
      if (value?.image) {
        return <img src={value?.image} alt="logo" className="va-adm-thumb" />;
      }
      return <img src={value} alt="logo" className="va-adm-thumb" />;
    }

    if (name === "logo_id") {
      return <img src={value?.image} alt="logo" height={50} width={50} />;
    }

    if (name === "image") {
      return <img src={value} alt="image" className="va-adm-thumb" />;
    }
    // pengaman: jangan pernah render object langsung
    if (value !== null && typeof value === "object") {
      return <p className="va-clamp-2">{value.name ?? value.title ?? "-"}</p>;
    }
    return (
      <p className="va-clamp-2" style={{ maxWidth: "24rem" }}>
        {value ?? "-"}
      </p>
    );
  };

  return (
    <AdminPanelLayout>
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
        pathDetail={pathDetail}
        selectLogo={selectLogo}
        is_imageSpecification={imageSpecification}
      />
      <GlobalDeleteModal
        open={openDeleteModal}
        onOpenChange={setOpenDeleteModal}
        id={deleteId}
        path={path}
        queryKey={`admin-${path}-section`}
      />

      {tabs}

      <header className="va-adm-head">
        <div>
          <h2 className="va-adm-title">Manajemen {title}</h2>
          <p className="va-text">
            {subtitle}
            {!isPending && !isError && (
              <span className="va-adm-count"> · {items.length} data</span>
            )}
          </p>
        </div>
        {
          // is_notSpecificationGallery
          imageSpecification && (
            <div className="va-adm-actions">
              <button
                type="button"
                title="Edit"
                aria-label="Edit"
                className="va-btn va-btn--sm"
                onClick={() => {
                  setOpenModal(true);
                  setIsCreate(false);
                }}
              >
                <Pencil size={15} /> Edit Images
              </button>
            </div>
          )
        }
        
        {createButton && (
          <div className="va-adm-actions">
            <button
              type="button"
              className="va-btn va-btn--sm"
              onClick={() => {
                setOpenModal(true);
                setIsCreate(true);
                setId(null);
              }}
            >
              <Plus size={16} /> Tambah {title}
            </button>
          </div>
        )}
      </header>

      {isError ? (
        <div className="va-alert" role="alert">
          <AlertCircle size={16} />
          <span>Gagal memuat data: {error.message}</span>
        </div>
      ) : isPending ? (
        isCard ? (
          <div className="va-adm-cards">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="va-skel" style={{ height: "22rem" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1px" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="va-skel" style={{ height: "3.5rem" }} />
            ))}
          </div>
        )
      ) : items.length === 0 ? (
        <EmptyState title={title} />
      ) : isCard ? (
        <div className="va-adm-cards">
          {items.map((item, index) => {
            if (imageSpecification) {
              const itemImages = [
                item?.image1,
                item?.image2,
                item?.image3,
              ].filter(Boolean);

              return itemImages.map((imgUrl, imgIndex) => (
                <GlobalCardImage
                  key={`${item?.id ?? index}-${imgIndex}`}
                  image={imgUrl}
                  title={`${title} #${imgIndex + 1}`}
                  description={`Image source: ${imgUrl}`}
                  is_image={true}
                />
              ));
            }

            return (
              <GlobalCardList
                key={item?.id || index}
                data={item}
                path={path}
                title={title}
                fields={fields}
                initialValues={initialValues}
                hasId={hasId}
              />
            );
          })}
        </div>
      ) : (
        <div className="va-adm-tablewrap">
          <table className="va-adm-table">
            <thead>
              <tr>
                <th className="is-center">No</th>
                {tableHead?.map((head) => (
                  <th key={head}>{head}</th>
                ))}
                <th className="is-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* {console.log(items)} */}
              {items.map((item, index) => (
                <tr key={item.id ?? index}>
                  <td className="is-center is-index">
                    {(page - 1) * 6 + index + 1}
                  </td>
                  {visibleFields.map((field) => (
                    <td key={field.name}>
                      {renderCell(
                        field,
                        item[field] ||
                          item?.logo?.image ||
                          item["logo"] ||
                          item?.rental_option[field] ||
                          item?.logo[field],
                        item?.image,
                      )}
                    </td>
                  ))}
                  <td>
                    <div className="va-adm-actions">
                      {editButton && (
                        <button
                          type="button"
                          title="Edit"
                          aria-label="Edit"
                          className="va-icon-btn va-icon-btn--sm"
                          onClick={() => {
                            setOpenModal(true);
                            setId(item.id);
                            setIsCreate(false);
                          }}
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                      {navigatePath && (
                        <button
                          type="button"
                          title="Detail"
                          aria-label="Detail"
                          className="va-icon-btn va-icon-btn--sm"
                          onClick={() =>
                            navigate(`${navigatePath}/${item?.id}`)
                          }
                        >
                          <Eye size={15} />
                        </button>
                      )}
                      {deleteButton && (
                        <button
                          type="button"
                          title="Hapus"
                          aria-label="Hapus"
                          className="va-icon-btn va-icon-btn--sm"
                          onClick={() => {
                            setDeleteId(item.id);
                            setOpenDeleteModal(true);
                          }}
                        >
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

      {is_paginate && (
        <Pagination
          page={page}
          totalPages={itemPaginates?.total_pages || 0}
          onChange={setPage}
        />
      )}
    </AdminPanelLayout>
  );
}
