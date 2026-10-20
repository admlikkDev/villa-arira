import GlobalIndex from "../../../components/modal/Read"

export default function ReasonIndex() {
    const fields = [
        {
            name: 'text',
            type: 'text',
            label: 'Text',
            placeholder: 'Insert Your Text Here!'
        },
    ]
    
    return (
        <GlobalIndex path={'reasons'} title={'Reason'} subtitle={'Kelola alasan.'} tableHead={['text']} fields={fields} hasId={false} is_paginate={true} />
    )
}