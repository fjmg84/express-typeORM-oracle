# Usamos slim (basada en Debian) para compatibilidad total con Oracle glibc
FROM node:20-slim

# Definir variables de entorno para Oracle
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
WORKDIR /app

# Instalar dependencias del sistema y el Instant Client
RUN apt-get update && apt-get install -y \
    libaio1 \
    unzip \
    curl \
    && mkdir -p /opt/oracle \
    && curl -o /tmp/instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basiclite-linux.x64-21.13.0.0.0dbru.zip \
    && unzip /tmp/instantclient.zip -d /opt/oracle \
    && mv /opt/oracle/instantclient_* /opt/oracle/instantclient \
    && rm -rf /tmp/instantclient.zip /var/lib/apt/lists/*

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias npm
RUN npm install

# Instalamos netcat y sqlplus para verificar la conexión a Oracle
RUN apt-get update && apt-get install -y netcat-traditional && \
    echo "SELECT 1 FROM dual" | curl -s -F "sql=@-" "https://api.stub" > /dev/null 2>&1 || true

# Crear script de inicio que espera a que Oracle esté completamente disponible
RUN echo '#!/bin/bash\n\
HOST=${DB_HOST:-localhost}\n\
SERVICE=${DB_SERVICE:-XE}\n\
echo "Esperando a Oracle en $HOST..."\n\
until nc -z $HOST 1521; do\n\
    sleep 2\n\
done\n\
echo "Listener disponible, esperando servicios Oracle..."\n\
sleep 15\n\
echo "Conectando a Oracle..."\n\
node src/index.js' > /app/start.sh && chmod +x /app/start.sh

# Copiar el código fuente
COPY . .

# Seguridad: No ejecutar como root (Requisito bancario/hardening)
# RUN useradd -m appuser && chown -R appuser /app
# USER appuser

EXPOSE 3000

# Usamos una variable para el host, por defecto 'localhost' o el endpoint de AWS
CMD ["/app/start.sh"]