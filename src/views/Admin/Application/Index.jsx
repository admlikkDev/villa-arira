import GlobalIndex from "../../../components/modal/Read";

export default function ApplicationIndex() {

    const fields = [
        {
            name: 'title',
            type: 'text',
            label: 'Title Application',
            placeholder: 'Input Title Application Here!',
        },
        {
            name: 'phone_number',
            type: 'number',
            label: 'Phone Number',
            placeholder: 'Input Your Phone Number Here!',
        },
        {
            name: 'logo',
            type: 'file',
            label: 'Logo',
            placeholder: 'Insert Your Logo Here!',
            is_image: true
        },
    ]

    return (
        <GlobalIndex path={'application'} title={'Application'} subtitle={'Kelola aplikasi.'} tableHead={['title', 'phone_number', 'logo']} fields={fields} deleteButton={false} createButton={false} hasId={false} />
    )
}