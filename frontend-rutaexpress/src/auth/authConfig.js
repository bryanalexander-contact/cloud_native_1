export const msalConfig = {
    auth: {
        clientId: "8e9ad887-fcb6-4d33-9544-0657e51590e3",
        // Cambiamos el ID del tenant por 'common' o 'consumers'
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "http://localhost:5173",
        postLogoutRedirectUri: "http://localhost:5173/"
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: ["User.Read", "api://9126af85-b017-4dff-951b-ad782d64adc9/read"]
};

export const bffTokenRequest = {
    scopes: ["api://9126af85-b017-4dff-951b-ad782d64adc9/read"]
};