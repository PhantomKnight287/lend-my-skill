import dynamic from "next/dynamic";

const ChatContainer = dynamic(() => import("@components/chat/container"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

import { MetaTags } from "@components/meta";
import { ChatSidebar } from "@components/sidebars/chat";
import { outfit } from "@fonts";
import { readCookie } from "@helpers/cookie";
import useHydrateUserContext from "@hooks/hydrate/user";
import useIssueNewAuthToken from "@hooks/jwt";
import { useUser } from "@hooks/user";
import { LoadingOverlay } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { fetchChatDetails } from "@services/chats.service";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export type ChatDetails = {
  chat: {
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
  orderState: string;
};

const Chat = () => {
  const [chatConfig, setchatConfig] = useState<ChatDetails>({} as ChatDetails);

  const refetchProfile = useHydrateUserContext();
  useIssueNewAuthToken({
    method: "replace",
    redirect: true,
    successAction: refetchProfile,
    to: "/auth/login",
  });
  const { isReady, query, asPath, replace } = useRouter();
  const [complete, setCompleted] = useState(false);

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
      (d) => {
        setchatConfig(d);
        if (d.orderState === "Completed") {
          setCompleted(true);
        }
      },
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
  const { role } = useUser();

  useEffect(() => {
    if (!chatConfig.id) return;
    if (!readCookie("token"))
      return void replace({
        pathname: "/auth/login",
        query: {
          to: asPath,
        },
      });
  }, [chatConfig.id, role, chatConfig?.chat?.id, asPath]);

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
      <LoadingOverlay visible={!chatConfig.id} overlayBlur={1} />
      {chatConfig.id ? (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">
            Chat With{" "}
            <Link
              href={`/profile/${
                role === "Client"
                  ? chatConfig.freelancer.username
                  : chatConfig.client.username
              }`}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {role === "Client"
                ? chatConfig.freelancer.name
                : chatConfig.client.name}
            </Link>
          </h1>
          <div className="flex flex-row mt-5">
            <div className="flex-[0.15] border-[1px] rounded-md p-2 sticky top-0 h-max pb-8">
              <ChatSidebar
                client={chatConfig.client}
                freelancer={chatConfig.freelancer}
              />
            </div>
            <div className="flex-1 border-[1px] rounded-md p-2 ml-1">
              <ChatContainer
                orderId={query.id as string}
                chatId={chatConfig.chat.id}
                completed={complete}
                setCompleted={setCompleted}
                freelancerUsername={chatConfig.freelancer.username}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Chat;
