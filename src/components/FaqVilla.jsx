import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useVillaList } from '../hooks/Usevillaquery';
import SectionState from './SectionState';
import '../assets/styles/villa.css';

export default function FaqVilla() {
    const [activeIndex, setActiveIndex] = useState(null);
    const { data: faqData = [], isLoading, isError, error } = useVillaList('faqs');

    if (isLoading) return <SectionState tone="paper" label="Memuat data FAQ…" />;
    if (isError) return <SectionState tone="paper" label="Data FAQ gagal dimuat" error={error.message} />;
    if (faqData.length === 0) return null;

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
                            <div key={item.id ?? index} className="va-acc__item" data-open={isOpen}>
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