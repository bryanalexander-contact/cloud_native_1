const TENANT_ID = "7ecd33b8-57e2-4e0b-ace8-8c8fd532708f";

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

// Permisos para autenticar la identidad del usuario
export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"]
};

// Permiso para obtener silenciosamente el token que consume el Backend BFF
export const bffTokenRequest = {
    scopes: ["api://9126af85-b017-4dff-951b-ad782d64adc9/read"]
};