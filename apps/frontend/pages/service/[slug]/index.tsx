/* eslint-disable react/no-children-prop */
import { outfit, satoshi } from "@fonts";
import { useUser } from "@hooks/user";
import {
  Avatar,
  Image,
  Rating,
  Tabs,
  Text,
  Container,
  Button,
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
import { Carousel } from "react-responsive-carousel";
import useHydrateUserContext from "@hooks/hydrate/user";
import { MetaTags } from "@components/meta";
import { IconCheck, IconClockCheck } from "@tabler/icons-react";
import { upperFirst } from "@mantine/hooks";
import { Renderer } from "@components/renderer";

const Service: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  service
) => {
  const { username, role } = useUser();
  useHydrateUserContext();
  return (
    <div
      className={clsx(
        "mt-3 mb-10 flex flex-col lg:flex-row lg:flex-wrap px-8 py-6 justify-around",
        {
          [outfit.className]: true,
        }
      )}
    >
      <MetaTags
        title={`@${service.user.username} | ${service.user.name} | Lend My Skill`}
        description={
          service.description || `${service.user.name} on Lend My Skill`
        }
        ogImage={assetURLBuilder(service.images[0])}
      />
      <Container className="lg:flex-[0.5]">
        <h1
          className={clsx(
            "text-2xl font-bold break-words hyphens-auto",
            satoshi.className
          )}
          lang="en"
        >
          {service.title}
        </h1>
        <div className="flex flex-row md:justify-start justify-center items-center mt-5 flex-wrap ">
          <div className="flex flex-row items-center">
            <Avatar
              src={
                service.user.avatarUrl
                  ? assetURLBuilder(service.user.avatarUrl)
                  : profileImageRouteGenerator(service.user.username)
              }
              size="md"
              radius="xl"
              className="mr-2"
            />
            <Link href={`/@${service.user.username}`}>
              <h2
                className={clsx(
                  "text-base font-bold",
                  satoshi.className,
                  "mr-2"
                )}
              >
                {service.user.name}
              </h2>
            </Link>
            <Link href={`/@${service.user.username}`}>
              <span
                className={clsx(
                  "text-sm font-bold text-gray-500 hidden md:inline",
                  satoshi.className
                )}
              >
                @{service.user.username}
              </span>
            </Link>
          </div>
          <div className="flex flex-row items-center ml-1">
            <Rating
              fractions={3}
              value={Number(service.totalRating) / Number(service.totalReviews)}
              readOnly
            />
            <span>
              {service.totalRating === null
                ? 0
                : Number(service.totalRating) /
                  Number(service.totalReviews)}{" "}
              ({service.totalReviews})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center mt-8">
          {service.images.length > 0 ? (
            <div className="container max-w-[400px] h-fit">
              <Carousel
                autoPlay={false}
                interval={5000}
                infiniteLoop
                showThumbs={false}
              >
                {service.images.map((i) => (
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
        </div>
        <article className="hidden lg:block">
          <p className="text-lg font-semibold my-4 ">About The Service</p>
          <Renderer children={service.description} />
        </article>
      </Container>
      <div
        className="mt-8 flex-1 lg:sticky top-10 lg:flex-[0.4] h-screen"
        id="packages-offered"
      >
        <Tabs
          defaultValue={service.package[0].id}
          unstyled
          styles={(theme) => ({
            tab: {
              ...theme.fn.focusStyles(),
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.white,
              color: "black",
              border: `1px solid ${
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[4]
              }`,
              padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
              cursor: "pointer",
              fontSize: theme.fontSizes.sm,
              display: "flex",
              alignItems: "center",
              fontFamily: satoshi.style.fontFamily,
              fontWeight: "bolder",
              width: "100%",
              "&:disabled": {
                opacity: 0.5,
                cursor: "not-allowed",
              },

              "&:not(:first-of-type)": {
                borderLeft: 0,
              },

              "&[data-active]": {
                borderBottom: "3px solid #fbff05",
              },
              "&:not([data-active])": {
                backgroundColor: "#e5e5e5",
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
        >
          <Tabs.List>
            {service.package.map((p) => (
              <Tabs.Tab key={p.id} value={p.id}>
                {upperFirst(p.name)}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          {service.package.map((p) => (
            <Tabs.Panel
              key={p.id}
              value={p.id}
              p="xs"
              className="border-[1px] border-gray-300 rounded-md border-t-0 rounded-t-none"
            >
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
                    ) : null}
                  </div>
                ))}
                {service.user.username != username && role == "Client" ? (
                  <Link
                    href={{
                      pathname: `/service/[slug]/purchase`,
                      query: {
                        slug: service.slug,
                        packageId: p.id,
                      },
                    }}
                    className="flex justify-center"
                  >
                    <Button
                      className="bg-accent text-black hover:bg-accent/90 mt-4 w-[90%]"
                      fullWidth
                    >
                      Purchase
                    </Button>
                  </Link>
                ) : null}
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </div>
      <article className="lg:hidden">
        <p className="text-lg font-semibold my-4 ">About The Service</p>
        <Renderer children={service.description} />
      </article>
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
