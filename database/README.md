# Base de datos

## Cargar datos iniciales

Con Docker levantado, ejecutar desde la raiz del proyecto:

```powershell
Get-Content database\seeds\001_datos_iniciales.sql | docker compose -f deploy\docker-compose.yml exec -T postgres psql -U postgres -d bomberos_db
```

## Migraciones manuales

Las migraciones SQL estan en `database/migrations`.
