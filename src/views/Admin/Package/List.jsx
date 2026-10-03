import GlobalDetailIndex from "../../../components/modal/ReadDetail";

export default function PackageListIndex() {

    const fields = [
        {
            name: 'text',
            type: 'text',
            label: 'Text',
            placeholder: 'Input Text Here!',
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
        <GlobalDetailIndex pathDetail={'villa-package-lists'} path={'villa-packages'} title={'Villa Packages List'} subtitle={'Kelola daftar list paket villa.'} tableHead={['text']} fields={fields} is_param={true} is_detail={true} nameId={'villa_package_id'} />
    )
}