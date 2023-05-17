import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Anchor,
  Stack,
  useMantineColorScheme,
  Button,
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
            userType: (d.user as any).role,
          },
        });
        createCookie("token", d.token);
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
        <h1
          className={clsx("text-center text-3xl font-bold mb-4", {
            [outfit.className]: true,
            "text-white": colorScheme === "dark",
          })}
        >
          Welcome <span className="text-center gradient-text">Back!</span>
        </h1>

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

            <div className="flex flex-col justify-center mt-4">
              <Anchor
                component={Link}
                href="/auth/register"
                type="button"
                size="xs"
                className="text-[#3b82f6] hover:underline"
                mb="md"
              >
                Do not have an account? Register
              </Anchor>
              <Button
                type="submit"
                className={clsx(
                  "bg-primary text-black hover:scale-105 duration-[110ms] transition-all hover:bg-primary/90",
                  {
                    [outfit.className]: true,
                  }
                )}
                loading={loading}
              >
                Login
              </Button>
            </div>
          </form>
        </Paper>
      </Container>
    </>
  );
}
