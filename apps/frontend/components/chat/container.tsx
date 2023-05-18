import { Message } from "@components/message";
import { ReviewModal } from "@components/modal/review";
import { outfit } from "@fonts";
import { readCookie } from "@helpers/cookie";
import { r } from "@helpers/date";
import { uploadFiles } from "@helpers/upload";
import { useUser } from "@hooks/user";
import {
  Button,
  FileInput,
  Group,
  Image,
  Modal,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import {
  fetchChatMessages,
  fetchChatMessagesCount,
} from "@services/chats.service";
import { IconCheck, IconFile, IconPlus, IconX } from "@tabler/icons-react";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import clsx from "clsx";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { io as socket, Socket } from "socket.io-client";
import { API_URL } from "~/constants";
type MessageType = "BASIC" | "CONFIRM_AND_CANCEL_PROMPT";

interface Props {
  orderId: string;
  chatId: string;
  completed: boolean;
  freelancerUsername: string;
  setCompleted: Dispatch<SetStateAction<boolean>>;
}

export type message = {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
    avatarUrl: any;
  };
  freelancer?: {
    id: string;
    name: string;
    username: string;
    avatarUrl: any;
  };
  createdAt: string;
  type: "Text" | "Prompt";
  sender: "System" | "Client" | "Freelancer";
};

