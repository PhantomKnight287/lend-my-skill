import { createCookie, readCookie } from "@helpers/cookie";
import { useSetUser, useUser } from "@hooks/user";
import { URLBuilder } from "@utils/url";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function useHydrateUserContext(
  action: "push" | "replace" = "replace",
  redirect?: boolean,
  redirectTarget?: string
) {
  const dispatch = useSetUser();
  const { push, replace } = useRouter();
  async function fetcher(token: string, updateState = false) {
    const res = await axios
      .get(URLBuilder("/profile"), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => null);
    if (res === null) {
      if (redirect) {
        if (redirectTarget) {
          action === "push" ? push(redirectTarget) : replace(redirectTarget);
        } else {
          action === "push" ? push("/") : replace("/");
        }
      }
      return null;
    }
    if (updateState) {
      dispatch({
        type: "SET_USER",
        payload: {
          ...res.data,
          userType: res.data.type,
        },
      });
    }
  }

  useEffect(() => {
    const token = readCookie("token");
    const refreshToken = readCookie("refreshToken");
    if (token) {
      fetcher(token, true);
    }
    if (refreshToken) {
      axios
        .get(URLBuilder("/hydrate/token"), {
          headers: {
            authorization: `Bearer ${refreshToken}`,
          },
        })
        .then((res) => {
          createCookie("token", res.data.token, 1);
          fetcher(res.data.token, true);
        })
        .catch((err) => null);
    }
  }, []);
  return fetcher;
}
