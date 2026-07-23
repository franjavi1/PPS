# Base de datos

## Cargar datos iniciales

Con Docker levantado, ejecutar desde la raiz del proyecto:

```powershell
Get-Content database\seeds\001_datos_iniciales.sql | docker compose -f deploy\docker-compose.yml exec -T postgres psql -U postgres -d bomberos_db
```

## Migraciones manuales

Las migraciones SQL estan en `database/migrations`.

Para agregar la modalidad relacionada a las comisiones asignaturas:

```powershell
Get-Content database\migrations\001_agregar_modalidades_comision_asignatura.sql | docker compose -f deploy\docker-compose.yml exec -T postgres psql -U postgres -d bomberos_db
```
