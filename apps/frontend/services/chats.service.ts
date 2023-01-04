import { URLBuilder } from "@utils/url";
import axios, { AxiosError } from "axios";
import { ChatDetails } from "../pages/profile/[username]/order/[id]/chat";

export async function fetchChatDetails(
  orderId: string,
  token: string,
  successHandler: (d: ChatDetails) => void,
  failureHandler: (err: AxiosError) => void,
  signal: AbortSignal
) {
  return axios
    .get<ChatDetails>(URLBuilder(`/chat/${orderId}`), {
      headers: {
        authorization: `Bearer ${token}`,
      },
      signal,
    })
    .then((d) => d.data)
    .then(successHandler)
    .catch(failureHandler);
}
