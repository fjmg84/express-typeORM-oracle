#!/bin/bash

echo "Iniciando aplicación en modo: ${NODE_ENV:-development}"

if [ "$NODE_ENV" = "production" ]; then
    echo "Conectando a Oracle RDS en $DB_HOST..."
    # En producción (RDS), no esperamos con nc porque AWS garantiza la disponibilidad del servicio [cite: 37, 85]
    node src/index.js
else
    echo "Esperando a la base de datos de desarrollo ($DB_HOST)..."
    # El puerto por defecto para Postgres es 5432
    until nc -z ${DB_HOST:-localhost} ${DB_PORT:-5432}; do
      echo "Base de datos no disponible... reintentando en 2s"
      sleep 2
    done
    echo "Base de datos lista!"
    node src/index.js
fi