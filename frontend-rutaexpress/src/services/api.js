import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Variable interna para almacenar la función que obtiene el token
let tokenGetter = null;

// Función para registrar el proveedor del token una sola vez (ej. al iniciar la app)
export const setAuthTokenGetter = (getTokenFunction) => {
    tokenGetter = getTokenFunction;
};

// El interceptor se registra UNA SOLA VEZ al cargar el archivo
api.interceptors.request.use(async (config) => {
    if (tokenGetter) {
        try {
            const token = await tokenGetter();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error al obtener el token en el interceptor:", error);
            // NO lanzar popup aquí, dejar que la request falle y el componente maneje el error
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
        console.warn("Sesión expirada o sin permisos (401/403). El usuario debe re-autenticarse.");
        // NO redirigir automáticamente — eso causa un loop infinito
    }
    return Promise.reject(error);
});

export default api;