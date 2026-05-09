-- Crear usuario app_user
-- Este script se ejecuta como SYSTEM por defecto
CREATE USER app_user IDENTIFIED BY apppassword DEFAULT TABLESPACE USERS TEMPORARY TABLESPACE TEMP QUOTA UNLIMITED ON USERS;
GRANT CONNECT, RESOURCE TO app_user;