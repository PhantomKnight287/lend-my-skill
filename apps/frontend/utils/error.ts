export function ErrorExtactor(
  response?: string | string[] | undefined | null
): string {
  if (response === undefined || response === null) {
    return "Something went wrong";
  }
  if (typeof response === "string") {
    return response;
  }
  if (Array.isArray(response)) {
    return response[0];
  }
  return "Something went wrong";
}
