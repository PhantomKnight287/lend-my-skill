import { Container } from "@components/container";
import { MetaTags } from "@components/meta";
import { SettingsSidebar } from "@components/sidebars/settings";
import { outfit } from "@fonts";
import { readCookie } from "@helpers/cookie";
import { uploadFiles } from "@helpers/upload";
import useHydrateUserContext from "@hooks/hydrate/user";
import { useUser } from "@hooks/user";
import {
  Avatar,
  Button,
  FileButton,
  Group,
  Loader,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Tabs,
  Textarea,
  TextInput,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconUsers } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import { profileImageRouteGenerator } from "@utils/profile";
import { assetURLBuilder, URLBuilder } from "@utils/url";
import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Countries } from "~/constants";

function Settings() {
  useHydrateUserContext("replace", true, "/auth/login");
  const [activeTab, setActiveTab] = useState("account");
  const { push, query, isReady } = useRouter();
  const { username } = useUser();
  const { data, error, refetch, isLoading } = useQuery<{
    bio: string;
    aboutMe: string;
    country: string;
    avatarUrl: string;
  }>({
    queryKey: ["account"],
    queryFn: async () => {
      return await fetch(URLBuilder(`/profile/${username}/authenticated`), {
        headers: {
          authorization: `Bearer ${readCookie("token")}`,
        },
      }).then((res) => res.json());
    },
    refetchInterval: false,
    enabled: isReady,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  const formState = useForm({
    initialValues: {
      bio: "",
      aboutMe: "",
      country: "",
      avatarUrl: "",
      imageSelected: false,
    },
  });

  const [avatar, setAvatar] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (!isLoading) {
      formState.setValues({
        bio: data!.bio,
        aboutMe: data!.aboutMe,
        country: data!.country,
        avatarUrl: data!.avatarUrl,
      });
      formState.resetDirty();
    }
  }, [data, isLoading]);

  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex flex-row ">
      <MetaTags description="Settings" title="Settings" />
      <aside>
        <SettingsSidebar setActiveTab={setActiveTab} />
      </aside>
      <div className="mt-20 px-4 flex-1">
        <Tabs
          classNames={{
            tabsList: "hidden",
          }}
          value={(query.activeTab as string) || "account"}
          onTabChange={(value) => push(`/settings?activeTab=${value}`)}
        >
          <Tabs.List>
            <Tabs.Tab value="account" icon={<IconUsers />}>
              Accounts
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="account">
            <Container
              className={clsx("", {
                [outfit.className]: true,
              })}
            >
              <LoadingOverlay visible={isLoading} overlayBlur={2} />
              {isLoading ? (
                <Loader />
              ) : error ? (
                <div>error</div>
              ) : (
                <>
                  {data ? (
                    <div className="flex flex-col items-center justify-center">
                      <FileButton
                        onChange={(d) => {
                          if (d) {
                            setAvatar(d);
                            formState.setFieldValue("imageSelected", true);
                          }
                        }}
                      >
                        {(props) => (
                          <Avatar
                            src={
                              formState.values.imageSelected && avatar
                                ? URL.createObjectURL(avatar)
                                : formState.values.avatarUrl
                                ? assetURLBuilder(formState.values.avatarUrl)
                                : profileImageRouteGenerator(username)
                            }
                            size={150}
                            className={clsx("cursor-pointer")}
                            radius={"50%" as any}
                            onClick={props.onClick}
                          />
                        )}
                      </FileButton>
                      <span
                        className={clsx("text-md leading-[18px] mt-3", {
                          "text-gray-500": colorScheme === "dark",
                          "text-[#666666]": colorScheme === "light",
                        })}
                      >
                        @{username}
                      </span>
                      <form
                        onSubmit={formState.onSubmit(async (d) => {
                          setLoading(true);
                          let url: string | undefined = undefined;
                          if (avatar) {
                            const urls = await uploadFiles(
                              [avatar],
                              readCookie("token")!
                            ).catch((err) => {
                              showNotification({
                                message:
                                  err?.response?.data?.message ||
                                  "Something went wrong",
                                color: "red",
                              });
                              return null;
                            });
                            if (urls === null) return;
                            url = urls.data.paths[0];
                          }

                          axios
                            .post(
                              URLBuilder("/profile/update"),
                              {
                                bio: d.bio || undefined,
                                aboutMe: d.aboutMe || undefined,
                                country: d.country || undefined,
                                avatarUrl: url || d.avatarUrl || undefined,
                              },
                              {
                                headers: {
                                  authorization: `Bearer ${readCookie(
                                    "token"
                                  )}`,
                                },
                              }
                            )
                            .then(() => {
                              showNotification({
                                message: "Profile updated",
                                color: "green",
                              });
                              formState.resetDirty();
                            })
                            .catch((err) => {
                              showNotification({
                                message:
                                  err?.response?.data?.message ||
                                  "Something went wrong",
                                color: "red",
                              });
                              return null;
                            })
                            .finally(() => {
                              setLoading(false);
                            });
                        })}
                        className={clsx("w-full")}
                      >
                        <SimpleGrid cols={2}>
                          <TextInput
                            label="Bio"
                            placeholder="Bio"
                            {...formState.getInputProps("bio")}
                            labelProps={{
                              className: clsx({
                                [outfit.className]: true,
                              }),
                            }}
                            classNames={{
                              input: clsx("h-[44px]"),
                            }}
                          />
                          <Select
                            data={Countries}
                            label="Country"
                            labelProps={{
                              className: clsx({
                                [outfit.className]: true,
                              }),
                            }}
                            placeholder="Country"
                            {...formState.getInputProps("country")}
                          />
                        </SimpleGrid>
                        <Textarea
                          label="About me"
                          placeholder="About me"
                          {...formState.getInputProps("aboutMe")}
                          labelProps={{
                            className: clsx({
                              [outfit.className]: true,
                            }),
                          }}
                          autosize
                        />
                        {formState.isDirty() || avatar != undefined ? (
                          <>
                            <Group position="center">
                              <Button
                                type="submit"
                                mt="md"
                                color="black"
                                className={clsx("", {
                                  [outfit.className]: true,
                                  "bg-gray-900 hover:bg-black":
                                    colorScheme === "light",
                                  "bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] text-white":
                                    colorScheme === "dark",
                                })}
                                loading={loading}
                              >
                                Update
                              </Button>
                            </Group>
                          </>
                        ) : null}
                      </form>
                    </div>
                  ) : null}
                </>
              )}
            </Container>
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}

export default Settings;
