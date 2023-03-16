import {
  Avatar,
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
import sanitizeHtml, { IOptions } from "sanitize-html";
import { IconStar } from "@tabler/icons";

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
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery<{
    services: {
      id: string;
      user: {
        username: string;
        name: string;
        avatarUrl: string;
      };
      createdAt: string;
      title: string;
      tags: { name: string; id: string; slug: string }[];
      slug: true;
      description: string;
      package: [
        {
          price: number;
        }
      ];
      rating: number;
      bannerImage: string;
      ratedBy: number;
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
          {page.services?.map((service) => (
            <Paper key={service.id} withBorder shadow={"md"} radius="md">
              <Image
                src={assetURLBuilder(service.bannerImage)}
                width="100%"
                height={"100%"}
                alt="Service Banner"
                classNames={{
                  image: "rounded-t-md",
                }}
              />
              <Group position="left" mt="md" pl="md">
                <div>
                  <Avatar
                    size="md"
                    src={
                      service.user.avatarUrl
                        ? assetURLBuilder(service.user.avatarUrl)
                        : profileImageRouteGenerator(service.user.username)
                    }
                    radius="xl"
                  />
                </div>
                <div className="flex flex-col">
                  <Text size="md" className={clsx(sen.className, "mb-0")}>
                    {service.user.name}
                  </Text>

                  <Text
                    size="xs"
                    className={clsx(sen.className, "mt-0 leading-3")}
                  >
                    @{service.user.username}{" "}
                  </Text>
                </div>
              </Group>
              <Group mt="sm" mb="xs" p="md">
                <Link
                  href={`/profile/${username}/service/${service.slug}`}
                  className="hover:text-white"
                >
                  {service.title}
                </Link>
              </Group>
              <Divider />
              <Group position="apart">
                <div className="flex flex-col">
                  <Text size="xs" className={clsx(sen.className)}>
                    {service.tags.map((tag) => (
                      <Fragment key={tag.id}>
                        <Link href={`/t/${tag.slug}`}>
                          <span className="text-gray-500"># {tag.name} </span>
                        </Link>
                      </Fragment>
                    ))}
                  </Text>
                </div>
              </Group>
              <Divider />
              <Group position="apart" p="md">
                <div className="flex flex-row pl-4">
                  <IconStar color="yellow" fill="yellow" width={15} />
                  <span className="ml-1">
                    {service.rating}
                    <span className="text-sm text-gray-500 ml-1">
                      ({service.ratedBy})
                    </span>
                  </span>
                </div>
                <div className="flex flex-col pr-4">
                  <Text
                    className={clsx(
                      outfit.className,
                      "text-[10px] mb-0 uppercase"
                    )}
                  >
                    Starting At
                  </Text>
                  <Text
                    className={clsx(
                      sen.className,
                      "text-lg mt-0 leading-3 mb-2"
                    )}
                  >
                    $ {service.package[0].price}
                  </Text>
                </div>
              </Group>
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
      {data?.pages[0].services.length === 0 && (
        <div className="flex flex-col items-center justify-center w-[100%] container">
          <p>
            <span className="font-bold">{username}</span> has not posted any
            service
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
