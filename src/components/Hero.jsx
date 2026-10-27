import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import '../assets/styles/villa.css';

export default function Hero() {
    const { get } = useFetch();

    const fetchData = async () => {
        const resp = await get('/hero-section');
        if (!resp.status) throw new Error(resp.error);
        return resp.data;
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['hero-section'],
        queryFn: fetchData,
    });

    if (isLoading) {
        return (
            <div className="va-ink va-state va-state--full">
                <Loader2 className="va-spin" size={28} />
                <p>Memuat Villa Arira…</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="va-ink va-state va-state--full">
                <p>Hero section gagal dimuat: {error.message}</p>
            </div>
        );
    }

    const heroContent = data?.data || data;

    return (
        <section className="va-hero va-ink">
            <video
                className="va-hero__video"
                src="/videos/villa-arira-hero-video.mp4"
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="va-hero__shade" />

            <div className="va-hero__body">
                <h1 className="va-hero__title">{heroContent?.title}</h1>
                <p className="va-hero__sub">{heroContent?.subtitle}</p>
                <a className="va-btn" href="/booking#cek-jadwal">Cek harga & ketersediaan</a>
            </div>

            <a className="va-hero__scroll" href="#informasi" aria-label="Gulir ke bawah">Gulir</a>
        </section>
    );
}