import GlobalIndex from "../../../components/modal/Read";

export default function SpecificationIndex() {

    const fields = [
        {
            name: 'text',
            type: 'text',
            label: 'Text',
            placeholder: 'Input Text Here!',
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
        <GlobalIndex path={'specifications'} title={'Spesifikasi'} subtitle={'Kelola daftar spesifikasi.'} tableHead={['text', 'logo']} fields={fields} is_paginate={true}/>
    )
}