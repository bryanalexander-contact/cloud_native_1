# ☁️ Despliegue en AWS EC2 (Guía Paso a Paso)

Esta guía detalla los pasos para desplegar la arquitectura completa de Ruta Express (Microservicios, Bases de Datos, Message Brokers y Frontend) en una instancia **Amazon EC2**.

## 1. Requisitos Previos en AWS
1. Entra a tu [Consola de AWS](https://aws.amazon.com/es/console/) y dirígete a **EC2**.
2. Lanza una nueva instancia (Launch Instance).
   - **SO:** Ubuntu Server 22.04 LTS o Amazon Linux 2023.
   - **Tipo de Instancia:** Recomendado **t3.medium** o **t3.large** (debido a que se levantarán 11 contenedores incluyendo Oracle DB, Kafka y MongoDB).
   - **Almacenamiento:** Mínimo **30 GB** (gp2 o gp3).

## 2. Configuración de Security Groups (Firewall)
Para que los servicios sean accesibles y se comuniquen, asegúrate de añadir las siguientes reglas de **Inbound Rules (Reglas de entrada)** en el Security Group de tu EC2:

| Tipo | Puerto | Origen | Descripción |
|---|---|---|---|
| SSH | 22 | Mi IP (o 0.0.0.0/0) | Acceso por terminal |
| Custom TCP | 5173 | 0.0.0.0/0 | Acceso al Frontend React (Nginx) |
| Custom TCP | 8080 | 0.0.0.0/0 | Acceso al API Gateway (BFF) |
| Custom TCP | 80 | 0.0.0.0/0 | Tráfico HTTP estándar (Opcional) |

*(Nota: Los puertos internos como 1521, 27017, 9092, 5672 no necesitan abrirse al exterior ya que los contenedores se comunican en la red interna de Docker, a menos que necesites acceso externo a las DBs).*

## 3. Despliegue en el Servidor (Vía Terminal)

1. Conéctate a tu instancia EC2 por SSH:
   ```bash
   ssh -i "tu-llave.pem" ubuntu@<IP_PUBLICA_EC2>
   ```

2. Clona tu repositorio en el servidor:
   ```bash
   git clone <URL_DE_TU_REPOSITORIO_GITHUB>
   cd RutaExpress-Workspace
   ```

3. Ejecuta el script de automatización de despliegue:
   Hemos preparado un script `deploy.sh` que instalará Docker, Docker Compose y levantará todos los servicios automáticamente.
   
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## 4. Verificación del Despliegue

Una vez que el script finalice (puede tardar unos minutos en descargar todas las imágenes y compilar el código Java/React), verifica que todos los contenedores estén corriendo:

```bash
docker-compose ps
```

Deberías ver 11 contenedores en estado `Up`:
- `zookeeper`
- `kafka`
- `oracle-db`
- `rabbitmq`
- `mongodb`
- `ms-bff`
- `ms-shipments`
- `ms-catalog`
- `ms-notify`
- `ms-report`
- `ms-audit`
- `frontend-rutaexpress`

## 5. Acceso a la Aplicación

1. **Frontend:** Abre en tu navegador `http://<IP_PUBLICA_EC2>:5173`
2. **Backend API:** El Gateway está disponible en `http://<IP_PUBLICA_EC2>:8080/api/v1/...`

> **Importante para Azure AD:** Si estás usando MSAL (Azure AD) en el frontend, recuerda agregar la URL `http://<IP_PUBLICA_EC2>:5173` como **Redirect URI** en tu registro de aplicación en el portal de Microsoft Entra ID. También asegúrate de que los CORS en `SecurityConfig.java` del BFF permitan esta URL si vas a consumir la API desde un dominio diferente.
