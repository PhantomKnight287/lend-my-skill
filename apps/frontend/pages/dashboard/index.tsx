import { outfit } from "@fonts";
import useHydrateUserContext from "@hooks/hydrate/user";
import clsx from "clsx";
import React, { useEffect, useRef } from "react";
import { MetaTags } from "@components/meta";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { URLBuilder } from "@utils/url";
import { AllGigsResponse } from "~/types/gig";
import { useUser } from "@hooks/user";
import { useIntersection } from "@mantine/hooks";
import { Loader, Title } from "@mantine/core";
import { Posts } from "~/types/jobpost";
import { PostCard } from "@components/card/post";

const Dashboard = () => {
  useHydrateUserContext("replace", true, "/auth/login", true);
  const {
    data: gigs,
    fetchNextPage: fetchMoreGigs,
    hasNextPage: hasMoreGigs,
    isFetchingNextPage: isFetchingMoreGigs,
    error: gigsError,
    status: gigsFetchingStatus,
  } = useInfiniteQuery<AllGigsResponse>({
    queryKey: ["gigs"],
    queryFn: async ({ pageParam = 10 }) => {
      const data = await fetch(URLBuilder(`/gigs?take=${pageParam}`));
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

  const gigsContainer = useRef<HTMLDivElement>(null);
  const jobpostsContainer = useRef<HTMLDivElement>(null);

  const { ref: gigsRef, entry: gigsEntry } = useIntersection({
    root: gigsContainer.current,
    threshold: 0.5,
  });

  const { ref: jobpostsRef, entry: jobpostsEntry } = useIntersection({
    root: jobpostsContainer.current,
    threshold: 0.5,
  });

  useEffect(() => {
    if (gigsEntry?.isIntersecting && hasMoreGigs) {
      fetchMoreGigs();
    }
  }, [gigsEntry?.isIntersecting]);

  useEffect(() => {
    if (jobpostsEntry?.isIntersecting && hasMoreJobposts) {
      fetchMoreJobposts();
    }
  }, [jobpostsEntry?.isIntersecting]);

  return (
    <div
      className={clsx("flex mt-8 p-20", {
        [outfit.className]: true,
      })}
    >
      <MetaTags
        description="An Open Source Freelance Platform For Everyone. "
        title="Lend My Skill"
      />
      <div
        className={clsx("flex gap-3 flex-wrap w-full  ", {
          "flex-col": userType === "client",
          "flex-col-reverse": userType === "freelancer",
        })}
      >
        <div>
          {gigs?.pages?.[0].gigs.length === 0 ? (
            <>
              <Title
                className={clsx("", {
                  [outfit.className]: true,
                })}
                align="center"
              >
                No Gigs Found
              </Title>
            </>
          ) : (
            <Title
              className={clsx("", {
                [outfit.className]: true,
              })}
              align="left"
            >
              Gigs
            </Title>
          )}
          <div
            className="flex flex-row gap-3 flex-nowrap overflow-x-scroll"
            ref={gigsContainer}
          >
            {gigsFetchingStatus === "loading" ? (
              <div className="flex flex-col items-center justify-center">
                <Loader color="green" />
              </div>
            ) : gigsFetchingStatus === "error" ? (
              <div>{(gigsError as Error)?.message}</div>
            ) : (
              gigs?.pages.map((page) =>
                page.gigs.map((gig) => (
                  <div
                    ref={
                      page.gigs[page.gigs.length - 1]?.id === gig.id
                        ? gigsRef
                        : undefined
                    }
                    key={gig.id}
                  >
                    <PostCard
                      description={gig.description}
                      image={gig.bannerImage}
                      title={gig.title}
                      author={gig.freelancer}
                      slug={gig.slug}
                      type="gig"
                      resolveImageUrl
                    />
                  </div>
                ))
              )
            )}
          </div>
        </div>
        <div>
          {jobposts?.pages[0].posts.length === 0 ? (
            <>
              <Title
                className={clsx("", {
                  [outfit.className]: true,
                })}
                align="center"
              >
                No Job Posts Found
              </Title>
            </>
          ) : (
            <Title
              className={clsx("", {
                [outfit.className]: true,
              })}
              align="left"
            >
              Job Posts
            </Title>
          )}
          <div
            className="flex flex-row gap-3 flex-nowrap overflow-x-scroll"
            ref={gigsContainer}
          >
            {gigsFetchingStatus === "loading" ? (
              <div className="flex flex-col items-center justify-center">
                <Loader color="green" />
              </div>
            ) : gigsFetchingStatus === "error" ? (
              <div>{(gigsError as Error)?.message}</div>
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
