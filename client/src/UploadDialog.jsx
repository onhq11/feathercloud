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

export default function UploadDialog({
  isOpen,
  handleClose,
  progress,
  fileName,
  handleEmptyUploadObject,
}) {
  useEffect(() => {
    let completed = 0;
    progress.map((item) => {
      if (item >= 100) {
        completed += 1;
      }
    });

    if (completed === progress.length && progress.length === fileName.length) {
      handleClose();
      handleEmptyUploadObject();
    }
  }, [...progress, ...fileName]);

  return (
    <Dialog open={isOpen} maxWidth="xl">
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", p: 1 }}>
          Uploading...
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: "center",
          minWidth: "30vw",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {progress.map((item, index) => (
          <Box key={index} sx={{ width: "100%", mt: 2 }}>
            <Typography
              sx={{
                fontWeight: 100,
                fontSize: 15,
                opacity: 0.9,
                color: item >= 100 ? "#64c4a8" : "#b1b1b1",
              }}
            >
              {fileName[index]}
            </Typography>
            <Box sx={{ width: "100%", mt: 2, color: "#64c4a8" }}>
              <LinearProgress
                color="inherit"
                variant="determinate"
                value={item}
              />
            </Box>
          </Box>
        ))}
        {progress.length !== fileName.length &&
          fileName.map((item, index) => {
            if (!!progress[index]) {
              return null;
            }

            return (
              <Box key={index} sx={{ width: "100%", mt: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 100,
                    fontSize: 15,
                    opacity: 0.9,
                    color: item >= 100 ? "#64c4a8" : "#b1b1b1",
                  }}
                >
                  {item}
                </Typography>
                <Box sx={{ width: "100%", mt: 2, color: "#64c4a8" }}>
                  <LinearProgress
                    color="warning"
                    variant="determinate"
                    value={0}
                  />
                </Box>
              </Box>
            );
          })}
      </DialogContent>
    </Dialog>
  );
}
