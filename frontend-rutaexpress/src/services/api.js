import axios from 'axios';

const getApiBaseUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== 'undefined') {
        return `http://${window.location.hostname}:8080`;
    }
    return 'http://54.204.31.3:8080';
};

const api = axios.create({
    baseURL: getApiBaseUrl(),
    headers: {
        'Content-Type': 'application/json'
    }
});

let tokenGetter = null;

export const setAuthTokenGetter = (getTokenFunction) => {
    tokenGetter = getTokenFunction;
};

api.interceptors.request.use(async (config) => {
    if (tokenGetter) {
        try {
            const token = await tokenGetter();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error al obtener el token en el interceptor:", error);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.warn("Sesión expirada o sin permisos en el backend (401/403).");
    }
    return Promise.reject(error);
});

export default api;