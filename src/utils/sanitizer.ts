import {
  SENSITIVE_BODY_FIELDS,
  SENSITIVE_HEADERS,
} from "../constants";

export function sanitizeHeaders(
  headers: Record<string, any>
) {
  const copy = { ...headers };

  for (const key of SENSITIVE_HEADERS) {
    delete copy[key];
  }

  return copy;
}

export function sanitizeBody(body: any) {
  if (!body || typeof body !== "object") {
    return body;
  }

  const copy = { ...body };

  for (const field of SENSITIVE_BODY_FIELDS) {
    if (field in copy) {
      copy[field] = "***";
    }
  }

  return copy;
}