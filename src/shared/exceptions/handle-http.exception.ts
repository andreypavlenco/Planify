import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function handleHttpException(error: any, errorMessage: string): void {
  const allowedExceptions = [
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
  ];
  if (allowedExceptions.some((exception) => error instanceof exception)) {
    throw error;
  }
  throw new InternalServerErrorException(errorMessage);
}
