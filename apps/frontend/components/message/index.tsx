/* eslint-disable react/no-children-prop */
import { Badge, Button, Group, Image } from "@mantine/core";
import { ReactNode } from "react";
import styles from "./message.module.scss";
import { Renderer } from "@components/renderer";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder } from "@utils/url";
import clsx from "clsx";
import Link from "next/link";
import { r } from "@helpers/date";
import dayjs from "dayjs";
import { IconCheck } from "@tabler/icons-react";
import { useUser } from "@hooks/user";
type MessageType = "Text" | "Prompt";

interface Props {
  content: ReactNode;
  createdAt: string;
  id: string;
  type: MessageType;
  acceptHandler?: () => void;
  rejectHandler?: () => void;
  completed?: boolean;
  author: {
    username: string;
    avatarUrl: string;
    name: string;
    id: string;
  };
  sender: "System" | "Client" | "Freelancer";
  promptSender?: "Client" | "Freelancer";
}

export function Message(props: Props) {
  const {
    content,
    type,
    completed,
    acceptHandler,
    rejectHandler,
    createdAt,
    author,
    sender,
    promptSender,
  } = props;
  const { role } = useUser();
  if (type === "Text" && sender != "System")
    return (
      <div className={`${styles.messageContainerWrapper}`} data-key={props.id}>
        <div className={styles.container}>
          <div className={styles.userAvatar}>
            <Image
              src={
                author.avatarUrl
                  ? assetURLBuilder(author.avatarUrl)
                  : profileImageRouteGenerator(author.username)
              }
              alt={`${author.username}'s Profile`}
              width={50}
              height={50}
              className={styles.avatar}
            />
          </div>
          <div className={styles.wrapper}>
            <div className={styles.userInfoAndTimestamp}>
              <div className={clsx(styles.username, "inline")}>
                <Link
                  href={`/profile/${author.username}`}
                  className="font-semibold"
                >
                  {author.name}
                </Link>
              </div>
              <Badge className="w-fit px-1 ml-1 ">{sender}</Badge>
              <span className={styles.timestamp}>
                Today at {dayjs(createdAt).format("HH:mm")}
              </span>
            </div>
            <article className="ml-[0.75rem]">
              <Renderer children={content as string} />
            </article>
          </div>
        </div>
      </div>
    );
  return (
    <div className={`${styles.messageContainerWrapper}`} data-key={props.id}>
      <div className={styles.container}>
        <div className={styles.userAvatar}>
          <Image
            src={"/brand/lms-logo.png"}
            alt={`Lend My Skill Logo`}
            width={50}
            height={50}
            className={styles.avatar}
          />
        </div>
        <div className={styles.wrapper}>
          <div className={styles.userInfoAndTimestamp}>
            <div
              className={clsx(
                styles.username,
                "font-semibold flex flex-row items-center"
              )}
            >
              System{" "}
              <Badge className="w-fit px-1 ml-1 rounded-full">
                <IconCheck color="green" size={16} />
              </Badge>
            </div>
            <span className={styles.timestamp}>
              Today at {dayjs(createdAt).format("HH:mm")}
            </span>
          </div>
          <div className={clsx(styles.messageWrapper)}>
            <article className="ml-[0.75rem]">
              <Renderer children={content as string} />
            </article>
            <Group
              position="left"
              className={clsx("ml-2 mt-3", {
                hidden:
                  completed ||
                  type != "Prompt" ||
                  role?.toLowerCase() === promptSender?.toLowerCase(),
              })}
            >
              <Button
                variant="outline"
                radius={"md"}
                onClick={acceptHandler}
                disabled={completed}
              >
                <span className={styles.accept}>Yes</span>
              </Button>
              <Button
                variant="outline"
                radius={"md"}
                onClick={rejectHandler}
                disabled={completed}
              >
                <span className={styles.reject}>No</span>
              </Button>
            </Group>
          </div>
        </div>
      </div>
    </div>
  );
}
