import { Box, Typography } from "@mui/material";
import User from "./User";
import { AUTHORIZED } from "./App";

export default function AuthorizedUsers({
  data,
  sendJsonMessage,
  handleOpenApprove,
  handleDelete,
}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#a8a8a8" }}>
        Authorized users
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "70vh",
          overflow: "auto",
        }}
      >
        {data.map((item, index) => (
          <User
            key={index}
            data={item}
            type={AUTHORIZED}
            sendJsonMessage={sendJsonMessage}
            handleOpenApprove={handleOpenApprove}
            handleDelete={handleDelete}
          />
        ))}
      </Box>
    </Box>
  );
}
