import GlobalIndex from "../../../components/modal/Read";

export default function MessageIndex() {
    return (
        <GlobalIndex path={'messages'} title={'Messages'} subtitle={'Kelola pesan masuk.'} tableHead={['firstname', 'lastname', 'email', 'message']} fields={[]} is_paginate={true} editButton={false} />
    )
}