import { MutableRefObject, useEffect, useRef } from "react";

export function useChatScroll<T>(dep: T): MutableRefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("DOMNodeInserted", (event: any) => {

        const { currentTarget: target } = event;
        target?.scroll({ top: target?.scrollHeight, behavior: "smooth" });
      });
    }
  }, [dep]);
  return ref as MutableRefObject<HTMLDivElement>;
}
