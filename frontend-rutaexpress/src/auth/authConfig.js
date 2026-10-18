// ID de Inquilino (Tenant ID) de tu organización en Azure Portal
const TENANT_ID = "72fd0b5a-8a6a-4cff-89f6-bde961f7e250";

export const msalConfig = {
    auth: {
        clientId: "8e9ad887-fcb6-4d33-9544-0657e51590e3",
        authority: `https://login.microsoftonline.com/${TENANT_ID}`,
        redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:5173",
        postLogoutRedirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:5173"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

// 1. Permisos EXCLUSIVOS para la autenticación e inicio de sesión del usuario
export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"]
};

// 2. Scope EXCLUSIVO para solicitar silenciosamente el token del Backend BFF
export const bffTokenRequest = {
    scopes: ["api://9126af85-b017-4dff-951b-ad782d64adc9/read"]
};
```[cite: 3]