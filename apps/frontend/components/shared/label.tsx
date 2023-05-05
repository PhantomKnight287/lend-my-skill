import clsx from "clsx";
import { DetailedHTMLProps, LabelHTMLAttributes } from "react";

export default function Label(
  props: DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > & {
    required?: boolean;
  }
) {
  return (
    <label
      {...props}
      htmlFor={props.htmlFor}
      className={clsx(
        "block mb-2 text-sm font-medium text-gray-900 dark:text-white",
        props.className,
        {
          'after:content-["*"] after:ml-1 after:text-red-500 after:text-base after:w-[1px] after:inline after:h-[1px] after:align-middle ':
            props.required,
        }
      )}
    >
      {props.children}
    </label>
  );
}
