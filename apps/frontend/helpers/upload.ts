import { URLBuilder } from "@utils/url";
import axios from "axios";

export async function uploadFiles(files: File[], token: string) {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });
  return await axios.post<{ paths: string[] }>(
    URLBuilder("/upload/multiple"),
    formData,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
}
