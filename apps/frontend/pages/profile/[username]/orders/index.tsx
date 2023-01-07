import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import { readCookie } from "@helpers/cookie";
import useHydrateUserContext from "@hooks/hydrate/user";
import useIssueNewAuthToken from "@hooks/jwt";
import { useUser } from "@hooks/user";
import {
  Avatar,
  Badge,
  Card,
  Loader,
  SimpleGrid,
  Tooltip,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Orders } from "~/types/response/order";

const Orders = () => {
  const [enabled, setEnabled] = useState(false);
  const {
    data: orders,
    error,
    hasNextPage,
    refetch,
    fetchNextPage,
    status,
  } = useInfiniteQuery<Orders>({
    queryKey: ["orders"],
    queryFn: async ({ pageParam = 10 }) => {
      const data = await fetch(URLBuilder(`/order/list?take=${pageParam}`), {
        headers: {
          authorization: `Bearer ${readCookie("token")}`,
        },
      });
      if (!data.ok) throw new Error("Error Fetching Orders");
      return await data.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
    enabled: enabled,
  });
  const { id, userType, username } = useUser();
  const { isReady, replace, asPath } = useRouter();
  useEffect(() => {
    if (!isReady) return;
    const token = readCookie("token");
    if (!token || !id)
      return void replace({
        pathname: "/auth/login",
        query: {
          to: asPath,
        },
      });
    setEnabled(true);
  }, [isReady]);

  useHydrateUserContext();
  useIssueNewAuthToken();
  return (
    <>
      <Container
        className={clsx("", {
          [outfit.className]: true,
        })}
      >
        <MetaTags title="Orders" description="View your orders" />
        {status === "loading" ? (
          <div className="flex flex-col items-center justify-center">
            <Loader color="green" />
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center justify-center">
            <p>Error Fetching Orders</p>
          </div>
        ) : (
          <>
            {orders?.pages[0].orders?.length === 0 ? (
              <div className="flex flex-col items-center justify-center">
                <p
                  className={clsx("font-bold text-xl", {
                    [outfit.className]: true,
                  })}
                >
                  No Orders Found
                </p>
              </div>
            ) : null}
            {orders?.pages.map((page, index) => (
              <div key={index}>
                <SimpleGrid
                  cols={3}
                  spacing="lg"
                  breakpoints={[
                    { maxWidth: "md", cols: 3, spacing: "md" },
                    { maxWidth: "sm", cols: 2, spacing: "sm" },
                    { maxWidth: "xs", cols: 1, spacing: "sm" },
                  ]}
                >
                  {page.orders?.map((order) => (
                    <div key={order.id}>
                      <Card
                        withBorder
                        radius="md"
                        shadow="xl"
                        component={Link}
                        href={`/profile/${username}/order/${order.id}`}
                      >
                        <Card.Section p="md">
                          <p>Id: {order.id}</p>
                          <p>
                            Order Completion Status:{" "}
                            {order.status === "CANCELLED"
                              ? "Cancelled"
                              : order.status === "COMPLETED"
                              ? "Completed"
                              : "Pending"}
                          </p>
                        </Card.Section>
                        <Card.Section p="md">
                          <p
                            className={clsx("text-left font-bold text-xl", {
                              [outfit.className]: true,
                            })}
                          >
                            {userType === "client"
                              ? "You Hired"
                              : "You Got Hired By"}
                          </p>
                          <div className="flex">
                            {(
                              userType === "client"
                                ? order.freelancer
                                : order.client
                            ) ? (
                              <Link
                                href={`/profile/${
                                  userType === "client"
                                    ? order.freelancer.username
                                    : order.client.username
                                }`}
                              >
                                {
                                  <div className="flex mt-2 flex-row flex-nowrap items-center">
                                    <Avatar
                                      src={
                                        userType === "client"
                                          ? order.freelancer.avatarUrl
                                            ? assetURLBuilder(
                                                order.freelancer.avatarUrl
                                              )
                                            : order.client.avatarUrl
                                            ? assetURLBuilder(
                                                order.client.avatarUrl
                                              )
                                            : profileImageRouteGenerator(
                                                order.client.username
                                              )
                                          : order.client.avatarUrl
                                          ? assetURLBuilder(
                                              order.client.avatarUrl
                                            )
                                          : order.freelancer.avatarUrl
                                          ? assetURLBuilder(
                                              order.freelancer.avatarUrl
                                            )
                                          : profileImageRouteGenerator(
                                              order.freelancer.username
                                            )
                                      }
                                      radius="xl"
                                    />
                                    <div className="flex flex-col ml-4">
                                      <h2 className="font-bold">
                                        {userType === "client"
                                          ? order.freelancer.name
                                          : order.client.name}
                                        {(
                                          userType === "client"
                                            ? order.freelancer.verified
                                            : order.client.verified
                                        ) ? (
                                          <Tooltip
                                            label="Verified User"
                                            withArrow
                                          >
                                            <Badge
                                              color="green"
                                              variant="light"
                                              className="rounded-full ml-2"
                                            >
                                              <div className="flex flex-row flex-nowrap items-center justify-center">
                                                <IconCheck
                                                  color="green"
                                                  size={15}
                                                />
                                              </div>
                                            </Badge>
                                          </Tooltip>
                                        ) : null}
                                      </h2>
                                      <p
                                        className={clsx(
                                          "text-gray-500 text-sm"
                                        )}
                                      >
                                        @
                                        {userType === "client"
                                          ? order.freelancer.username
                                          : order.client.username}
                                      </p>
                                    </div>
                                  </div>
                                }
                              </Link>
                            ) : null}
                          </div>
                        </Card.Section>
                      </Card>
                    </div>
                  ))}
                </SimpleGrid>
              </div>
            ))}
          </>
        )}
      </Container>
    </>
  );
};

export default Orders;
