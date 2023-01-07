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
import {
  fetchChatDetails,
  isChatQuestionsAnswered,
} from "@services/chats.service";
import clsx from "clsx";
import { AnswerType, OrderStatus } from "db";
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
  status: OrderStatus;
};

export type ChatQuestions = {
  id: string;
  isRequired: boolean;
  question: string;
  answerType: AnswerType;
};

const Chat = () => {
  const [chatConfig, setchatConfig] = useState<ChatDetails>({} as ChatDetails);
  const [questionsAnswered, setQuestionsAnswered] = useState<
    Boolean | undefined
  >(undefined);
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
      setchatConfig,
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

  useEffect(() => {
    if (!chatConfig.id) return;
    const controller = new AbortController();
    if (!readCookie("token"))
      return void replace({
        pathname: "/auth/login",
        query: {
          to: asPath,
        },
      });
    if (userType === "client") {
      isChatQuestionsAnswered(
        chatConfig.Chat.id,
        readCookie("token")!,
        setQuestionsAnswered,
        (err) => {
          return showNotification({
            title: "Error",
            message:
              (err?.response?.data as any)?.message || "Something went wrong",
            color: "red",
          });
        },
        controller.signal
      );
    }
    return () => controller.abort();
  }, [chatConfig.id, userType, chatConfig?.Chat?.id, asPath]);

  useEffect(() => {
    if (questionsAnswered === undefined) return;
    if (questionsAnswered === false)
      return void replace({
        pathname: asPath.replace("chat", "questions"),
        query: {
          to: asPath,
          chatId: chatConfig.Chat.id,
        },
      });
  }, [questionsAnswered]);

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
              href={`/profile/${userType === "client"
                  ? chatConfig.freelancer.username
                  : chatConfig.client.username
                }`}
              className="text-blue-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {userType === "client"
                ? chatConfig.freelancer.name
                : chatConfig.client.name}
            </Link>
          </h1>
          <div className="flex flex-row mt-5">
            <div className="flex-[0.15] border-[1px] rounded-md p-2">
              <ChatSidebar
                client={chatConfig.client}
                freelancer={chatConfig.freelancer}
              />
            </div>
            <div className="flex-1 border-[1px] rounded-md p-2 ml-1">
              <ChatContainer
                orderId={query.id as string}
                chatId={chatConfig.Chat.id}
                completed={chatConfig.status === "COMPLETED"}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Chat;
