import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Checkbox,
  Anchor,
  Stack,
  useMantineColorScheme,
  Select,
} from "@mantine/core";
import { Container } from "@components/container";
import clsx from "clsx";
import { MetaTags } from "@components/meta";
import { outfit, spaceGrotest } from "@fonts";
import Link from "next/link";
import axios from "axios";
import { URLBuilder } from "@utils/url";
import { showNotification } from "@mantine/notifications";
import { RegisterResponse } from "~/types/response/register";
import { useSetUser, useUser } from "@hooks/user";
import { createCookie } from "@helpers/cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { profileImageRouteGenerator } from "@utils/profile";
import { Countries } from "~/constants";
import useHydrateUserContext from "@hooks/hydrate/user";

export default function Register() {
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
      username: "",
      confirmPass: "",
      country: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
      username: (val) =>
        val.length >= 8 ? null : "Username must be at least 8 characters long",
      confirmPass: (val, values) =>
        val === values.password ? null : "Passwords do not match",
    },
    validateInputOnBlur: true,
  });

  const { colorScheme } = useMantineColorScheme();
  const dispatch = useSetUser();
  const { isReady, replace } = useRouter();
  const { id } = useUser();
  const [userType, setUserType] = useState<"client" | "freelancer" | "">("");
  const [checked, setChecked] = useState<"client" | "freelancer" | "">("");
  useHydrateUserContext();
  function handleSubmit(values: typeof form.values) {
    const { confirmPass, email, name, password, username, country } = values;
    axios
      .post<RegisterResponse>(URLBuilder(`/${userType}/auth/register`), {
        confirmPassword: confirmPass,
        email,
        name,
        password,
        username,
        country,
      })
      .then((d) => d.data)
      .then((d) => {
        dispatch({
          type: "SET_USER",
          payload: {
            ...d.user,
            avatarUrl: profileImageRouteGenerator(d.user.username),
            userType: userType as "client" | "freelancer",
          },
        });
        createCookie("token", d.tokens.auth, 1);
        createCookie("refreshToken", d.tokens.refresh, 7);
        showNotification({
          message: "Successfully Registered",
          color: "green",
        });
        replace("/dashboard");
      })
      .catch((err) => {
        const error = err?.response?.data?.errors?.[0].message;
        showNotification({
          message:
            error || err?.response?.data?.message || "Something went wrong",
          color: "red",
        });
      });
  }

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (id) replace("/dashboard");
  }, [isReady,id]);

  if (!userType)
    return (
      <Container className={clsx("mt-20")} my={40}>
        <MetaTags
          title="Register | Lend My Skill"
          description="Register to Lend Your Skill to world and start earning money"
        />
        <Text
          size="lg"
          weight={500}
          className={clsx("text-center text-2xl font-bold mb-4", {
            [outfit.className]: true,
            "text-white": colorScheme === "dark",
          })}
        >
          Join as a <br />
          <span className="text-center bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] bg-clip-text text-transparent">
            Client
          </span>{" "}
          or{" "}
          <span className="text-center bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] bg-clip-text text-transparent">
            Freelancer
          </span>
        </Text>

        <Paper radius="md" p="xl" withBorder>
          <Group position="center" className="flex flex-col gap-4 flex-wrap">
            <div className="flex flex-row gap-4 items-center justify-center flex-wrap">
              <Paper
                radius={"md"}
                withBorder
                p="xl"
                className={clsx(
                  "hover:border-[1px] cursor-pointer text-lg hover:border-pink-400",
                  {
                    [outfit.className]: true,
                    "text-white": colorScheme === "dark",
                    "border-[1px] border-pink-400": checked === "client",
                  }
                )}
                onClick={() => {
                  setChecked("client");
                }}
              >
                <img src="/icons/customer-50.png" alt="client" />I am a Client,
                I want to hire a freelancer
              </Paper>
              <Paper
                radius={"md"}
                withBorder
                p="xl"
                className={clsx(
                  "hover:border-[1px] cursor-pointer text-lg hover:border-pink-400",
                  {
                    [outfit.className]: true,
                    "text-white": colorScheme === "dark",
                    "border-[1px] border-pink-400": checked === "freelancer",
                  }
                )}
                onClick={() => {
                  setChecked("freelancer");
                }}
              >
                <img src="/icons/freelancer-50.png" alt="freelancer" />I am a
                Freelancer, I want to work for clients
              </Paper>
            </div>
            <Button
              variant="filled"
              className={clsx("bg-pink-400 hover:bg-pink-500")}
              onClick={() => {
                setUserType(checked);
              }}
            >
              Confirm
            </Button>
          </Group>
        </Paper>
      </Container>
    );

  if (userType === "client" || userType === "freelancer")
    return (
      <>
        <MetaTags
          title="Register | Lend My Skill"
          description="Register to Lend Your Skill to world and start earning money"
        />
        <Container className={clsx("mt-20")} my={40}>
          <Text
            size="lg"
            weight={500}
            className={clsx("text-center text-2xl font-bold mb-4", {
              [outfit.className]: true,
              "text-white": colorScheme === "dark",
            })}
          >
            Welcome to <br />
            <span className="text-center bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] bg-clip-text text-transparent">
              Lend My Skill
            </span>
          </Text>

          <Paper radius="md" p="xl" withBorder>
            <Text
              className={clsx("text-center text-2xl font-bold mb-4", {
                [outfit.className]: true,
                "text-white": colorScheme === "dark",
              })}
            >
              {userType === "client"
                ? "Sign Up to Hire Freelancers"
                : "Sign Up to Start Earning Money"}
            </Text>
            <form onSubmit={form.onSubmit((d) => handleSubmit(d))}>
              <Stack>
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  required
                  {...form.getInputProps("name")}
                />

                <TextInput
                  required
                  label="Email"
                  placeholder="johndoe@mail.com"
                  type={"email"}
                  {...form.getInputProps("email")}
                />

                <TextInput
                  required
                  label="Username"
                  placeholder="johndoe123"
                  {...form.getInputProps("username")}
                />

                <PasswordInput
                  required
                  label="Password"
                  placeholder="Your password"
                  {...form.getInputProps("password")}
                />
                <PasswordInput
                  required
                  label="Confirm Password"
                  placeholder="Your password"
                  {...form.getInputProps("confirmPass")}
                />
                <Select
                  data={Countries}
                  required
                  label="Country"
                  searchable
                  placeholder="Select your country"
                  {...form.getInputProps("country")}
                  maxDropdownHeight={280}
                />

                <Checkbox
                  label={
                    <>
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className={"text-[#3b82f6] hover:underline"}
                      >
                        Terms and Conditions
                      </Link>
                    </>
                  }
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                />
              </Stack>

              <Group position="apart" mt="xl">
                <Anchor
                  component={Link}
                  href="/auth/login"
                  type="button"
                  size="xs"
                  className="text-[#3b82f6] hover:underline"
                >
                  Already have an account? Login
                </Anchor>
                <Button
                  type="submit"
                  fullWidth
                  color="black"
                  className={clsx("", {
                    [outfit.className]: true,
                    "bg-gray-900 hover:bg-black": colorScheme === "light",
                    "bg-gradient-to-r from-[#3b82f6] to-[#2dd4bf] text-white":
                      colorScheme === "dark",
                  })}
                  disabled={!form.values.terms}
                >
                  Register
                </Button>
              </Group>
            </form>
          </Paper>
        </Container>
      </>
    );
}
