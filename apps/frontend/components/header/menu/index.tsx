import { useSetUser, useUser } from "@hooks/user";
import { Avatar, Menu } from "@mantine/core";
import { profileImageRouteGenerator } from "@utils/profile";
import { eraseCookie } from "@helpers/cookie";
import { useRouter } from "next/router";
import { assetURLBuilder } from "@utils/url";

export default function HeaderMenu() {
  const { avatarUrl, username, userType } = useUser();
  const dispatch = useSetUser();
  const { push } = useRouter();
  return (
    <>
      <Menu withArrow width={200}>
        <Menu.Target>
          <Avatar
            className="cursor-pointer"
            src={
              avatarUrl
                ? assetURLBuilder(avatarUrl)
                : profileImageRouteGenerator(username)
            }
            radius="xl"
          />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              push(`/profile/${username}`);
            }}
          >
            Profile
          </Menu.Item>
          {userType === "client" ? (
            <Menu.Item
              color="green"
              onClick={() => {
                push("/create/job-post");
              }}
            >
              Post a Request
            </Menu.Item>
          ) : (
            <>
              {userType === "freelancer" ? (
                <Menu.Item>Dashboard</Menu.Item>
              ) : null}
            </>
          )}
          <Menu.Divider />
          <Menu.Label>Danger</Menu.Label>
          <Menu.Item
            color="red"
            onClick={() => {
              eraseCookie("token");
              eraseCookie("refreshToken");
              dispatch({
                type: "LOG_OUT",
                payload: {},
              });
              push("/auth/login");
            }}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
