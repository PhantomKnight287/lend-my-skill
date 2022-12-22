import { ContainerProps } from "@mantine/core";
import { Container as C } from "@mantine/core";
import clsx from "clsx";

export function Container(props: Partial<ContainerProps>) {
  return <C {...props} className={clsx("mt-20", props.className)} />;
}
