import GlobalIndex from "../../../components/modal/Read";

export default function TestimonyIndex() {

    const fields = [
        {
            name: 'comment',
            type: 'text',
            label: 'Comment',
            placeholder: 'Input Comment Here!',
        },
        {
            name: 'username',
            type: 'text',
            label: 'Username',
            placeholder: 'Input Username Here!',
        },
        {
            name: 'star',
            type: 'number',
            label: 'Star',
            placeholder: 'Input Star Here!',
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
        <GlobalIndex path={'testimonies'} title={'Testimony'} subtitle={'Kelola daftar testimoni.'} tableHead={['comment', 'username', 'star']} fields={fields} />
    )
}