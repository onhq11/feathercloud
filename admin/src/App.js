import {
  Box,
  createTheme,
  Divider,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import AuthorizedUsers from "./AuthorizedUsers";
import InQueue from "./InQueue";
import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { v4 } from "uuid";
import ApproveDialog from "./ApproveDialog";

export const IN_QUEUE = 1;
export const AUTHORIZED = 2;
export const STATUS_OK = "ok";
export const STATUS_WAITING = "waiting";
export const STATUS_APPROVE = "approve";
export const STATUS_INSPECT = "inspect";
export const STATUS_INSPECT_ABORT = "inspect_abort";
export const STATUS_DELETE = "delete";

export const INFO_PERMISSIONS_GRANTED = "Permissions successfully granted";

export default function App() {
  const [inQueue, setInQueue] = useState([]);
  const [authorized, setAuthorized] = useState([]);
  const [openApprove, setOpenApprove] = useState(false);
  const [data, setData] = useState({});

  const theme = createTheme({
    palette: {
      success: {
        main: "#4cbd8b",
        contrastText: "#fff",
      },
      normal: {
        main: "#444",
        contrastText: "#fff",
      },
    },
  });

  const { sendJsonMessage } = useWebSocket("ws://localhost:3005/admin", {
    share: true,
    filter: () => false,
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      if (data.status === STATUS_OK) {
        switch (data.type) {
          case AUTHORIZED:
            setAuthorized(data.list);
            break;

          case IN_QUEUE:
            setInQueue(data.list);
            break;

          default: {
            setInQueue([]);
            setAuthorized([]);
          }
        }
      }
    },
  });

  const handleDelete = (data) => {
    sendJsonMessage({
      status: STATUS_DELETE,
      userId: data.userId,
    });
  };

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      localStorage.setItem("userId", v4());
    }

    sendJsonMessage({
      status: STATUS_WAITING,
      userId: localStorage.getItem("userId"),
    });
  }, [sendJsonMessage]);

  const handleOpenApprove = (data) => {
    setData(data);
    setOpenApprove(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={2000}
        style={{ paddingRight: "50px" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <ApproveDialog
            isOpen={openApprove}
            handleClose={() => setOpenApprove(false)}
            data={data}
            sendJsonMessage={sendJsonMessage}
          />
          <Box
            sx={{
              width: "70%",
              minHeight: "70%",
              backgroundColor: "white",
              margin: "auto",
              borderRadius: "15px",
              boxShadow: "0px 0px 24px 22px rgba(216, 240, 234, 1)",
              py: 4,
              px: 4.5,
              display: "flex",
              gap: 4,
            }}
          >
            <Box sx={{ flex: 2, display: "flex", flexDirection: "column" }}>
              <Box>
                <Typography
                  variant="h4"
                  sx={{ color: "#4dbc9d", fontWeight: "bold", fontSize: 30 }}
                >
                  Administrator panel
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#a8a8a8",
                    fontWeight: 600,
                    mt: 1,
                    mb: 2,
                    fontSize: 18,
                  }}
                >
                  Here you can assign permissions to the client
                </Typography>
                <Divider sx={{ mb: 2 }} flexItem />
              </Box>
              <Box sx={{ flex: 1, width: "100%" }}>
                <InQueue
                  data={inQueue}
                  sendJsonMessage={sendJsonMessage}
                  handleOpenApprove={handleOpenApprove}
                />
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <AuthorizedUsers
                data={authorized}
                sendJsonMessage={sendJsonMessage}
                handleOpenApprove={handleOpenApprove}
                handleDelete={handleDelete}
              />
            </Box>
          </Box>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
