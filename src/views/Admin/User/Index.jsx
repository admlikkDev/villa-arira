import GlobalIndex from "../../../components/modal/Read";

export default function UserIndex() {
  const fields = [
    {
      name: "email",
      type: "email",
      label: "Email",
      placeholder: "Insert Email Here!",
    },
    {
      name: "password",
      type: "text",
      label: "Password",
      placeholder: "Insert Password Here!",
      hide_in_table: true
      
    },
    {
      name: "phone",
      type: "number",
      label: "Phone",
      placeholder: "Insert Phone Here!",
    },
    {
      name: "username",
      type: "text",
      label: "Username",
      placeholder: "Insert Username Here!",
    },
  ];

  return (
    <GlobalIndex
      path={"users"}
      title={"User"}
      subtitle={"Kelola user."}
      tableHead={['username', 'email', 'phone']}
      fields={fields}
      hasId={false}
      is_paginate={true}
    />
  );
}
