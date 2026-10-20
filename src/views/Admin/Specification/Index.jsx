import { useSearchParams } from 'react-router-dom';
import GlobalIndex from '../../../components/modal/Read';

const TABS = [
    { key: 'spesifikasi', label: 'Spesifikasi' },
    { key: 'gambar', label: 'Gambar spesifikasi' },
];

// Didefinisikan di luar komponen agar referensinya stabil di setiap render
const PAGES = {
    spesifikasi: {
        path: 'specifications',
        title: 'Spesifikasi',
        subtitle: 'Kelola daftar spesifikasi.',
        tableHead: ['text', 'logo'],
        is_paginate: true,
        pathDetail: 'logos',
        selectLogo: true,
        fields: [
            { name: 'text', type: 'text', label: 'Text', placeholder: 'Input Text Here!' },
            { name: 'logo', type: 'select', label: 'Logo', placeholder: 'Input Logo Here!' },
            { name: 'sort_order', type: 'number', label: 'Order', placeholder: 'Input Order Here!', hide_in_table: true },
        ],
    },
    gambar: {
        path: 'specification-gallery',
        title: 'Gambar Spesifikasi',
        subtitle: 'Kelola daftar gambar spesifikasi.',
        tableHead: ['image1', 'image2', 'image3'],
        is_paginate: true,
        isCard: true,
        imageSpecification: true,
        fields: [
            { name: 'image1', type: 'file', label: 'Image 1', placeholder: 'Input First Here!' },
            { name: 'image2', type: 'file', label: 'Image 2', placeholder: 'Input Second Here!' },
            { name: 'image3', type: 'file', label: 'Image 3', placeholder: 'Input Third Here!' },
        ],
    },
};

export default function SpecificationIndex() {
    // Tab disimpan di URL (?tab=gambar) agar bertahan saat refresh dan bisa di-share
    const [params, setParams] = useSearchParams();
    const active = params.get('tab') === 'gambar' ? 'gambar' : 'spesifikasi';

    const selectTab = (key) => setParams(key === 'spesifikasi' ? {} : { tab: key }, { replace: true });

    const tabs = (
        <div className="va-tabs" role="tablist" aria-label="Bagian spesifikasi">
            {TABS.map((t) => (
                <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={active === t.key}
                    className="va-tab"
                    onClick={() => selectTab(t.key)}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );

    return <GlobalIndex tabs={tabs} {...PAGES[active]} />;
}