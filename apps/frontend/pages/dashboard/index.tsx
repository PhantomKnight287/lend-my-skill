import { outfit } from "@fonts";
import useHydrateUserContext from "@hooks/hydrate/user";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { MetaTags } from "@components/meta";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { URLBuilder } from "@utils/url";
import { AllServicesResponse } from "~/types/service";
import { useUser } from "@hooks/user";
import { useIntersection } from "@mantine/hooks";
import { Loader, Title } from "@mantine/core";
import { Posts } from "~/types/jobpost";
import { PostCard } from "@components/card/post";
import styles from "@styles/Dashboard.module.scss";

const Dashboard = () => {
  useHydrateUserContext("replace", true, "/auth/login", true);
  const {
    data: services,
    fetchNextPage: fetchMoreServices,
    hasNextPage: hasMoreServices,
    isFetchingNextPage: isFetchingMoreServices,
    error: servicesError,
    status: servicesFetchingStatus,
  } = useInfiniteQuery<AllServicesResponse>({
    queryKey: ["services"],
    queryFn: async ({ pageParam = 10 }) => {
      const data = await fetch(URLBuilder(`/services?take=${pageParam}`));
      if (!data.ok)
        throw new Error(
          (await data.json())["message"] || "Something went wrong"
        );
      return data.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });

  const {
    data: jobposts,
    fetchNextPage: fetchMoreJobposts,
    hasNextPage: hasMoreJobposts,
    isFetchingNextPage: isFetchingMoreJobposts,
    error: jobpostsError,
    status: jobpostsFetchingStatus,
  } = useInfiniteQuery<Posts>({
    queryKey: ["jobposts"],
    queryFn: async ({ pageParam = 10 }) => {
      const data = await fetch(URLBuilder(`/jobpost?take=${pageParam}`));
      if (!data.ok)
        throw new Error(
          (await data.json())["message"] || "Something went wrong"
        );
      return data.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
  });

  const { userType } = useUser();

  const servicesContainer = useRef<HTMLDivElement>(null);
  const jobpostsContainer = useRef<HTMLDivElement>(null);

  const { ref: servicesRef, entry: servicesEntry } = useIntersection({
    root: servicesContainer.current,
    threshold: 0.5,
  });

  const { ref: jobpostsRef, entry: jobpostsEntry } = useIntersection({
    root: jobpostsContainer.current,
    threshold: 0.5,
  });

  useEffect(() => {
    if (servicesEntry?.isIntersecting && hasMoreServices) {
      fetchMoreServices();
    }
  }, [servicesEntry?.isIntersecting]);

  useEffect(() => {
    if (jobpostsEntry?.isIntersecting && hasMoreJobposts) {
      fetchMoreJobposts();
    }
  }, [jobpostsEntry?.isIntersecting]);

  return (
    <div
      className={clsx("flex mt-8 w-full", {
        [outfit.className]: true,
      })}
    >
      <MetaTags
        description="An Open Source Freelance Platform For Everyone. "
        title="Lend My Skill"
      />
      <div
        className={clsx("flex gap-3 flex-wrap w-full", {
          "flex-col": userType === "client",
          "flex-col-reverse": userType === "freelancer",
        })}
      >
        <div className="w-full px-8 py-4">
          <Title
            className={clsx("", {
              [outfit.className]: true,
            })}
            align="left"
          >
            Services
          </Title>
          {services?.pages?.[0].services.length === 0 ? (
            <>
              <Title
                className={clsx(
                  "bg-gray-100 text-gray-500 text-2xl py-10 rounded-lg my-4",
                  {
                    [outfit.className]: true,
                  }
                )}
                align="center"
              >
                No Services Found
              </Title>
            </>
          ) : null}
          <div
            className={clsx(
              "flex flex-row gap-3 flex-nowrap px-2 py-3",
              styles.scroll,
              {
                "overflow-x-scroll": services?.pages?.[0].services.length !== 0,
              }
            )}
            ref={servicesContainer}
          >
            {servicesFetchingStatus === "loading" ? (
              <div className="flex flex-col items-center justify-center">
                <Loader color="green" />
              </div>
            ) : servicesFetchingStatus === "error" ? (
              <div>{(servicesError as Error)?.message}</div>
            ) : (
              services?.pages.map((page) =>
                page.services.map((service) => (
                  <div
                    ref={
                      page.services[page.services.length - 1]?.id === service.id
                        ? servicesRef
                        : undefined
                    }
                    key={service.id}
                  >
                    <PostCard
                      description={service.description}
                      image={service.bannerImage}
                      title={service.title}
                      author={service.freelancer}
                      slug={service.slug}
                      type="service"
                      resolveImageUrl
                    />
                  </div>
                ))
              )
            )}
          </div>
        </div>
        <div className="w-full px-8 py-4">
          <Title
            className={clsx("", {
              [outfit.className]: true,
            })}
            align="left"
          >
            Job Posts
          </Title>
          {jobposts?.pages[0].posts.length === 0 ? (
            <>
              <Title
                className={clsx(
                  "bg-gray-100 text-gray-500 text-2xl py-10 rounded-lg my-4",
                  {
                    [outfit.className]: true,
                  }
                )}
                align="center"
              >
                No Job Posts Found
              </Title>
            </>
          ) : null}
          <div
            className={clsx("flex flex-row gap-3 flex-nowrap", {
              "overflow-x-scroll": jobposts?.pages[0].posts.length,
            })}
            ref={servicesContainer}
          >
            {servicesFetchingStatus === "loading" ? (
              <div className="flex flex-col items-center justify-center">
                <Loader color="green" />
              </div>
            ) : servicesFetchingStatus === "error" ? (
              <div>{(servicesError as Error)?.message}</div>
            ) : (
              jobposts?.pages.map((page) =>
                page.posts.map((post) => (
                  <div
                    ref={
                      page.posts[page.posts.length - 1]?.id === post.id
                        ? jobpostsRef
                        : undefined
                    }
                    key={post.id}
                  >
                    <PostCard
                      description={post.description}
                      image={
                        "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                      }
                      title={post.title}
                      author={post.author}
                      slug={post.slug}
                      type="post"
                      resolveImageUrl={false}
                      badgeLabel={post.budget ? `$ ${post.budget}` : undefined}
                    />
                  </div>
                ))
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
