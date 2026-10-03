import GlobalDetailIndex from "../../../components/modal/ReadDetail";

export default function AddonListIndex() {

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
        <GlobalDetailIndex pathDetail={'addon-lists'} path={'addons'} title={'Villa Addon List'} subtitle={'Kelola daftar addon list villa.'} tableHead={['text']} fields={fields} is_param={true} is_detail={true} nameId={'addon_id'} />
    )
}