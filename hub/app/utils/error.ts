// import type { FetchResponse } from "ofetch";

export class ValidateInputError extends Error {
  constructor(message?: string) {
    super(message);
  }
}

  // export class ApiError extends Error {
  //   constructor(public readonly response: FetchResponse<any>) {
  //     super("API ERROR");
  //   }
  // }
