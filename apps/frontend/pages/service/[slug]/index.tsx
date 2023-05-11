import { Container } from "@components/container";
import { outfit } from "@fonts";
import { useUser } from "@hooks/user";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Image,
  Table,
  Text,
  Tooltip,
  TypographyStylesProvider,
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
  IconPoint,
  IconPointFilled,
  IconX,
} from "@tabler/icons-react";
import { sanitize } from "@components/tabs/profile/services";
import { upperFirst } from "@mantine/hooks";
import useIssueNewAuthToken from "@hooks/jwt";

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
        "mt-20 mb-10 flex flex-col lg:flex-row lg:flex-wrap p-4",
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
      <div>
        <div className="flex items-center justify-center">
          <Image
            src={assetURLBuilder(props.bannerImage)}
            alt="Banner Image"
            className="mb-4 w-full max-w-[400px] aspect-square"
            classNames={{
              image:
                "min-w-[140px] min-h-[140px] max-w-full min-h-full rounded-md object-contain w-full max-w-[400px]",
            }}
          />
        </div>
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
        <div className="flex flex-row flex-wrap items-center mt-2 justify-center">
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
          <div className="flex flex-col items-center justify-center w-full">
            <Divider orientation="horizontal" className={clsx("w-full my-4")} />
            <Badge key={props.category.id}>
              <Link href={`/category/${props.category.slug}`}>
                {props.category.name}
              </Link>
            </Badge>
            {props.tags?.length > 0 ? (
              <div className="flex flex-row gap-2 items-center justify-center flex-wrap my-4">
                {props.tags?.map((t) => (
                  <Badge variant="light" key={t.id} color="green">
                    <a href={`/services/tags/${t.slug}`}>#{t.name}</a>
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
          <Divider orientation="horizontal" className={clsx("w-full my-4")} />
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

          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={sanitize(props.description, undefined)}
            />
          </TypographyStylesProvider>
        </div>
        <Divider
          orientation="horizontal"
          className={clsx("w-full my-4 lg:hidden")}
        />
      </div>
      <div>
        <Text
          className={clsx("font-bold text-2xl text-center mb-4", {
            [outfit.className]: true,
          })}
          id="packages-offered"
        >
          Packages Offered
        </Text>

        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Package</th>
              {props.package.map((p) => (
                <th key={p.id}>{upperFirst(p.name)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Description</td>
              {props.package.map((p) => (
                <td key={p.id}>{p.description || "Not Provided"}</td>
              ))}
            </tr>
            <tr>
              <td>Delivery</td>
              {props.package.map((p) => (
                <td key={p.id}>
                  {p.deliveryDays} {p.deliveryDays > 1 ? "Days" : "Day"}
                </td>
              ))}
            </tr>
            <tr>
              <td>Features</td>
              {props.package.map((p) => (
                <td key={p.id}>
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
                </td>
              ))}
            </tr>
            <tr>
              <td>Price</td>
              {props.package.map((p) => (
                <td key={p.id}>
                  <span className="font-semibold text-[18px]">${p.price}</span>
                </td>
              ))}
            </tr>
            {props.user.username != username ? (
              <tr>
                <td>Actions</td>
                {props.package.map((p) => (
                  <td key={p.id}>
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      disabled={username === props.user.username}
                      component={Link}
                      href={{
                        pathname: "/service/[slug]/purchase",
                        query: {
                          slug: props.slug,
                          packageId: p.id,
                        },
                      }}
                      color="black"
                      className={clsx(
                        "rounded-md text-white transition-all duration-[110ms] hover:scale-105",
                        {
                          [outfit.className]: true,
                          "bg-gray-900 hover:bg-black ":
                            colorScheme === "light",
                          "bg-purple-900 hover:bg-purple-800":
                            colorScheme === "dark",
                          "cursor-not-allowed":
                            username === props.user.username,
                        }
                      )}
                    >
                      Select
                    </Button>
                  </td>
                ))}
              </tr>
            ) : null}
          </tbody>
        </Table>
        {/* {userType === "Client" ? (
        <Script
          src={"https://checkout.razorpay.com/v1/checkout.js"}
          strategy="lazyOnload"
        />
      ) : null} */}
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
