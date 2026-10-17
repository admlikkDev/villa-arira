import { Pencil, Clock, AlertCircle, Loader2 } from 'lucide-react';
import AdminPanelLayout from '../../layouts/AdminPanelLayout';
import useFetch from '../../../hooks/useFetch';
import { useQuery } from '@tanstack/react-query';
import UpdateHeroModal from './Update';
import { useState } from 'react';
import Hero from '../../../components/Hero';
import '../../../assets/styles/villa.css';

const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Belum diperbarui';

    const date = new Date(isoString);
    const diffInSeconds = Math.floor((new Date() - date) / 1000);

    if (diffInSeconds < 60) return 'Baru saja';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;

    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function Index() {
    const { get } = useFetch();
    const [isOpen, setIsOpen] = useState(false);

    const fetchData = async () => {
        const resp = await get('hero-section');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['admin-hero-section'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return (
            <AdminPanelLayout>
                <div className="va-state">
                    <Loader2 className="va-spin" size={26} />
                    <p>Memuat data hero section…</p>
                </div>
            </AdminPanelLayout>
        );
    }

    if (isError) {
        return (
            <AdminPanelLayout>
                <div className="va-alert" role="alert">
                    <AlertCircle size={16} />
                    <span>Gagal memuat data: {error.message}</span>
                </div>
            </AdminPanelLayout>
        );
    }

    const heroContent = data?.data || data;

    return (
        <AdminPanelLayout>
            <UpdateHeroModal open={isOpen} onOpenChange={setIsOpen} data={heroContent} />

            <header className="va-adm-head">
                <div>
                    <h2 className="va-adm-title">Manajemen hero section</h2>
                    <p className="va-text">Atur konten banner utama yang tampil di halaman depan website.</p>
                </div>
                <div className="va-adm-actions">
                    <button type="button" className="va-btn va-btn--sm" onClick={() => setIsOpen(true)}>
                        <Pencil size={16} /> Edit konten hero
                    </button>
                </div>
            </header>

            <div className="va-frame">
                <div className="va-frame__bar">
                    <span>villaarira.com</span>
                    <span>Pratinjau</span>
                </div>
                <div className="va-frame__body">
                    <Hero />
                </div>
            </div>

            <div className="va-adm-foot">
                <span>
                    <Clock size={16} strokeWidth={1.5} />
                    Terakhir diperbarui: {formatTimeAgo(heroContent?.updatedAt)}
                </span>
            </div>
        </AdminPanelLayout>
    );
}