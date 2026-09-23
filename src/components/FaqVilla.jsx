import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function FaqVilla() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const {get} = useFetch()

    const fetchData = async () => {
        const resp = await get('faqs');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-faqs-section'],
        queryFn: fetchData
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
                <Loader2 className="size-6 animate-spin text-indigo-600" />
                <p className="text-sm font-medium">Memuat data FAQ...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 max-w-4xl">
                <AlertCircle className="size-5 shrink-0" />
                <p className="text-sm">Gagal memuat data: {error.message}</p>
            </div>
        );
    }

    const faqData = data?.data

    return (
        <section id="faq" style={{
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#F5EFEB',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '6rem 2rem',
            boxSizing: 'border-box',
            fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                    .faq-item {
                        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                    }
                    .faq-item:hover {
                        border-color: rgba(164, 123, 66, 0.4) !important;
                        box-shadow: 0 10px 25px rgba(11, 13, 12, 0.06);
                    }
                `}
            </style>

            <div style={{ textAlign: 'center', marginBottom: '3.5rem', maxWidth: '750px' }}>
                <span style={{
                    fontSize: '0.75rem',
                    letterSpacing: '2.5px',
                    textTransform: 'uppercase',
                    color: '#A47B42',
                    fontWeight: '700',
                }}>
                    Bantuan & Informasi
                </span>
                <h2 style={{
                    fontSize: '2.5rem',
                    fontFamily: '"Playfair Display", serif',
                    color: '#0B0D0C',
                    marginTop: '0.4rem',
                    marginBottom: '0.8rem',
                    fontWeight: '600',
                }}>
                    Pertanyaan yang Sering Diajukan (FAQ)
                </h2>
                <p style={{
                    fontSize: '0.95rem',
                    color: '#4A4D4C',
                    lineHeight: '1.6',
                    margin: 0,
                }}>
                    Informasi penting terkait masa tinggal, reservasi, dan aturan umum di Villa Arira.
                </p>
            </div>

            <div style={{
                maxWidth: '900px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.2rem',
            }}>
                {faqData.map((item, index) => {
                    const isOpen = activeIndex === index;
                    return (
                        <div
                            key={index}
                            className="faq-item"
                            style={{
                                backgroundColor: '#ECE2D8',
                                borderRadius: '16px',
                                border: '1px solid rgba(164, 123, 66, 0.2)',
                                overflow: 'hidden',
                                cursor: 'pointer',
                            }}
                            onClick={() => toggleAccordion(index)}
                        >
                            <div style={{
                                padding: '1.4rem 1.8rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '1rem',
                            }}>
                                <h3 style={{
                                    fontSize: '1.05rem',
                                    fontWeight: '600',
                                    color: '#0B0D0C',
                                    margin: 0,
                                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                                }}>
                                    {item.question}
                                </h3>
                                <span style={{
                                    fontSize: '1rem',
                                    color: '#A47B42',
                                    fontWeight: 'bold',
                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                    flexShrink: 0,
                                }}>
                                    ▼
                                </span>
                            </div>

                            {isOpen && (
                                <div style={{
                                    padding: '0 1.8rem 1.6rem 1.8rem',
                                    fontSize: '0.92rem',
                                    color: '#3A3D3C',
                                    lineHeight: '1.6',
                                    borderTop: '1px solid rgba(164, 123, 66, 0.1)',
                                    paddingTop: '1rem',
                                }}>
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
