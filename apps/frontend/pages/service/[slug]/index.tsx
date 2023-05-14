import { outfit } from "@fonts";
import { useUser } from "@hooks/user";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Image,
  Rating,
  Table,
  Tabs,
  Text,
  Tooltip,
  useMantineColorScheme,
} from "@mantine/core";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import clsx from "clsx";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { Service } from "~/types/service";
import Carousel from "framer-motion-carousel";
import useHydrateUserContext from "@hooks/hydrate/user";
import { MetaTags } from "@components/meta";
import {
  IconCheck,
  IconClockCheck,
  IconPoint,
  IconPointFilled,
  IconX,
} from "@tabler/icons-react";
import { sanitize } from "@components/tabs/profile/services";
import { upperFirst } from "@mantine/hooks";
import useIssueNewAuthToken from "@hooks/jwt";
import Editor from "@components/editor";

const Service: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { username } = useUser();
  useHydrateUserContext();
  useIssueNewAuthToken();
  const { colorScheme } = useMantineColorScheme();

  return (
    <div
      className={clsx(
        "mt-20 mb-10 flex flex-col lg:flex-row lg:flex-wrap p-4 justify-around",
        {
          [outfit.className]: true,
        }
      )}
    >
      <MetaTags
        title={`@${props.user.username} | ${props.user.name} | Lend My Skill`}
        description={props.description || `${props.user.name} on Lend My Skill`}
        ogImage={assetURLBuilder(props.bannerImage)}
      />
      <div className="flex-[0.5]">
        <h1 className="text-2xl font-bold text-center">{props.title}</h1>
        {props.user.profileCompleted ? null : (
          <div className="mt-2  text-center">
            <span className="text-red-500">
              {username === props.user.username
                ? "Please complete your profile for this post to appear in search results.(only you can see this)"
                : null}
            </span>
          </div>
        )}
        <div className="flex flex-col items-center mt-2 justify-center">
          <div className="flex flex-row flex-wrap">
            <Avatar
              src={
                props.user.avatarUrl
                  ? assetURLBuilder(props.user.avatarUrl)
                  : profileImageRouteGenerator(props.user.username)
              }
              size="md"
              radius="xl"
            />
            <div className="flex flex-col ml-2">
              <h2 className="text-base font-semibold">
                {props.user.name}
                {props.user.verified ? (
                  <Tooltip label="Verified User" withArrow>
                    <Badge
                      color="green"
                      variant="light"
                      className="rounded-full ml-2"
                    >
                      <div className="flex flex-row flex-nowrap items-center justify-center">
                        <IconCheck />
                      </div>
                    </Badge>
                  </Tooltip>
                ) : null}
              </h2>
              <Text
                color={"dimmed"}
                className={clsx("leading-3", {
                  [outfit.className]: true,
                })}
              >
                <a
                  href={`/profile/${props.user.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm hover:underline"
                >
                  @{props.user.username}
                </a>
              </Text>
            </div>
            <div className="flex flex-row items-center ml-2">
              <Rating
                fractions={3}
                defaultValue={Number(Number(props.totalRating).toFixed(2))}
              />
              <Text>
                {props.totalRating} ({props.totalReviews})
              </Text>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-fit p-4">
            <Divider orientation="horizontal" className={clsx("w-full my-4")} />
            <Badge key={props.category.id}>
              <Link href={`/category/${props.category.slug}`}>
                {props.category.name}
              </Link>
            </Badge>
            {props.tags?.length > 0 ? (
              <>
                <div className="flex flex-row gap-2 items-center justify-center flex-wrap my-4">
                  {props.tags?.map((t) => (
                    <Badge variant="light" key={t.id} color="green">
                      <a href={`/services/tags/${t.slug}`}>#{t.name}</a>
                    </Badge>
                  ))}
                </div>
                <Divider
                  orientation="horizontal"
                  className={clsx("w-full my-4")}
                />
              </>
            ) : null}
          </div>
          {props.images.length > 0 ? (
            <div className="container max-w-[400px] h-fit">
              <Carousel
                autoPlay={false}
                interval={5000}
                loop
                renderDots={({ activeIndex, setActiveIndex }) => (
                  <div className="flex flex-row gap-2 items-center justify-center flex-wrap my-4 absolute bottom-[-15px] right-0 left-0">
                    {props.images.map((i, index) => (
                      <button
                        key={index}
                        className="cursor-pointer"
                        onClick={() => setActiveIndex(index)}
                      >
                        {index === activeIndex ? (
                          <IconPointFilled size={20} color="blue" />
                        ) : (
                          <IconPoint size={20} color="gray" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              >
                {props.images.map((i) => (
                  <div
                    key={assetURLBuilder(i)}
                    className="max-w-[400px] aspect-square  "
                  >
                    {i.endsWith(".mp4") ? (
                      <video
                        src={assetURLBuilder(i)}
                        className="cursor-pointer my-6"
                        controls
                        onClick={() => {
                          window.open(assetURLBuilder(i));
                        }}
                      />
                    ) : (
                      <Image
                        src={assetURLBuilder(i)}
                        alt="Image"
                        className="cursor-pointer  max-w-[400px] aspect-square"
                        classNames={{
                          image: "rounded-md max-w-[400px] aspect-square",
                        }}
                        onClick={() => {
                          window.open(assetURLBuilder(i));
                        }}
                      />
                    )}
                  </div>
                ))}
              </Carousel>
            </div>
          ) : null}
          <Divider orientation="horizontal" className={clsx("w-full my-4")} />
          <div className="w-full">
            <Text
              className={clsx("font-bold text-2xl text-center mb-4", {
                [outfit.className]: true,
              })}
            >
              About the service
            </Text>
            <Editor
              onSubmit={() => {}}
              setActive={() => {}}
              read
              content={props.description}
              editorStyles={{
                border: "none",
              }}
            />
          </div>
        </div>
        <Divider
          orientation="horizontal"
          className={clsx("w-full my-4 lg:hidden")}
        />
      </div>
      <div className="flex-[0.25] ml-6">
        <Tabs
          unstyled
          styles={(theme) => ({
            tab: {
              ...theme.fn.focusStyles(),
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.white,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.colors.gray[9],
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[4]
              }`,
              padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
              cursor: "pointer",
              fontSize: theme.fontSizes.sm,
              display: "flex",
              alignItems: "center",

              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
              },
              "&:first-of-type": {
                borderLeft: 0,
              },
              "&:last-of-type": {
                borderRight: 0,
              },
              "&[data-active]": {
                backgroundColor: theme.colors.blue[7],
                borderColor: theme.colors.blue[7],
                color: theme.white,
              },
            },

            tabIcon: {
              marginRight: theme.spacing.xs,
              display: "flex",
              alignItems: "center",
            },

            tabsList: {
              display: "flex",
            },
          })}
          className="lg:sticky lg:top-20 border-t-0 rounded-md border-[1px] border-[#25262b]"
        >
          <Tabs.List>
            {props.package.map((p) => (
              <Tabs.Tab key={p.id} value={p.id} className="w-full p-4">
                {upperFirst(p.name)}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {props.package.map((p) => (
            <Tabs.Panel key={p.id} value={p.id} p="xs">
              <div className="flex flex-col justify-center">
                <div className="flex flex-row flex-nowrap justify-between mb-8">
                  <h1 className="text-xl font-bold">{upperFirst(p.name)}</h1>
                  <h1 className="text-xl font-bold">${p.price}</h1>
                </div>
                <p className="mb-8">{p.description}</p>
                <div className="flex flex-row justify-between mb-8">
                  <div className="flex flex-row gap-2 items-center">
                    <IconClockCheck size={20} />
                    <Text>
                      {p.deliveryDays} {p.deliveryDays === 1 ? "day" : "days"}
                    </Text>
                  </div>
                </div>
                {p.features.map((f) => (
                  <div key={f.id}>
                    {f.includedIn.includes(p.name) ? (
                      <div className="flex flex-row items-center gap-2">
                        <IconCheck size={13} color="green" />
                        <span>{f.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        <IconX size={13} color="red" />
                        <span>{f.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Service;

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await (await fetch(URLBuilder("/static/services"))).json();
  return {
    fallback: "blocking",
    paths: data.map((g: any) => ({
      params: {
        username: g.user.username,
        slug: g.slug,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<Service> = async ({ params }) => {
  const slug = params!.slug;

  const data = await fetch(URLBuilder(`/services/${slug}`));
  if (!data.ok) {
    return {
      notFound: true,
    };
  }
  const service = await data.json();
  return {
    props: service,
  };
};
