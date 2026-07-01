PPS - Proyecto Flask + React

Este repositorio contiene el desarrollo de una aplicación web realizada con Flask en el backend y React en el frontend.

El proyecto forma parte de la PPS y tiene como objetivo implementar una solución web modular, organizada y mantenible, utilizando buenas prácticas de desarrollo, control de versiones con Git y trabajo colaborativo mediante ramas.

Tecnologías utilizadas
Backend
Python
Flask
SQLAlchemy
Marshmallow
PostgreSQL / SQLite
Flask-CORS
Frontend
React
Vite
JavaScript
HTML
CSS
Herramientas
Git
GitHub
Docker / Docker Compose
Visual Studio Code

Descripción general

La aplicación está dividida en dos partes principales:

Backend: desarrollado con Flask, encargado de manejar la lógica del sistema, las rutas de la API, la conexión con la base de datos, validaciones y servicios.
Frontend: desarrollado con React, encargado de la interfaz visual del usuario y la comunicación con la API del backend.
Flujo de trabajo con Git

El proyecto utiliza una estructura de ramas para organizar el desarrollo:

Rama	Descripción
main	Rama principal. Contiene la versión estable del proyecto.
develop	Rama de integración. Se combinan aquí las funcionalidades antes de llegar a main.
feature/nombre-funcionalidad	Ramas utilizadas para desarrollar funcionalidades específicas.

Ejemplo de rama de funcionalidad:

feature/plan-asignaturas
Forma de trabajo

Cada funcionalidad debe desarrollarse en una rama propia creada desde develop.

git checkout develop
git pull origin develop
git checkout -b feature/nombre-funcionalidad

Luego de realizar los cambios:

git add .
git commit -m "Agrega funcionalidad correspondiente"
git push -u origin feature/nombre-funcionalidad

Finalmente, se debe crear un Pull Request hacia la rama develop.
