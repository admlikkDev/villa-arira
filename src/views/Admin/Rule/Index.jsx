import GlobalIndex from "../../../components/modal/Read";

export default function RuleIndex() {
  const fields = [
    {
      name: "text",
      type: "text",
      label: "Rule",
      placeholder: "Insert Rule Here!",
    },
    {
      name: "sort_order",
      type: "number",
      label: "Order (opsional)",
      placeholder: "Input Order Here!",
      hide_in_table: true,
    },
  ];

  return (
    <GlobalIndex
      path={"villa-rules"}
      title={"Villa Rules"}
      subtitle={"Kelola Aturan Villa."}
      tableHead={["text"]}
      fields={fields}
      hasId={false}
      is_paginate={true}
    />
  );
}
