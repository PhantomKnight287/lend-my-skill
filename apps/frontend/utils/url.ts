import { API_URL } from "~/constants";

export function URLBuilder(path: string): string {
  return `${API_URL}${path}`;
}
