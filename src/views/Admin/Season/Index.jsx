import GlobalIndex from "../../../components/modal/Read";

export default function SeasonIndex() {
    const fields = [
        {
            name: 'name',
            type: 'text',
            label: 'Input Name Season',
            placeholder: 'Insert Your Input Name Season Here!',
        },
        {
            name: 'start_date',
            type: 'date',
            label: 'Input Start Date Season',
            placeholder: 'Insert Your Input Start Date Season Here!',
        },
        {
            name: 'end_date',
            type: 'date',
            label: 'Input End Date Season',
            placeholder: 'Insert Your Input End Date Season Here!',
        },
    ];

    return (
        <GlobalIndex
            path={'seasons'}
            title={'Season'}
            subtitle={'Kelola season.'}
            tableHead={['name', 'start_date', 'end_date']}
            fields={fields}
// +           hasId={true}
// +           is_paginate={true}
        />
    )
}