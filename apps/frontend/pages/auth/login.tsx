import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
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
import axios, { isCancel } from "axios";
import { URLBuilder } from "@utils/url";
import { showNotification } from "@mantine/notifications";
import { RegisterResponse } from "~/types/response/register";
import { useSetUser, useUser } from "@hooks/user";
import { createCookie } from "@helpers/cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { profileImageRouteGenerator } from "@utils/profile";

import useHydrateUserContext from "@hooks/hydrate/user";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (val) =>
        !val
          ? "Email can't be empty"
          : /^\S+@\S+$/.test(val)
          ? null
          : "Invalid email",
      password: (val) =>
        val.length <= 8
          ? "Password should include at least 8 characters"
          : null,
    },
    validateInputOnBlur: true,
  });

  const { colorScheme } = useMantineColorScheme();
  const dispatch = useSetUser();
  const { isReady, replace, query } = useRouter();
  const { id } = useUser();
  useHydrateUserContext();
  function handleSubmit(values: typeof form.values) {
    setLoading(true);
    const { email, password } = values;
    axios
      .post<RegisterResponse>(URLBuilder("/auth/login"), {
        email,
        password,
      })
      .then((d) => d.data)
      .then((d) => {
        dispatch({
          type: "SET_USER",
          payload: {
            ...d.user,
            avatarUrl: profileImageRouteGenerator(d.user.username),
          },
        });
        createCookie("token", d.token, 1);
        showNotification({
          message: `Welcome back @${upperFirst(d.user.username)}`,
          color: "green",
        });
        replace((query.to as string) || "/dashboard");
      })
      .catch((err) => {
        if (isCancel(err)) return;
        const error = Array.isArray(err?.response?.data?.message)
          ? err?.response?.data?.message[0]
          : err?.response?.data?.message;
        showNotification({
          message:
            error || err?.response?.data?.message || "Something went wrong",
          color: "red",
        });
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isReady) return;
    if (id) {
      replace((query.to as string) || "/dashboard");
    }
  }, [isReady, id]);

  return (
    <>
      <MetaTags
        title="Login | Lend My Skill"
        description="Login to Lend Your Skill to world and start earning money"
      />
      <Container className={clsx("mt-20")} size={500} my={40}>
        <Text
          size="lg"
          weight={500}
          className={clsx("text-center text-3xl font-bold mb-4", {
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
          <form onSubmit={form.onSubmit((d) => handleSubmit(d))}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="johndoe@mail.com"
                type={"email"}
                {...form.getInputProps("email")}
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                {...form.getInputProps("password")}
              />
            </Stack>

            <Group position="apart" mt="xl">
              <Anchor
                component={Link}
                href="/auth/register"
                type="button"
                size="xs"
                className="text-[#3b82f6] hover:underline"
              >
                Do not have an account? Register
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
                loading={loading}
              >
                Login
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </>
  );
}
