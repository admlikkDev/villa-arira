import GlobalIndex from "../../../components/modal/Read";

export default function RentalOptionIndex() {
  const fields = [
    {
      name: "title",
      type: "text",
      label: "Input Type Rental Option",
      placeholder: "Insert Your Input Type Rental Option Here!",
    },
    {
      name: "subtitle",
      type: "text",
      label: "Input Subtitle Rental Option",
      placeholder: "Insert Your Input Subtitle Rental Option Here!",
    },
    {
      name: "description",
      type: "text",
      label: "Input Description Rental Option",
      placeholder: "Insert Your Input Description Rental Option Here!",
    },
    {
      name: "max_capacity",
      type: "number",
      label: "Input Maximum Capacity Rental Option",
      placeholder: "Insert Your Input Maximum Capacity Rental Option Here!",
    },
    {
      name: "room_count",
      type: "number",
      label: "Input Room Count Rental Option",
      placeholder: "Insert Your Input Room Count Rental Option Here!",
    },
    {
      name: "image",
      type: "file",
      label: "Input Image Rental Option",
      placeholder: "Insert Your Input Image Rental Option Here!",
    },
    {
      name: "sort_order",
      type: "number",
      label: "Input Sort Order Rental Option",
      placeholder: "Insert Your Input Sort Order Rental Option Here!",
    },
  ];

  return (
    <GlobalIndex
      path={"rental-options"}
      title={"Rental Option"}
      subtitle={"Kelola rental option."}
      tableHead={[
        "title",
        "subtitle",
        "description",
        "max_capacity",
        "room_count",
        "image",
        "sort_order",
      ]}
      fields={fields}
      hasId={true}
      is_paginate={true}
      isCard={true}
      isDetail={true}
      isRentalOptionPage={true}
    />
  );
}
