/* eslint-disable @next/next/no-img-element */
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
import { outfit } from "@fonts";
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
      role: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
      confirmPass: (val, values) =>
        val === values.password ? null : "Passwords do not match",
    },
    validateInputOnBlur: true,
  });

  const { colorScheme } = useMantineColorScheme();
  const dispatch = useSetUser();
  const { isReady, replace } = useRouter();
  const { id } = useUser();
  const [loading, setLoading] = useState(false);
  useHydrateUserContext();
  function handleSubmit(values: typeof form.values) {
    setLoading(true);
    const { confirmPass, email, name, password, username, country, role } =
      values;
    console.log(values);
    axios
      .post<RegisterResponse>(URLBuilder(`/auth/register`), {
        confirmPassword: confirmPass,
        email,
        name,
        password,
        username,
        country,
        role,
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
        createCookie("token", d.token);
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
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (id) replace("/dashboard");
  }, [isReady, id]);

  return (
    <>
      <MetaTags
        title="Register | Lend My Skill"
        description="Register to Lend Your Skill to world and start earning money"
      />
      <Container className={clsx("mt-20")} my={40}>
        <h1
          className={clsx("text-center text-3xl font-bold mb-4", {
            [outfit.className]: true,
            "text-white": colorScheme === "dark",
          })}
        >
          Welcome to <br />
          <span className="gradient-text">Lend My Skill</span>
        </h1>

        <Paper radius="md" p="xl" withBorder className="max-w-[500px] mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(form.values);
            }}
          >
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

              <Select
                data={Countries}
                required
                label="Country"
                searchable
                placeholder="Select your country"
                {...form.getInputProps("country")}
                maxDropdownHeight={280}
              />
              <Select
                data={["Freelancer", "Client"]}
                required
                label="Role"
                placeholder="Select your role"
                {...form.getInputProps("role")}
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
                className={clsx(
                  "focus:outline-none bg-primary hover:bg-primary/90 font-medium rounded-lg text-sm px-5  mb-2 text-black",
                  {
                    [outfit.className]: true,
                  }
                )}
                disabled={!form.values.terms || loading}
                loading={loading}
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
