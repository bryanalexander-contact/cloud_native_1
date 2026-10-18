export const msalConfig = {
    auth: {
        clientId: "8e9ad887-fcb6-4d33-9544-0657e51590e3",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:5173",
        postLogoutRedirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:5173"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

// Permisos para inicio de sesión del usuario (incluye la API del Backend desde el origen)
export const loginRequest = {
    scopes: [
        "openid",
        "profile",
        "User.Read",
        "api://9126af85-b017-4dff-951b-ad782d64adc9/read"
    ]
};

// Scope explícito para obtención silenciosa de tokens del Backend BFF
export const bffTokenRequest = {
    scopes: ["api://9126af85-b017-4dff-951b-ad782d64adc9/read"]
};