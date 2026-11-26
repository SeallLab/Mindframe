import { Platform } from "react-native";
import { colors } from "./theme";

// Height includes the 1px top border and the padding, so content gets
// height - 1 - paddingTop - paddingBottom. On web that's ~57px, which
// comfortably fits an icon + label. iOS/Android values are unchanged.
const platformSizing = Platform.select({
  ios:     { height: 84, paddingBottom: 28 },
  web:     { height: 76, paddingBottom: 10 },
  default: { height: 64, paddingBottom: 10 },
});

export const tabBarStyle = {
  backgroundColor: colors.surface,
  borderTopColor: colors.border,
  borderTopWidth: 1,
  paddingTop: 8,
  ...platformSizing,
};
