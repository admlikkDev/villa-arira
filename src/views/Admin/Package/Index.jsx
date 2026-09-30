import GlobalIndex from "../../../components/modal/Read";

export default function PackageIndex() {

    const fields = [
        {
            name: 'max_capacity',
            type: 'number',
            label: 'Max Capacity',
            placeholder: 'Input Max Capacity Here!',
        },
        {
            name: 'price',
            type: 'number',
            label: 'Price',
            placeholder: 'Input Price Here!',
        },
        {
            name: 'title',
            type: 'text',
            label: 'Title',
            placeholder: 'Input Title Here!',
        },
        {
            name: 'subtitle',
            type: 'text',
            label: 'subtitle',
            placeholder: 'Input Subtitle Here!',
        },
        {
            name: 'sort_order',
            type: 'number',
            label: 'Order (opsional)',
            placeholder: 'Input Order Here!',
            hide_in_table: true
        },
    ]

    return (
        <GlobalIndex path={'villa-packages'} title={'Villa Packages'} subtitle={'Kelola daftar paket villa.'} tableHead={['max_capacity', 'price', 'title', 'subtitle']} fields={fields} navigatePath={'/admin/package'} isCard={true}/>
    )
}