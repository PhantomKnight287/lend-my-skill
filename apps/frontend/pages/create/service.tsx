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
  Text,
  TextInput,
  useMantineColorScheme,
  Textarea as T,
  Checkbox,
  ButtonProps,
  Table,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import useHydrateUserContext from "@hooks/hydrate/user";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconPlus,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { uploadFiles } from "@helpers/upload";
import { readCookie } from "@helpers/cookie";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { URLBuilder } from "@utils/url";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useUser } from "@hooks/user";
import { DELIVERY_DAYS } from "~/constants";
import { createService } from "../../services/services.service";
import { AnswerType } from "~/types/answer";
import { Carousel } from "react-responsive-carousel";

type Form = {
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
  tags: string[];
};

function CreateService() {
  const formState = useForm<Form>({
    initialValues: {
      title: "I will ",
      description: "",
      price: "",
      category: "",
      packages: [
        {
          name: "Basic",
          price: 0,
          description: "",
          deliveryDays: 0,
        },
        {
          name: "Standard",
          price: 0,
          description: "",
          deliveryDays: 0,
        },
        {
          name: "Premium",
          price: 0,
          description: "",
          deliveryDays: 0,
        },
      ],
      questions: [
        {
          question: "",
          type: "TEXT",
          required: false,
        },
      ],
      tags: [],
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
  const [tags] = useState<{ value: string; label: string }[]>([]);
  const addNewFeatureFormState = useForm<{ name: string }>({
    initialValues: {
      name: "",
    },
  });
  const { data, refetch } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get(URLBuilder("/categories"));
      return res.data;
    },
  });
  const [features, setFeatures] = useState<
    { name: string; includedIn: string[] }[]
  >([]);
  const [active, setActive] = useState(0);
  const { colorScheme: theme } = useMantineColorScheme();
  const { push } = useRouter();
  useHydrateUserContext("replace", true);
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
          className={clsx("bg-primary hover:bg-primary/90 text-black")}
          {...props}
        >
          {props.children || "Next Step"}
        </Button>
      ),
      []
    );
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [addNewFeatureModal, setAddNewFeatureModal] = useState(false);
  const handleSubmit = async (values: typeof formState.values) => {
    console.log("called");
    const token = readCookie("token");
    if (!token)
      return showNotification({
        title: "Unauthorized",
        message: "Please login to continue",
        color: "red",
        icon: <IconX />,
      });
    setLoadingVisible(true);
    if (values.description.length < 100) {
      setLoadingVisible(false);
      return showNotification({
        title: "Error",
        message: "Description should be atleast 100 characters long",
        color: "red",
        icon: <IconX />,
      });
    }
    if (values.title.length < 20) {
      setLoadingVisible(false);
      return showNotification({
        title: "Error",
        message: "Title should be atleast 20 characters long",
        color: "red",
        icon: <IconX />,
      });
    }
    if (values.title.length > 100) {
      setLoadingVisible(false);
      return showNotification({
        title: "Error",
        message: "Title should be less than 100 characters long",
        color: "red",
        icon: <IconX />,
      });
    }
    if (features.length < 1) {
      setLoadingVisible(false);
      return showNotification({
        title: "Error",
        message: "Please add atleast one feature",
        color: "red",
        icon: <IconX />,
      });
    }
    if (!values.category) {
      setLoadingVisible(false);
      return showNotification({
        title: "Error",
        message: "Please select a category",
        color: "red",
        icon: <IconX />,
      });
    }
    let imagePaths: string[] = [];
    if (images.length > 0) {
      const uploads = await uploadFiles(images, token, "serviceImages").catch(
        (err) => null
      );
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
    createService(
      {
        category: values.category,
        description: values.description,
        features,
        packages: values.packages!.map((p) => ({
          ...p,
          price: Number(p.price),
        })),
        questions: values.questions!,
        tags: values.tags,
        title: values.title,
        images: imagePaths,
      },
      token
    )
      .then((d) => d.data)
      .then((d) => {
        push(`/service/${d.slug}`);
      })
      .catch((err) => {
        console.log(err.response);
      })
      .finally(() => {
        setLoadingVisible(false);
      });
  };

  const {
    data: tagsData,
    isLoading: tagsLoading,
    refetch: tagsRefetch,
  } = useQuery<{ id: string; name: string }[]>({
    queryKey: ["tags"],
    queryFn: async () => {
      const res = await axios.get(URLBuilder("/tags"));
      return res.data;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  });

  return (
    <>
      <MetaTags
        title="Create Service | Lend My Skill"
        description="Create a service to get hired and earn money."
      />
      <LoadingOverlay visible={loadingVisible} />
      <div
        className={clsx("flex justify-center", {
          "h-screen": active != 3,
        })}
      >
        <form
          onSubmit={formState.onSubmit((d) => handleSubmit(d))}
          className="flex flex-1 justify-center h-full items-center"
        >
          <div
            className={clsx(
              "flex flex-col lg:flex-row items-center justify-center flex-1 lg:p-8",
              {
                "flex-row": active != 2,
                "flex-col": active == 2,
              }
            )}
          >
            <div
              className={clsx(
                "flex flex-col items-center justify-center lg:flex-[0.5] flex-1 w-[95%] lg:w-auto mb-0 lg:mb-8",
                {
                  "lg:hidden flex": active > 1,
                }
              )}
            >
              <h1 className={clsx("text-2xl font-bold", outfit.className)}>
                Create a Service
              </h1>
              <p className={clsx("text-center", outfit.className)}>
                Create a service to get hired and earn money.
              </p>
            </div>
            <div
              className={clsx("lg:flex-[0.5] flex-1 w-[95%] lg:w-[unset]", {})}
            >
              <div
                className={clsx({
                  hidden: active !== 0,
                })}
              >
                <TextInput
                  label="Title"
                  required
                  placeholder="Title of your service"
                  {...formState.getInputProps("title")}
                  size="md"
                  classNames={{
                    input: clsx(outfit.className, "border-0", "bg-inputs"),
                  }}
                />
                <div className="flex">
                  <span
                    className={clsx(
                      "ml-auto text-sm text-gray-500",
                      outfit.className,
                      {
                        "text-red-500":
                          formState.values.title.length < 20 ||
                          formState.values.title.length > 100,
                      }
                    )}
                  >
                    {formState.values.title.length}/100
                  </span>
                </div>
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
                            authorization: `Bearer ${readCookie("token")}`,
                          },
                        }
                      )
                      .then((d) => refetch().then(() => setLoading(false)))
                      .catch((err) => {
                        showNotification({
                          color: "red",
                          message:
                            err?.response?.data?.message || "An error occured",
                        });
                        setLoading(false);
                      });
                    return null;
                  }}
                />
                <MultiSelect
                  mt="md"
                  data={
                    tagsData
                      ? tagsData.map((d) => ({
                          value: d.id,
                          label: d.name,
                        }))
                      : []
                  }
                  {...formState.getInputProps("tags")}
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
                    setLoading(true);
                    axios
                      .post(
                        URLBuilder(`/tags/create`),
                        {
                          name: query,
                        },
                        {
                          headers: {
                            authorization: `Bearer ${readCookie("token")}`,
                          },
                        }
                      )
                      .then((d) => tagsRefetch().then(() => setLoading(false)))
                      .catch((err) => {
                        showNotification({
                          color: "red",
                          message:
                            err?.response?.data?.message || "An error occured",
                        });
                      });
                    setLoading(false);
                    return null;
                  }}
                  maxSelectedValues={5}
                  classNames={{
                    input: "focus:outline-none",
                  }}
                />
              </div>
              <div
                className={clsx({
                  hidden: active !== 1,
                })}
              >
                <Textarea
                  {...formState.getInputProps("description")}
                  placeholder="Description of your service(supports markdown)"
                  required
                  classNames={{
                    input: clsx(outfit.className, "border-0", "bg-inputs"),
                  }}
                  labelString="Description"
                  id="description"
                  minRows={10}
                />
              </div>
              <div
                className={clsx({
                  hidden: active !== 2,
                })}
              >
                <h1
                  className={clsx(
                    "text-2xl font-bold my-8 text-center",
                    outfit.className
                  )}
                >
                  Pricing Plans
                </h1>
                <Table
                  horizontalSpacing="xl"
                  verticalSpacing="xs"
                  withBorder
                  withColumnBorders
                >
                  <thead>
                    <tr>
                      <th>Plan Name</th>
                      {formState.values.packages?.map((p, i) => (
                        <th key={i}>
                          <TextInput
                            {...formState.getInputProps(`packages.${i}.name`)}
                            placeholder="Basic"
                            required
                            classNames={{
                              input: clsx(
                                outfit.className,
                                "border-[1px]",
                                "bg-transparent"
                              ),
                            }}
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Description</td>
                      {formState.values.packages?.map((p, i) => (
                        <td key={i}>
                          <T
                            {...formState.getInputProps(
                              `packages.${i}.description`
                            )}
                            placeholder="Description of your service"
                            required
                            rows={10}
                            classNames={{
                              input: clsx(
                                outfit.className,
                                "border-[1px]",
                                "bg-transparent"
                              ),
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Price</td>
                      {formState.values.packages?.map((p, i) => (
                        <td key={i}>
                          <NumberInput
                            {...formState.getInputProps(`packages.${i}.price`)}
                            placeholder="100"
                            required
                            classNames={{
                              input: clsx(
                                outfit.className,
                                "border-[1px]",
                                "bg-transparent"
                              ),
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Features</td>
                      {formState.values.packages?.map((p, i) => (
                        <td key={i}>
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
                                }}
                                className="w-full"
                                label={feature.name}
                              />
                            </div>
                          ))}
                          <Button
                            fullWidth
                            className={clsx(
                              "bg-green-400 hover:bg-green-400/90 text-black"
                            )}
                            onClick={() => {
                              setAddNewFeatureModal(true);
                            }}
                          >
                            <IconPlus />
                          </Button>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Delivery Days</td>
                      {formState.values.packages?.map((p, i) => (
                        <td key={i}>
                          <Select
                            data={
                              DELIVERY_DAYS.map((d) => ({
                                value: d.value,
                                label: d.label,
                              })) as any
                            }
                            {...formState.getInputProps(
                              `packages.${i}.deliveryDays`
                            )}
                            placeholder="Select Delivery Duration"
                            searchable
                            clearable
                            required
                            classNames={{
                              input: clsx(
                                outfit.className,
                                "border-[1px]",
                                "bg-transparent"
                              ),
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div
                className={clsx({
                  hidden: active !== 3,
                })}
              >
                <h1
                  className={clsx(
                    "text-2xl font-bold my-8 text-center",
                    outfit.className
                  )}
                >
                  Images
                </h1>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col gap-4 flex-1 items-center justify-center">
                    <div className="mt-4">
                      {images.length > 0 ? (
                        <div className="container relative max-w-[400px] h-fit bg-inputs">
                          <Carousel
                            autoPlay={false}
                            interval={5000}
                            infiniteLoop
                            showThumbs={false}
                            renderArrowNext={(
                              onClickHandler,
                              hasNext,
                              label
                            ) => (
                              <button
                                type="button"
                                onClick={onClickHandler}
                                title={label}
                                className="absolute top-[45%] right-0 z-10  text-4xl text-white bg-black rounded-full shadow-lg"
                                style={{ padding: "10px" }}
                              >
                                <IconArrowRight />
                              </button>
                            )}
                            renderArrowPrev={(
                              onClickHandler,
                              hasNext,
                              label
                            ) => (
                              <button
                                type="button"
                                onClick={onClickHandler}
                                title={label}
                                className="absolute top-[45%] left-0 z-10  text-4xl text-white bg-black rounded-full shadow-lg"
                                style={{ padding: "10px" }}
                              >
                                <IconArrowLeft />
                              </button>
                            )}
                          >
                            {images.map((i) => (
                              <div
                                key={URL.createObjectURL(i)}
                                className="max-w-[400px] aspect-square "
                              >
                                {i.name.endsWith(".mp4") ? (
                                  <video
                                    src={URL.createObjectURL(i)}
                                    className="cursor-pointer my-6 max-h-[400px] aspect-square"
                                    controls
                                    onClick={() => {
                                      window.open(URL.createObjectURL(i));
                                    }}
                                  />
                                ) : (
                                  <Image
                                    src={URL.createObjectURL(i)}
                                    alt="Image"
                                    className="cursor-pointer  max-w-[400px] aspect-square"
                                    classNames={{
                                      image:
                                        "rounded-md max-w-[400px] aspect-square",
                                    }}
                                    onClick={() => {
                                      window.open(URL.createObjectURL(i));
                                    }}
                                  />
                                )}
                              </div>
                            ))}
                          </Carousel>
                        </div>
                      ) : null}
                    </div>
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
                                Upload Images{" "}
                              </Text>
                              <p className="text-gray-500">
                                These images will be shown as slideshow on your
                                service&apos;s page
                              </p>
                            </div>
                          </Paper>
                        </>
                      )}
                    </FileButton>
                  </div>
                </div>
              </div>
              <Group
                align="center"
                mt="md"
                className="flex flex-row items-center justify-center gap-4"
              >
                <Button
                  disabled={active === 0}
                  onClick={() => setActive((prev) => prev - 1)}
                  variant="outline"
                  color="gray"
                >
                  Back
                </Button>
                {active === 3 ? (
                  <Button
                    variant="filled"
                    type="submit"
                    className={clsx(
                      "bg-primary hover:bg-primary/90 text-black"
                    )}
                  >
                    Create Service
                  </Button>
                ) : (
                  <NextButton
                    onClick={
                      active === 3
                        ? undefined
                        : () => {
                            setActive((prev) => prev + 1);
                          }
                    }
                    type={active === 3 ? "submit" : "button"}
                  >
                    {active === 3 ? "Create Service" : "Next"}
                  </NextButton>
                )}
              </Group>
            </div>
          </div>
        </form>
      </div>
      <Modal
        opened={addNewFeatureModal}
        onClose={() => setAddNewFeatureModal((d) => !d)}
        centered
        title="Add New Feature"
      >
        <div className="p-4">
          <div className="flex flex-row justify-between items-center">
            <form
              onSubmit={addNewFeatureFormState.onSubmit((d) => {
                setFeatures((f) => [...f, { name: d.name, includedIn: [] }]);
                setAddNewFeatureModal(false);
                addNewFeatureFormState.reset();
              })}
              className="flex flex-col gap-4 flex-1"
            >
              <TextInput
                {...addNewFeatureFormState.getInputProps("name")}
                placeholder="Feature Name"
                required
                classNames={{
                  input: clsx(
                    outfit.className,
                    "border-[1px]",
                    "bg-transparent"
                  ),
                }}
              />
              <div className="flex flex-row gap-2 mt-4">
                <Button
                  type="submit"
                  className={clsx(
                    "bg-green-400 hover:bg-green-400/90 text-black"
                  )}
                  fullWidth
                >
                  <IconCheck />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CreateService;
