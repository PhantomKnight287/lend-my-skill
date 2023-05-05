import clsx from "clsx";
import {
  DetailedHTMLProps,
  HTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  useState,
} from "react";
import Label from "./label";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  labelProps?: DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >;
  label: string;
  errorMessage?: string;
  errorProps?: DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >;
}

export default function Input(props: Props) {
  const {
    label,
    labelProps,
    errorMessage,
    errorProps,
    onBlur,
    onChange,
    ref,
    ...rest
  } = props;
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Label
        {...labelProps}
        htmlFor={label.toLowerCase().replaceAll(" ", "-")}
        required={props.required}
      >
        {label}
      </Label>

      <div className="relative">
        <input
          id={label.toLowerCase().replaceAll(" ", "-")}
          {...rest}
          className={clsx(
            "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
            props.className,
            {
              "border-[1px] border-red-500 outline-none": errorMessage,
            }
          )}
          type={
            rest.type === "password"
              ? visible
                ? "text"
                : "password"
              : rest.type
          }
          {...{ onBlur, onChange, ref }}
        />

        <div
          className={clsx(
            "absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer",
            {
              hidden: rest.type !== "password",
            }
          )}
        >
          {visible ? (
            <AiFillEyeInvisible
              className="text-gray-400"
              onClick={() => setVisible(false)}
            />
          ) : (
            <AiFillEye
              className="text-gray-400"
              onClick={() => setVisible(true)}
            />
          )}
        </div>
      </div>

      {errorMessage ? (
        <p
          {...errorProps}
          className={clsx("text-base font-semibold text-red-500 mt-1 ")}
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
