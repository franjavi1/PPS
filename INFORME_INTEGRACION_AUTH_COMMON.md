# Informe de Integración: Paquete Interno `auth-common`

Este informe detalla las tareas realizadas, la arquitectura de seguridad implementada y los problemas resueltos durante la integración del paquete `auth-common` en el microservicio backend del proyecto.

---

## 1. ¿Qué es `auth-common` y cuál era el objetivo?
`auth-common` es un paquete de Python compartido por los microservicios del sistema (Auth, Planes, Inscripción) para centralizar y unificar la seguridad de la API:
* **Validación síncrona de sesión**: Asegura que el token JWT enviado sea válido y que la sesión del usuario esté activa en Redis (`session:<id_usuario>`).
* **Autorización granular por roles y acciones**: Permite restringir el acceso a los endpoints mediante el decorador `@requires_permission` basándose en los permisos guardados en Redis.

---

## 2. Lo que Hicimos (Cambios Implementados)

### A. Gestión de Dependencias y Dockerización
* **[requirements.txt](file:///c:/Users/Luis/Desktop/ProyectoSigalFinalFront/FRONT-PPS-BASICO/PPS/backend/requirements.txt)**:
  * Agregamos la instalación de `auth-common` desde su repositorio git (`git+https://github.com/ignacioaltamirano23/auth-common.git@v0.1.0`).
  * Agregamos `pyyaml` (para leer el archivo de acciones) y `requests` (para enviar las acciones al servicio de Auth al arrancar).
* **[Dockerfile](file:///c:/Users/Luis/Desktop/ProyectoSigalFinalFront/FRONT-PPS-BASICO/PPS/backend/Dockerfile)**:
  * Dado que la imagen base del backend es `python:3.12-slim` (que no cuenta con `git`), modificamos el archivo para instalar `git` mediante `apt-get` antes de correr `pip install`. Esto permitió descargar dependencias directamente desde GitHub.

### B. Configuración de Entornos y Orquestación
* **[config.py](file:///c:/Users/Luis/Desktop/ProyectoSigalFinalFront/FRONT-PPS-BASICO/PPS/backend/config/config.py)**:
  * Configuramos las llaves `AUTH_COMMON_REDIS_URL` y `AUTH_COMMON_SESSION_TTL` mapeadas desde variables de entorno.
  * Añadimos la variable `JWT_SECRET_KEY` para que `Flask-JWT-Extended` pueda verificar la firma de los tokens y `AUTH_COMMON_ENDPOINTS_EXCEPTUADOS = ["health"]` para excluir el healthcheck público.
* **[docker-compose.yml](file:///c:/Users/Luis/Desktop/ProyectoSigalFinalFront/FRONT-PPS-BASICO/PPS/deploy/docker-compose.yml)**:
  * Inyectamos las variables de entorno necesarias al servicio de `backend`.

### C. Mapeo de Seguridad y Roles
* **[acciones.yml](file:///c:/Users/Luis/Desktop/ProyectoSigalFinalFront/FRONT-PPS-BASICO/PPS/backend/acciones.yml) (Nuevo)**:
  * Creamos la especificación formal del microservicio `planes`.
  * Agrupamos los permisos del backend en 5 recursos principales (`planes`, `comisiones`, `sedes`, `legajos`, `personas`) con sus acciones básicas (`leer`, `crear`, `editar`, `eliminar`).
  * Mapeamos los roles existentes en el frontend: `ROLE_ADMIN` (permisos CRUD completos), `ROLE_INSTRUCTOR` y `ROLE_USER` (acceso exclusivo de lectura `leer`).

### D. Inicialización en el Ciclo de Vida del Backend
* **[app.py](file:///c:/Users/Luis/Desktop/ProyectoSigalFinalFront/FRONT-PPS-BASICO/PPS/backend/app.py)**:
  * Importamos e inicializamos `AuthCommon(app)` y `JWTManager(app)` para registrar los hooks y configurar el análisis de tokens JWT.
  * Implementamos `registrar_acciones()`, una función que lee `acciones.yml` e intenta registrar dinámicamente los roles y permisos del microservicio contra el de `auth` (`http://auth:5000/acciones`).
  * Agregamos control de excepciones en esta comunicación para evitar que el backend colapse si el servicio `auth` no está levantado en entornos de desarrollo locales.

### E. Decoración Masiva de Rutas
* **[routes/](file:///c:/Users/Luis/Desktop/ProyectoSigalFinalFront/FRONT-PPS-BASICO/PPS/backend/routes/)**:
  * Modificamos quirúrgicamente las 24 rutas del backend para importar y aplicar el decorador `@requires_permission("planes.<recurso>.<accion>")` a cada endpoint según el método HTTP correspondiente (`GET` -> `leer`, `POST` -> `crear`, `PUT` -> `editar`, `DELETE` -> `eliminar`).

---

## 3. Resolución de Problemas y Diagnóstico (Debug)

Durante el despliegue del entorno, solucionamos los siguientes inconvenientes críticos:

1. **Incompatibilidad de Base de Datos (502 Bad Gateway)**:
   * **Problema**: Al levantar el entorno, Nginx devolvía error 502 debido a que el contenedor de `postgres` se caía continuamente con el error: *`The data directory was initialized by PostgreSQL version 16, which is not compatible with this version 17`*.
   * **Solución**: Modificamos la versión en `docker-compose.yml` para utilizar `postgres:16` de modo que fuera compatible con los archivos de tu volumen local sin perder tus datos de desarrollo.
2. **Inicialización de JWT (KeyError: 'JWT_TOKEN_LOCATION')**:
   * **Problema**: `auth-common` invoca a `verify_jwt_in_request()` pero la aplicación Flask no tenía inicializada la extensión `JWTManager` de `Flask-JWT-Extended`.
   * **Solución**: Agregamos e inicializamos `JWTManager(app)` y seteamos la propiedad `JWT_SECRET_KEY` compartida.
3. **Excepción de Endpoint Público**:
   * **Problema**: El endpoint `/health` pedía credenciales a pesar de estar exceptuado.
   * **Solución**: Corregimos el valor de exceptuados de `"/health"` (la ruta URL) a `"health"` (el nombre de la función controladora del endpoint en Flask), permitiendo que Nginx y balanceadores puedan consultar el estado del servidor sin autenticarse.

---

## 4. Metodología de Trabajo

* **Automatización**: Para evitar introducir errores tipográficos en los 24 archivos de rutas, diseñamos un script en Python (`decorate_routes.py`) que analizó las rutas, determinó el recurso de manera contextual en base al archivo y mapeó la acción idónea basada en el método HTTP (GET/POST/PUT/DELETE) para inyectar los imports y decoradores de forma exacta.
* **Idempotencia**: El script fue diseñado para ser seguro ante múltiples ejecuciones, previniendo duplicidad de decoradores e importaciones.
* **Integridad**: Validamos la compilación sintáctica recursiva del 100% de los archivos del backend en Python antes y después de los despliegues.
