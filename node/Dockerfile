# Usamos node:20-slim por su estabilidad y base Debian (necesaria para Oracle glibc)
FROM node:20-slim

# Directorio de trabajo
WORKDIR /app

# 1. Instalar dependencias del sistema
# Incluimos netcat-traditional para el check de salud en desarrollo
RUN apt-get update && apt-get install -y \
    libaio1 \
    unzip \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# 2. Instalación de Oracle Instant Client (Obligatorio para conectar con RDS Oracle)
# Se descarga y configura aunque en desarrollo uses Postgres, para que la imagen sea idéntica
ENV LD_LIBRARY_PATH=/opt/oracle/instantclient
RUN mkdir -p /opt/oracle && \
    curl -o /tmp/instantclient.zip https://download.oracle.com/otn_software/linux/instantclient/2113000/instantclient-basiclite-linux.x64-21.13.0.0.0dbru.zip && \
    unzip /tmp/instantclient.zip -d /opt/oracle && \
    mv /opt/oracle/instantclient_* /opt/oracle/instantclient && \
    rm -rf /tmp/instantclient.zip

# 3. Gestión de dependencias de Node.js
COPY package*.json ./
# Instalamos todas las dependencias (incluyendo los drivers 'oracledb' y 'pg')
RUN npm install

# 4. Copiar código fuente
COPY . .

# 5. Script de inicio dinámico
COPY start.sh start.sh
RUN chmod +x start.sh

# HARDENING: Ejecutar como usuario no-root (Requisito bancario de seguridad) [cite: 71, 75]
RUN useradd -m bankuser && chown -R bankuser:bankuser . 
USER bankuser

EXPOSE 3000

CMD ["/bin/bash", "start.sh"]