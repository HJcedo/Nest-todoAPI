import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'; // Importe o tipo de erro do Prisma
import { Response } from 'express';

@Catch(PrismaClientKnownRequestError) // Captura erros específicos do PrismaClientKnownRequestError
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor.';
    let error = 'Internal Server Error';

    // Verifique o código de erro do Prisma para personalizar a resposta
    switch (exception.code) {
      case 'P2002': // Unique constraint violation (e.g., trying to create a task with a duplicate title if title was unique)
        statusCode = HttpStatus.CONFLICT; // 409 Conflict
        message = `Um registro com o(s) campo(s) [${exception.meta?.target || 'desconhecido'}] já existe.`;
        error = 'Conflict';
        break;
      case 'P2025': // Record not found (e.g., trying to update/delete a non-existent record)
        statusCode = HttpStatus.NOT_FOUND; // 404 Not Found
        message = `O recurso solicitado não foi encontrado.`;
        error = 'Not Found';
        break;
      // Você pode adicionar outros códigos de erro do Prisma aqui se precisar de tratamento específico
      // Consulte a documentação do Prisma para mais códigos de erro:
      // https://www.prisma.io/docs/reference/api-reference/error-reference#client-errors
      default:
        // Para outros erros do Prisma não tratados especificamente, logamos e retornamos um erro genérico
        console.error('Prisma Error Não Tratado:', exception.code, exception.message);
        break;
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error,
    });
  }
}