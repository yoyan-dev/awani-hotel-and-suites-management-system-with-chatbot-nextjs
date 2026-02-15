"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { Spinner } from "@heroui/react";
import { useRouter, usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "@/store/store";
// import AuthSessionSync from "./auth-session-sync";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

function RouteLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-[3px] bg-primary-300 animate-pulse z-50" />
      )}
      {children}
    </>
  );
}

function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        {/* <AuthSessionSync /> */}
        <RouteLoader>
          <ReduxProvider>{children}</ReduxProvider>
        </RouteLoader>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
