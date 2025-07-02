import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException) // Este filtro irá capturar todas as exceções do tipo HttpException
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse(); // Pode ser uma string ou um objeto

    // Verificamos se a resposta da exceção é um objeto para extrair 'message' e 'error'
    const message =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).message || 'Erro inesperado.'
        : exceptionResponse || 'Erro inesperado.';

    const error =
      typeof exceptionResponse === 'object'
        ? (exceptionResponse as any).error || 'Bad Request' // Ex: para validação de DTOs
        : exception.name; // Nome da exceção (e.g., 'NotFoundException')

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message.join(', ') : message, // Para erros de validação com múltiplas mensagens
      error: error,
    });
  }
}