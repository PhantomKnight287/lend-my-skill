import { LoadingOverlay, Paper } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import { Fragment } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import clsx from "clsx";

dayjs.extend(relativeTime);

interface Props {
  username: string;
}
const JobPosts = ({ username }: Props) => {
  const { data, error, hasNextPage, refetch, fetchNextPage, isLoading } =
    useInfiniteQuery<{
      posts: {
        id: string;
        author: {
          id: string;
          username: string;
          name: string;
          country: string;
          avatarUrl: string;
        };
        createdAt: string;
        description: string;
        budget: number;
        title: string;
        tags: string[];
      }[];
      next?: number;
    }>({
      queryKey: ["job-posts", username],
      queryFn: async ({ pageParam = 10 }) => {
        const res = await fetch(
          URLBuilder(`/jobpost/${username}?take=${pageParam}`)
        );
        return await res.json();
      },
      getNextPageParam: (lastPage, pages) => lastPage.next,
    });
  console.log(data);
  return (
    <div className="container">
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.posts?.map((post) => (
            <div key={post.id} className="flex flex-col">
              <Paper
                withBorder
                radius="md"
                p="md"
                my="sm"
                className={clsx("cursor-pointer")}
              >
                <div className="flex flex-row ">
                  <div className="flex flex-row items-center">
                    <img
                      src={
                        post.author.avatarUrl
                          ? assetURLBuilder(post.author.avatarUrl)
                          : profileImageRouteGenerator(post.author.username)
                      }
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col ml-2">
                      <span className="font-bold">{post.title}</span>
                      <span className="text-gray-500 text-sm">
                        @{post.author.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center">
                    <span className={clsx("text-gray-500 text-sm ml-4")}>
                      {dayjs(post.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row mt-2">
                  <span className="text-gray-500 text-sm">
                    {post.description}
                  </span>
                </div>
              </Paper>
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default JobPosts;
