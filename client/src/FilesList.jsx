import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Files from "./Files";
import useWebSocket from "react-use-websocket";
import {
  ERROR_INTERNAL_SERVER,
  INFO_KEY_SAVED,
  STATUS_INSPECT,
  STATUS_INSPECT_ABORT,
  STATUS_OK,
  STATUS_UPDATE_FILE,
} from "./App";
import { useSnackbar } from "notistack";

export default function FilesList({ handleOpenPreview }) {
  const [files, setFiles] = useState([]);
  const [reloadList, setReloadList] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { sendJsonMessage } = useWebSocket(
    window.location.href
      .replace(/^https/, "wss")
      .replace(/^http/, "ws")
      .replace(/\/$/, "") + "/update",
    {
      share: true,
      filter: () => false,
      onMessage: (event) => {
        const data = JSON.parse(event.data);
        switch (data.status) {
          case STATUS_UPDATE_FILE:
            enqueueSnackbar(data.message, {
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

            setReloadList(!reloadList);
            break;
        }
      },
    },
  );

  useEffect(() => {
    sendJsonMessage({
      userId: localStorage.getItem("userId"),
    });
  }, [sendJsonMessage]);

  useEffect(() => {
    fetch("/api/files", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const data = [...res];
        data.sort(
          (a, b) => new Date(b.last_modified) - new Date(a.last_modified),
        );

        setFiles(data);
      });
  }, [reloadList]);

  return (
    <Box
      sx={{
        flex: 1,
        gap: 2,
        display: "flex",
        flexDirection: "column",
        maxHeight: { xs: "", lg: "60vh" },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#a8a8a8" }}>
        Files list
      </Typography>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100px",
          overflowY: "auto",
        }}
      >
        {files.map((item, index) => (
          <Files
            key={index}
            data={item}
            handleOpenPreview={handleOpenPreview}
            handleReloadList={() => setReloadList(!reloadList)}
          />
        ))}
      </Box>
    </Box>
  );
}
