// src/middlewares/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../utils/error.handler';

/**
 * @theoreticalBackground
 * Middleware de error para Express:
 * - Captura errores no manejados en la cadena de middleware
 * - Integra con el sistema central de manejo de errores
 * - Asegura un formato consistente de respuesta de error
 */

export const errorHandler = (
  err: Error,           // Objeto de error capturado.
  req: Request,         // Solicitud recibida. No se utiliza en este middleware.
  res: Response,        // Respuesta para enviar al cliente.
  next: NextFunction    // No se utiliza, pero es necesario incluirlo para conformar la firma del middleware.
): void => {
  // Los errores personalizados ya tienen formato
  if (err instanceof ErrorHandler) {
      ErrorHandler.handleError(err, res);
      return;
  }

  // Errores no controlados
  console.error('Error no manejado:', err);   // Registra el error en la consola para propósitos de depuración.

  res.status(500).json({                      // Envía la respuesta al cliente con el código de estado y el mensaje del error    
    status: 'error',
    statusCode: 500,                          // Determina el código de estado HTTP del error, utilizando 500 (Error interno del servidor) como predeterminado.
      message: 'Error interno del servidor'   // Extrae el mensaje del error. Si no está disponible, utiliza un mensaje genérico.
      
  });
};
