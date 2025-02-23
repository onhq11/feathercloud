import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Providers from "@/providers/frontend/Providers";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Container from "@/components/Layout/Container";

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AppRouterCacheProvider>
        <Providers>
          <Container>{children}</Container>
        </Providers>
      </AppRouterCacheProvider>
    </NextIntlClientProvider>
  );
}
