import { useSearchParams } from "react-router-dom";
import GlobalIndex from "../../../components/modal/Read";

const TABS = [
  { key: "Rental_option", label: "Pilihan Sewa" },
  { key: "Pricelist", label: "Harga Pilihan Sewa" },
];

const PAGES = {
  Rental_option: {
    path: "rental-options",
    title: "Pilihan Sewa",
    subtitle: "Kelola daftar Pilihan Sewa.",
    tableHead: [
      "title",
      "subtitle",
      "description",
      "max_capacity",
      "room_count",
      "image",
    ],
    is_paginate: true,
    pathDetail: "rental-options2",
    fields: [
      {
        name: "title",
        type: "text",
        label: "Title Rental Option",
        placeholder: "Input Title Rental Option Here!",
      },
      {
        name: "subtitle",
        type: "text",
        label: "Subtitle Rental Option",
        placeholder: "Input Subtitle Rental Option Here!",
      },
      {
        name: "description",
        type: "text",
        label: "Description Rental Option",
        placeholder: "Input Description Rental Option Here!",
      },
      {
        name: "max_capacity",
        type: "text",
        label: "Max Capacity",
        placeholder: "Input Max Capacity Here!",
      },
      {
        name: "room_count",
        type: "text",
        label: "Room Count",
        placeholder: "Input Room Count Here!",
      },
      {
        name: "sort_order",
        type: "number",
        label: "Sort Order (optional)",
        placeholder: "Input Sort Order Here!",
        hide_in_table: true,
      },
      {
        name: "image",
        type: "file",
        label: "Image Rental Option",
        placeholder: "Insert Your Image Here!",
        is_image: true,
      },
    ],
  },
  Pricelist: {
    path: "pricelists",
    title: "Harga Pilihan Sewa",
    subtitle: "Kelola daftar Harga Pilihan Sewa.",
    tableHead: [
      "title",
      "description",
      "max_capacity",
      "weekday_price",
      "weekend_price",
      "long_weekend_price",
      "high_season_price",
    ],
    is_paginate: true,
    isCard: false,
    imageSpecification: false,
    pathDetail: "rental-options",
    fields: [
      {
        name: "rental_option_id",
        type: "select",
        label: "Rental Option",
        placeholder: "Select Rental Option Here!",
      },
      {
        name: "weekday_price",
        type: "number",
        label: "Weekday Price",
        placeholder: "Input Weekday Price Here!",
      },
      {
        name: "weekend_price",
        type: "number",
        label: "Weekend Price",
        placeholder: "Input Weekend Price Here!",
      },
      {
        name: "long_weekend_price",
        type: "number",
        label: "Long Weekend Price",
        placeholder: "Input Long Weekend Price Here!",
      },
      {
        name: "high_season_price",
        type: "number",
        label: "High Season Price",
        placeholder: "Input High Season Price Here!",
      },
    ],
  },
};

export default function RentalOptionIndex() {
  const [params, setParams] = useSearchParams();
  const active =
    params.get("tab") === "Pricelist" ? "Pricelist" : "Rental_option";

  const selectTab = (key) =>
    setParams(key === "Rental_option" ? {} : { tab: key }, { replace: true });

  const tabs = (
    <div className="va-tabs" role="tablist" aria-label="Bagian Rental_option">
      {TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          role="tab"
          aria-selected={active === t.key}
          className="va-tab"
          onClick={() => selectTab(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );

  return <GlobalIndex tabs={tabs} {...PAGES[active]} />;
}
