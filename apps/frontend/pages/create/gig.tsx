import { Container } from "@components/container";
import Textarea from "@components/input/textarea";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import {
  Button,
  FileButton,
  Group,
  Image,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stepper,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import clsx from "clsx";
import React, { useState } from "react";
import { DatePicker } from "@mantine/dates";
import useHydrateUserContext from "@hooks/hydrate/user";
import { IconCheck, IconCross, IconX } from "@tabler/icons";
import { uploadFiles } from "@helpers/upload";
import { readCookie } from "@helpers/cookie";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { URLBuilder } from "@utils/url";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useUser } from "@hooks/user";

function CreateJobPost() {
  const formState = useForm({
    initialValues: {
      title: "I will ",
      description: "",
      price: "",
      category: "",
    },
    validateInputOnBlur: true,
    validate: {
      title: (value) =>
        value.length < 20
          ? "Title should be atleast 20 characters long"
          : value.length > 100
          ? "Title should be less than 100 characters long"
          : null,
      description: (value) =>
        value.length < 100
          ? "Description should be atleast 100 characters long"
          : value.length > 1000
          ? "Description should be less than 1000 characters long"
          : null,
      price: (value) =>
        !value
          ? null
          : Number(value) < 100
          ? "Price should be atleast 100"
          : null,
    },
  });
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const { data, refetch } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(URLBuilder("/categories"));
      return res.data;
    },
  });
  const [files, setFiles] = useState<File[]>([]);
  const [active, setActive] = useState(0);
  const { colorScheme: theme } = useMantineColorScheme();
  const [deadline, setDeadline] = useState<Date>();
  const { username } = useUser();
  const { push } = useRouter();
  useHydrateUserContext();
  const nextStep = () =>
    setActive((current) => (current < 1 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: typeof formState.values) => {
    const { category, description, price, title } = data;
    const token = readCookie("token");
    if (!token)
      return showNotification({
        message: "Session Expired. Please login again.",
        color: "red",
      });
    setLoading(true);
    let urls: string[] = [];
    if (files.length > 0) {
      const data = await uploadFiles(files, token).catch((err) => {
        showNotification({
          message: err?.response?.data?.message || "Something went wrong",
          color: "red",
        });
        setLoading(false);
        return null;
      });
      if (data === null) return;
      urls = data.data.paths;
    }
    await axios
      .post(
        URLBuilder("/jobpost/create"),
        {
          title,
          description,
          price: Number(price),
          category,
          tags: tags.map((t) => t.label),
          images: urls.length > 0 ? urls : undefined,
          deadline: (deadline as unknown as Date)?.toISOString(),
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      )
      .then((d) => d.data)
      .then((d) => {
        showNotification({
          message: "Gig Created Successfully",
          color: "green",
        });
        return push(`/profile/${username}/post/${d.slug}`);
      })
      .catch((err) => {
        showNotification({
          message: err?.response?.data?.message || "Something went wrong",
          color: "red",
        });
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <MetaTags
        title="Create Gig | Lend My Skill"
        description="Create a gig to get hired and earn money."
      />
      <div className={clsx("flex flex-col p-20")}>
        <div className="flex flex-row flex-wrap xl:items-center justify-center  gap-4">
          <div className={clsx("mr-20")}>
            <Title
              order={1}
              className={clsx("text-center", {
                [outfit.className]: true,
              })}
            >
              Let&apos;s Create A Gig!
            </Title>
            <Text
              className={clsx("text-lg font-bold ", {
                [outfit.className]: true,
              })}
            >
              We&apos;ll try to find buyers for your gig.
            </Text>
          </div>
          <div className={clsx("flex flex-col")}>
            <form onSubmit={formState.onSubmit((d) => handleSubmit(d))}>
              <Stepper
                active={active}
                color="green"
                onStepClick={setActive}
                breakpoint="sm"
                classNames={{
                  stepLabel: clsx("", {
                    [outfit.className]: true,
                  }),
                  stepDescription: clsx("", {
                    [outfit.className]: true,
                  }),
                }}
                completedIcon={<IconCheck />}
              >
                <Stepper.Step label="Overview" allowStepSelect={active > 0}>
                  <Paper radius={"md"} p="xl" className={clsx("max-w-3xl ")}>
                    <>
                      <div>
                        <Textarea
                          required
                          id="title"
                          labelString="Title"
                          placeholder="Enter the title of your job post"
                          labelProps={{
                            className: clsx({
                              [outfit.className]: true,
                            }),
                          }}
                          {...formState.getInputProps("title")}
                          classNames={{
                            input: clsx("border-0", {}),
                          }}
                          minLength={20}
                          maxLength={1000}
                          wordsComponent={
                            <span
                              className={clsx("text-sm ml-auto pr-3 my-2", {
                                "text-[#6c757d]":
                                  formState.values.title.length < 20,
                                "text-[#28a745]":
                                  formState.values.title.length >= 20 &&
                                  formState.values.title.length < 1000,
                              })}
                            >
                              {formState.values.title.length}/1000
                            </span>
                          }
                        />
                      </div>
                      <div>
                        <Textarea
                          required
                          id="description"
                          labelString="Description"
                          placeholder="Enter the description of your job post"
                          labelProps={{
                            className: clsx({
                              [outfit.className]: true,
                            }),
                          }}
                          {...formState.getInputProps("description")}
                          classNames={{
                            input: clsx("border-0", {}),
                          }}
                          minLength={20}
                          maxLength={1000}
                          wordsComponent={
                            <div className="flex flex-col">
                              <span
                                className={clsx("text-sm ml-auto pr-3 my-2", {
                                  "text-[#6c757d]":
                                    formState.values.description.length < 100,
                                  "text-[#28a745]":
                                    formState.values.description.length >=
                                      100 &&
                                    formState.values.description.length < 1000,
                                })}
                              >
                                {formState.values.description.length}/1000
                              </span>
                              {files.length > 0 ? (
                                <div className="flex flex-row flex-wrap gap-2 m-2">
                                  {files.map((image) => (
                                    <div className="relative" key={image.name}>
                                      <Image
                                        src={URL.createObjectURL(image)}
                                        alt="image"
                                        width={100}
                                        height={100}
                                        className={clsx("rounded-md")}
                                      />
                                      <div
                                        className={clsx(
                                          "absolute top-0 right-0 bg-[#e53935] rounded-full cursor-pointer"
                                        )}
                                        onClick={() => {
                                          setFiles((prev) =>
                                            prev.filter(
                                              (prevImage) => prevImage !== image
                                            )
                                          );
                                        }}
                                      >
                                        <IconX className={clsx("text-white")} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : null}
                            </div>
                          }
                        />
                      </div>
                      <FileButton
                        onChange={(d) => {
                          if (!d) return;

                          setFiles((o) => [...o, d]);
                        }}
                        accept="image/png,image/jpeg"
                      >
                        {(props) => (
                          <Button
                            disabled={files.length >= 5}
                            {...props}
                            className={clsx(
                              "bg-[#1e88e5] hover:bg-[#1976d2] mt-4",
                              {
                                [outfit.className]: true,
                              }
                            )}
                          >
                            Attach Files
                          </Button>
                        )}
                      </FileButton>

                      <div>
                        <LoadingOverlay overlayBlur={2} visible={loading} />

                        <Select
                          mt="md"
                          data={
                            data
                              ? data?.map((d) => ({
                                  value: d.id,
                                  label: d.name,
                                }))
                              : []
                          }
                          {...formState.getInputProps("category")}
                          label="Category"
                          placeholder="Select a category"
                          searchable
                          clearable
                          required
                          creatable
                          getCreateLabel={(query) => `Create "${query}"`}
                          labelProps={{
                            className: clsx("text-sm font-bold ", {
                              [outfit.className]: true,
                              "text-[#495057]": theme === "light",
                            }),
                          }}
                          onCreate={(query) => {
                            setLoading(true);
                            axios
                              .post(
                                URLBuilder(`/categories/create`),
                                {
                                  name: query,
                                },
                                {
                                  headers: {
                                    authorization: `Bearer ${readCookie(
                                      "token"
                                    )}`,
                                  },
                                }
                              )
                              .then((d) =>
                                refetch().then(() => setLoading(false))
                              )
                              .catch((err) => {
                                console.log(err);
                                showNotification({
                                  color: "red",
                                  message:
                                    err?.response?.data?.message ||
                                    "An error occured",
                                });
                                setLoading(false);
                              });
                          }}
                        />
                      </div>
                      <MultiSelect
                        mt="md"
                        data={tags}
                        label="Tags"
                        labelProps={{
                          className: clsx("text-sm font-bold ", {
                            [outfit.className]: true,
                            "text-[#495057]": theme === "light",
                          }),
                        }}
                        placeholder="Enter tags"
                        searchable
                        clearable
                        creatable={tags.length < 5}
                        getCreateLabel={(query) => `+ Create ${query}`}
                        onCreate={(query) => {
                          const item = { value: query, label: query };
                          setTags((current) => [...current, item]);
                          return item;
                        }}
                        maxSelectedValues={5}
                      />
                      <Group position="center" mt="xl">
                        <Button variant="default" disabled>
                          Back
                        </Button>
                        <Button
                          onClick={() => setActive(1)}
                          variant="filled"
                          className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                        >
                          Next step
                        </Button>
                      </Group>
                    </>
                  </Paper>
                </Stepper.Step>
                <Stepper.Step label="Pricing" allowStepSelect={active > 1}>
                  Lorem, ipsum.
                </Stepper.Step>
                <Stepper.Step label="Description" allowStepSelect={active > 2}>
                  <Paper
                    radius={"md"}
                    p="xl"
                    className={clsx("max-w-3xl lg:min-w-[30vw]")}
                  >
                    <>
                      <Text
                        className={clsx(
                          "text-sm font-bold text-[#495057] py-2",
                          {
                            [outfit.className]: true,
                          }
                        )}
                      >
                        Deadline(optional)
                      </Text>
                      <DatePicker
                        onChange={(d) => {
                          if (d) setDeadline(d);
                        }}
                        value={deadline}
                        excludeDate={(date) =>
                          date.getMonth() < new Date().getMonth() &&
                          date.getFullYear() <= new Date().getFullYear()
                        }
                      />
                      <Text
                        className={clsx(
                          "text-sm font-bold text-[#495057] py-2 mt-5",
                          {
                            [outfit.className]: true,
                          }
                        )}
                      >
                        Budget(optional)
                      </Text>
                      <NumberInput
                        {...formState.getInputProps("price")}
                        labelProps={{
                          className: clsx({
                            [outfit.className]: true,
                          }),
                        }}
                        min={1}
                        icon={"$"}
                      />
                      <Group position="center" mt="xl">
                        <Button
                          variant="default"
                          loading={loading}
                          onClick={prevStep}
                        >
                          Back
                        </Button>
                        <Button
                          type={"submit"}
                          variant="filled"
                          loading={loading}
                          className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                        >
                          Next step
                        </Button>
                      </Group>
                    </>
                  </Paper>
                </Stepper.Step>
                <Stepper.Step label="Requirements">Lorem, ipsum.</Stepper.Step>
                <Stepper.Step label={"Assets"}>Lorem, ipsum.</Stepper.Step>
                <Stepper.Step label="Review">Lorem, ipsum.</Stepper.Step>
              </Stepper>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateJobPost;
