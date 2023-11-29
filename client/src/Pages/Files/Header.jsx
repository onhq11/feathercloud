import { Box, IconButton, Tooltip, Typography } from "@mui/material";

export default function Header({ handleOpenLogin }) {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h4"
          sx={{ color: "#4dbc9d", fontWeight: "bold", fontSize: 30 }}
        >
          Upload files
        </Typography>
        <Tooltip title="Request for permissions">
          <IconButton size="small" onClick={handleOpenLogin}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="#4cbd8b"
                d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z"
              />
            </svg>
          </IconButton>
        </Tooltip>
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: "#a8a8a8",
          fontWeight: 600,
          mt: 1,
          mb: 4,
          fontSize: 18,
        }}
      >
        Upload files you want to share to server
      </Typography>
    </>
  );
}
