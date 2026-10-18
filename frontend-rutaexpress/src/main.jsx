import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig, bffTokenRequest } from './auth/authConfig';
import { setAuthTokenGetter } from './services/api';
import './index.css';

const msalInstance = new PublicClientApplication(msalConfig);

// Promesa en caché para desduplicar peticiones de token simultáneas
let pendingTokenPromise = null;

msalInstance.initialize().then(async () => {
    await msalInstance.handleRedirectPromise();

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0 && !msalInstance.getActiveAccount()) {
        msalInstance.setActiveAccount(accounts[0]);
    }

    // Registra la obtención de token para el interceptor de Axios
    setAuthTokenGetter(async () => {
        const activeAccount = msalInstance.getActiveAccount();
        if (!activeAccount) return null;

        // Si ya hay una petición de token en curso, reutilizarla
        if (pendingTokenPromise) {
            return pendingTokenPromise;
        }

        pendingTokenPromise = (async () => {
            try {
                const response = await msalInstance.acquireTokenSilent({
                    ...bffTokenRequest,
                    account: activeAccount
                });
                return response.accessToken;
            } catch (error) {
                console.warn("No se pudo obtener token silencioso MSAL:", error);
                return null;
            } finally {
                pendingTokenPromise = null;
            }
        })();

        return pendingTokenPromise;
    });

    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <MsalProvider instance={msalInstance}>
                <App />
            </MsalProvider>
        </React.StrictMode>
    );
}).catch(error => {
    console.error("Error crítico al inicializar MSAL:", error);
});