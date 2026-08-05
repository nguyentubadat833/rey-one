// import type { FetchResponse } from "ofetch";

export class ValidateInputError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class ApiError extends Error {
  constructor(public readonly data: any) {
    super();
  }
}
