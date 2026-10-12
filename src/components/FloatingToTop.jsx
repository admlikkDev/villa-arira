import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import '../assets/styles/villa.css';

export default function FloatingToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setIsVisible(window.scrollY > 300);
        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="va-float va-float--left">
            <button
                className="va-fab va-fab--square"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                title="Kembali ke atas"
                aria-label="Kembali ke atas"
            >
                <ArrowUp size={20} />
            </button>
        </div>
    );
}