import { MetaTags } from "@components/meta";
import LinkedAccounts from "@components/profiles";
import ServicesTab from "@components/tabs/profile/services";
import JobPosts from "@components/tabs/profile/job-posts";
import { outfit, sen } from "@fonts";
import { readCookie } from "@helpers/cookie";
import useHydrateUserContext from "@hooks/hydrate/user";
import {
  Avatar,
  Divider,
  Paper,
  Rating,
  Tabs,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconCake,
  IconMapPin,
  IconPencil,
} from "@tabler/icons";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import axios from "axios";
import clsx from "clsx";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Reviews from "@components/tabs/profile/reviews";
import dayjs from "dayjs";
import { r } from "@helpers/date";

type Client = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  country: string;
  aboutMe: string | null;
  githubId: string | null;
  linkedinUsername: string | null;
  twitterUsername: string | null;
  facebookUsername: string | null;
  instagramUsername: string | null;
  kycDocuments: string[];
  kycCompleted: boolean;
  phoneNumber: string | null;
  profileCompleted: boolean;
  avatarUrl: string | null;
  bio: string | null;
  paypalEmail: string | null;
  upiId: string | null;
  createdAt: Date;
  updatedAt: Date;
  verified: boolean;
  emailVerified: boolean;
};

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
      className={clsx({
        [outfit.className]: true,
      })}
    >
      <MetaTags
        title={`${props.name} | @${props.username} |  | Lend My Skill`}
        description={props.bio || `${props.name} on Lend My Skill`}
      />
      <div className="flex flex-row items-center justify-evenly flex-wrap">
        <div className="w-full h-40 bg-[#e0f3ff]"></div>
        <Paper
          withBorder
          p="xl"
          radius={"md"}
          style={{
            flex: 0.3,
          }}
          className="lg:min-w-[50%] mt-[-50px]"
        >
          <div className="flex flex-col items-center justify-center">
            <Avatar
              src={
                props.avatarUrl
                  ? assetURLBuilder(props.avatarUrl)
                  : profileImageRouteGenerator(props.username)
              }
              className="rounded-full w-32 h-32 mt-[-90px]"
              draggable={false}
            />
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-row mt-8">
                <h1
                  className={clsx(
                    "text-3xl font-bold text-white",
                    outfit.className
                  )}
                >
                  {props.name}
                </h1>
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
                className={clsx(
                  "text-[13px] leading-[18px] mt-1 hover:underline text-gray-400"
                )}
              >
                @{props.username}
              </span>
              {props.rating ? (
                <>
                  <div className="flex flex-row">
                    <Rating readOnly value={props.rating} fractions={2} />
                    <span className="ml-2 text-[13px]">
                      {props.rating} ({props.reviews})
                    </span>
                  </div>
                </>
              ) : null}
              <p className="text-center mt-4 font-medium text-base">
                {props.bio}
              </p>
            </div>

            <div className="flex flex-row items-center justify-evenly w-[90%] mt-4">
              <div className="flex flex-row text-base items-center">
                <IconMapPin className="w-5 h-5 mr-2" />
                {props.country}
              </div>
              <div className="flex flex-row text-base items-center">
                <IconCake className="w-5 h-5 mr-2" /> Joined on{" "}
                {dayjs(props.createdAt).format("MMM DD, YYYY")}
              </div>
            </div>

            {editable ? (
              <div className="flex flex-row items-center justify-center mt-3">
                <Link href="/settings">
                  <IconPencil className="h-6 w-6 text-blue-500" />
                </Link>
              </div>
            ) : null}
          </div>
        </Paper>
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
    rating?: number;
    reviews?: number;
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
