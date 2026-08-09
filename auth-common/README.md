# auth-common

Paquete interno de Python compartido por los microservicios del sistema (Auth, Planes, Inscripción). Resuelve dos cosas para cualquier microservicio que lo instale:

1. **Validación de sesión antes de cada request** (`before_request`): exige un access token válido y una sesión vigente en Redis, sin que tengas que escribir ese chequeo vos mismo.
2. **Autorización por endpoint** (`requires_permission`): un decorador para proteger tus rutas según los permisos del usuario autenticado.

No se necesita leer roles ni permisos del JWT directamente, todo eso vive en Redis y este paquete lo deja disponible en `flask.g`.

---

## 1. Antes de empezar

- **Redis compartido.** Tu microservicio necesita apuntar al **mismo Redis** que usa Auth (`AUTH_COMMON_REDIS_URL`). Las sesiones se crean del lado de Auth (login) y se leen desde acá, si apuntás a un Redis distinto, nunca vas a encontrar ninguna sesión.
- **Python ≥ 3.12**, Flask ≥ 3.1, Flask-JWT-Extended ≥ 4.7. Se instalan solos como dependencias del paquete.

---

## 2. Instalación

### 2.1 Desarrollo local

Cloná `auth-common` como carpeta **hermana** de tu propio repositorio (no como subcarpeta):

```
tu-carpeta-de-trabajo/
├── planes/              (o inscripcion/)
└── auth-common/
```

```bash
git clone https://github.com/ignacioaltamirano23/auth-common.git
cd planes   # o inscripcion
pip install -e ../auth-common
```

`pip install -e` es una instalación **editable**: no copia el código, lo enlaza directo a la carpeta que clonaste. Un `git pull` dentro de `auth-common/` alcanza para tener la última versión, no hace falta reinstalar.

### 2.2 Docker / docker-compose

La instalación se hace en el arranque del contenedor. En tu `docker-compose.yml`:

```yaml
services:
  tu-servicio:
    build:
      context: ../backend
      dockerfile: Dockerfile
    command: sh -c "pip install -e /auth-common --quiet && python app.py"
    volumes:
      - ../backend:/app
      - ../../auth-common:/auth-common
    # ...resto de tu config
```

La ruta `../../auth-common` asume que tu repo y `auth-common` son carpetas hermanas.

### 2.3 Como dependencia (Legajo, Inscripción, o cualquier consumidor que no desarrolla sobre este paquete)

Si tu equipo solo usa `auth_common` pero no lo edita, no hace falta clonarlo aparte ni el bind mount de la sección 2.2. Alcanza con agregar esta línea a tu `requirements.txt`:

```
git+https://github.com/ignacioaltamirano23/auth-common.git@v0.3.0
```

Esta misma línea sirve para dos casos:

- **Instalar por primera vez**: agregala a tu `requirements.txt` si todavía no está.
- **Actualizar a una versión nueva**: cambiá el tag (`@v0.3.0` → `@v0.4.0`, por ejemplo) en esa misma línea, y volvé a buildear tu imagen.

Apuntá siempre a un tag, no a `@main`. Con `@main`, cualquier commit nuevo del lado de Auth te puede cambiar el comportamiento sin aviso, y Docker puede no darse cuenta de que hay algo nuevo para instalar.

---

## 3. Conectar la extensión en tu app

Necesitás 3 config keys en tu `app.config` (podés ponerlas directo en tu clase `Config`, o donde ya centralices configuración):

| Config key                          | Obligatoria       | Qué es                                                                                  |
| ----------------------------------- | ----------------- | --------------------------------------------------------------------------------------- |
| `AUTH_COMMON_REDIS_URL`             | Sí                | El mismo Redis que usa Auth. Ej: `redis://redis:6379/0`                                 |
| `AUTH_COMMON_SESSION_TTL`           | Sí                | TTL de sesión en segundos (el mismo valor que usa Auth, para que ambos lados coincidan) |
| `AUTH_COMMON_ENDPOINTS_EXCEPTUADOS` | No (default `[]`) | Lista de tus propios endpoints públicos que no requieren sesión                         |
| `AUTH_COMMON_SERVICIOS_PERMITIDOS`  | No (default `[]`) | IPs de microservicios internos autorizados a llamar tus endpoints `only_services=True`  |

