"use client";

import Input from "@/components/shared/input";
import { axios } from "@/utils/axios";
import { toast } from "react-hot-toast";
import { ErrorExtactor } from "@/utils/error";
import { useForm } from "@mantine/form";
import Button from "../shared/button";
import { useState } from "react";

type Form = {
  name: string;
  password: string;
  email: string;
  username: string;
};

function RegisterForm() {
  const formState = useForm<Form>({
    initialValues: {
      name: "",
      password: "",
      email: "",
      username: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const onSubmit = (data: typeof formState.values) => {
    const { email, name, password, username } = data;
    setLoading(true);
    axios
      .post("/auth/register", {
        email,
        name: name.trim(),
        password,
        username: username.trim().toLowerCase(),
      })
      .then(({ data }) => {
        console.log(data);
        toast.success("Account created successfully", {
          position: "bottom-right",
        });
        formState.reset();
      })
      .catch((err) => {
        toast.error(ErrorExtactor(err?.response?.data?.message), {
          position: "bottom-right",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center">
      <div className="container">
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a
              href="#"
              className="flex items-center  text-2xl font-semibold text-gray-900 dark:text-white"
            >
              Lend My Skill
            </a>
            <p className="mb-6 text-medium text-lg">
              Create a new freelance account.
            </p>

            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
                </h1>
                <form
                  className="space-y-4 md:space-y-6"
                  onSubmit={formState.onSubmit((d) => onSubmit(d))}
                >
                  <div className="">
                    <div>
                      <Input
                        label="Name"
                        placeholder="John Doe"
                        required
                        {...formState.getInputProps("name")}
                        errorMessage={
                          formState.errors.name ? "Name is required" : undefined
                        }
                      />
                    </div>
                  </div>
                  <div className="">
                    <Input
                      label="Email"
                      type="email"
                      {...formState.getInputProps("email")}
                      placeholder="johdoe@mail.com"
                      required
                      errorMessage={
                        formState.errors.email ? "Email is required" : undefined
                      }
                    />
                  </div>
                  <div>
                    <Input
                      label="Username"
                      placeholder="johndoe123"
                      {...formState.getInputProps("username")}
                      required
                      errorMessage={
                        formState.errors.username
                          ? "Username is required"
                          : undefined
                      }
                    />
                  </div>
                  <div>
                    <Input
                      label="Password"
                      placeholder="••••••••"
                      {...formState.getInputProps("password")}
                      type="password"
                      required
                      errorMessage={
                        formState.errors.password
                          ? "Password is required"
                          : undefined
                      }
                    />
                  </div>

                  <Button type="submit" loading={loading}>
                    Sign in
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default RegisterForm;
