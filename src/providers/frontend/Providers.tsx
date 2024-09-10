"use client";

import theme from "@/config/theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
