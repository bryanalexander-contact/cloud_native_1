# Ruta Express Frontend

Este es el frontend de Ruta Express, construido con React, Vite y TailwindCSS.

## Configuración y Variables de Entorno

Para ejecutar la aplicación correctamente y conectarla con el BFF (Backend For Frontend) y Azure AD, es necesario configurar las siguientes variables de entorno.

Crea un archivo `.env` en la raíz de `frontend-rutaexpress` basándote en este ejemplo:

```env
# URL del API Gateway (BFF)
VITE_API_URL=http://localhost:8080

# Configuración de Azure AD (MSAL)
VITE_AZURE_CLIENT_ID=tu_client_id_aqui
VITE_AZURE_TENANT_ID=tu_tenant_id_aqui
VITE_AZURE_REDIRECT_URI=http://localhost:5173
```

Para producción (AWS EC2), asegúrate de cambiar estas variables (por ejemplo, `VITE_API_URL=http://<IP_PUBLICA_EC2>:8080`).

## Comandos

- `npm install` - Instala las dependencias.
- `npm run dev` - Levanta el servidor de desarrollo en `http://localhost:5173`.
- `npm run build` - Construye la aplicación para producción.
- `npm test` - Ejecuta las pruebas unitarias usando Vitest.

## Despliegue con Docker

Este frontend incluye un `Dockerfile` (multistage) que construye la aplicación y la sirve con Nginx. 
El orquestador principal del proyecto `docker-compose.yml` en la raíz se encarga de levantarlo junto al resto de los microservicios.
