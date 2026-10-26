import GlobalIndex from "../../../components/modal/Read";

export default function WhatsappTemplateIndex() {
  const fields = [
    {
      name: "text",
      type: "text",
      label: "Text",
      placeholder: "Input Text Here!",
    },
  ];

  return (
    <GlobalIndex
      path={"whatsapp-templates"}
      title={"Whatsapp Template"}
      subtitle={"Kelola Whatsapp Template."}
      tableHead={["text"]}
      fields={fields}
      is_paginate={true}
    //   navigatePath={"/admin/whatsapp-templates"}
      isCard={false}
      param={'&sort=desc'}
    />
  );
}
