#!/bin/bash
set -e

echo "==========================================="
echo "   🚀 RUTA EXPRESS - AWS EC2 DEPLOYMENT  "
echo "==========================================="

# 1. Update system packages
echo "[1/5] Actualizando paquetes del sistema..."
sudo yum update -y || sudo apt-get update -y

# 2. Install Docker if not installed
if ! command -v docker &> /dev/null
then
    echo "[2/5] Instalando Docker..."
    sudo yum install -y docker || sudo apt-get install -y docker.io
    sudo service docker start
    sudo systemctl enable docker
    sudo usermod -a -G docker ec2-user || sudo usermod -a -G docker ubuntu
else
    echo "[2/5] Docker ya está instalado."
fi

# 3. Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null
then
    echo "[3/5] Instalando Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "[3/5] Docker Compose ya está instalado."
fi

# 4. Pull latest changes (assuming this is run inside the cloned repo)
echo "[4/5] Preparando entorno..."
# Ensure execution permissions for the script itself
chmod +x deploy.sh

# 5. Build and deploy using docker-compose
echo "[5/5] Levantando contenedores (Infra, Backend y Frontend)..."
docker-compose down
docker-compose up -d --build

echo "==========================================="
echo " ✅ Despliegue completado con éxito! "
echo "==========================================="
echo "Servicios expuestos:"
echo "- Frontend React: http://<tu-ip-ec2>:5173"
echo "- BFF Gateway:    http://<tu-ip-ec2>:8080"
echo "Asegúrate de que los Security Groups de AWS permitan tráfico entrante en los puertos 5173 y 8080."
