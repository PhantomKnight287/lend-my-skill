import {
  Button,
  LoadingOverlay,
  Paper,
  TypographyStylesProvider,
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
import { outfit } from "@fonts";
import sanitizeHtml, { IOptions } from "sanitize-html";

dayjs.extend(relativeTime);

const defaultOptions = {
  allowedTags: ["b", "i", "em", "strong", "a"],
  allowedAttributes: {
    a: ["href"],
  },
  allowedIframeHostnames: ["www.youtube.com"],
};

export const sanitize = (dirty: string, options: IOptions | undefined) => ({
  __html: sanitizeHtml(dirty, { ...defaultOptions, ...options }),
});

interface Props {
  username: string;
}
const ServicesTab = ({ username }: Props) => {
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
    services: {
      id: string;
      freelancer: {
        username: string;
        name: string;
        avatarUrl: string;
      };
      createdAt: string;
      title: string;
      tags: string[];
      slug: true;
      description: string;
    }[];
    next?: number;
  }>({
    queryKey: ["services", username],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(`/services/${username}?take=${pageParam}`)
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
          {page.services?.map((service) => (
            <div key={service.id} className="flex flex-col">
              <Paper
                withBorder
                radius="md"
                p="md"
                my="sm"
                className={clsx("cursor-pointer")}
                component={Link}
                href={`/profile/${username}/service/${service.slug}`}
              >
                <div className="flex flex-row ">
                  <div className="flex flex-row items-center">
                    <img
                      src={
                        service.freelancer.avatarUrl
                          ? assetURLBuilder(service.freelancer.avatarUrl)
                          : profileImageRouteGenerator(service.freelancer.username)
                      }
                      className="w-10 h-10 rounded-full"
                      alt="avatar"
                    />
                    <div className="flex flex-col ml-2">
                      <span className="font-bold">{service.title}</span>
                      <span className="text-gray-500 text-sm">
                        @{service.freelancer.username}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-row items-center ml-auto">
                    <span className={clsx("text-gray-500 text-sm ml-4")}>
                      {dayjs(service.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-row mt-2">
                  <TypographyStylesProvider style={{ lineClamp: 2 }}>
                    <div
                      dangerouslySetInnerHTML={sanitize(
                        service.description,
                        undefined
                      )}
                    />
                  </TypographyStylesProvider>
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
      {data?.pages[0].services.length === 0 && (
        <div className="flex flex-col items-center justify-center w-[100%] container">
          <p>
            <span className="font-bold">{username}</span> has not posted any service
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

export default ServicesTab;