Y en tu `app.py` o dentro de tu `create_app()`:

```python
import os
from flask import Flask
from auth_common import AuthCommon

app = Flask(__name__)

app.config["AUTH_COMMON_REDIS_URL"] = os.environ.get(
    "AUTH_COMMON_REDIS_URL", "redis://redis:6379/0"
)
app.config["AUTH_COMMON_SESSION_TTL"] = int(
    os.environ.get("AUTH_COMMON_SESSION_TTL", 900)  # 900 = 15 minutos, mismo valor que usa Auth
)
app.config["AUTH_COMMON_ENDPOINTS_EXCEPTUADOS"] = []

app.config["AUTH_COMMON_SERVICIOS_PERMITIDOS"] = [
    ip.strip()
    for ip in os.environ.get("AUTH_COMMON_SERVICIOS_PERMITIDOS", "").split(",")
    if ip.strip()
]

AuthCommon(app)
```

Y en tu `docker-compose.yml`, le pasás esos valores al contenedor:

```yaml
environment:
  - AUTH_COMMON_REDIS_URL=redis://redis:6379/0
  - AUTH_COMMON_SESSION_TTL=900
```

`AUTH_COMMON_ENDPOINTS_EXCEPTUADOS` queda como lista fija en el código (no como variable de entorno).

Con esa única línea (`AuthCommon(app)`) ya queda registrada automáticamente la validación de sesión en cada request. No necesitás llamar a nada más a mano, esto incluye `JWTManager`.

---

## 4. Declarar tus propias acciones (`acciones.yml`)

Antes de poder usar `requires_permission("planes.algo")`, esa acción tiene que existir del lado de Auth, si no, ningún rol se le puede asignar a nadie, y el chequeo va a fallar siempre.

Creá un archivo `acciones.yml` en la raíz de tu repo (mismo formato que ya usa Auth para el suyo):

```yaml
servicio: planes

acciones:
  - nombre: planes.leer
    descripcion: Ver planes de estudio
    activo: true
  - nombre: cursos.control_parcial
    descripcion: Crear o editar cursos
    activo: true

roles:
  - nombre: DOCENTE
    descripcion: Docente de la federación

rol_accion:
  - rol: DOCENTE
    acciones:
      - planes.leer
      - cursos.control_parcial
```

Notas sobre este archivo:

- `nombre` de cada acción va **sin** el prefijo del servicio (`planes.leer`, no `planes.planes.leer`), el prefijo lo arma Auth automáticamente al calcular los permisos efectivos de una sesión, combinando `servicio` + `nombre`. Vos usás el nombre completo (`planes.planes.leer`) recién cuando llamás a `requires_permission()` en tu código (sección 5).
- Si declarás un rol que ya existe en otro servicio, no se crea un rol nuevo ni hay conflicto. Un mismo rol puede combinar acciones de varios microservicios.
- `rol_accion` solo puede vincular tu rol a acciones que **vos mismo** declaraste en este archivo, no podés vincular un rol a una acción de otro servicio desde acá.

En tu `create_app()`, al arrancar, leé este archivo y registralo contra Auth vía `POST /acciones` (sobre la red interna de Docker, no a través de Nginx, este endpoint es exclusivamente interno):

```python
import yaml
import requests

def registrar_acciones():
    with open("acciones.yml") as f:
        datos = yaml.safe_load(f)
    requests.post("http://auth:5000/acciones", json=datos)
```

Es seguro correr esto en cada arranque del contenedor: el registro no duplica nada si ya existía.

