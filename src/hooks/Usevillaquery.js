import { useQuery, useQueries } from '@tanstack/react-query';
import useFetch from './useFetch';

// Jumlah data yang diminta untuk halaman publik (sesuaikan dengan batas size di backend)
export const ALL = 'page=1&size=50&sort=asc';

const errMsg = (e) => (typeof e === 'string' ? e : e?.message || JSON.stringify(e) || 'Terjadi kesalahan');

// Respons API bisa berlapis ({ data: { data: ... } }); kupas sampai isi sebenarnya
const unwrap = (body) => {
    let d = body;
    while (d && !Array.isArray(d) && typeof d === 'object' && 'data' in d) d = d.data;
    return d;
};

const toArray = (body) => {
    const d = unwrap(body);
    if (Array.isArray(d)) return d;
    return d ? [d] : [];
};

export const bySortOrder = (a, b) => {
    const x = a?.sort_order ?? Number.MAX_SAFE_INTEGER;
    const y = b?.sort_order ?? Number.MAX_SAFE_INTEGER;
    return x === y ? 0 : x - y;
};

// ---------- Formatter ----------
export const formatRupiah = (value) => {
    const n = Number(value);
    if (value === null || value === undefined || value === '' || Number.isNaN(n)) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
        .format(n)
        .replace(/\s/g, ' ');
};

// Di API pricelist nilai min/max kapasitas bisa terbalik, jadi urutkan dulu
export const formatCapacity = (a, b) => {
    const nums = [Number(a), Number(b)].filter((n) => !Number.isNaN(n) && n > 0).sort((x, y) => x - y);
    if (nums.length === 0) return '-';
    if (nums.length === 1 || nums[0] === nums[1]) return `${nums[0]} orang`;
    return `${nums[0]} – ${nums[1]} orang`;
};

export function useVillaList(path, { query = ALL, sort = bySortOrder } = {}) {
    const { get } = useFetch();

    return useQuery({
        queryKey: [`admin-${path}-section`, 'public', query],
        queryFn: async () => {
            const resp = await get(query ? `${path}?${query}` : path);
            if (!resp.status) throw new Error(errMsg(resp.error));
            return resp.data;
        },
        select: (body) => (sort ? [...toArray(body)].sort(sort) : toArray(body)),
        staleTime: 60 * 1000,
        retry: 1,
    });
}

// Untuk endpoint yang mengembalikan satu objek (mis. specification-gallery)
export function useVillaOne(path) {
    const { get } = useFetch();

    return useQuery({
        queryKey: [`admin-${path}-section`, 'public', 'one'],
        queryFn: async () => {
            const resp = await get(path);
            if (!resp.status) throw new Error(errMsg(resp.error));
            return resp.data;
        },
        select: (body) => unwrap(body) ?? null,
        staleTime: 60 * 1000,
        retry: 1,
    });
}

// Daftar induk + anak (`lists`). Jika respons daftar belum menyertakan `lists`,
// anaknya diambil dari GET {path}/{id}/lists.
export function useVillaListWithLists(path, opts) {
    const { get } = useFetch();
    const parents = useVillaList(path, opts);

    const missing = (parents.data ?? []).filter((p) => !Array.isArray(p.lists));

    const children = useQueries({
        queries: missing.map((p) => ({
            queryKey: [`admin-${path}-section`, 'public', p.id, 'lists'],
            queryFn: async () => {
                const resp = await get(`${path}/${p.id}/lists?${ALL}`);
                if (!resp.status) throw new Error(errMsg(resp.error));
                return resp.data;
            },
            select: (body) => [...toArray(body)].sort(bySortOrder),
            staleTime: 60 * 1000,
            retry: 1,
        })),
    });

    const fetchedById = {};
    missing.forEach((p, i) => { fetchedById[p.id] = children[i]?.data ?? []; });

    const data = parents.data?.map((p) =>
        Array.isArray(p.lists)
            ? { ...p, lists: [...p.lists].sort(bySortOrder) }
            : { ...p, lists: fetchedById[p.id] ?? [] }
    );

    return {
        data,
        isLoading: parents.isLoading || children.some((c) => c.isLoading),
        isError: parents.isError,
        error: parents.error,
    };
}