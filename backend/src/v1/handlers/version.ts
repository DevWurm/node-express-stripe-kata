import { Request, Response, NextFunction } from 'express-serve-static-core';

export function versionHandler(req: Request, res: Response, next: NextFunction): void {
  // TODO: Get the version info via ../helpers/manifest and send them in the response
}