import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function handleHttpException(error: any, errorMessage: string): void {
  if (error instanceof NotFoundException) {
    throw error;
  }
  if (error instanceof BadRequestException) {
    throw error;
  }
  if (error instanceof UnauthorizedException) {
    throw error;
  }
  throw new InternalServerErrorException(errorMessage);
}
