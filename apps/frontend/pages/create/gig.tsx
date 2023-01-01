import { IMAGE_MIME_TYPE } from "@mantine/dropzone";
import Textarea from "@components/input/textarea";
import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import {
  Button,
  Divider,
  FileButton,
  Group,
  Image,
  LoadingOverlay,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stepper,
  Text,
  TextInput,
  Title,
  useMantineColorScheme,
  Textarea as T,
  Checkbox,
  Menu,
  ButtonProps,
  Badge,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import clsx from "clsx";
import React, { useEffect, useMemo, useState } from "react";
import { DatePicker } from "@mantine/dates";
import useHydrateUserContext from "@hooks/hydrate/user";
import {
  IconCheck,
  IconCross,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons";
import { uploadFile, uploadFiles } from "@helpers/upload";
import { readCookie } from "@helpers/cookie";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { URLBuilder } from "@utils/url";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useUser } from "@hooks/user";
import Editor from "@components/editor";
import { DELIVERY_DAYS } from "~/constants";
import { createGig } from "../../services/gigs.service";

export const AnswerType= {
  TEXT: 'TEXT',
  MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
  ATTACHMENT: 'ATTACHMENT'
};


function CreateGig() {
  const formState = useForm<{
    title: string;
    description: string;
    price: string;
    category: string;
    packages?: {
      name: string;
      price: number;
      description: string;
      deliveryDays: number;
    }[];
    questions: {
      question: string;
      type: keyof typeof AnswerType;
      required: boolean;
    }[];
  }>({
    initialValues: {
      title: "I will ",
      description: "",
      price: "",
      category: "",
      packages: [
        {
          name: "Package",
          price: 0,
          description: "",
          deliveryDays: 0,
        },
      ],
      questions: [
        {
          question: "",
          type:"TEXT",
          required: false,
        },
      ],
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
  const [features, setFeatures] = useState<
    { name: string; includedIn: string[] }[]
  >([
    {
      name: "",
      includedIn: [],
    },
  ]);
  const [active, setActive] = useState(0);
  const { colorScheme: theme } = useMantineColorScheme();
  const { username } = useUser();
  const { push, isReady } = useRouter();
  useHydrateUserContext("replace", true);
  const [bannerImage, setBannerImage] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const NextButton = (
    props: import("@mantine/utils").PolymorphicComponentProps<
      "button",
      ButtonProps
    >
  ) =>
    useMemo(
      () => (
        <Button
          onClick={() => setActive((prev) => prev + 1)}
          variant="filled"
          className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
          {...props}
        >
          {props.children || "Next Step"}
        </Button>
      ),
      []
    );
  const [loadingVisible, setLoadingVisible] = useState(false);
  const handleSubmit = async (values: typeof formState.values) => {
    const token = readCookie("token");
    if (!token)
      return showNotification({
        title: "Unauthorized",
        message: "Please login to continue",
        color: "red",
        icon: <IconX />,
      });
    setLoadingVisible(true);

    if (!bannerImage) {
      setLoadingVisible(false);
      return showNotification({
        title: "Banner Image is required",
        message: "Please upload a banner image",
        color: "red",
        icon: <IconX />,
      });
    }
    const upload = await uploadFile(bannerImage, token).catch((err) => null);
    if (upload === null) {
      setLoadingVisible(false);
      return showNotification({
        title: "Error",
        message: "Something went wrong while uploading the banner image",
        color: "red",
        icon: <IconX />,
      });
    }
    const { path: bannerImagePath } = upload.data;
    let imagePaths: string[] = [];
    if (images.length > 0) {
      const uploads = await uploadFiles(images, token).catch((err) => null);
      if (uploads === null) {
        setLoadingVisible(false);
        return showNotification({
          title: "Error",
          message: "Something went wrong while uploading the images",
          color: "red",
          icon: <IconX />,
        });
      }
      imagePaths = uploads.data.paths;
    }
    createGig(
      {
        bannerImage: bannerImagePath,
        category: values.category,
        description: values.description,
        features,
        packages: values.packages!.map((p) => ({
          ...p,
          price: Number(p.price),
        })),
        questions: values.questions!,
        tags: tags.map((tag) => tag.value),
        title: values.title,
        images: imagePaths,
      },
      token
    )
      .then((d) => d.data)
      .then((d) => {
        push(`/profile/${username}/gig/${d.slug}`);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoadingVisible(false);
      });
  };
  return (
    <>
      <MetaTags
        title="Create Gig | Lend My Skill"
        description="Create a gig to get hired and earn money."
      />
      <div className={clsx("flex flex-col p-20")}>
        <LoadingOverlay visible={loadingVisible} />
        <div className="flex flex-row flex-wrap xl:items-center justify-center  gap-4">
          {active === 0 ? (
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
          ) : null}
          <div className={clsx("flex flex-col")}>
            <form
              onSubmit={formState.onSubmit((d) => {
                handleSubmit(d);
              })}
            >
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
                        <NextButton />
                      </Group>
                    </>
                  </Paper>
                </Stepper.Step>
                <Stepper.Step label="Features">
                  <div className="flex flex-col items-center justify-center mt-3   gap-4 w-full">
                    <Text
                      align="center"
                      className={clsx("text-lg font-bold text-center", {
                        [outfit.className]: true,
                      })}
                    >
                      List the features of your Gig.
                    </Text>
                    <div className="mt-5 w-full">
                      {features.map((feature, id) => (
                        <div
                          className="flex flex-row gap-2 w-full my-2"
                          key={id}
                        >
                          <TextInput
                            value={feature.name}
                            onChange={(e) => {
                              setFeatures(
                                features.map((f, index) =>
                                  index === id
                                    ? {
                                        name: e.target.value,
                                        includedIn: f.includedIn,
                                      }
                                    : f
                                )
                              );
                            }}
                            placeholder="Feature"
                            className="w-full"
                          />
                          <Button
                            variant="filled"
                            className="bg-[#e53935] hover:bg-[#d32f2f]"
                            onClick={() => {
                              formState.removeListItem("features", id);
                            }}
                          >
                            <IconX />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-10">
                    <Group position="center">
                      <Button
                        onClick={() => setActive(0)}
                        variant="filled"
                        className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                      >
                        Back
                      </Button>
                      <Button
                        color="purple"
                        className={clsx("bg-purple-600 hover:bg-purple-700")}
                        onClick={() => {
                          setFeatures((f) => [
                            ...f,
                            { name: "", includedIn: [] },
                          ]);
                        }}
                      >
                        Add feature
                      </Button>
                      <Button
                        onClick={() => {
                          if (features.length === 0) {
                            return showNotification({
                              color: "red",
                              message: "You must add at least one feature",
                            });
                          }
                          setActive(2);
                        }}
                        variant="filled"
                        className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                      >
                        Next step
                      </Button>
                    </Group>
                  </div>
                </Stepper.Step>
                <Stepper.Step label="Packages" allowStepSelect={active > 1}>
                  <div className="flex flex-row gap-4 mt-8">
                    <div className="flex flex-col">
                      <Text
                        className={clsx("text-lg font-bold", {
                          [outfit.className]: true,
                          "text-black": theme === "light",
                        })}
                      >
                        Packages
                      </Text>
                      <Button
                        onClick={() => {
                          formState.insertListItem("packages", {
                            name: "Package",
                            price: 0,
                            description: "",
                          });
                        }}
                        disabled={formState.values.packages!.length === 3}
                        variant="filled"
                        className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                      >
                        <IconPlus />
                      </Button>
                    </div>
                    <SimpleGrid
                      cols={
                        formState.values.packages!.length === 1
                          ? 1
                          : formState.values.packages!.length === 2
                          ? 2
                          : 3
                      }
                      className="w-full"
                    >
                      {formState.values.packages?.map((p, index) => (
                        <div
                          className={clsx(
                            "flex flex-col border-l-[1px] w-full border-gray-400 pl-3"
                          )}
                          key={index}
                        >
                          <Text
                            className={clsx("text-sm font-bold text-center", {
                              [outfit.className]: true,
                            })}
                          >
                            {formState.values.packages![index].name}
                          </Text>
                          <TextInput
                            placeholder="Package name"
                            required
                            {...formState.getInputProps(
                              `packages.${index}.name`
                            )}
                          />
                          <Divider className={"my-2"} />
                          <T
                            placeholder="Package description"
                            required
                            {...formState.getInputProps(
                              `packages.${index}.description`
                            )}
                          />
                          <Select
                            label="Delivery Days"
                            {...formState.getInputProps(
                              `packages.${index}.deliveryDays`
                            )}
                            required
                            data={DELIVERY_DAYS}
                            placeholder="Select an Option"
                          />
                          <Text
                            className={clsx(
                              "text-sm font-bold text-center mt-2",
                              {
                                [outfit.className]: true,
                              }
                            )}
                          >
                            Features
                          </Text>
                          {features.map((feature, id) => (
                            <div
                              className="flex flex-row gap-2 w-full my-2"
                              key={id}
                            >
                              <Checkbox
                                checked={feature.includedIn?.includes(p.name)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    if (!feature.includedIn?.includes(p.name)) {
                                      setFeatures((f) =>
                                        f.map((f) =>
                                          f.name === feature.name
                                            ? {
                                                ...f,
                                                includedIn: [
                                                  ...f.includedIn,
                                                  p.name,
                                                ],
                                              }
                                            : f
                                        )
                                      );
                                    }
                                  }
                                  if (!e.target.checked) {
                                    setFeatures((f) =>
                                      f.map((f) =>
                                        f.name === feature.name
                                          ? {
                                              ...f,
                                              includedIn: f.includedIn.filter(
                                                (i) => i !== p.name
                                              ),
                                            }
                                          : f
                                      )
                                    );
                                  }
                                  console.log(feature);
                                }}
                                className="w-full"
                                label={feature.name}
                              />
                            </div>
                          ))}
                          <TextInput
                            placeholder="Price "
                            required
                            label="Price in USD"
                            {...formState.getInputProps(
                              `packages.${index}.price`
                            )}
                            type="number"
                          />
                        </div>
                      ))}
                    </SimpleGrid>
                  </div>
                  <div className="flex flex-row gap-4 items-center justify-center mt-4">
                    <Button
                      onClick={() => setActive(1)}
                      variant="filled"
                      className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => {
                        if (formState.values.packages!.length === 0) {
                          return showNotification({
                            color: "red",
                            message: "You must add at least one package",
                          });
                        }
                        setActive(3);
                      }}
                      variant="filled"
                      className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                    >
                      Next step
                    </Button>
                  </div>
                </Stepper.Step>
                <Stepper.Step label="Description" allowStepSelect={active > 2}>
                  <Editor
                    onSubmit={(d) => {
                      if (d.length < 100) {
                        return showNotification({
                          color: "red",
                          message:
                            "Description must be at least 100 characters long",
                        });
                      }
                      formState.setFieldValue("description", d);
                      setActive((o) => o + 1);
                    }}
                    setActive={setActive}
                  />
                </Stepper.Step>
                <Stepper.Step label="Requirements">
                  <Text
                    align="center"
                    className={clsx("text-lg font-bold", {
                      [outfit.className]: true,
                      "text-black": theme === "light",
                    })}
                  >
                    These questions will be asked to your client before they
                    hire you.
                  </Text>
                  <div className="flex flex-col gap-4 mt-8">
                    {formState.values.questions?.map((q, i) => (
                      <div className="flex flex-row items-center justify-center gap-4" key={i} >
                        <T
                          placeholder="Question"
                          required
                          spellCheck={false}
                          {...formState.getInputProps(
                            `questions.${i}.question`
                          )}
                        />
                        <Select
                          required
                          label="Type"
                          data={[
                            { label: "Text", value: AnswerType.TEXT },
                            {
                              label: "Attachments",
                              value: AnswerType.ATTACHMENT,
                            },
                          ]}
                          {...formState.getInputProps(`questions.${i}.type`)}
                        />
                        <Select
                          label="Required"
                          placeholder="Is this question required?"
                          required
                          data={[
                            { label: "Yes", value: true },
                            { label: "No", value: false },
                          ]}
                          {...formState.getInputProps(
                            `questions.${i}.required`
                          )}
                        />

                        <Button
                          onClick={() => {
                            formState.removeListItem("questions", i);
                          }}
                          variant="filled"
                          className={clsx("bg-red-500 hover:bg-red-500/90")}
                        >
                          <IconTrash />
                        </Button>
                      </div>
                    ))}
                    <Group position="center" className="mt-4">
                      <Button
                        onClick={() => {
                          setActive((o) => o - 1);
                        }}
                        variant="filled"
                        className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                      >
                        Back
                      </Button>

                      <Button
                        onClick={() => {
                          formState.insertListItem("questions", {
                            question: "",
                            type: AnswerType.TEXT,
                          });
                        }}
                        variant="filled"
                        className={clsx(
                          "bg-purple-600 hover:bg-purple-700 max-w-fit"
                        )}
                      >
                        Add question
                      </Button>
                      <Button
                        onClick={() => {
                          setActive((o) => o + 1);
                        }}
                        variant="filled"
                        className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                      >
                        Next Step
                      </Button>
                    </Group>
                  </div>
                </Stepper.Step>
                <Stepper.Step label={"Assets"}>
                  <Text
                    align="center"
                    className={clsx("text-lg font-bold mt-4", {
                      [outfit.className]: true,
                      "text-black": theme === "light",
                    })}
                  >
                    Add some images to your gig to make it more appealing and
                    stand out.
                  </Text>
                  <div className="flex flex-row gap-5 flex-wrap">
                    <FileButton
                      onChange={(d) => {
                        if (d) {
                          if (d.type.includes("image")) {
                            setBannerImage(d);
                          }
                        }
                      }}
                    >
                      {(props) => (
                        <>
                          {bannerImage ? (
                            <div
                              className={clsx(
                                "flex flex-col gap-4 w-full items-center justify-center"
                              )}
                            >
                              <Image
                                className="cursor-pointer rounded-md"
                                src={URL.createObjectURL(bannerImage)}
                                onClick={props.onClick}
                                classNames={{
                                  image: "object-cover  rounded-md",
                                }}
                              />
                              <span
                                className={clsx("text-sm  cursor-pointer", {
                                  [outfit.className]: true,
                                })}
                              >
                                Banner Image
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col w-full items-center mt-4 justify-center">
                              <Paper
                                withBorder
                                p="md"
                                radius="md"
                                mb="md"
                                onClick={props.onClick}
                                className="max-w-fit cursor-pointer"
                              >
                                <div className="flex flex-col items-center justify-center">
                                  <IconUpload className="w-16 h-16 text-gray-500" />
                                  <Text className="text-gray-500">
                                    Upload Banner Image{" "}
                                  </Text>
                                  <p className="text-gray-500">
                                    This image will be shown when client will
                                    search for services.
                                  </p>
                                </div>
                              </Paper>
                            </div>
                          )}
                        </>
                      )}
                    </FileButton>
                  </div>
                  <div className="flex flex-row flex-wrap gap-4">
                    {images.map((i, index) => (
                      <div
                        className="flex flex-col items-center justify-center gap-2"
                        key={index}
                      >
                        <div className="relative">
                          <Image
                            className="cursor-pointer rounded-md"
                            width={100}
                            height={100}
                            src={URL.createObjectURL(i)}
                            onClick={() => {
                              setImages(images.filter((_, i2) => i2 !== index));
                            }}
                            classNames={{
                              image: "object-cover  rounded-md",
                            }}
                          />
                          <div className="absolute top-0 right-0">
                            <Button
                              onClick={() => {
                                setImages(
                                  images.filter((_, i2) => i2 !== index)
                                );
                              }}
                              variant="filled"
                              compact
                              className={clsx(
                                "p-0 rounded-full bg-red-500 hover:bg-red-500/90"
                              )}
                            >
                              <IconX />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center mt-8 w-full">
                      <FileButton
                        onChange={(i) => {
                          setImages((im) => [...im, ...i]);
                        }}
                        multiple
                      >
                        {(props) => (
                          <>
                            <Paper
                              withBorder
                              p="md"
                              radius="md"
                              onClick={props.onClick}
                              className="max-w-fit cursor-pointer"
                            >
                              <div className="flex flex-col items-center justify-center">
                                <IconUpload className="w-16 h-16 text-gray-500" />
                                <Text className="text-gray-500">
                                  Upload Showcase Images{" "}
                                </Text>
                                <p className="text-gray-500">
                                  Showcase images will be shown as slideshow on
                                  your service&apos;s page
                                </p>
                              </div>
                            </Paper>
                          </>
                        )}
                      </FileButton>
                    </div>
                  </div>
                  <Group position="center" mt="md">
                    <Button
                      onClick={() => {
                        setActive((o) => o - 1);
                      }}
                      variant="filled"
                      className={clsx("bg-[#1e88e5] hover:bg-[#1976d2]")}
                    >
                      Back
                    </Button>
                    <NextButton
                      type="submit"
                      className={clsx("bg-green-500 hover:bg-green-500/90")}
                      onClick={() => {
                        const error =
                          formState.errors[Object.keys(formState.errors)[0]];
                        if (error) {
                          showNotification({
                            message: error,
                            color: "red",
                          });
                        }
                      }}
                    >
                      Create
                    </NextButton>
                  </Group>
                </Stepper.Step>
              </Stepper>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateGig;
