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




## Errores

```shell

> tsc

error TS2688: Cannot find type definition file for 'express'.
  The file is in the program because:
    Entry point of type library 'express' specified in compilerOptions

  tsconfig.json:12:7
    12       "express"
             ~~~~~~~~~
    File is entry point of type library specified here.


Found 1 error.

npm error Lifecycle script `build` failed with error:
npm error code 2
npm error path /home/seai_dev/Documents/web-dev/projectFinal/managx-Health/backend
npm error workspace backend@1.0.0
npm error location /home/seai_dev/Documents/web-dev/projectFinal/managx-Health/backend
npm error command failed
npm error command sh -c tsc
(base) seai_dev@seai:~/.../managx-Health$ npm ls @types/express
managx-health@1.0.0 /home/seai_dev/Documents/web-dev/projectFinal/managx-Health
├─┬ backend@1.0.0 -> ./backend
│ └── @types/express@5.0.0
└─┬ frontend@0.1.0 -> ./frontend
  └─┬ react-scripts@5.0.1
    └─┬ webpack-dev-server@4.15.2
      ├── @types/express@4.17.21
      ├─┬ @types/serve-index@1.9.4
      │ └── @types/express@5.0.0 deduped
      └─┬ http-proxy-middleware@2.0.7
        └── @types/express@4.17.21 deduped

```
esto se debe a dependencias repetidas asi que forzamos para que use solo una version

```shell

npm dedupe

```
Usa resolutions en el package.json de la Raíz Modifica el archivo raíz (managx-health/package.json) para forzar a todas las dependencias a usar la versión 4.17.21 de @types/express, que es compatible con la mayoría de las configuraciones.

Agrega lo siguiente en la raíz del archivo:

```json
"resolutions": {
  "@types/express": "4.17.21"
}
```
