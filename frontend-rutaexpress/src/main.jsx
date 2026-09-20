import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig, bffTokenRequest } from './auth/authConfig'; // <-- Importar bffTokenRequest
import { setAuthTokenGetter } from './services/api';
import './index.css'; 

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.initialize().then(async () => {
    await msalInstance.handleRedirectPromise();

    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
    }

    setAuthTokenGetter(async () => {
        const activeAccount = msalInstance.getActiveAccount();
        if (!activeAccount) return null;

        try {
            let response = await msalInstance.acquireTokenSilent({
                ...bffTokenRequest,
                account: activeAccount
            });

            const accessToken = response.accessToken;
            if (!accessToken) return null;

            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const now = Math.floor(Date.now() / 1000);
            const exp = typeof payload?.exp === 'number' ? payload.exp : 0;
            const isExpiringSoon = exp <= (now + 120);

            if (isExpiringSoon) {
                response = await msalInstance.acquireTokenSilent({
                    ...bffTokenRequest,
                    account: activeAccount,
                    forceRefresh: true
                });
            }
            return response.accessToken;
        } catch (error) {
            if (error instanceof InteractionRequiredAuthError) {
                const popupResponse = await msalInstance.acquireTokenPopup(bffTokenRequest);
                return popupResponse.accessToken;
                return popupResponse.accessToken;
            }
            return null;
        }
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
