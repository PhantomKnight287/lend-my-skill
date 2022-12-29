import { Container } from "@components/container";
import { outfit } from "@fonts";
import { useUser } from "@hooks/user";
import {
  Avatar,
  Badge,
  Button,
  Chip,
  Divider,
  Image,
  Table,
  Tabs,
  Text,
  TextInput,
  Tooltip,
  TypographyStylesProvider,
  useMantineColorScheme,
} from "@mantine/core";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import clsx from "clsx";
import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from "next";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Gig } from "~/types/gig";
import { Carousel } from "@mantine/carousel";
import useHydrateUserContext from "@hooks/hydrate/user";
import { MetaTags } from "@components/meta";
import { IconCheck, IconX } from "@tabler/icons";
import { sanitize } from "@components/tabs/profile/gigs";
import { upperFirst } from "@mantine/hooks";
import { openModal,closeAllModals } from "@mantine/modals";
import { useForm } from "@mantine/form";
import axios from "axios";
import { readCookie } from "@helpers/cookie";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { Razorpay } from "@module/razorpay";

const Gig: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const formState = useForm({
    initialValues: {
      couponCode: "",
    },
  });
  const { username } = useUser();
  useHydrateUserContext();
  const { colorScheme } = useMantineColorScheme();

  const { push, asPath } = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  return (
    <Container
      className={clsx("mb-10", {
        [outfit.className]: true,
      })}
    >
      <MetaTags
        title={`@${props.freelancer.username} | ${props.freelancer.name} | Lend My Skill`}
        description={
          props.description || `${props.freelancer.name} on Lend My Skill`
        }
        ogImage={assetURLBuilder(props.bannerImage)}
      />
      <Image
        src={assetURLBuilder(props.bannerImage)}
        alt="Banner Image"
        className="mb-4"
        classNames={{
          image:
            "min-w-[140px] min-h-[140px] max-w-full min-h-full  object-contain w-full",
        }}
      />
      <h1 className="text-2xl font-bold text-center">{props.title}</h1>
      {props.freelancer.profileCompleted ? null : (
        <div className="mt-2  text-center">
          <span className="text-red-500">
            {username === props.freelancer.username
              ? "Please complete your profile for this post to appear in search results.(only you can see this)"
              : null}
          </span>
        </div>
      )}
      <div className="flex flex-row flex-wrap items-center mt-2 justify-center">
        <Avatar
          src={
            props.freelancer.avatarUrl
              ? assetURLBuilder(props.freelancer.avatarUrl)
              : profileImageRouteGenerator(props.freelancer.username)
          }
          size="md"
          radius="xl"
        />
        <div className="flex flex-col ml-2">
          <h2 className="text-base font-semibold">
            {props.freelancer.name}
            {props.freelancer.verified ? (
              <Tooltip label="Verified Freelancer" withArrow>
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
              href={`/profile/${props.freelancer.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              @{props.freelancer.username}
            </a>
          </Text>
        </div>
        <div className="flex flex-col items-center justify-center w-full">
          <Divider orientation="horizontal" className={clsx("w-full my-4")} />
          <Badge key={props.category.id}>
            <Link href={`/category/${props.category.slug}`}>
              {props.category.name}
            </Link>
          </Badge>
          <div className="flex flex-row gap-2 items-center justify-center flex-wrap my-4">
            {props.tags.map((t, index) => (
              <Badge variant="light" key={index} color="green">
                <a href={`/search?tag=${t}&tab=gigs`}>#{t}</a>
              </Badge>
            ))}
          </div>
        </div>
        <Divider orientation="horizontal" className={clsx("w-full my-4")} />
        {props.images.length > 0 ? (
          <Carousel
            slideSize="70%"
            height={200}
            slideGap="lg"
            controlsOffset="xs"
            withIndicators
            breakpoints={[
              { maxWidth: "md", slideSize: "50%" },
              { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
            ]}
          >
            {props.images.map((i) => (
              <Carousel.Slide key={assetURLBuilder(i)}>
                <Image
                  src={assetURLBuilder(i)}
                  alt="Image"
                  className="cursor-pointer"
                  classNames={{
                    image:
                      "min-w-[140px] min-h-[140px] max-w-full min-h-full  object-contain w-full",
                  }}
                  onClick={() => {
                    window.open(assetURLBuilder(i));
                  }}
                />
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : null}
        <Divider orientation="horizontal" className={clsx("w-full my-4")} />

        <TypographyStylesProvider>
          <div
            dangerouslySetInnerHTML={sanitize(props.description, undefined)}
          />
        </TypographyStylesProvider>
      </div>
      <Divider orientation="horizontal" className={clsx("w-full my-4")} />

      <Text
        className={clsx("font-bold text-2xl text-center mb-4", {
          [outfit.className]: true,
        })}
      >
        Packages Offered
      </Text>

      <Table striped highlightOnHover withBorder withColumnBorders>
        <thead>
          <tr>
            <th>Package</th>
            {props.Package.map((p) => (
              <th key={p.id}>{upperFirst(p.name)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Description</td>
            {props.Package.map((p) => (
              <td key={p.id}>{p.description || "Not Provided"}</td>
            ))}
          </tr>
          <tr>
            <td>Delivery</td>
            {props.Package.map((p) => (
              <td key={p.id}>
                {p.deliveryDays} {p.deliveryDays > 1 ? "Days" : "Day"}
              </td>
            ))}
          </tr>
          {/* map over the "features" array provided in "Package".features and then check if includedIn has package name, if yes render true else false */}
          <tr>
            <td>Features</td>
            {props.Package.map((p) => (
              <td key={p.id}>
                {p.features.map((f) => (
                  <div key={f.id}>
                    {f.includedIn.includes(p.name) ? (
                      <div className="flex flex-row items-center gap-2">
                        <IconCheck size={13} color="green" />
                        <span>{f.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-row items-center gap-2">
                        <IconX size={13} color="red" />
                        <span>{f.name}</span>
                      </div>
                    )}
                  </div>
                ))}
              </td>
            ))}
          </tr>
          <tr>
            <td>Price</td>
            {props.Package.map((p) => (
              <td key={p.id}>
                <span className="font-semibold text-[18px]">${p.price}</span>
              </td>
            ))}
          </tr>
          <tr>
            <td>Actions</td>
            {props.Package.map((p) => (
              <td key={p.id}>
                <Button
                  variant="default"
                  size="sm"
                  fullWidth
                  disabled={username === props.freelancer.username}
                  onClick={() => {
                    openModal({
                      title: "Confirm Payment",
                      children: (
                        <div
                          className={clsx("", {
                            [outfit.className]: true,
                          })}
                        >
                          <Text>
                            Are you sure you want to hire{" "}
                            {props.freelancer.name}?{" "}
                          </Text>
                          <Text>
                            You will be charged ${p.price} for this package.
                          </Text>
                          <div className="flex flex-col gap-2 mt-2">
                            <Button
                              variant="default"
                              color="black"
                              fullWidth
                              onClick={() => {
                                openModal({
                                  title: "Enter Coupon Code",
                                  children: (
                                    <div
                                      className={clsx("", {
                                        [outfit.className]: true,
                                      })}
                                    >
                                      <form
                                        onSubmit={formState.onSubmit((d) => {
                                          if (!username)
                                            return push({
                                              pathname: "/auth/login",
                                              query: {
                                                to: asPath,
                                              },
                                            });
                                          axios
                                            .post<{
                                              id: string;
                                              amount: string;
                                              discounted: boolean;
                                            }>(
                                              URLBuilder("/order/create"),
                                              {
                                                packageId: p.id,
                                                sellerUsername:
                                                  props.freelancer.username,
                                                discountCode:
                                                  ref.current?.value,
                                              },
                                              {
                                                headers: {
                                                  authorization: `Bearer ${readCookie(
                                                    "token"
                                                  )}`,
                                                },
                                              }
                                            )
                                            .then((d) => d.data)
                                            .then(
                                              ({ amount, discounted, id }) => {
                                                if (discounted)
                                                  openModal({
                                                    title:
                                                      "Coupon Code Applied",
                                                    children: (
                                                      <div
                                                        className={clsx("", {
                                                          [outfit.className]:
                                                            true,
                                                        })}
                                                      >
                                                        <Text>
                                                          Coupon code applied
                                                          successfully.
                                                        </Text>
                                                        <Text>
                                                          You will be charged
                                                          &#x20B9;
                                                          {Number(amount) /
                                                            100}{" "}
                                                          for this package.
                                                        </Text>
                                                        <Button
                                                          variant="default"
                                                          fullWidth
                                                          className=" text-white bg-green-500 hover:bg-green-600"
                                                          onClick={() => {
                                                            if (!username)
                                                              return push({
                                                                pathname:
                                                                  "/auth/login",
                                                                query: {
                                                                  to: asPath,
                                                                },
                                                              });
                                                              const razorpay = new
                                                              Razorpay({
                                                                amount,
                                                                currency: "INR",
                                                                key: process.env
                                                                  .NEXT_PUBLIC_RAZORPAY_KEY!,
                                                                name: "Lend My Skill",
                                                                order_id: id,
                                                                handler(){
                                                                  showNotification({
                                                                    message:"Payment Successful",
                                                                    color:"green"
                                                                  })
                                                                  closeAllModals()
                                                                }
                                                              })
                                                              razorpay.on("payment.failed",(res:{
                                                                error:any
                                                              })=>{
                                                                showNotification({
                                                                  message:res?.error?.description || "Something went wrong",
                                                                  color:"red"
                                                                })
                                                              })
                                                              razorpay.open()
                                                          }}
                                                        >
                                                          Proceed to Payment
                                                        </Button>
                                                      </div>
                                                    ),
                                                    centered: true,
                                                  });
                                              }
                                            )
                                            .catch((err) => {
                                              showNotification({
                                                message:
                                                  err?.response?.data
                                                    ?.message ||
                                                  "Something went wrong",
                                                color: "red",
                                              });
                                            });
                                        })}
                                      >
                                        <div className="flex flex-col gap-2 mt-2">
                                          <TextInput
                                            label="Discount Code"
                                            placeholder="Enter Discount Code"
                                            ref={ref}
                                            required
                                          />
                                          <Button
                                            variant="default"
                                            color="black"
                                            fullWidth
                                            type="submit"
                                            className={clsx(
                                              "rounded-md text-white transition-all duration-[110ms] hover:scale-105",
                                              {
                                                [outfit.className]: true,
                                                "bg-gray-900 hover:bg-black ":
                                                  colorScheme === "light",
                                                "bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] ":
                                                  colorScheme === "dark",
                                              }
                                            )}
                                          >
                                            Apply
                                          </Button>
                                        </div>
                                      </form>
                                    </div>
                                  ),
                                  centered: true,
                                });
                              }}
                            >
                              I have a coupon code
                            </Button>
                            <Button
                              variant="default"
                              fullWidth
                              className=" text-white bg-green-500 hover:bg-green-600"
                              onClick={() => {
                                if (!username)
                                  return push({
                                    pathname: "/auth/login",
                                    query: {
                                      to: asPath,
                                    },
                                  });
                                axios
                                  .post<{
                                    id: string;
                                    amount: string;
                                    discounted: boolean;
                                  }>(
                                    URLBuilder("/order/create"),
                                    {
                                      packageId: p.id,
                                      sellerUsername: props.freelancer.username,
                                    },
                                    {
                                      headers: {
                                        authorization: `Bearer ${readCookie(
                                          "token"
                                        )}`,
                                      },
                                    }
                                  )
                                  .then((d) => d.data)
                                  .then(({ amount, discounted, id }) => {
                                    if (discounted) {
                                      openModal({
                                        title: "Coupon Code Applied",
                                        children: (
                                          <div
                                            className={clsx("", {
                                              [outfit.className]: true,
                                            })}
                                          >
                                            <Text>
                                              Coupon code applied successfully.
                                            </Text>
                                            <Text>
                                              You will be charged &#x20B9;
                                              {Number(amount) / 100} for this
                                              package.
                                            </Text>
                                            <Button
                                              variant="default"
                                              fullWidth
                                              className=" text-white bg-green-500 hover:bg-green-600"
                                              onClick={() => {
                                                if (!username)
                                                  return push({
                                                    pathname: "/auth/login",
                                                    query: {
                                                      to: asPath,
                                                    },
                                                  });
                                              }}
                                            >
                                              Proceed to Payment
                                            </Button>
                                          </div>
                                        ),
                                        centered: true,
                                      });
                                    } else {
                                      openModal({
                                        title: "Proceed to Payment",
                                        children: (
                                          <div
                                            className={clsx("", {
                                              [outfit.className]: true,
                                            })}
                                          >
                                            <Text>
                                              You will be charged &#x20B9;
                                              {Number(amount) / 100} for this
                                              package.
                                            </Text>
                                            <Button
                                              variant="default"
                                              fullWidth
                                              className=" text-white bg-green-500 hover:bg-green-600"
                                              onClick={() => {
                                                if (!username)
                                                  return push({
                                                    pathname: "/auth/login",
                                                    query: {
                                                      to: asPath,
                                                    },
                                                  });
                                                const razorpay = new
                                                  Razorpay({
                                                    amount,
                                                    currency: "INR",
                                                    key: process.env
                                                      .NEXT_PUBLIC_RAZORPAY_KEY!,
                                                    name: "Lend My Skill",
                                                    order_id: id,
                                                    handler(){
                                                      showNotification({
                                                        message:"Payment Successful",
                                                        color:"green"
                                                      })
                                                      closeAllModals()
                                                    }
                                                  })
                                                  razorpay.on("payment.failed",(res:{
                                                    error:any
                                                  })=>{
                                                    showNotification({
                                                      message:res?.error?.description || "Something went wrong",
                                                      color:"red"
                                                    })
                                                  })
                                                  razorpay.open()
                                              }}
                                            >
                                              Initiate Payment
                                            </Button>
                                          </div>
                                        ),
                                        centered: true,
                                      });
                                    }
                                  })
                                  .catch((err) => {
                                    showNotification({
                                      message:
                                        err?.response?.data?.message ||
                                        "Something went wrong",
                                      color: "red",
                                    });
                                  });
                              }}
                            >
                              Proceed to Payment
                            </Button>
                          </div>
                        </div>
                      ),
                      centered: true,
                    });
                  }}
                  color="black"
                  className={clsx(
                    "rounded-md text-white transition-all duration-[110ms] hover:scale-105",
                    {
                      [outfit.className]: true,
                      "bg-gray-900 hover:bg-black ": colorScheme === "light",
                      "bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] ":
                        colorScheme === "dark",
                    }
                  )}
                >
                  Select
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

export default Gig;

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await (await fetch(URLBuilder("/static/gigs"))).json();
  console.log(data);
  return {
    fallback: "blocking",
    paths: data.map((g: any) => ({
      params: {
        username: g.freelancer.username,
        slug: g.slug,
      },
    })),
  };
};

export const getStaticProps: GetStaticProps<Gig> = async ({ params }) => {
  const username = params!.username;
  const slug = params!.slug;

  const data = await fetch(URLBuilder(`/gigs/${username}/${slug}`));
  if (!data.ok) {
    return {
      notFound: true,
    };
  }
  const gig = await data.json();
  return {
    props: gig,
  };
};
