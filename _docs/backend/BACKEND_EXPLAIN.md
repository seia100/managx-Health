# Explicacion del backend

Documentacion importante en la que se sigue en cada uno de los archivos /pendiente

## Ejecucion

Crear un dockerfile dentro de la carpeta `./backend ` para poder construir 



## Middleware

1. `authMiddleware.ts`: Middleware para autenticación y autorización basada en roles
2. `errorHandler.ts`: Middleware para manejo centralizado de errores.
3. `validationMiddleware.ts`: Middleware para validación de datos (usaremos Joi por sus ventajas).


La diferencia principal entre `error.handler.ts` y `error.middleware.ts` es que:

`error.handler.ts` es una clase base que define la estructura y el comportamiento de los errores personalizados
`error.middleware.ts` es un middleware de Express que captura errores en la cadena de middleware y los procesa usando la clase ErrorHandler
