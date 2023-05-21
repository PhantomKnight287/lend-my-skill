import { PostCard } from "@components/card/post";
import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import useHydrateUserContext from "@hooks/hydrate/user";
import {
  Button,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { useIntersection } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { URLBuilder } from "@utils/url";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { JobPost } from "~/types/jobpost";
import { Service } from "~/types/service";

function SearchUsingCategory() {
  const [query, setQuery] = useState<string>("");
  const [type, setType] = useState<"Job" | "Service">("Job");
  const [category, setCategory] = useState<string>("");
  const { data: categories, isFetching: categoriesFetching } = useQuery<
    { id: string; name: string; slug: string }[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(URLBuilder("/categories")).catch((err) => {
        console.log(err.response.data);
        return null;
      });
      if (!res) return null;
      return res.data;
    },
  });
  useHydrateUserContext();
  const { data, isFetching, hasNextPage, fetchNextPage, refetch } =
    useInfiniteQuery<{
      services: Service[];
      next?: number;
      jobs: JobPost[];
    }>({
      queryKey: ["search", type, query, category],
      enabled: false,
      getNextPageParam: (l, _) => l?.next,
      queryFn: async ({ pageParam = 10, signal }) => {
        const data = await axios
          .get(
            URLBuilder(
              `/search/category/${category}?take=${pageParam}&type=${type}&q=${query}`
            ),
            { signal }
          )
          .catch((err) => {
            console.log(err.response.data);
            return null;
          });
        if (!data) return null;
        return data.data;
      },
    });
  const containerRef = useRef<HTMLDivElement>(null);
  const { entry, ref } = useIntersection({
    root: containerRef.current,
    threshold: 0.5,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) fetchNextPage();
  }, [entry?.isIntersecting]);
  return (
    <>
      <MetaTags
        title="Search"
        description="Seach for Jobs and Services using Category"
      />
      <Container>
        {categoriesFetching ? (
          <div className="flex flex-col items-center justify-center">
            <Loader variant="oval" color="green" />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              refetch();
            }}
          >
            <Group position="center">
              <TextInput
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                required
                label="Search For"
                placeholder="react"
              />
              <Select
                data={["Job", "Service"]}
                defaultValue={type}
                label="Select Type"
                required
                onChange={(e) => {
                  if (e) {
                    setType(e as any);
                  }
                }}
              />
              {categories ? (
                <Select
                  data={categories.map((d) => ({
                    label: d.name,
                    value: d.slug,
                  }))}
                  searchable
                  defaultValue={category}
                  label="Select Category"
                  required
                  onChange={(e) => {
                    if (e) {
                      setCategory(e);
                    }
                  }}
                />
              ) : null}
            </Group>
            <div className="flex flex-col items-center mt-5 mb-10 justify-center">
              <Button
                type="submit"
                leftIcon={<IconSearch size={20} />}
                className={clsx(
                  "transition-all duration-[110ms] hover:scale-105 hover:bg-primary/90 bg-primary",
                  outfit.className
                )}
              >
                Search
              </Button>
            </div>
          </form>
        )}
        <div ref={containerRef}>
          {isFetching ? (
            <div className="flex flex-col items-center justify-center my-6">
              <Loader variant="oval" color="green" />
            </div>
          ) : (
            <>
              {data?.pages?.map((page, i) => (
                <Fragment key={i}>
                  {type === "Job"
                    ? page.jobs?.map((j) => (
                        <SimpleGrid
                          key={j.id}
                          cols={3}
                          verticalSpacing="lg"
                          breakpoints={[
                            { maxWidth: 980, cols: 3, spacing: "md" },
                            { maxWidth: 755, cols: 2, spacing: "sm" },
                            { maxWidth: 600, cols: 1, spacing: "sm" },
                          ]}
                        >
                          <PostCard
                            description={j.description}
                            images={j.images}
                            title={j.title}
                            slug={j.slug}
                            type="job"
                            resolveImageUrl={false}
                            badgeLabel={
                              j.budget ? `$ ${j.budget}` : `No Budget`
                            }
                          />
                        </SimpleGrid>
                      ))
                    : page.services?.map((s) => (
                        <SimpleGrid
                          key={s.id}
                          cols={3}
                          verticalSpacing="lg"
                          breakpoints={[
                            { maxWidth: 980, cols: 3, spacing: "md" },
                            { maxWidth: 755, cols: 2, spacing: "sm" },
                            { maxWidth: 600, cols: 1, spacing: "sm" },
                          ]}
                        >
                          <PostCard
                            description={s.description}
                            images={s.images}
                            title={s.title}
                            slug={s.slug}
                            type="service"
                            resolveImageUrl={true}
                          />
                        </SimpleGrid>
                      ))}
                </Fragment>
              ))}
            </>
          )}
          {(data?.pages?.[0]?.jobs || data?.pages?.[0]?.services)?.length ===
          0 ? (
            <div className="mt-20 flex flex-col items-center justify-center">
              <Text className={clsx(outfit.className, "text-center")}>
                No Search Results Found
              </Text>
              <Text
                className={clsx(
                  outfit.className,
                  "text-center",
                  "text-2xl font-bold",
                  "mt-10"
                )}
              >
                Looking for Something Else?
              </Text>
              <div className="flex flex-row flex-wrap mt-5 gap-10 items-center justify-center">
                <Link
                  href="/search/category"
                  className="underline text-blue-500 "
                >
                  Search Using Category
                </Link>
                <Link href="/search/tags" className="underline text-blue-500 ">
                  Search Using Tags
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </Container>
    </>
  );
}

export default SearchUsingCategory;
