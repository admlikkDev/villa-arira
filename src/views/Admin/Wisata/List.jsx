import GlobalDetailIndex from "../../../components/modal/ReadDetail";

export default function WisataListIndex() {

    const fields = [
        {
            name: 'attraction_id',
            type: 'select',
            label: 'Attraction',
            placeholder: 'Select Attraction',
        },
        {
            name: 'distance',
            type: 'number',
            label: 'Distance',
            placeholder: 'Input Distance Here!',
        },
        {
            name: 'time_required',
            type: 'number',
            label: 'Time Required',
            placeholder: 'Input Time Required Here!',
        },
        {
            name: 'vehicle',
            type: 'text',
            label: 'Vehicle',
            placeholder: 'Input Vehicle Here!',
        },  
    ]

    return (
        <GlobalDetailIndex pathDetail={'transports'} path={'attractions'} title={'Villa Transport List'} subtitle={'Kelola transport list.'} tableHead={['distance', 'time_required', 'vehicle']} fields={fields} is_param={true} is_detail={true} nameId={'attraction_id'}/>
    )
}