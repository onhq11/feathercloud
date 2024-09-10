import { Box } from "@mui/material";
import { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        mx: { xs: 2, sm: "3vw", md: "8vw", lg: "12vw" },
        translation: "0.2s",
      }}
    >
      {children}
    </Box>
  );
}
