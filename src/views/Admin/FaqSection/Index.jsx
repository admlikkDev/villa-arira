import GlobalIndex from "../../../components/modal/Read";
export default function FaqIndex() {

    const fields = [
        {
            name: 'question',
            type: 'text',
            label: 'Question',
            placeholder: 'Input Question Here!',
        },
        {
            name: 'answer',
            type: 'textarea',
            label: 'Answer',
            placeholder: 'Input Answer Here!',
        },
        {
            name: 'sort_order',
            type: 'number',
            label: 'Order',
            placeholder: 'Input Order!',
            is_update: true
        },
    ]

    return (
        <GlobalIndex path={'faqs'} title={'FAQ'} subtitle={'Kelola daftar pertanyaan yang sering diajukan beserta jawabannya.'} tableHead={['pertanyaan', 'jawaban']} fields={fields} />
    );
}