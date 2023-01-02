import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import { readCookie } from "@helpers/cookie";
import { r } from "@helpers/date";
import useHydrateUserContext from "@hooks/hydrate/user";
import useIssueNewAuthToken from "@hooks/jwt";
import { useUser } from "@hooks/user";
import { Button, Group, Loader, Table, Tooltip } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { URLBuilder } from "@utils/url";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Order } from "~/types/response/order";

const OrderPage = () => {
  const [order, setOrder] = useState<Order>();
  const { id } = useUser();
  const { isReady, replace, asPath, query } = useRouter();
  const fetchUserDetails = useHydrateUserContext();
  useIssueNewAuthToken({
    method: "replace",
    redirect: false,
    to: "",
    successAction: fetchUserDetails,
  });

  useEffect(() => {
    const token = readCookie("token");
    if (!isReady) return;
    if (!token || !id)
      return void replace({
        pathname: "/auth/login",
        query: {
          to: asPath,
        },
      });
  }, [isReady]);

  useEffect(() => {
    const token = readCookie("token");
    if (!isReady) return;
    const controller = new AbortController();
    if (!query.id) return;
    axios
      .get(URLBuilder(`/order/details/${query.id}`), {
        headers: {
          authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then((d) => d.data)
      .then(setOrder)
      .catch((err) => {
        if (err.code === "ERR_CANCELED") return;
        showNotification({
          message: err?.response?.data?.message || "Something went wrong",
          color: "red",
          title: "Error",
        });
      });
    return () => controller.abort();
  }, [isReady, query.id]);

  return (
    <Container
      className={clsx({
        [outfit.className]: true,
      })}
    >
      <MetaTags
        title="Order Details"
        description="Check your order details here"
      />

      <div className="flex flex-col items-center justify-center w-full h-full">
        <h1
          className={clsx("text-2xl font-bold", {
            [outfit.className]: true,
          })}
        >
          Order Details
        </h1>
      </div>
      {order !== undefined ? (
        <>
          <Table
            withBorder
            striped
            highlightOnHover
            className={clsx({
              [outfit.className]: true,
            })}
            mt="xl"
          >
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Order Id</td>
                <td>{order.id}</td>
              </tr>
              <tr>
                <td>Created </td>
                <td>{r(order.createdAt)}</td>
              </tr>
              <tr>
                <td>
                  <Tooltip label="Status of Work done by Freelancer">
                    <span>Status</span>
                  </Tooltip>
                </td>
                <td>
                  {order.status === "CANCELLED"
                    ? "Cancelled"
                    : order.status === "COMPLETED"
                    ? "Completed"
                    : "Pending"}
                </td>
              </tr>
              <tr>
                <td>
                  {order.user === "client" ? "You Hired" : "You Got Hired By"}
                </td>
                <td>
                  <Link
                    href={`/profile/${
                      order.user === "freelancer"
                        ? order.client.username
                        : order.freelancer.username
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    {order.user === "client"
                      ? order.freelancer.name
                      : order.client.name}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Deadline</td>
                <td>{r(order.deadline)}</td>
              </tr>
              <tr>
                <td>Package Selected</td>
                <td>
                  <Link
                    href={`/profile/${order.package.gig.freelancer.username}/gig/${order.package.gig.slug}#packages-offered`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 hover:underline"
                  >
                    {order.package.name}
                  </Link>
                </td>
              </tr>
              {order.user === "client" ? (
                <tr>
                  <td>Amount Paid</td>
                  <td>
                    &#x20B9;
                    {order.amountPaid || order.price}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </Table>
          <Group position={"center"}>
            <Link
              href={`/profile/${order.package.gig.freelancer.username}/gig/${order.package.gig.slug}#packages-offered`}
            >
              <Button
                variant="outline"
                color="blue"
                className="mt-4"
                onClick={() => {
                  showNotification({
                    message: "Redirecting to Gig Page",
                    color: "blue",
                    title: "Redirecting",
                  });
                }}
              >
                View Gig
              </Button>
            </Link>
            {order.user === "client" ? (
              <Link href={`/profile/${order.package.gig.freelancer.username}`}>
                <Button
                  variant="outline"
                  color="blue"
                  className="mt-4"
                  onClick={() => {
                    showNotification({
                      message: "Redirecting to Freelancer Profile",
                      color: "blue",
                      title: "Redirecting",
                    });
                  }}
                >
                  View Freelancer
                </Button>
              </Link>
            ) : null}
            <Link href={`${asPath}/chat`}>
              <Button
                variant="outline"
                color="blue"
                className="mt-4"
                onClick={() => {
                  showNotification({
                    message: "Redirecting to Chat",
                    color: "blue",
                    title: "Redirecting",
                  });
                }}
              >
                Open Chat
              </Button>
            </Link>
          </Group>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Loader />
        </div>
      )}
    </Container>
  );
};

export default OrderPage;
