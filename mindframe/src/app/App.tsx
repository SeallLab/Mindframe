import { AppFrame } from "../components/AppFrame";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { RootNavigator } from "../navigators/RootNavigator";
import { installWebGlobals } from "../styling/webGlobals";
import { AppProviders } from "./AppProviders";

// Runs once at module load. No-op on native.
installWebGlobals();

export default function App() {
  return (
    <AppFrame>
      <ErrorBoundary>
        <AppProviders>
          <RootNavigator />
        </AppProviders>
      </ErrorBoundary>
    </AppFrame>
  );
}
