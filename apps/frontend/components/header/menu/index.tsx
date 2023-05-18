import { useSetUser, useUser } from "@hooks/user";
import { Avatar, Menu } from "@mantine/core";
import { profileImageRouteGenerator } from "@utils/profile";
import { eraseCookie } from "@helpers/cookie";
import { useRouter } from "next/router";
import { assetURLBuilder } from "@utils/url";
import {
  IconBrandCashapp,
  IconHome,
  IconLogout,
  IconPhotoCheck,
  IconSearch,
  IconSettings2,
  IconShoppingCart,
  IconUserCircle,
} from "@tabler/icons-react";

export default function HeaderMenu() {
  const { avatarUrl, username, userType, profileCompleted } = useUser();
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
              push("/dashboard");
            }}
            icon={<IconHome size={20} />}
          >
            Home
          </Menu.Item>

          <>
            {userType === "Freelancer" ? (
              <Menu.Item
                color="green"
                onClick={() => push(`/create/service`)}
                icon={<IconBrandCashapp size={20} />}
              >
                Post a Service
              </Menu.Item>
            ) : null}
          </>

          <Menu.Item
            onClick={() => {
              push(`/profile/${username}`);
            }}
            icon={<IconUserCircle size={20} />}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              push(`/search`);
            }}
            icon={<IconSearch size={20} />}
          >
            Search
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              push(`/settings`);
            }}
            icon={<IconSettings2 size={20} />}
          >
            Settings
          </Menu.Item>
          {profileCompleted ? null : (
            <Menu.Item
              color="yellow"
              onClick={() => push(`/settings?activeTab=complete-profile`)}
              icon={<IconPhotoCheck size={20} />}
            >
              Complete Profile
            </Menu.Item>
          )}
          <Menu.Item
            onClick={() => {
              push(`/profile/${username}/orders`);
            }}
            icon={<IconShoppingCart size={20} />}
          >
            Orders
          </Menu.Item>
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
            icon={<IconLogout size={20} />}
          >
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
