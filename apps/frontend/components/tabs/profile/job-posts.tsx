import {
  Avatar,
  Badge,
  Button,
  Divider,
  Group,
  Image,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import clsx from "clsx";
import Link from "next/link";
import { outfit, sen } from "@fonts";
import { IconStar } from "@tabler/icons-react";

dayjs.extend(relativeTime);

interface Props {
  username: string;
}
const JobPosts = ({ username }: Props) => {
  const {
    data,
    error,
    hasNextPage,
    refetch,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<{
    posts: Array<{
      author: {
        name: string;
        verified: boolean;
        avatarUrl: string;
        username: string;
      };
      budget: number;
      category: {
        name: string;
        slug: string;
      };
      deadline: string;
      description: string;
      images: Array<any>;
      slug: string;
      title: string;
      tags: Array<{
        name: string;
        slug: string;
        id: string;
      }>;
      createdAt: string;
      id: string;
    }>;
    next?: number;
  }>({
    queryKey: ["job-posts", username],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(`/job-post/user/${username}?take=${pageParam}`)
      );
      return await res.json();
    },
    getNextPageParam: (lastPage, pages) => lastPage.next,
  });
  const { colorScheme } = useMantineColorScheme();
  return (
    <div className={clsx("container")}>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data?.pages.map((page, index) => (
        <SimpleGrid
          key={index}
          cols={3}
          verticalSpacing="lg"
          breakpoints={[
            { maxWidth: 980, cols: 3, spacing: "md" },
            { maxWidth: 755, cols: 2, spacing: "sm" },
            { maxWidth: 600, cols: 1, spacing: "sm" },
          ]}
        >
          {page.posts?.map((post) => (
            <Paper key={post.id} withBorder shadow={"md"} radius="md">
              <Group position="left" mt="md" pl="md">
                <div>
                  <Avatar
                    size="md"
                    src={
                      post.author.avatarUrl
                        ? assetURLBuilder(post.author.avatarUrl)
                        : profileImageRouteGenerator(post.author.username)
                    }
                    radius="xl"
                  />
                </div>
                <div className="flex flex-col">
                  <Text size="md" className={clsx(sen.className, "mb-0")}>
                    {post.author.name}
                  </Text>

                  <Text
                    size="xs"
                    className={clsx(sen.className, "mt-0 leading-3")}
                  >
                    @{post.author.username}{" "}
                  </Text>
                </div>
              </Group>
              <Group p="md">
                <Link href={`/post/${post.slug}`} className="hover:text-white">
                  {post.title}
                </Link>
              </Group>
              {post?.tags?.length > 0 ? (
                <>
                  <Divider />
                  <Group position="apart">
                    <div className="flex flex-col p-2 ">
                      <Text size="xs" className={clsx(sen.className)}>
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag.id}
                            className="mx-1 my-1 bg-yellow-400 capitalize "
                          >
                            <Link href={`/t/${tag.slug}`}>
                              <span className="text-black text-xs">
                                # {tag.name}{" "}
                              </span>
                            </Link>
                          </Badge>
                        ))}
                      </Text>
                    </div>
                  </Group>
                </>
              ) : null}
            </Paper>
          ))}
        </SimpleGrid>
      ))}
      <div>
        {isFetchingNextPage ? (
          "Loading more..."
        ) : hasNextPage ? (
          <Button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            fullWidth
            color="black"
            className={clsx("", {
              [outfit.className]: true,
              "bg-gray-900 hover:bg-black": colorScheme === "light",
              "bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] text-white":
                colorScheme === "dark",
            })}
          >
            Load More
          </Button>
        ) : null}
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      {data?.pages?.[0]?.posts?.length === 0 && (
        <div className="flex flex-col items-center justify-center w-[100%] container">
          <p className="text-center">
            <span className="font-bold">{username}</span> has not posted any
            post
            <p className="opacity-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum,
              perspiciatis velit. Magni, error reprehenderit quidem provident
              vitae deleniti placeat in!
            </p>
          </p>
        </div>
      )}
    </div>
  );
};

export default JobPosts;
