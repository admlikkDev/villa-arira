import { AlertCircle, Loader2 } from 'lucide-react';
import '../assets/styles/villa.css';

// Status loading / error yang warnanya mengikuti section (tone: 'paper' | 'ink')
export default function SectionState({ tone = 'paper', label, error }) {
    return (
        <div className={`va-${tone} va-state`} role={error ? 'alert' : 'status'}>
            {error ? <AlertCircle size={26} /> : <Loader2 className="va-spin" size={26} />}
            <p>{error ? `${label}: ${error}` : label}</p>
        </div>
    );
}