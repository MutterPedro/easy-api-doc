import { ErrorCodes } from '../enums/ErrorCodes';

export class EasyApiDocError extends Error {
  readonly isEasyApiDocError: boolean = true;
  readonly code: ErrorCodes = ErrorCodes.Generic;

  constructor(message: string) {
    super(message);

    this.name = 'EasyApiDocError';
  }
}
