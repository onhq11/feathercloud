import {
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import File from "./File";
import useWebSocket from "react-use-websocket";
import { STATUS_UPDATE_FILE } from "../../../App";
import { useSnackbar } from "notistack";
import FolderDialog from "../../../Dialogs/FolderDialog";

export default function FilesList({
  handleChangeGlobalPath,
  uploadInProgress,
  handleReloadList,
  reloadList,
  isActive,
}) {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState("~");
  const { enqueueSnackbar } = useSnackbar();
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [currentInProgress, setCurrentInProgress] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
    if (!uploadInProgress) {
      setTimeout(() => {
        setCurrentInProgress(uploadInProgress);
      }, 100);
    }
    setCurrentInProgress(uploadInProgress);
  }, [uploadInProgress]);

  const handleOpenFolderDialog = () => {
    setOpenFolderDialog(true);
  };

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
            if (!currentInProgress) {
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
            }

            handleReloadList();
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
    handleChangeGlobalPath(path);

    setBreadcrumbs(
      path.includes("~") ? path.split("/") : ("~" + "/" + path).split("/"),
    );

    fetch("/api/files/" + path, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          return res.json().then((error) => {
            throw new Error(error.message);
          });
        }

        return res.json();
      })
      .then((res) => {
        const data = [...res];
        data.sort(
          (a, b) => new Date(b.last_modified) - new Date(a.last_modified),
        );

        setFiles(data);
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar(err.message, {
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
      });
  }, [reloadList, path]);

  const handleChangePath = (path, overwrite) => {
    setPath((item) =>
      overwrite ? path : item !== "~" ? item + "/" + path : path,
    );
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        isActive &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.keyCode === 78
      ) {
        event.preventDefault();
        setOpenFolderDialog(true);
        return;
      }

      if (isActive && event.key === "Backspace" && !openFolderDialog) {
        event.preventDefault();
        handleChangePath(path.split("/").slice(0, -1).join("/") || "~", true);
      }
    };

    if (isActive) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isActive]);

  return (
    <Box
      sx={{
        flex: 1,
        gap: 2,
        display: "flex",
        flexDirection: "column",
        maxWidth: { xs: "100%", lg: "50%" },
      }}
    >
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#a8a8a8" }}>
            Files list
          </Typography>
          <Box sx={{ display: "flex" }}>
            {path !== "~" && (
              <Tooltip title="Go back (Backspace)">
                <IconButton
                  onClick={() => {
                    handleChangePath(
                      path.split("/").slice(0, -1).join("/") || "~",
                      true,
                    );
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#b1b1b1"
                      d="M228 128a12 12 0 0 1-12 12H69l51.52 51.51a12 12 0 0 1-17 17l-72-72a12 12 0 0 1 0-17l72-72a12 12 0 0 1 17 17L69 116h147a12 12 0 0 1 12 12Z"
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Create folder (Ctrl+Shift+N)">
              <IconButton onClick={handleOpenFolderDialog}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4cbd8b"
                    d="M12.414 5H21a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2ZM11 12H8v2h3v3h2v-3h3v-2h-3V9h-2v3Z"
                  />
                </svg>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Breadcrumbs maxItems={4} sx={{ color: "#b1b1b1" }}>
          {breadcrumbs.map((item, index) => (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                handleChangePath(
                  breadcrumbs
                    .filter((folder, itemIndex) => itemIndex <= index)
                    .join("/"),
                  true,
                );
              }}
            >
              {item}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>
      <FolderDialog
        isOpen={openFolderDialog}
        handleClose={() => setOpenFolderDialog(false)}
        path={path}
        type={"file"}
      />
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
        }}
      >
        {files.map((item, index) => (
          <File
            key={index}
            data={item}
            handleReloadList={handleReloadList}
            handleChangePath={handleChangePath}
            path={path}
          />
        ))}
      </Box>
    </Box>
  );
}
