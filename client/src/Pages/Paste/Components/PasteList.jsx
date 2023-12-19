import {
  Box,
  Breadcrumbs,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Paste from "./Paste";
import FolderDialog from "../../../Dialogs/FolderDialog";
import PasteDialog from "../../../Dialogs/Paste/PasteDialog";

export default function PasteList({
  handleCloseEditor,
  handleReloadList,
  reloadList,
  handleGetContent,
  isActive,
  isAutocompleteOpen,
}) {
  const [pastes, setPastes] = useState([]);
  const [path, setPath] = useState("~");
  const [openPasteDialog, setOpenPasteDialog] = useState(false);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const handleOpenPasteDialog = () => {
    setOpenPasteDialog(true);
  };

  const handleOpenFolderDialog = () => {
    setOpenFolderDialog(true);
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

      if (
        isActive &&
        (event.ctrlKey || event.metaKey) &&
        event.keyCode === 78
      ) {
        event.preventDefault();
        setOpenPasteDialog(true);
        return;
      }

      if (
        isActive &&
        event.key === "Backspace" &&
        !openFolderDialog &&
        !openPasteDialog &&
        !isAutocompleteOpen
      ) {
        event.preventDefault();
        handleChangePath(path.split("/").slice(0, -1).join("/") || "~", true);
      }
    };

    if (
      isActive &&
      !openFolderDialog &&
      !openPasteDialog &&
      !isAutocompleteOpen
    ) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isActive, isAutocompleteOpen, openPasteDialog, openFolderDialog]);

  useEffect(() => {
    setBreadcrumbs(
      path.includes("~") ? path.split("/") : ("~" + "/" + path).split("/"),
    );

    fetch("/api/pastes/" + path, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          return res.json().then((error) => {
            handleReloadList();
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

        setPastes(data);
      });
  }, [reloadList, path]);

  const handleChangePath = (path, overwrite) => {
    setPath((item) =>
      overwrite ? path : item !== "~" ? item + "/" + path : path,
    );
  };

  return (
    <Box
      sx={{
        flex: 0.4,
        gap: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#a8a8a8" }}>
            Paste list
          </Typography>
          <Box sx={{ display: "flex" }}>
            {path !== "~" && (
              <Tooltip title="Go back">
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
            <Tooltip title="Create paste (Ctrl+N)">
              <IconButton onClick={handleOpenPasteDialog}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4cbd8b"
                    d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157l3.712 3.712l1.157-1.157a2.625 2.625 0 0 0 0-3.712Zm-2.218 5.93l-3.712-3.712l-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z"
                  />
                </svg>
              </IconButton>
            </Tooltip>
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
        type={"paste"}
      />
      <PasteDialog
        isOpen={openPasteDialog}
        handleClose={() => setOpenPasteDialog(false)}
        path={path}
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
        {pastes.map((item, index) => (
          <Paste
            key={index}
            data={item}
            handleReloadList={handleReloadList}
            handleChangePath={handleChangePath}
            path={path}
            handleGetContent={(name, copyToClipboard) =>
              handleGetContent(path, name, copyToClipboard)
            }
            handleCloseEditor={handleCloseEditor}
          />
        ))}
      </Box>
    </Box>
  );
}
