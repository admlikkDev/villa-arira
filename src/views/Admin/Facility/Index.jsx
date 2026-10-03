import GlobalIndex from "../../../components/modal/Read";

export default function FacilityIndex() {

    const fields = [
        {
            name: 'title',
            type: 'text',
            label: 'Title',
            placeholder: 'Input Title Here!',
        },
        {
            name: 'description',
            type: 'text',
            label: 'Description',
            placeholder: 'Input Description Here!',
        },
        {
            name: 'logo',
            type: 'text',
            label: 'Logo',
            placeholder: 'Input Logo Here!',
        },
        {
            name: 'sort_order',
            type: 'number',
            label: 'Order',
            placeholder: 'Input Order Here!',
            hide_in_table: true
        },
    ]

    return (
        <GlobalIndex path={'facilities'} title={'Facilities'} subtitle={'Kelola daftar fasilitas.'} tableHead={['title', 'description', 'logo']} fields={fields} is_paginate={true}/>
    )
}