// Importa los tipos necesarios de Express para tipar el middleware de manejo de errores.
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de manejo de errores globales.
 * Captura cualquier error no manejado previamente y devuelve una respuesta estructurada al cliente.
 */
export const errorHandler = (
  err: any, // Objeto de error capturado.
  _req: Request, // Solicitud recibida. No se utiliza en este middleware.
  res: Response, // Respuesta para enviar al cliente.
  _next: NextFunction // No se utiliza, pero es necesario incluirlo para conformar la firma del middleware.
) => {
    // Registra el error en la consola para propósitos de depuración.
    console.error('Error:', err);

    // Determina el código de estado HTTP del error, utilizando 500 (Error interno del servidor) como predeterminado.
    const statusCode = err.status || 500;

    // Extrae el mensaje del error. Si no está disponible, utiliza un mensaje genérico.
    const message = err.message || 'Error interno del servidor';

    // Envía la respuesta al cliente con el código de estado y el mensaje del error.
    res.status(statusCode).json({ message });
};
