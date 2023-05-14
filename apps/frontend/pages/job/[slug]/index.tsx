import { Container } from "@components/container";
import Quotations from "@components/jobpost/quotations";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import useHydrateUserContext from "@hooks/hydrate/user";
import { useUser } from "@hooks/user";
import {
  Avatar,
  Badge,
  Divider,
  Image,
  SimpleGrid,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconCheck, IconPoint, IconPointFilled } from "@tabler/icons-react";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import clsx from "clsx";
import Carousel from "framer-motion-carousel";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { JobPost } from "~/types/jobpost";

const Slug: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  useHydrateUserContext();
  const { query } = useRouter();
  const { username } = useUser();
  return (
    <Container
      className={clsx("", {
        [outfit.className]: true,
      })}
      mb="xl"
    >
      <MetaTags
        title={`${props.title} | ${props.user.name} | Lend My Skill`}
        description={props.description || `${props.user.name} on Lend My Skill`}
      />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">{props.title}</h1>
        {props.budget ? (
          <Tooltip label={`The Budget of this Job Post is $ ${props.budget}`}>
            <Badge variant="light" className="mt-2">
              {" "}
              $ {props.budget}
            </Badge>
          </Tooltip>
        ) : null}
        {props.user.profileCompleted ? null : (
          <div className="mt-2">
            <span className="text-red-500">
              {username === props.user.username
                ? "Please complete your profile for this post to appear in search results.(only you can see this)"
                : null}
            </span>
          </div>
        )}
        {/* {props.claimed ? (
          <div className="mt-2">
            <Tooltip label={`This Post is claimed by ${props.claimedBy.name}`}>
              <Badge color="green">Claimed</Badge>
            </Tooltip>
          </div>
        ) : null} */}
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
                href={`/profile/${props.user.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline  leading-3"
              >
                @{props.user.username}
              </a>
            </Text>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <Divider orientation="horizontal" className={clsx("w-full my-4")} />
          <Badge key={props.category.id}>
            <Link href={`/c/${props.category.slug}`}>
              {props.category.name}
            </Link>
          </Badge>
          <div className="flex flex-row gap-2  items-center justify-center flex-wrap mt-4">
            {props.tags.map((t, index) => (
              <Badge variant="light" key={index} color="green">
                <a href={`/t/${t.slug}`}>#{t.name}</a>
              </Badge>
            ))}
          </div>
        </div>
        <Divider orientation="horizontal" className={clsx("w-full my-4")} />
        <p className="text-xl">{props.description}</p>

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
        {"quotations" in props ? (
          <>
            <Divider orientation="horizontal" className={clsx("w-full my-4")} />
            <h3 className="text-center text-xl font-bold">Quotations</h3>
            <Quotations
              slug={query.slug as string}
              username={query.username as string}
            />
          </>
        ) : null}
      </div>
    </Container>
  );
};

export default Slug;

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(URLBuilder("/static/job-posts"));
  if (!res.ok) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
  return {
    paths: (await res.json()).map(
      (p: { slug: string; user: { username: string } }) => ({
        params: {
          username: p.user.username,
          slug: p.slug,
        },
      })
    ),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<JobPost> = async ({ params }) => {
  const username = params!.username;
  const slug = params!.slug;
  const data = await fetch(URLBuilder(`/job-post/${slug}`));
  if (!data.ok) {
    return {
      notFound: true,
    };
  }
  const jobPost = await data.json();
  return {
    props: jobPost,
  };
};
