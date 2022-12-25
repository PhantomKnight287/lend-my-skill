import { MetaTags } from "@components/meta";
import LinkedAccounts from "@components/profiles";
import JobPosts from "@components/tabs/profile/job-posts";
import { outfit } from "@fonts";
import { readCookie } from "@helpers/cookie";
import useHydrateUserContext from "@hooks/hydrate/user";
import { Divider, Paper, Tabs, useMantineColorScheme } from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconMapPin,
  IconPencil,
} from "@tabler/icons";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import axios from "axios";
import clsx from "clsx";
import { Client } from "db";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { colorScheme } = useMantineColorScheme();
  const [editable, setEditable] = useState(false);
  useHydrateUserContext();
  useEffect(() => {
    const token = readCookie("token");
    if (!token) return;
    axios
      .get(URLBuilder(`/editable/profile/${props.username}`), {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((d) => d.data)
      .then((d) => {
        setEditable(d.editable);
      })
      .catch((err) => {
        null;
      });
  }, []);
  const { query, push } = useRouter();
  return (
    <div
      className={clsx("mt-20", {
        [outfit.className]: true,
      })}
    >
      <MetaTags
        title={`${props.username} | ${props.name} | Lend My Skill`}
        description={props.bio || `${props.name} on Lend My Skill`}
      />
      <div className="flex flex-row items-center justify-evenly flex-wrap">
        <Paper
          withBorder
          p="xl"
          radius={"md"}
          style={{
            flex: 0.3,
          }}
          className="lg:min-w-[400px]"
        >
          <div className="flex flex-col items-center justify-center">
            <img
              src={
                props.avatarUrl
                  ? assetURLBuilder(props.avatarUrl)
                  : profileImageRouteGenerator(props.username)
              }
              className="rounded-full w-32 h-32"
              draggable={false}
            />
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-row">
                <h1 className={clsx("text-xl font-bold")}>{props.name}</h1>
                {props.verified ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : null}
              </div>
              <span
                className={clsx("text-[13px] leading-[18px] hover:underline", {
                  "text-gray-500": colorScheme === "dark",
                  "text-[#666666]": colorScheme === "light",
                })}
              >
                @{props.username}
              </span>
              <Divider
                orientation="horizontal"
                className={clsx("w-full mt-3 mb-1 ")}
              />
              <p className="text-center">{props.bio}</p>
            </div>
            <Divider
              orientation="horizontal"
              className={clsx("w-full mt-3 mb-1")}
            />
            <div className="flex flex-col w-full text-[14px]">
              <ul>
                <li className="flex flex-row items-center">
                  <span className="mr-2">
                    <IconMapPin width={14} height={16} />
                  </span>
                  From
                  <span className="ml-auto">
                    {props.country ? props.country : "Unknown"}
                  </span>
                </li>
                <li className="flex flex-row items-center mt-2">
                  <span className="mr-2">
                    <svg
                      width={14}
                      height={16}
                      viewBox="0 0 14 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M7 8C9.20938 8 11 6.20937 11 4C11 1.79063 9.20938 0 7 0C4.79063 0 3 1.79063 3 4C3 6.20937 4.79063 8 7 8ZM9.8 9H9.27812C8.58437 9.31875 7.8125 9.5 7 9.5C6.1875 9.5 5.41875 9.31875 4.72188 9H4.2C1.88125 9 0 10.8813 0 13.2V14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V13.2C14 10.8813 12.1187 9 9.8 9Z" />
                    </svg>
                  </span>
                  Joined
                  <span className="ml-auto">
                    {new Date(props.createdAt).toLocaleDateString()}
                  </span>
                </li>
              </ul>
            </div>
            <Divider
              orientation="horizontal"
              className={clsx("w-full mt-3 mb-1")}
            />
            <div className="flex flex-col w-full text-[16px] text-center">
              {props.aboutMe}
            </div>
            <Divider
              orientation="horizontal"
              className={clsx("w-full mt-3 mb-1")}
            />
            {props.githubId ||
            props.twitterUsername ||
            props.facebookUsername ||
            props.linkedinUsername ||
            props.linkedinUsername ? (
              <div className="flex flex-col w-full">
                <h2 className="text-center text-base font-bold">
                  Linked Accounts
                </h2>
                <LinkedAccounts
                  githubUsername={props.githubId}
                  twitterUsername={props.twitterUsername}
                  facebookUsername={props.facebookUsername}
                  linkedinUsername={props.linkedinUsername}
                  instagramUsername={props.instagramUsername}
                />
              </div>
            ) : null}
            {editable ? (
              <div className="flex flex-row items-center justify-center mt-3">
                <Link href="/settings">
                  <IconPencil className="h-6 w-6 text-blue-500" />
                </Link>
              </div>
            ) : null}
          </div>
        </Paper>
        <div className="m-4">
          <Tabs
            className={clsx("w-full")}
            defaultValue={(query.tab as string) || "job-posts"}
            onTabChange={(d) => {
              if (d) {
                push(`/profile/${props.username}?tab=${d}`);
              }
            }}
          >
            <Tabs.List>
              {props.type === "client" ? (
                <Tabs.Tab value="job-posts">Job Posts</Tabs.Tab>
              ) : props.type === "freelancer" ? (
                <Tabs.Tab value="gigs">Gigs</Tabs.Tab>
              ) : null}
            </Tabs.List>
            {props.type === "client" ? (
              <Tabs.Panel value="job-posts">
                <JobPosts username={props.username} />
              </Tabs.Panel>
            ) : null}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await (await fetch(URLBuilder("/static/profiles"))).json();
  return {
    fallback: "blocking",
    paths: paths.map((p: { username: string }) => ({
      params: {
        username: p.username,
      },
    })),
  };
};
export const getStaticProps: GetStaticProps<
  Pick<
    Client,
    | "avatarUrl"
    | "bio"
    | "country"
    | "createdAt"
    | "id"
    | "name"
    | "username"
    | "verified"
    | "profileCompleted"
    | "aboutMe"
    | "facebookUsername"
    | "twitterUsername"
    | "instagramUsername"
    | "githubId"
    | "linkedinUsername"
  > & {
    type: "client" | "freelancer";
  }
> = async ({ params }) => {
  const username = params!.username;
  const profile = await (
    await fetch(URLBuilder(`/profile/${username}`))
  ).json();
  return {
    props: {
      ...profile,
    },
  };
};

export default ProfilePage;
