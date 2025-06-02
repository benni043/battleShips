import { useCookie } from "#app";
import type { User } from "~/utils/types";

export const useUserNameStore = defineStore("userName", {
  state: () => ({
    opponent: "",
    game: "",
  }),
  actions: {
    saveToCookies(userData: User) {
      const userName = useCookie("username");
      const uuid = useCookie("uuid");

      userName.value = userData.userName;
      uuid.value = userData.uuid;
    },
    isLoggedIn() {
      const uuid = useCookie<string | null>("uuid");
      return !!uuid.value;
    },
    getMe() {
      const userName = useCookie<string | null>("username");
      return userName.value;
    },
  },
});
