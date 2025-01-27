import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class ExtractProjectIdMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.projectId = req.params.projectId;
    next();
  }
}
