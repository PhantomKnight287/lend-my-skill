import { PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

function FirstForm() {
  const formState = useForm({
    initialValues: {
      email: "",
      password: "",
      passwordConfirm: "",
      username: "",
      name: "",
    },
    validateInputOnBlur: true,
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value, values) =>
        value != values.passwordConfirm ? "Passwords do not match" : null,
      username: (value) =>
        value.length >= 8
          ? null
          : "Username must be at least 8 characters long",
    },
  });
  return (
    <>
      <form onSubmit={formState.onSubmit(console.log)}>
        <TextInput
          label="Name"
          placeholder="Enter your Name"
          required
          {...formState.getInputProps("name")}
        />
        <TextInput
          mt="md"
          label="Email"
          placeholder="Enter your email"
          required
          {...formState.getInputProps("email")}
        />
        <TextInput
          mt="md"
          label="Username"
          placeholder="Enter your username"
          required
          {...formState.getInputProps("username")}
        />
        <PasswordInput
          mt="md"
          label="Password"
          placeholder="Enter your password"
          required
          {...formState.getInputProps("password")}
        />
        <PasswordInput
          mt="md"
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          {...formState.getInputProps("passwordConfirm")}
        />
      </form>
    </>
  );
}

export { FirstForm };
