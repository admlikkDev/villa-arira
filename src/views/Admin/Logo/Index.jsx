import GlobalIndex from "../../../components/modal/Read";

export default function LogoIndex() {

    const fields = [
        {
            name: 'image',
            type: 'file',
            label: 'Logo',
            placeholder: 'Insert Your Logo Here!',
            is_image: true
        },
    ]

    return (
        <GlobalIndex path={'logos'} title={'Logo'} subtitle={'Kelola logo.'} tableHead={['image']} fields={fields} hasId={false} />
    )
}