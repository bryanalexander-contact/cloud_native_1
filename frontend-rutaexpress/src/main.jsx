import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig, bffTokenRequest } from './auth/authConfig';
import { setAuthTokenGetter } from './services/api';
import './index.css';

const msalInstance = new PublicClientApplication(msalConfig);

let pendingTokenPromise = null;

msalInstance.initialize().then(async () => {
    try {
        await msalInstance.handleRedirectPromise();
    } catch (error) {
        console.warn("Aviso en handleRedirectPromise:", error);
    }

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0 && !msalInstance.getActiveAccount()) {
        msalInstance.setActiveAccount(accounts[0]);
    }

    // El interceptor SOLO solicita tokens silenciosos en segundo plano
    setAuthTokenGetter(async () => {
        const activeAccount = msalInstance.getActiveAccount() || msalInstance.getAllAccounts()[0];
        if (!activeAccount) return null;

        if (!msalInstance.getActiveAccount()) {
            msalInstance.setActiveAccount(activeAccount);
        }

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
                console.warn("No se pudo obtener token silencioso (se requiere inicio de sesión explícito):", error.errorMessage || error);
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