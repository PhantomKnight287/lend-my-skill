import { MetaTags } from "@components/meta";
import { outfit } from "@fonts";
import clsx from "clsx";

const Chat = () => {
  return (
    <div
      className={clsx("p-8", {
        [outfit.className]: true,
      })}
    >
      <MetaTags title="Chat" description="Chat to complete this project successfully." />
      
    </div>
  );
};

export default Chat;
