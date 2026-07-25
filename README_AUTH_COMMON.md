# Guía de Integración y Pruebas: auth-common

Este documento detalla la arquitectura implementada en el microservicio de backend utilizando el paquete `auth-common`, el mapeo de permisos y cómo probar el correcto funcionamiento del sistema.

---

## 1. Explicación de lo que Implementamos

El microservicio ahora delega toda la autenticación y la autorización fina de endpoints al paquete interno `auth-common`. Esto resuelve dos necesidades críticas de seguridad:

1. **Validación Global de Sesión (`before_request`)**:
   * Cualquier petición entrante (excepto `/health`) es interceptada automáticamente.
   * Se extrae el *Access Token* (JWT) de la cabecera `Authorization: Bearer <token>`.
   * Se valida la firma del token y se busca en Redis la clave `session:<id_usuario>` para asegurar que la sesión siga activa y no haya sido destruida o expirada desde el panel de control.
   
2. **Autorización Fina por Endpoint (`requires_permission`)**:
   * Las rutas se protegen con el decorador `@requires_permission("planes.<recurso>.<accion>")`.
   * Los permisos efectivos del usuario no viajan en el JWT; se leen síncronamente desde Redis en cada request (`flask.g.acciones`). Si se le revocan permisos al usuario a mitad de sesión, el cambio se aplica de inmediato.

### Recursos y Roles Definidos (`acciones.yml`)

El microservicio se identifica bajo el identificador único `servicio: planes` y registra dinámicamente las siguientes acciones agrupadas por recurso:

* **Planes (`planes`)**: `leer`, `crear`, `editar`, `eliminar`.
* **Comisiones (`comisiones`)**: `leer`, `crear`, `editar`, `eliminar`.
* **Sedes (`sedes`)**: `leer`, `crear`, `editar`, `eliminar`.
* **Legajos (`legajos`)**: `leer`, `crear`, `editar`, `eliminar`.
* **Personas (`personas`)**: `leer`, `crear`, `editar`, `eliminar`.

Los roles se mapean de la siguiente manera:
* **`ROLE_ADMIN`**: Tiene acceso a las 20 acciones (Lectura + Escritura en todos los módulos).
* **`ROLE_INSTRUCTOR`**: Únicamente permisos de lectura (`leer`) en todos los módulos.
* **`ROLE_USER`**: Únicamente permisos de lectura (`leer`) en todos los módulos.

Al iniciar el contenedor, el backend lee automáticamente `acciones.yml` y ejecuta un POST interno hacia `http://auth:5000/acciones` para registrar estos roles y acciones de forma segura en la base de datos de Auth.

---

## 2. Cómo Probarlo (Paso a Paso)

Para realizar una verificación completa de la seguridad, sigue los pasos a continuación.

### Paso A: Reconstruir y levantar los contenedores

Dado que modificamos dependencias y agregamos variables de entorno, es necesario reconstruir la imagen de Docker sin caché y reiniciar el entorno:

1. Abre una terminal en el directorio `deploy/` (donde está el `docker-compose.yml`).
2. Ejecuta los siguientes comandos:
   ```bash
   docker compose build backend --no-cache
   docker compose up -d
   ```

3. Revisa los logs del backend para asegurar la correcta inicialización de `AuthCommon` y que la compilación sea limpia:
   ```bash
   docker compose logs backend
   ```
   *Deberías ver que el servidor Flask inicia correctamente en el puerto 5000.*

---

### Paso B: Simular sesión en Redis (Prueba sin el servicio Auth levantado)

Si estás probando el backend de forma aislada y no tienes el servicio `Auth` corriendo, puedes simular una sesión válida directamente en el Redis compartido:

