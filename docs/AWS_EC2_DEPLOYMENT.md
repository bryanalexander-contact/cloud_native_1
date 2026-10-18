# ☁️ Despliegue en AWS EC2 (Guía Paso a Paso)

Esta guía detalla los pasos para desplegar la arquitectura completa de Ruta Express (Microservicios, Bases de Datos, Message Brokers y Frontend) en una instancia **Amazon EC2**.

## 1. Requisitos Previos en AWS
1. Entra a tu [Consola de AWS](https://aws.amazon.com/es/console/) y dirígete a **EC2**.
2. Lanza una nueva instancia (Launch Instance).
   - **SO:** Ubuntu Server 22.04 LTS o Amazon Linux 2023.
   - **Tipo de Instancia:** Recomendado **t3.medium** o **t3.large** (debido a que se levantarán contenedores incluyendo PostgreSQL, Kafka y MongoDB).
   - **Almacenamiento:** Mínimo **30 GB** (gp2 o gp3).

## 2. Configuración de Security Groups (Firewall)
Para que los servicios sean accesibles y se comuniquen, asegúrate de añadir las siguientes reglas de **Inbound Rules (Reglas de entrada)** en el Security Group de tu EC2:

| Tipo | Puerto | Origen | Descripción |
|---|---|---|---|
| SSH | 22 | Mi IP (o 0.0.0.0/0) | Acceso por terminal |
| Custom TCP | 5173 | 0.0.0.0/0 | Acceso al Frontend React (Nginx) |
| Custom TCP | 8080 | 0.0.0.0/0 | Acceso al API Gateway (BFF) |
| Custom TCP | 80 | 0.0.0.0/0 | Tráfico HTTP estándar (Opcional) |

*(Nota: Los puertos internos como 5432, 27017, 9092, 5672 no necesitan abrirse al exterior ya que los contenedores se comunican en la red interna de Docker, a menos que necesites acceso externo a las DBs).*

## 3. Despliegue en el Servidor (Vía Terminal)

1. Conéctate a tu instancia EC2 por SSH:
   ```bash
   ssh -i "tu-llave.pem" ubuntu@<IP_PUBLICA_EC2>