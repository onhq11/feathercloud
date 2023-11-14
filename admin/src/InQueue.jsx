import { Box, Typography } from "@mui/material";
import User from "./User";
import { IN_QUEUE } from "./App";

export default function InQueue({ data, sendJsonMessage, handleOpenApprove }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#a8a8a8" }}>
        Waiting for approve
      </Typography>
      <Box
        sx={{
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "59vh",
        }}
      >
        {data.map((item, index) => (
          <User
            key={index}
            data={item}
            type={IN_QUEUE}
            sendJsonMessage={sendJsonMessage}
            handleOpenApprove={handleOpenApprove}
          />
        ))}
      </Box>
    </Box>
  );
}
