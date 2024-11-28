// Importación del cliente de conexión de PostgreSQL desde el módulo `pg`.
// Se utiliza `Pool` para manejar un grupo de conexiones reutilizables.
import { Pool } from "pg";

// Importación del módulo `dotenv` para cargar variables de entorno desde un archivo `.env`.
// Esto ayuda a separar las credenciales y configuraciones sensibles del código fuente.
import dotenv from "dotenv";

// Carga las variables de entorno definidas en el archivo `.env` para que estén accesibles
// mediante `process.env`.
dotenv.config();

// Configuración del pool de conexiones para PostgreSQL.
// Se utilizan las variables de entorno cargadas para parametrizar la conexión.
const pool = new Pool({
    // Usuario de la base de datos, tomado de las variables de entorno.
    user: process.env.POSTGRES_USER,
    // Host o dirección del servidor PostgreSQL (puede ser `localhost` o una IP remota).
    host: process.env.DB_HOST,
    // Nombre de la base de datos a la que se conecta el cliente.
    database: process.env.POSTGRES_DB,
    // Contraseña del usuario, tomada de las variables de entorno.
    password: process.env.POSTGRES_PASSWORD,
    // Puerto donde escucha el servidor PostgreSQL, por defecto es 5432.
    // Se convierte explícitamente a número entero para garantizar que sea el tipo correcto.
    port: parseInt(process.env.DB_PORT || "5432", 10),
});

// Evento que se activa cuando el pool establece exitosamente una conexión con la base de datos.
// Se utiliza para registrar en el log que la conexión está funcionando.
pool.on("connect", () => {
    console.log("Conexión exitosa a la base de datos");
});

// Evento que se activa cuando ocurre un error en las conexiones del pool.
// El programa imprime el error y termina la ejecución para evitar inconsistencias.
pool.on("error", (err) => {
    console.error("Error en la conexión con la base de datos", err);
    process.exit(-1); // -1 indica que el proceso finalizó con un error crítico.
});

// Exportación del pool configurado para que pueda ser utilizado en otros módulos.
// Esto permite que diferentes partes de la aplicación utilicen el mismo pool de conexiones.
export default pool;