**Importante - orden de arranque:** si tu contenedor arranca antes de que Auth esté listo para recibir requests, este `POST` va a fallar. En tu `docker-compose.yml`, declará tu servicio con `depends_on` apuntando a `auth` con `condition: service_healthy` (Auth ya expone un `healthcheck` para esto).

---

## 5. Proteger tus endpoints

```python
from auth_common.decorador import requires_permission

@app.route("/planes")
@requires_permission("planes.planes.leer")
def listar_planes():
    ...

@app.route("/cursos", methods=["POST"])
@requires_permission("planes.cursos.control_parcial")
def crear_curso():
    ...

@app.route("/dashboard")
@requires_permission("planes.planes.leer", "planes.cursos.ver", policy="ANY")
def dashboard():
    ...
```

- El string que le pasás es siempre `servicio.nombre` completo (con el prefijo), no el `nombre` suelto tal cual aparece en tu `acciones.yml`.
- `policy="ALL"` (default): el usuario necesita **todas** las acciones listadas.
- `policy="ANY"`: alcanza con **una** de las acciones listadas, útil cuando un mismo endpoint sirve a más de un flujo.
- No hace falta poner `@jwt_required()` en tus rutas, la validación del token ya la hace `AuthCommon` en el `before_request`, antes de que tu endpoint se ejecute.

### 5.1 Endpoints exclusivos para microservicios (`only_services`)

Para endpoints que no los llama un usuario logueado sino otro microservicio, usá `only_services=True` en vez de una lista de acciones:

```python
@app.route("/acciones", methods=["POST"])
@requires_permission(only_services=True)
def registrar():
...
```

- No se combina con acciones: es un chequeo de identidad de servicio, no de
  permisos de usuario. `requires_permission(only_services=True)` no acepta
  ningún string de acción como argumento.
- Valida la IP de origen del request contra `AUTH_COMMON_SERVICIOS_PERMITIDOS`,
  no contra `flask.g.acciones`, no hace falta que el llamador tenga JWT.
- **El endpoint también tiene que estar en `AUTH_COMMON_ENDPOINTS_EXCEPTUADOS`.**
  Si no, `validar_sesion` lo rechaza con 401 (por falta de JWT) antes de que
  este decorador llegue a ejecutarse.

### Convención de nombres

- `servicio.recurso.accion`, por ej: `planes.planes.leer`, `planes.cursos.control_parcial`.
- `control_parcial` es la convención del proyecto para "crear o editar", **no** son dos acciones separadas (`crear` + `editar`), es una sola que cubre ambas operaciones.

---

## 6. Cómo funciona la sesión

- **Los permisos nunca viven en el JWT.** El token solo prueba identidad (`sub` = id de usuario). Todo lo demás (roles, acciones) se lee en cada request desde Redis (`session:{id_usuario}`). Esto es a propósito: si a un usuario le cambian los permisos a mitad de sesión, el cambio es efectivo en el siguiente request, sin esperar a que el token expire.
- **Si `flask.g.acciones` está vacío o el usuario da 401 de la nada**, podés usar el comando `redis-cli HGETALL session:{id_usuario}` para ver qué roles y acciones tiene esa sesión en este momento.

---

## 7. Actualizar la librería cuando cambia

Depende de cómo la instalaste.

### Si la instalaste editable (secciones 2.1/2.2, desarrollo local)

```bash
cd auth-common
git pull
```

No hace falta reinstalar nada — la instalación editable ya apunta al código en disco. En Docker, como el `command` corre `pip install -e /auth-common` en cada arranque, un `docker compose restart tu-servicio` después del `git pull` ya toma el cambio.

### Si la instalaste como dependencia fija (sección 2.3, `git+https://...@tag`)

Cambiá el tag en tu `requirements.txt` a la versión nueva, y reconstruí tu imagen:

```bash
docker compose build tu-servicio --no-cache
docker compose up -d tu-servicio
```

El `--no-cache` asegura que Docker vuelva a correr `pip install` para traer la versión nueva del tag, en vez de reusar una capa vieja de la build anterior.
