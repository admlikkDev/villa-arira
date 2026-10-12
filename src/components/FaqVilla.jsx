import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import '../assets/styles/villa.css';

export default function FaqVilla() {
    const [activeIndex, setActiveIndex] = useState(null);
    const { get } = useFetch();

    const fetchData = async () => {
        const resp = await get('faqs');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-faqs-section'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return (
            <div className="va-paper va-state">
                <Loader2 className="va-spin" size={26} />
                <p>Memuat data FAQ…</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="va-paper va-state">
                <AlertCircle size={26} />
                <p>Data FAQ gagal dimuat: {error.message}</p>
            </div>
        );
    }

    const faqData = data?.data || data || [];

    return (
        <section id="faq" className="va-paper va-section">
            <div className="va-wrap">
                <div className="va-head">
                    <h2 className="va-h2">Pertanyaan yang sering diajukan</h2>
                    <p className="va-lead">
                        Informasi penting seputar masa tinggal, reservasi, dan aturan umum di Villa Arira.
                    </p>
                </div>

                <div className="va-acc">
                    {faqData.map((item, index) => {
                        const isOpen = activeIndex === index;
                        return (
                            <div key={item.id || index} className="va-acc__item" data-open={isOpen}>
                                <button
                                    className="va-acc__btn"
                                    aria-expanded={isOpen}
                                    onClick={() => setActiveIndex(isOpen ? null : index)}
                                >
                                    {item.question}
                                    <Plus size={26} strokeWidth={1.5} />
                                </button>
                                <div className="va-acc__panel">
                                    <div>
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}