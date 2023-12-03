import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { AUTHORIZED, IN_QUEUE } from "./App";

export default function User({
  data,
  type,
  sendJsonMessage,
  handleOpenApprove,
  handleDelete,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid lightgray",
        p: 1,
        borderRadius: "4px",
      }}
    >
      <Box sx={{ px: 3, py: 1.5 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
        >
          <path
            fill="#b1b1b1"
            d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z"
          />
        </svg>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ color: "#919191" }}>
            {data.friendlyName || data.userId}
          </Typography>
          <Typography sx={{ color: "#c1c1c1", fontSize: 12, mt: 1 }}>
            {data?.currentPermissions?.map((item, index) =>
              index !== data.currentPermissions.length - 1 ? item + ", " : item,
            )}
          </Typography>
        </Box>
        <Box>
          <Tooltip title="Grant permissions">
            <IconButton onClick={() => handleOpenApprove(data)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4cbd8b"
                  d="M17 14h-4.341a6 6 0 1 1 0-4H23v4h-2v4h-4v-4ZM7 14a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"
                />
              </svg>
            </IconButton>
          </Tooltip>
          {type === AUTHORIZED && (
            <Tooltip title="Delete user">
              <IconButton onClick={() => handleDelete(data)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 256 256"
                >
                  <path
                    fill="#dc4d5e"
                    d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"
                  />
                </svg>
              </IconButton>
            </Tooltip>
          )}
          {type === IN_QUEUE && <></>}
        </Box>
      </Box>
    </Box>
  );
}
