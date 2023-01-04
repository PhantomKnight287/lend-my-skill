import { outfit } from "@fonts";
import { useUser } from "@hooks/user";
import { Avatar, Badge, Text, Tooltip } from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder } from "@utils/url";
import clsx from "clsx";
import { memo } from "react";

interface User {
  username: string;
  id: string;
  name: string;
  avatarUrl: string;
  verified: boolean;
}

interface ChatSidebarProps {
  freelancer: User;
  client: User;
}

export function ChatSidebar({ client, freelancer }: ChatSidebarProps) {
  const { userType } = useUser();
  return (
    <div
      className={clsx("flex", {
        "flex-col": userType === "client",
        "flex-col-reverse": userType === "freelancer",
      })}
    >
      <div className="flex flex-row items-center hover:scale-110 transition-all duration-[110ms] border-[1px] p-1 rounded-md mb-2 ">
        <Avatar
          src={
            freelancer.avatarUrl
              ? assetURLBuilder(freelancer.avatarUrl)
              : profileImageRouteGenerator(freelancer.username)
          }
          size="md"
          radius="xl"
        />
        <div className="flex flex-col ml-2">
          <h2 className="text-base font-semibold overflow-x-hidden">
            {freelancer.name}
            {freelancer.verified ? (
              <Tooltip label="Verified User" withArrow>
                <Badge
                  color="green"
                  variant="light"
                  className="rounded-full ml-2"
                >
                  <div className="flex flex-row flex-nowrap items-center justify-center">
                    <IconCheck color="green" size={15} />
                  </div>
                </Badge>
              </Tooltip>
            ) : null}
          </h2>
          <Text
            color={"dimmed"}
            className={clsx({
              [outfit.className]: true,
            })}
            lineClamp={1}
          >
            <a
              href={`/profile/${freelancer.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              @{freelancer.username}
            </a>
          </Text>
        </div>
      </div>
      <div className="flex flex-row items-center hover:scale-110 transition-all duration-[110ms] border-[1px] p-1 rounded-md mb-2">
        <Avatar
          src={
            client.avatarUrl
              ? assetURLBuilder(client.avatarUrl)
              : profileImageRouteGenerator(client.username)
          }
          size="md"
          radius="xl"
        />
        <div className="flex flex-col ml-2">
          <h2 className="text-base font-semibold">
            {client.name}
            {client.verified ? (
              <Tooltip label="Verified User" withArrow>
                <Badge
                  color="green"
                  variant="light"
                  className="rounded-full ml-2"
                >
                  <div className="flex flex-row flex-nowrap items-center justify-center">
                    <IconCheck color="green" size={15} />
                  </div>
                </Badge>
              </Tooltip>
            ) : null}
          </h2>
          <Text
            color={"dimmed"}
            className={clsx({
              [outfit.className]: true,
            })}
          >
            <a
              href={`/profile/${client.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              @{client.username}
            </a>
          </Text>
        </div>
      </div>
    </div>
  );
}
