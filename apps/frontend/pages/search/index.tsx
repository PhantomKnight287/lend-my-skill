import { PostCard } from "@components/card/post";
import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import useHydrateUserContext from "@hooks/hydrate/user";
import useIssueNewAuthToken from "@hooks/jwt";
import { Button, Select, SimpleGrid, Tabs, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCategory, IconSearch } from "@tabler/icons";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { URLBuilder } from "@utils/url";
import clsx from "clsx";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Search = () => {
  useHydrateUserContext();
  useIssueNewAuthToken();
  const { query, isReady, push } = useRouter();
  const formState = useForm({
    initialValues: {
      search: "",
      category: "",
      type: "",
    },
  });

  useEffect(() => {
    if (!isReady) return;

    formState.setFieldValue("search", query.search as string);
    formState.setFieldValue("type", query.type as string);
    formState.setFieldValue("category", query.category as string);
    formState.resetDirty();
  }, [isReady]);

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch(URLBuilder("/categories"));
      if (!res.ok) throw new Error((await res.json()).message);
      return await res.json();
    },
  });
  const {
    data: querySearchResults,
    isLoading: querySearchResultsLoading,
    error: querySearchResultsError,
    isFetching: querySearchResultsFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchQuerySearchResults,
  } = useInfiniteQuery<{
    data: any;
    next?: number;
    type: "services" | "jobposts";
  }>({
    queryKey: ["search", query.search, query.type],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(
          `/search/${formState.values.category}/${formState.values.type}?take=${pageParam}`
        )
      );
      if (!res.ok) throw new Error((await res.json()).message);
      return await res.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
    enabled: formState.values.category ? query.tab === "category" : false,
  });
  console.log(formState.values);

  const {
    data: searchResults,
    isLoading: searchResultsLoading,
    error: searchResultsError,
    isFetching: searchResultsFetching,
    refetch: refetchSearchResults,
  } = useInfiniteQuery<{
    data: any;
    next?: number;
    type: "services" | "jobposts";
  }>({
    queryKey: ["search", query.search, query.type],
    queryFn: async ({ pageParam = 10 }) => {
      const res = await fetch(
        URLBuilder(
          `/search?query=${formState.values.search}&type=${formState.values.type}&take=${pageParam}`
        )
      );
      if (!res.ok) throw new Error((await res.json()).message);
      return await res.json();
    },
    getNextPageParam: (lastPage) => lastPage.next,
    enabled: formState.values.search ? query.tab === "query" : false,
  });
  return (
    <Container>
      <MetaTags
        title="Search | Lend My Skill"
        description="Search for Talents or Jobs on Lend My Skill"
      />
      <Tabs
        defaultValue={(query.tab as string) || "query"}
        onTabChange={(e) => {
          push({
            pathname: "/search",
            query: {
              ...query,
              tab: e,
            },
          });
        }}
      >
        <Tabs.List grow>
          <Tabs.Tab value="query" icon={<IconSearch size={20} />}>
            Search Using Terms
          </Tabs.Tab>
          <Tabs.Tab value="category" icon={<IconCategory size={20} />}>
            Search Using Categories
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="query" pt="xl">
          <div className="flex flex-col justify-center items-center">
            <form
              onSubmit={formState.onSubmit((d) => {
                refetchSearchResults();
              })}
              className={clsx(
                "w-full flex flex-row gap-3 items-center justify-center flex-wrap"
              )}
            >
              <div className="flex flex-row gap-3 items-center justify-center flex-wrap">
                <TextInput
                  label="Search"
                  placeholder="Search for talents or jobs"
                  name="search"
                  required
                  {...formState.getInputProps("search")}
                />
                <Select
                  data={[
                    {
                      value: "services",
                      label: "Talents",
                    },
                    {
                      value: "jobposts",
                      label: "Jobs",
                    },
                  ]}
                  {...formState.getInputProps("type")}
                  required
                  label="Type"
                  placeholder="Select type"
                  defaultValue={(query.type as string) || "services"}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className={clsx("mt-auto", {
                    [outfit.className]: true,
                  })}
                >
                  Search
                </Button>
              </div>
            </form>
            {searchResultsLoading ? null : (
              <div className="flex flex-col gap-3 items-center justify-center flex-wrap">
                {querySearchResults?.pages.map((page, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 items-center justify-center mt-4 flex-wrap"
                  >
                    <SimpleGrid cols={3} spacing={"xl"} verticalSpacing="xl">
                      {page.data.map((item: any) => (
                        <div
                          className="flex flex-col gap-3 items-center justify-center flex-wrap"
                          key={item.id}
                        >
                          {page.type === "services" ? (
                            <PostCard
                              title={item.title}
                              description={item.description}
                              price={item.price}
                              image={item.bannerImage}
                              author={item.freelancer || item.author}
                              resolveImageUrl
                              slug={item.slug}
                              type="service"
                            />
                          ) : (
                            <PostCard
                              key={item.id}
                              title={item.title}
                              description={item.description}
                              price={item.price}
                              image={
                                "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                              }
                              author={item.author || item.freelancer}
                              resolveImageUrl={false}
                              slug={item.slug}
                              type="post"
                            />
                          )}
                        </div>
                      ))}
                    </SimpleGrid>
                  </div>
                ))}
                <div className="flex flex-row gap-3 items-center mt-8 justify-center flex-wrap">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage}
                    variant="outline"
                    mt="xl"
                    className={clsx("mt-auto", {
                      [outfit.className]: true,
                    })}
                  >
                    {isFetchingNextPage
                      ? "Loading more..."
                      : hasNextPage
                      ? "Load More"
                      : "Nothing more to load"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="category" pt="xl">
          <div className="flex flex-col justify-center items-center">
            <form
              onSubmit={formState.onSubmit((d) => {
                refetchQuerySearchResults();
              })}
              className={clsx(
                "w-full flex flex-row gap-3 items-center justify-center flex-wrap"
              )}
            >
              <div className="flex flex-row gap-3 items-center justify-center flex-wrap">
                {/* show loading when categories are fetched and then show a select menu */}
                {categoriesLoading ? (
                  <div className="flex flex-row gap-3 items-center justify-center flex-wrap">
                    <div className="w-40 h-10 bg-gray-200 animate-pulse"></div>
                    <div className="w-40 h-10 bg-gray-200 animate-pulse"></div>
                  </div>
                ) : (
                  <Select
                    data={categories!.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))}
                    required
                    {...formState.getInputProps("category")}
                    label="Category"
                    placeholder="Select category"
                    defaultValue={(query.category as string) || undefined}
                  />
                )}
                <Select
                  data={[
                    {
                      value: "services",
                      label: "Talents",
                    },
                    {
                      value: "jobposts",
                      label: "Jobs",
                    },
                  ]}
                  required
                  {...formState.getInputProps("type")}
                  label="Type"
                  placeholder="Select type"
                  defaultValue={(query.type as string) || "services"}
                />
                <Button
                  type="submit"
                  variant="outline"
                  className={clsx("mt-auto", {
                    [outfit.className]: true,
                  })}
                >
                  Search
                </Button>
              </div>
            </form>
            {querySearchResultsLoading ? null : (
              <div className="flex flex-col gap-3 items-center justify-center flex-wrap">
                {querySearchResults?.pages.map((page, index) => (
                  <div
                    className="flex flex-col gap-3 items-center justify-center mt-4 flex-wrap"
                    key={index}
                  >
                    <SimpleGrid cols={3} spacing={"xl"} verticalSpacing="xl">
                      {page.data.map((item: any) => (
                        <div
                          className="flex flex-col gap-3 items-center justify-center flex-wrap"
                          key={item.id}
                        >
                          {page.type === "services" ? (
                            <PostCard
                              title={item.title}
                              description={item.description}
                              price={item.price}
                              image={item.bannerImage}
                              author={item.freelancer || item.author}
                              resolveImageUrl
                              slug={item.slug}
                              type="service"
                            />
                          ) : (
                            <PostCard
                              key={item.id}
                              title={item.title}
                              description={item.description}
                              price={item.price}
                              image={
                                "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
                              }
                              author={item.author || item.freelancer}
                              resolveImageUrl={false}
                              slug={item.slug}
                              type="post"
                            />
                          )}
                        </div>
                      ))}
                    </SimpleGrid>
                  </div>
                ))}
                <div className="flex flex-row gap-3 items-center mt-8 justify-center flex-wrap">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage}
                    variant="outline"
                    mt="xl"
                    className={clsx("mt-auto", {
                      [outfit.className]: true,
                    })}
                  >
                    {isFetchingNextPage
                      ? "Loading more..."
                      : hasNextPage
                      ? "Load More"
                      : "Nothing more to load"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default Search;
