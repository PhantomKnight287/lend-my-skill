import { API_URL, STORAGE_URL } from "~/constants";

export function URLBuilder(path: string): string {
  return `${API_URL}${path}`;
}
export function assetURLBuilder(ending: string) {
  return `${STORAGE_URL}${ending}`;
}
