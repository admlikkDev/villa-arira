import axios from "axios"
import { useAuth } from "./useAuth"

const formatErr = (err) => {
    if (!err.response) return { general: 'Network error' };

    const responseData = err.response.data;

    if (responseData?.errors) {
        const formattedErrors = {};
        for (const [key, value] of Object.entries(responseData.errors)) {
            formattedErrors[key] = Array.isArray(value) ? value[0] : value;
        }
        return formattedErrors;
    }

    if (responseData?.message) {
        return { general: responseData.message };
    }

    return { general: err.response.statusText || 'Terjadi kesalahan pada server' };
}

export default function useFetch() {
    const { user } = useAuth();
    
    const url = import.meta.env.VITE_APP_URL || import.meta.env.VITE_URL_APP;

    const axiosProvider = axios.create({
        baseURL: url,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: user?.token ? `Bearer ${user.token}` : ''
        }
    });

    return {
        post: async (path, value) => {
            try {
                const resp = await axiosProvider.post(path, value);
                return { status: true, data: resp.data };
            } catch (error) {
                return { status: false, error: formatErr(error) };
            }
        },
        get: async (path) => {
            try {
                const resp = await axiosProvider.get(path);
                return { status: true, data: resp.data };
            } catch (error) {
                return { status: false, error: formatErr(error) };
            }
        },
        put: async (path, value) => {
            try {
                const resp = await axiosProvider.put(path, value);
                return { status: true, data: resp.data };
            } catch (error) {
                return { status: false, error: formatErr(error) };
            }
        },
        destroy: async (path, value = null) => {
            try {
                const config = value ? { data: value } : {};
                const resp = await axiosProvider.delete(path, config);
                return { status: true, data: resp.data };
            } catch (error) {
                return { status: false, error: formatErr(error) };
            }
        }
    }
}