const ChatContainer = (prop: Props) => {
  const [io, setIo] = useState<Socket>();
  const [count, setCount] = useState(0);
  const [messages, setMessages] = useState<message[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  useEffect(() => {
    if (window) {
      setIo(
        socket(API_URL!.replace(/\/v(.*)/, ""), {
          auth: {
            token: readCookie("token")!,
          },
          query: {
            orderId: prop.orderId,
            chatId: prop.chatId,
          },
          path: "/v1/socket.io",
          transports: ["websocket"],
        })
      );
    }
  }, [prop.chatId, prop.orderId]);
  const [typing, setTyping] = useState<{ userType?: "Freelancer" | "Client" }>(
    {}
  );

  const [disabled, setDisabled] = useState(prop.completed);
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    io?.on("connect", () => {
      console.log("Connected");
      io?.on("message", (d: message) => {
        setMessages((old) => [...old, d]);
        setCount((old) => old + 1);
        ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
      io.on("typing", (d: { userType: "Freelancer" | "Client" }) => {
        if (timeout) clearTimeout(timeout);
        setTyping(d);
        timeout = setTimeout(() => {
          setTyping({});
        }, 3000);
      });
      io.on("completed", () => {
        prop.setCompleted(true);
        setDisabled(true);
      });
      io.on("error", (err) => {
        showNotification({
          title: "Error",
          message: err,
          color: "red",
        });
      });
    });

    return () => {
      io?.disconnect();
      clearTimeout(timeout);
      return;
    };
  }, [io]);

  const formState = useForm({
    initialValues: {
      message: "",
    },
  });
  const { asPath, replace } = useRouter();
  useEffect(() => {
    const token = readCookie("token");
    if (!token)
      return void replace({
        pathname: "/auth/login",
        query: {
          to: asPath,
        },
      });
    const controller = new AbortController();
    fetchChatMessagesCount(
      prop.orderId,
      token,
      setCount,
      (err) => {
        showNotification({
          title: "Error",
          message:
            (err?.response?.data as any)?.message || "Something went wrong",
          color: "red",
        });
      },
      controller.signal
    );
  }, []);

  async function fetchMessages(
    appendMode?: "before" | "after",
    take?: number,
    skip?: number,
    reverse?: boolean
  ) {
    const token = readCookie("token")!;
    await fetchChatMessages(
      prop.orderId,
      token,
      (data) => {
        if (appendMode === "before") {
          setMessages((old) => [...data.messages, ...old]);
        } else if (appendMode === "after") {
          setMessages((old) => [...old, ...data.messages]);
        } else {
          if (reverse) return setMessages(data.messages.reverse());
          setMessages(data.messages);
        }
      },
      (err) => {
        showNotification({
          title: "Error",
          message:
            (err?.response?.data as any)?.message || "Something went wrong",
          color: "red",
        });
      },
      skip,
      take
    );
  }

  useEffect(() => {
    if (count > 0) fetchMessages(undefined, undefined, undefined, true);
  }, [count]);

  const ref = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [doneModalOpened, setDoneModalOpened] = useState(false);

  useEffect(() => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, []);
  const { userType } = useUser();
  function acceptHandler() {
    io?.emit("prompt");
  }
  function rejectHandler() {
    io?.emit("reject");
  }
  const [reviewModalOpened, setReviewModalOpened] = useState(false);

  const [attachmentModalOpened, setAttachmentModalOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadWorkModal, setUploadWorkModal] = useState(false);
  return (
    <>
      <div className="hidden lg:block relative max-h-screen overflow-y-scroll">
        <div ref={chatContainerRef}>
          {messages?.length < count && (
            <Group position="center">
              {userType == "Freelancer" && !prop.completed ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadWorkModal(true);
                  }}
                >
                  Submit Work
                </Button>
              ) : null}
              <Button
                onClick={() => {
                  fetchMessages(
                    "before",
                    messages?.length + 30,
                    messages?.length
                  );
                }}
                variant="outline"
              >
                Load More
              </Button>
              {prop.completed ? null : (
                <Button
                  onClick={() => {
                    setDoneModalOpened((o) => !o);
                  }}
                  variant="outline"
                >
                  Mark as Done
                </Button>
              )}
              {userType === "Client" && prop.completed === true ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setReviewModalOpened((o) => !o);
                  }}
                >
                  Leave a Review
                </Button>
              ) : null}
            </Group>
          )}
          {messages.map((m, i) => (
            <>
              <Message
                key={m.id}
                author={m.author}
                content={m.content}
                id={m.id}
                sender={m.sender}
                type={m.type}
                acceptHandler={acceptHandler}
                rejectHandler={rejectHandler}
                createdAt={m.createdAt}
              />
              {i === messages.length - 1 ? (
                <>
                  <div className="w-full h-[10px] mb-[60px]" ref={ref} />
                  <div className="sticky bottom-0 w-full mt-auto">
                    <div className="flex flex-row items-center justify-between flex-1 p-2 bg-inputs border-t border-gray-200 rounded-md w-full">
                      <form
                        onSubmit={formState.onSubmit((d) => {
                          io?.emit("message", d);
                          formState.reset();
                        })}
                        className="flex flex-col  items-center justify-between w-full"
                      >
                        {typing.userType ? (
                          <div className="flex flex-row mb-1 text-xs w-full ">
                            {upperFirst(typing.userType)}
                            <span className="ml-1"> is typing...</span>
                          </div>
                        ) : null}
                        <div className="flex flex-row w-full items-center">
                          <IconPlus
                            className="cursor-pointer mr-2"
                            onClick={() => setAttachmentModalOpened((o) => !o)}
                          />
                          <input
                            {...formState.getInputProps("message")}
                            className={clsx(
                              "w-full bg-inputs border-none outline-none rounded-md p-2 focus:ring-2 focus:ring-blue focus:ring-opacity-50  ",
                              outfit.className
                            )}
                            required
                            autoFocus
                            placeholder="Type your message here..."
                            onChange={(e) => {
                              formState.setFieldValue(
                                "message",
                                e.target.value
                              );
                              io?.emit("typing");
                            }}
                            disabled={disabled}
                            ref={inputRef}
                          />
                          <input type="hidden" name="send" />
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              ) : null}
            </>
          ))}
        </div>

        <Modal
          opened={attachmentModalOpened}
          onClose={() => setAttachmentModalOpened((o) => !o)}
          centered
          closeOnClickOutside={!loading}
          closeOnEscape={!loading}
          withCloseButton={!loading}
        >
          {attachments.map((a) => (
            <div
              className="flex flex-row items-center justify-between"
              key={a.name}
            >
              <div className="flex flex-row items-center">
                <IconFile />
                <span className="ml-2">{a.name}</span>
              </div>
              <IconX
                className="cursor-pointer"
                onClick={() => {
                  setAttachments((o) => o.filter((b) => b !== a));
                }}
              />
            </div>
          ))}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (attachments.length === 0)
                return showNotification({
                  message: "Please select at least one attachment",
                  color: "red",
                });
              setLoading(true);
              const token = readCookie("token")!;
              const data = await uploadFiles(attachments, token).catch((e) => {
                showNotification({
                  message: e?.response?.data?.message || "Something went wrong",
                  color: "red",
                });
                return null;
              });
              if (data === null) return setLoading(false);
              const urls = data.data.paths;
              formState.setFieldValue(
                "message",
                `${formState.values.message}\n${urls
                  .map((u) => `![image.png]${assetURLBuilder(u)}`)
                  .join("\n")}`
              );
              setLoading(false);
              setAttachmentModalOpened(false);
            }}
          >
            <FileInput
              label="Upload Attachment"
              withAsterisk
              multiple
              value={attachments}
              placeholder="Select Attachments"
              onChange={setAttachments}
            />
            <Group position="center" mt="md">
              <Button
                type="submit"
                variant="outline"
                color="gray"
                loading={loading}
              >
                Upload
              </Button>
            </Group>
          </form>
        </Modal>
        <Modal
          opened={doneModalOpened}
          onClose={() => setDoneModalOpened(false)}
          centered
          closeOnClickOutside
          closeOnEscape
          withCloseButton
        >
          <div className="flex flex-col items-center justify-center w-full p-4 space-y-4">
            <IconCheck className="w-16 h-16 text-green-500" />
            <h1 className="text-xl font-semibold text-center">
              Are you sure you want to mark this job as done?
            </h1>
            <p className="text-gray-500 text-center">
              Marking this job as done will require consent of both parties.
              This chat will be closed.
            </p>
            <Group position="center">
              <Button
                variant="outline"
                color="gray"
                onClick={() => setDoneModalOpened(false)}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                className="bg-green-500 hover:bg-green-600"
                onClick={() => {
                  io?.emit("prompt");
                }}
              >
                Mark as Done
              </Button>
            </Group>
          </div>
        </Modal>
        <ReviewModal
          modalOpen={reviewModalOpened}
          setModalOpen={setReviewModalOpened}
          freelancerUsername={prop.freelancerUsername}
        />
      </div>
      {userType !== "Client" && !prop.completed ? null : (
        <Modal
          centered
          opened={uploadWorkModal}
          onClose={() => setUploadWorkModal(false)}
          title="Upload Work"
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (attachments.length === 0)
                return showNotification({
                  message: "Please select at least one attachment",
                  color: "red",
                });
              setLoading(true);
              const token = readCookie("token")!;
              const data = await uploadFiles(attachments, token).catch((e) => {
                showNotification({
                  message: e?.response?.data?.message || "Something went wrong",
                  color: "red",
                });
                return null;
              });
              if (data === null) return setLoading(false);
              const urls = data.data.paths;
              io?.emit("message", {
                message: urls,
                attachment: true,
              });
              io?.emit("message", {
                message: "Here is my work",
                attachment: false,
              });
              setLoading(false);
              setUploadWorkModal(false);
              setAttachments([]);
            }}
          >
            <FileInput
              multiple
              label="Select Files(Max 10MB)"
              onChange={(e) => {
                const validFiles = e.filter((file) => file.size < 10000000);
                if (validFiles.length < e.length) {
                  showNotification({
                    title: "Error",
                    message: "Some files are too large",
                    color: "red",
                  });
                }
                setAttachments(validFiles);
              }}
            />
            <Group mt="md" position="center">
              <Button type="submit" variant="outline" loading={loading}>
                Upload
              </Button>
            </Group>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ChatContainer;
