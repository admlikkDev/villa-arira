import GlobalIndex from "../../../components/modal/Read";

export default function AddonIndex() {

    const fields = [
        {
            name: 'title',
            type: 'text',
            label: 'Title',
            placeholder: 'Input Title Here!',
        },
        {
            name: 'subtitle',
            type: 'text',
            label: 'Subtitle',
            placeholder: 'Input Subtitle Here!',
        },
        {
            name: 'description',
            type: 'text',
            label: 'Description',
            placeholder: 'Input Description Here!',
        },
        {
            name: 'price',
            type: 'number',
            label: 'Price',
            placeholder: 'Input Price Here!',
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
        <GlobalIndex path={'addons'} title={'Addon'} subtitle={'Kelola Addon villa.'} tableHead={['title', 'subtitle', 'description', 'price']} fields={fields} navigatePath={'/admin/addon'} isCard={false}/>
    )
}