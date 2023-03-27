import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import useHydrateUserContext from "@hooks/hydrate/user";
import {
  Badge,
  Button,
  Loader,
  Paper,
  Tabs,
  useMantineColorScheme,
} from "@mantine/core";
import { upperFirst, useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import clsx from "clsx";
import dayjs from "dayjs";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { JobPosts } from "~/types/jobpost";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
dayjs.extend(relativeTime);

const ContentRelatedToCategory: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = (props) => {
  const { colorScheme } = useMantineColorScheme();
  useHydrateUserContext();
  const {
    data,
    status,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<JobPosts>({
    queryKey: ["category", props.id, props.name],
    queryFn: async ({ pageParam = 10 }) => {
      const data = await fetch(
        URLBuilder(`/categories/${props.id}/job-posts?take=${pageParam}`)
      );
      if (!data.ok) {
        throw new Error("Error fetching data");
      }
      return await data.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });
  const { query, push } = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
    root: containerRef.current,
    threshold: 0.5,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting]);

  return (
    <Container>
      <MetaTags
        title={`${upperFirst(props.name)} | Category | Lend My Skill`}
        description={`Find ${props.name} related jobs and services on Lend My Skill. `}
      />
      <h1
        className={clsx("text-4xl text-center font-bold mb-8", {
          [outfit.className]: true,
        })}
      >
        {upperFirst(props.name)}
      </h1>
      <div className="flex flex-row flex-wrap items-center justify-center gap-3">
        <Badge
          variant="light"
          color="green"
          className="cursor-pointer"
          onClick={() => {
            push(`/category/${query.slug}?tab=services`);
          }}
        >
          {props.services} {props.services > 1 ? "Services" : "Service"}
        </Badge>
        <Badge
          variant="light"
          color="green"
          className="cursor-pointer"
          onClick={() => {
            push(`/category/${query.slug}?tab=job-posts`);
          }}
        >
          {props.jobs} Job {props.jobs > 1 ? "Posts" : "Post"}
        </Badge>
      </div>
      <Tabs
        defaultValue={(query.tab as string) || "job-posts"}
        onTabChange={(d) => {
          if (d) push(`/category/${query.slug}?tab=${d}`);
        }}
      >
        <Tabs.List grow>
          <Tabs.Tab value="job-posts">Job Posts</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="job-posts">
          {status === "loading" ? (
            <Loader />
          ) : status === "error" ? (
            <div>Error</div>
          ) : (
            <>
              {data?.pages.map((p, index) => (
                <Fragment key={index}>
                  {p.posts.map((post) => (
                    <div key={post.id} className="flex flex-col">
                      <Paper
                        withBorder
                        radius="md"
                        p="md"
                        my="sm"
                        className={clsx("cursor-pointer")}
                        component={Link}
                        href={`/post/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex flex-row ">
                          <div className="flex flex-row items-center">
                            <img
                              src={
                                post.author.avatarUrl
                                  ? assetURLBuilder(post.author.avatarUrl)
                                  : profileImageRouteGenerator(
                                      post.author.username
                                    )
                              }
                              className="w-10 h-10 rounded-full"
                            />
                            <div className="flex flex-col ml-2">
                              <span className="font-bold">
                                {post.author.name}
                              </span>
                              <span className="text-gray-500 text-sm">
                                @{post.author.username}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-row items-center ml-auto">
                            <span
                              className={clsx("text-gray-500 text-sm ml-4")}
                            >
                              {dayjs(post.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                        <p className="ml-12 text-lg font-semibold">
                          {post.title}
                        </p>
                        <div className="flex flex-row mt-2  gap-2">
                          {post.tags.map((t, index) => (
                            <Badge key={index} color="green" variant="light">
                              #{t}
                            </Badge>
                          ))}
                        </div>
                      </Paper>
                    </div>
                  ))}
                </Fragment>
              ))}
              <div className="" ref={containerRef}>
                <div ref={ref}>{isFetchingNextPage && <Loader />}</div>
              </div>
              {hasNextPage ? (
                <Button
                  color="black"
                  className={clsx("", {
                    [outfit.className]: true,
                    "bg-gray-900 hover:bg-black": colorScheme === "light",
                    "bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] text-white":
                      colorScheme === "dark",
                  })}
                  onClick={() => fetchNextPage()}
                >
                  Load More
                </Button>
              ) : null}
            </>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default ContentRelatedToCategory;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await (await fetch(URLBuilder("/static/categories"))).json();
  return {
    fallback: "blocking",
    paths: paths.map((p: { slug: string }) => ({
      params: {
        slug: p.slug,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<{
  id: string;
  name: string;
  services: number;
  jobs: number;
}> = async ({ params }) => {
  const data = await fetch(URLBuilder(`/categories/${params!.slug}`));
  if (!data.ok) {
    return {
      notFound: true,
    };
  }
  const category = await data.json();
  return {
    props: category,
  };
};
