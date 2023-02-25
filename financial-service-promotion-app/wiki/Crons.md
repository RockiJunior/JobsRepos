## CRONS
Para que los CRONS (tareas programadas automáticas) funcionen correctamente dentro del proyecto, 
es necesario que nos logueemos (Log In) con un endpoint que se creó con el fin de que el TOKEN (clave con permisos) nos permita realizar estas tareas programadas sin una fecha de expiración.

- El endpoint es el siguiente: `<Server>/auth/generate-withOutExpToken`

## REGLAS
- SOLAMENTE y UNICAMENTE podemos loguearnos a la página UNA vez, con permisos de SUPERADMIN, porque es necesario el uso de el TOKEN UNICO y EXCLUSIVO para el cron. Por lo tanto, es necesaria la creación de un usuario de nombre CRON (o un nombre clave que sea explícito para la utilización de los Crons)
- El usuario de nombre CRON, SOLAMENTE debe loguearse una UNICA vez.

## PASOS
- El cuerpo (BODY) que se ejecutará, tendrá el siguiente formato: `{
    "email": "",
    "password": ""
}`
y el metodo utilizado será un POST

- Una vez realizada la ejecución del metodo POST que apuntará al endpoint previamente mencionado, debemos capturar el resultado del TOKEN (copiar el código), para posteriormente pegarlo en un lugar determinado, que se mencionará en el proximo punto.
- El TOKEN copiado deberá ser pegado dentro del archivo de variables de entorno, que deberá estar creado dentro de la carpeta raíz del proyecto (si este no esta creado, deberá crearse un archivo con nombre `.env`), y éste debe tener el siguiente formato:

DATABASE_NAME=

DATABASE_PORT=

DATABASE_PASSWORD=

DATABASE_USER=

DATABASE_HOST=

API_KEY=

JWT_SECRET=

API_HOST=

FILES_HOST=

LANDING_URL=

MODE=DEV

RUN_MIGRATIONS=

PORT=

DEFAULTLOCALE = 

FILES_PATH=

MAIL_HOST=s

MAIL_USER=

MAIL_PASS=

MAIL_FROM=

AUTH_TOKEN='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6IlNVUEVSQURNSU4iLCJlbWFpazxczqtsdbCI6ImthcmVuLmFsdmFyYWRvQGVjb25vY29tLmNvbasdaImRhdGUiOiIyMDIyLTA3LTA3VDIxOjM3OjE3LjY5N1oiLCJpYXQiOjEcvaq2452NTcyMjk4MzcsImV4cCI6MTY1ODA5MzgzN30.KWNnHZrsxq4qzTblRJ0yIGnQTOacX81ONIE9zp1zTqoasdd'

HOST=

FINCOMUN_API=

NODE_TLS_REJECT_UNAUTHORIZED=

- Si notamos...en la variable AUTH_TOKEN existe un token erróneo, puesto como ejemplo. Aquí es donde tenemos que reemplazar el TOKEN eliminando todo lo que exista despues de la palabra `Bearer` seguida de un espacio, y pegar el TOKEN previamente copiado.
- Una vez realizados los pasos, ya deberían ejecutarse los Crons de manera correcta. 

## Ejecuciones de los crons
La ejecucion de los crons estan programados para que se ejecuten en el siguiente orden:
-   Generación de reportes (4 por cada partner)
-   Generación de ranking individual (1 por partner)
-   Generación de ranking de liderazgo (1 por partner)
-   Generación de comisión individual (1 por partner)
-   Generación de comisión de liderazgo (1 por partner)
-   Generación de bonus mensual (1 por partner)
-   Generación de meta mensual (1 por partner)
-   Generación de ranking mensual (1 por partner)
-   Generación de ranking bimestral (1 por partner)
-   Generación de reportes de actividad para el CMS (1 por partner)
-   Generación de reportes de asociados para el CMS (1 por partner)
-   Generación de reportes de comisiones para el CMS (1 por partner)
-   Generación de reportes de puntajes para el CMS (1 por partner)
-   Ejecución de eliminación de cuentas expiradas por deshabilitación
- Ejecución de deshabilitación de cuentas expiradas por falta de documentación y actividad





