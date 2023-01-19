import { Button, Loader } from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { URLBuilder } from "@utils/url";
import clsx from "clsx";
import { Fragment, useEffect, useRef } from "react";

interface Props {
  username: string;
  slug: string;
}
interface Type {
  quotations: {
    id: string;
    createdAt: Date;
    description: string;
    price: number;
    freelancer: {
      username: string;
      name: string;
      avatarUrl: string;
      verified: boolean;
    };
  }[];
  next?: number;
}
const Quotations = ({ slug, username }: Props) => {
  const {
    data,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery<Type>({
    queryKey: ["quotations", slug, username],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(`/jobpost/${slug}/${username}/quotations?take=${pageParam}`)
      );
      return await res.json();
      0;
    },
    getNextPageParam: (lastPage, pages) => lastPage.next,
  });

  const baseRef = useRef<HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
    root: baseRef.current,
    threshold: 0.5,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry?.isIntersecting]);

  if (status === "loading")
    return (
      <div className="container">
        <Loader />
      </div>
    );
  if (status === "error")
    return (
      <div className="container">
        <h1>Something went wrong</h1>
      </div>
    );
  return (
    <div className="container" ref={baseRef}>
      {data?.pages.length === 0 ||
        (data?.pages[0].quotations.length === 0 && (
          <div className="container">
            <p className={clsx("text-center ", "text-md", "mt-2")}>
              No Quotations Found
            </p>
          </div>
        ))}
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.quotations.map((quotation) => (
            <div key={quotation.id}>
              <h1>{quotation.freelancer.username}</h1>
            </div>
          ))}
        </Fragment>
      ))}
      <div ref={ref} />
      <div className="flex flex-col items-center justify-center mt-10">
        <Button
          variant="outline"
          color="blue"
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className={clsx("",{
            "cursor-not-allowed": !hasNextPage || isFetchingNextPage,
          })}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load More"
            : "Nothing more to load"}
        </Button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </div>
  );
};

export default Quotations;
