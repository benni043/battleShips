import type { User } from "~/utils/types";

export const useUserNameStore = defineStore("userName", {
  state: () => ({
    opponent: "",
    game: "",
  }),
  actions: {
    saveToLocalStorage(userData: User) {
      if (typeof window !== "undefined") {
        localStorage.setItem("userName", userData.userName);
        localStorage.setItem("uuid", userData.uuid);
      }
    },
    isLoggedIn() {
      if (typeof window !== "undefined") {
        return localStorage.getItem("uuid") !== null;
      }
    },
    getMe() {
      if (typeof window !== "undefined") {
        return localStorage.getItem("userName");
      }
    },
  },
});
