import { useContext } from "react";
import { UserContext } from "../context/user";

export function useUser() {
  const data = useContext(UserContext);
  if (data === null) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return data.user;
}

export function useSetUser() {
  const data = useContext(UserContext);
  if (data === null) {
    throw new Error("useSetUser must be used within a UserProvider");
  }

  return data.setUser;
}
