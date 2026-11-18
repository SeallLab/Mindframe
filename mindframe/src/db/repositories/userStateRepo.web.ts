import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserState, initialState } from "../../types/UserState.types";

const KEY = "user_state";

export function createUserStateRepo(_db?: unknown) {
  return {
    async load(): Promise<UserState> {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (!raw) return initialState;
        const parsed = JSON.parse(raw);
        // Merged over the defaults so a partial or older-shaped object
        // can't hand the engine a UserState with undefined fields — every
        // rule and gauge does arithmetic on these, and one `undefined`
        // turns into NaN that then gets persisted back.
        return { ...initialState, ...parsed };
      } catch (e) {
        console.error("userStateRepo: couldn't read stored state, using initial state", e);
        return initialState;
      }
    },

    // Not swallowed on purpose — see taskRepo.web.ts writeAll.
    async save(state: UserState): Promise<void> {
      try {
        await AsyncStorage.setItem(KEY, JSON.stringify(state));
      } catch (e) {
        console.error("userStateRepo: couldn't persist state", e);
        throw e;
      }
    },
  };
}
