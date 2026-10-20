import GlobalIndex from "../../../components/modal/Read";

export default function WisataIndex() {

    const fields = [
        {
            name: 'title',
            type: 'text',
            label: 'Title Rental Option',
            placeholder: 'Input Title Rental Option Here!',
        },
        {
            name: 'subtitle',
            type: 'text',
            label: 'Subtitle Rental Option',
            placeholder: 'Input Subtitle Rental Option Here!',
        },
        {
            name: 'price',
            type: 'number',
            label: 'Price',
            placeholder: 'Input Price Here!',
        },
        {
            name: 'map',
            type: 'text',
            label: 'Map',
            placeholder: 'Input Map Here!',
        },
        {
            name: 'sort_order',
            type: 'number',
            label: 'Sort Order (optional)',
            placeholder: 'Input Sort Order Here!',
            hide_in_table: true
        },
        {
            name: 'image',
            type: 'file',
            label: 'Image Rental Option',
            placeholder: 'Insert Your Image Here!',
            is_image: true
        },
    ]

    return (
        <GlobalIndex path={'attractions'} title={'Wisata'} subtitle={'Kelola Wisata Terdekat villa.'} tableHead={['tite', 'subtitle', 'price', 'image']} fields={fields} navigatePath={'/admin/attractions'} isCard={true}/>
    )
}