1. **Generar un JWT Simulado**:
   Crea un JWT token básico (por ejemplo usando [jwt.io](https://jwt.io/)) o reutiliza un token firmado previamente por tu app. El payload del JWT debe tener el campo de identidad del usuario (`sub`), por ejemplo:
   ```json
   {
     "sub": "usuario_prueba_123",
     "exp": 9999999999
   }
   ```
   *(Asegúrate de que la clave de firma/secreto del JWT en tu backend coincida con la usada para firmar este token).*

2. **Inyectar la sesión en Redis**:
   Accede al Redis del contenedor para registrar el estado de la sesión simulada de ese usuario.
   
   Ejecuta en tu consola:
   ```bash
   docker exec -it bomberos_redis redis-cli
   ```
   Dentro de la consola de redis-cli, crea el hash de sesión indicando las acciones y el rol del usuario:
   ```redis
   HSET session:usuario_prueba_123 acciones "planes.planes.leer,planes.comisiones.leer,planes.sedes.leer,planes.legajos.leer,planes.personas.leer" rol "ROLE_USER"
   EXPIRE session:usuario_prueba_123 900
   ```
   *(Puedes verificar que los datos se guardaron correctamente usando `HGETALL session:usuario_prueba_123`).*

---

### Paso C: Probar los endpoints usando curl o Postman

#### 1. Probar acceso público (Excepción)
El endpoint de healthcheck está exceptuado del control de sesiones. Debería responder con éxito sin proveer ningún token:
```bash
curl -X GET http://localhost:8000/api/g1/health
```
**Respuesta esperada:** `{"status":"success","message":"API funcionando"}` (200 OK)

---

#### 2. Probar acceso denegado por falta de autenticación (401 Unauthorized)
Si intentas leer planes de estudio sin adjuntar un token en las cabeceras, `auth-common` lo rechazará de inmediato:
```bash
curl -X GET http://localhost:8000/api/g1/planes
```
**Respuesta esperada:** Un código de estado `401 Unauthorized` indicando la falta de un token o sesión válida.

---

#### 3. Probar acceso concedido (200 OK)
Envía la petición con el token JWT del usuario simulado (el cual creamos en Redis en el Paso B con permisos de lectura):
```bash
curl -X GET http://localhost:8000/api/g1/planes -H "Authorization: Bearer TU_JWT_TOKEN_AQUI"
```
**Respuesta esperada:** Retornará la lista de planes correctamente con código `200 OK`, ya que la sesión `session:usuario_prueba_123` en Redis contiene el permiso `planes.planes.leer`.

---

#### 4. Probar acceso denegado por falta de permisos (403 Forbidden)
Intenta crear un nuevo plan con el mismo token (el cual simulamos como `ROLE_USER` y no tiene la acción `planes.planes.crear` en Redis):
```bash
curl -X POST http://localhost:8000/api/g1/planes \
  -H "Authorization: Bearer TU_JWT_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{"descripcion": "Plan de prueba", "id_tipo_planes": 1}'
```
**Respuesta esperada:** El servidor responderá con código `403 Forbidden`, debido a que el decorador `@requires_permission("planes.planes.crear")` detectó que la sesión en Redis no cuenta con la acción requerida.

---

#### 5. Probar acceso de Administrador (Escritura)
Para comprobar que el Administrador sí puede escribir, actualiza la sesión simulada en Redis asignándole todas las acciones necesarias o el rol correspondiente (`ROLE_ADMIN`), y luego vuelve a repetir la petición del POST anterior:
```bash
docker exec -it bomberos_redis redis-cli
HSET session:usuario_prueba_123 acciones "planes.planes.leer,planes.planes.crear,planes.planes.editar,planes.planes.eliminar" rol "ROLE_ADMIN"
```
Repite el comando de creación anterior (POST /planes).
**Respuesta esperada:** Código `201 Created` o la validación correspondiente de base de datos, lo que demuestra que el bloqueo de permisos funciona dinámicamente y se actualiza de inmediato.

---

## 3. Cómo Probarlo con Postman

Para realizar las pruebas utilizando la interfaz gráfica de **Postman**, sigue estos pasos:

### 1. Configurar la petición básica (GET Planes)
* Crea una nueva petición en Postman haciendo clic en el botón `+`.
* Cambia el método HTTP a **`GET`**.
* En la barra de direcciones URL, ingresa: `http://localhost:8000/api/g1/planes`.
* Presiona **`Send`**.
  * **Resultado Esperado (Sin Auth)**: Debería devolver un código de estado **`401 Unauthorized`**.

### 2. Adjuntar el Token Bearer de Autenticación
* En la petición de Postman, ve a la pestaña **`Authorization`** (ubicada debajo de la URL).
* En el menú desplegable **`Type`**, selecciona **`Bearer Token`**.
* En el campo de texto **`Token`**, pega tu token JWT simulado (el que coincide con el `sub` que configuraste en Redis, p. ej. `usuario_prueba_123`).
* Presiona **`Send`**.
  * **Resultado Esperado**: Debería devolver la lista de planes con código de estado **`200 OK`**.

*Nota: Alternativamente, puedes ir a la pestaña `Headers` y añadir manualmente la cabecera:*
* **Key**: `Authorization`
* **Value**: `Bearer TU_JWT_TOKEN`

### 3. Probar la Creación de un Recurso (POST Planes)
* Duplica tu petición anterior y cambia el método a **`POST`**.
* Mantén la misma URL `http://localhost:8000/api/g1/planes`.
* Asegúrate de que la pestaña **`Authorization`** esté configurada con el mismo **`Bearer Token`**.
* Ve a la pestaña **`Body`** (al lado de Headers).
* Selecciona la opción **`raw`** y en el selector de tipo de la derecha, elige **`JSON`** (en lugar de Text).
* En el cuadro de texto del cuerpo, escribe un JSON válido, por ejemplo:
  ```json
  {
    "descripcion": "Plan de Seguridad contra Incendios 2026",
    "id_tipo_planes": 1
  }
  ```
* Presiona **`Send`**.
  * **Si el usuario en Redis tiene rol `ROLE_USER`**: Responderá con un código **`403 Forbidden`**.
  * **Si el usuario en Redis tiene rol `ROLE_ADMIN`**: Responderá con un código **`201 Created`** (o en su defecto un error de base de datos como `400 Bad Request` si la base de datos rechaza los datos ingresados, pero superando el control de permisos).

