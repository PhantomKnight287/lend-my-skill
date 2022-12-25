import { URLBuilder } from "@utils/url";
import axios from "axios";

export async function updateGithubId(id: string, token: string) {
  return axios.post(
    URLBuilder("/accounts/github"),
    { id },
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
}
