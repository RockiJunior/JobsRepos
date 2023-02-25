## Documentacion
- Inicio de sessión
	- El usuario no debe tener Rol de Distribuidor.
	- Validar si el usuario esta activo.
	- Validar si la contraseña expiró (60 días), si es así, enviar a actualización de contraseña.
	- Validar si la contraseña se encuentra en el histórico de contraseñas, que no sea igual a las últimas 4.
	- La plataforma debe cerrar las sesiones después de un período de inactividad (30min).
- Actualización de contraseña.
	- El password deber ser alfanumérico con una longitud mínima de 8 caracteres, incluyendo mayúsculas, minúsculas, dígitos y caracteres especiales.
	- El password debe expirar por lo menos cada 60 días y no debe ser cambiado en los siguientes 7 días.
	- No se debe permitir el reúso de contraseñas y se debe guardar un histórico mínimo de 4.
	- La política de passwords debe aplicar para todos los usuarios a excepción el usuario Administrador.
	- En la plataforma sólo debe existir un usuario con el privilegio de administrador.
	
