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
  Table,
  Tooltip,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
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
      const data = await fetch(URLBuilder(`/orders?take=${pageParam}`), {
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
  const { id, username } = useUser();
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
            <Table striped withBorder withColumnBorders className="">
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>State</th>
                  <th>Freelancer</th>
                  <th>Client</th>
                  <th>Coupon Code</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.pages.map((p, i) => (
                  <Fragment key={i}>
                    {p.orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <Link
                            className="text-blue-500"
                            href={`/profile/${username}/order/${order.id}/chat`}
                          >
                            {order.id}
                          </Link>
                        </td>
                        <td>
                          <Badge>{order.orderState}</Badge>
                        </td>
                        <td>
                          <Link
                            className="text-blue-500"
                            href={`/profile/${order.freelancer.username}`}
                          >
                            {order.freelancer.name}
                          </Link>
                        </td>
                        <td>
                          <Link
                            className="text-blue-500"
                            href={`/profile/${order.client.username}`}
                          >
                            {order.client.name}
                          </Link>
                        </td>
                        <td>{order.couponCode?.code ?? "N/A"}</td>
                        <td>
                          <Badge>&#8377;{order.transaction.amount / 100}</Badge>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </>
  );
};

export default Orders;
