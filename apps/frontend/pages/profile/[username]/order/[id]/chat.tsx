import { MetaTags } from "@components/meta";
import { ChatSidebar } from "@components/sidebars/chat";
import { outfit } from "@fonts";
import { readCookie } from "@helpers/cookie";
import useHydrateUserContext from "@hooks/hydrate/user";
import useIssueNewAuthToken from "@hooks/jwt";
import { useUser } from "@hooks/user";
import { Grid, LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { fetchChatDetails } from "@services/chats.service";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export type ChatDetails = {
  Chat: {
    id: string;
  };
  client: {
    id: string;
    name: string;
    username: string;
    avatarUrl: any;
    verified: boolean;
  };
  freelancer: {
    id: string;
    name: string;
    username: string;
    avatarUrl: any;
    verified: boolean;
  };
  id: string;
  status: string;
};

const Chat = () => {
  const [chatDetails, setChatDetails] = useState<ChatDetails>(
    {} as ChatDetails
  );
  const refetchProfile = useHydrateUserContext();
  useIssueNewAuthToken({
    method: "replace",
    redirect: true,
    successAction: refetchProfile,
    to: "/auth/login",
  });
  const { isReady, query, asPath, replace } = useRouter();

  useEffect(() => {
    if (!isReady) return;
    const controller = new AbortController();
    const token = readCookie("token");
    if (!token)
      return void replace({
        pathname: "/auth/login",
        query: {
          to: asPath,
        },
      });
    fetchChatDetails(
      query.id as string,
      token,
      setChatDetails,
      (error) => {
        if (error.code === "ERR_CANCELED") return;
        showNotification({
          title: "Error",
          message:
            (error?.response?.data as any)?.message || "Something went wrong",
          color: "red",
        });
      },
      controller.signal
    );
    return () => controller.abort();
  }, [isReady, query.id, asPath]);
  const { userType } = useUser();

  return (
    <div
      className={clsx("p-8", {
        [outfit.className]: true,
      })}
    >
      <MetaTags
        title="Chat"
        description="Chat to complete this project successfully."
      />
      <LoadingOverlay visible={!chatDetails.id} overlayBlur={1} />
      {chatDetails.id ? (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            Chat With{" "}
            <Link
              href={`/profile/${
                userType === "client"
                  ? chatDetails.freelancer.username
                  : chatDetails.client.username
              }`}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {userType === "client"
                ? chatDetails.freelancer.name
                : chatDetails.client.name}
            </Link>
          </h1>
          <div className="flex flex-row mt-10">
            <div className="flex-[0.15] border-[1px] rounded-md min-h-screen p-2">
              <ChatSidebar
                client={chatDetails.client}
                freelancer={chatDetails.freelancer}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Chat;
