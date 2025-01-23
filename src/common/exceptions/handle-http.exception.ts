import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export function handleHttpException(error: any, errorMessage: string): void {
  if (error instanceof NotFoundException) {
    throw error;
  }
  throw new InternalServerErrorException(errorMessage);
}
