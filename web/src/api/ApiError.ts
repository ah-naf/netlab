import {
  ERROR_KIND,
  GENERIC_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  UNKNOWN_ERROR_CODE,
} from "../constants/api";

type ErrorKind = (typeof ERROR_KIND)[keyof typeof ERROR_KIND];

type ErrorFields = {
  kind: ErrorKind;
  status: number;
  code: string;
  message: string;
  resource?: string;
  details?: unknown;
};

type ErrorAnswer = { error?: Partial<ErrorFields> };

/** The one error type for every failed call: a server error answer or no answer at all. */
export class ApiError extends Error {
  declare readonly kind: ErrorKind;
  declare readonly status: number;
  declare readonly code: string;
  declare readonly resource?: string;
  declare readonly details?: unknown;

  constructor(fields: ErrorFields) {
    super(fields.message);
    this.name = "ApiError";
    Object.assign(this, fields);
  }

  static network(): ApiError {
    return new ApiError({
      kind: ERROR_KIND.NETWORK,
      status: 0,
      code: UNKNOWN_ERROR_CODE,
      message: NETWORK_ERROR_MESSAGE,
    });
  }

  static unexpected(status: number): ApiError {
    return new ApiError({
      kind: ERROR_KIND.SERVER,
      status,
      code: UNKNOWN_ERROR_CODE,
      message: GENERIC_ERROR_MESSAGE,
    });
  }

  /** Reads the standard error body, falling back to the status when the body is not standard. */
  static async fromResponse(response: Response): Promise<ApiError> {
    const answer: ErrorAnswer | null = await response.json().catch(() => null);
    const { code, message, resource, details } = answer?.error ?? {};
    return new ApiError({
      kind: ERROR_KIND.SERVER,
      status: response.status,
      code: code ?? UNKNOWN_ERROR_CODE,
      message: message ?? GENERIC_ERROR_MESSAGE,
      resource,
      details,
    });
  }
}
