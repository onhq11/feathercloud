import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { v4 } from "uuid";
import {
  ERROR_INTERNAL_SERVER,
  INFO_KEY_SAVED,
  STATUS_IDLE,
  STATUS_INSPECT,
  STATUS_INSPECT_ABORT,
  STATUS_OK,
  STATUS_WAITING,
} from "./App";

export default function LoginDialog({ isOpen, handleClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const [inspectionState, setInspectionState] = useState(false);
  const [connectionState, setConnectionState] = useState(0)

  const { sendJsonMessage } = useWebSocket(window.location.href.replace(/^https/, 'wss').replace(/^http/, 'ws').replace(/\/$/, '') + '/login', {
    share: true,
    filter: () => false,
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      switch (data.status) {
        case STATUS_OK:
          localStorage.setItem("key", data.key);

          enqueueSnackbar(INFO_KEY_SAVED, {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            autoHideDuration: 2000,
            style: {
              backgroundColor: "#4cbd8b",
              color: "white",
            },
          });

          handleClose();
          break;

        case STATUS_INSPECT:
          setInspectionState(true);
          break;

        case STATUS_INSPECT_ABORT:
          setInspectionState(false);
          break;

        default: {
          enqueueSnackbar(data?.message || ERROR_INTERNAL_SERVER, {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            autoHideDuration: 2000,
            style: {
              backgroundColor: "#dc4d5e",
              color: "white",
            },
          });
        }
      }
    },
  });

  useEffect(() => {
    if (localStorage.getItem("userId") === null) {
      localStorage.setItem("userId", v4());
    }

    if (isOpen) {
      setConnectionState(connectionState + 1)
      sendJsonMessage({
        status: STATUS_WAITING,
        userId: localStorage.getItem("userId"),
      });
    } else {
      sendJsonMessage({
        status: connectionState > 0 ? STATUS_IDLE : STATUS_OK,
        userId: localStorage.getItem("userId"),
      });
    }
  }, [isOpen, sendJsonMessage]);

  return (
    <Dialog open={isOpen} maxWidth="xl">
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", p: 1 }}>
          Login
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", minWidth: "30vw" }}>
        <Typography sx={{ color: "#4cbd8b", fontWeight: "bold" }}>
          {inspectionState
            ? "Administrator is inspecting"
            : "Waiting for administrator"}
        </Typography>
        <Typography sx={{ color: "#c1c1c1" }}>
          {inspectionState
            ? "Administrator is reviewing your request"
            : "Administrator must grant permissions for your device"}
        </Typography>
        <Box sx={{ px: 3, mt: 3 }}>
          <LinearProgress color="success" variant="indeterminate" />
          <Typography sx={{ color: "#c1c1c1", fontSize: 12, mt: 1 }}>
            {localStorage.getItem("userId")}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M176 128a8 8 0 0 1-8 8H88a8 8 0 0 1 0-16h80a8 8 0 0 1 8 8Zm56 0A104 104 0 1 1 128 24a104.11 104.11 0 0 1 104 104Zm-16 0a88 88 0 1 0-88 88a88.1 88.1 0 0 0 88-88Z"
              />
            </svg>
          }
          color="success"
          onClick={handleClose}
        >
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
}
