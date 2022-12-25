import { outfit } from "@fonts";
import {
  Textarea as T,
  TextareaProps,
  useMantineColorScheme,
} from "@mantine/core";
import clsx from "clsx";
import { ReactNode } from "react";

interface Props extends TextareaProps {
  labelString: string;
  required?: boolean;
  id: string;
  minWords?: number;
  maxWords?: number;
  wordsComponent?: ReactNode;
}

export default function Textarea({
  minWords,
  maxWords,
  labelString,
  wordsComponent,
  ...props
}: Props) {
  const { colorScheme } = useMantineColorScheme();
  return (
    <div className="mt-4">
      <label
        className={clsx("text-sm font-bold py-2", {
          [outfit.className]: true,
          "text-[#495057] ": colorScheme === "light",
        })}
        htmlFor={props.id}
      >
        {labelString}
        <span>
          <span className="text-red-500">*</span>
        </span>
      </label>
      <div
        className={clsx("border-[1px]  rounded-sm flex flex-col", {
          "border-[#ced4da]": colorScheme === "light",
          "border-[#495057]": colorScheme === "dark",
        })}
      >
        <T
          required
          placeholder="Enter the description of your job post"
          labelProps={{
            className: clsx({
              [outfit.className]: true,
            }),
          }}
          {...props}
          classNames={{
            input: clsx("border-0", {}),
            ...props.classNames,
          }}
          minLength={20}
          maxLength={1000}
          error={null}
        />
        {wordsComponent}
      </div>
      <span
        className={clsx("text-red-500 text-sm", {
          [outfit.className]: true,
        })}
      >
        {props.error}
      </span>
    </div>
  );
}
