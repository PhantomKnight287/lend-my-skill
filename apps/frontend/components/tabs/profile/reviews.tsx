import {
  Button,
  LoadingOverlay,
  Paper,
  Rating,
  useMantineColorScheme,
} from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import { Fragment } from "react";
import clsx from "clsx";
import Link from "next/link";
import { outfit } from "@fonts";
import { r } from "@helpers/date";

interface Props {
  username: string;
}
const Reviews = ({ username }: Props) => {
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
    reviews: {
      author: {
        avatarUrl: any;
        id: string;
        username: string;
        name: string;
      };
      comment: string;
      id: string;
      rating: number;
      createdAt: string;
    }[];
    next?: number;
  }>({
    queryKey: ["reviews", username],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(`/reviews/${username}?take=${pageParam}`)
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
        <Fragment key={index}>
          {page.reviews?.map((post) => (
            <div key={post.id} className="flex flex-col">
              <Paper withBorder radius="md" p="md" my="sm">
                <div className="flex flex-row ">
                  <div className="flex flex-row items-center">
                    <img
                      src={
                        post.author.avatarUrl
                          ? assetURLBuilder(post.author.avatarUrl)
                          : profileImageRouteGenerator(post.author.username)
                      }
                      className="w-10 h-10 rounded-full"
                      alt="avatar"
                    />
                    <div className="flex flex-col ml-2">
                      <span className="font-bold">{post.author.name}</span>
                      <span className="text-gray-500 text-sm">
                        @{post.author.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center ml-auto">
                    <span className={clsx("text-gray-500 text-sm ml-4")}>
                      {r(post.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col mt-2 ml-12">
                  <Rating readOnly value={post.rating} fractions={2} />
                  <span
                    className="text-gray-500 text-sm "
                    style={{ lineClamp: 2 }}
                  >
                    {post.comment}
                  </span>
                </div>
              </Paper>
            </div>
          ))}
        </Fragment>
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
      {data?.pages[0].reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center w-[100%] container">
          <p>
            <span className="font-bold">{username}</span> has not posted any job
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

export default Reviews;
