import { NextResponse } from "next/server";

type ApiErrorBody = {
  error: string;
  details?: Record<string, unknown>;
};

export function jsonOk<T>(data: T, init: ResponseInit = {}) {
  const { status, ...rest } = init;
  return NextResponse.json({ data }, { status: status ?? 200, ...rest });
}

export function jsonError(
  message: string,
  status = 400,
  details?: Record<string, unknown>,
) {
  const body: ApiErrorBody = { error: message };
  if (details) {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}
