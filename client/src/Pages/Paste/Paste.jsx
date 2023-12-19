import { Box, useMediaQuery, useTheme } from "@mui/material";
import PasteList from "./Components/PasteList";
import Preview from "./Components/Preview";
import { useState } from "react";
import { useSnackbar } from "notistack";
import { INFO_PASTE_COPIED } from "../../App";
import PreviewDialog from "../../Dialogs/Paste/PreviewDialog";
import UnsavedDialog from "../../Dialogs/Paste/UnsavedDialog";

export default function Paste({ handleReloadList, reloadList, isActive }) {
  const { enqueueSnackbar } = useSnackbar();
  const [currentContent, setCurrentContent] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("text");
  const [disabled, setDisabled] = useState(true);
  const [fileName, setFileName] = useState("");
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [hasEditPermissions, setHasEditPermissions] = useState(false);
  const [openUnsavedDialog, setOpenUnsavedDialog] = useState(false);
  const [unsavedData, setUnsavedData] = useState({});
  const [editorContent, setEditorContent] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

  const handleAutocompleteOpen = () => {
    setIsAutocompleteOpen(true);
  };

  const handleAutocompleteClose = () => {
    setIsAutocompleteOpen(false);
  };

  const handleChangeGlobalLanguage = (language) => {
    setCurrentLanguage(language);
  };

  const handleEditorContent = (content) => {
    setEditorContent(content);
  };

  const handleUnsaved = (state = true) => {
    setIsUnsaved(state);
  };

  const handleOpenUnsavedDialog = (data) => {
    setOpenUnsavedDialog(true);
    setUnsavedData(data);
  };

  const handleCloseEditor = () => {
    setCurrentFile("");
    setCurrentLanguage("text");
    setCurrentContent("");
    setDisabled(true);
    setOpenPreviewDialog(false);
  };

  const handleGetContent = (path, name, copyToClipboard) => {
    fetch("/api/paste/read/" + path + "/" + name, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("key"),
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
        const fileContent = String.fromCharCode(...res.content?.data).toString(
          "utf8",
        );
        const language = fileContent
          .split("-_-")?.[1]
          ?.split("LANGUAGE=")?.[1]
          ?.replace(/ /g, "");
        const content = fileContent.split("-_-")?.[2]?.replace("\n", "");

        if (copyToClipboard) {
          window.navigator.clipboard.writeText(content);
          enqueueSnackbar(INFO_PASTE_COPIED, {
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
          return;
        }

        if (!disabled && isUnsaved && currentFile !== path + "/" + name) {
          handleOpenUnsavedDialog({
            saveCallback: () => {
              handleSave(editorContent, false);

              setCurrentLanguage(language || "text");
              setCurrentContent(content);

              setDisabled(false);
              setCurrentFile(path + "/" + name);
              setFileName(name);
              setOpenPreviewDialog(true);
              setHasEditPermissions(res.hasEditPermission);
            },
            cancelCallback: () => {
              setCurrentLanguage(language || "text");
              setCurrentContent(content);

              setDisabled(false);
              setCurrentFile(path + "/" + name);
              setFileName(name);
              setOpenPreviewDialog(true);
              setHasEditPermissions(res.hasEditPermission);
            },
          });
          return;
        }

        setCurrentLanguage(language || "text");
        setCurrentContent(content);

        setDisabled(false);
        setCurrentFile(path + "/" + name);
        setFileName(name);
        setOpenPreviewDialog(true);
        setHasEditPermissions(res.hasEditPermission);
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
        handleReloadList();
      });
  };

  const handleSave = (content, autosave) => {
    fetch("/api/paste/edit/" + currentFile, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("key"),
      },
      method: "post",
      body: JSON.stringify({ content, language: currentLanguage }),
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
        setIsUnsaved(false);
        if (!autosave) {
          enqueueSnackbar(res.message, {
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
        handleReloadList();
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        height: "85%",
        gap: 4,
        flexDirection: { xs: "column", lg: "row" },
      }}
    >
      <PreviewDialog
        isOpen={isSmallScreen && openPreviewDialog}
        handleClose={() => {
          setOpenPreviewDialog(false);
          setDisabled(true);
        }}
        currentContent={currentContent}
        disabled={disabled}
        handleSave={handleSave}
        handleChangeGlobalLanguage={handleChangeGlobalLanguage}
        currentLanguage={currentLanguage}
        fileName={fileName}
        isUnsaved={isUnsaved}
        handleUnsaved={handleUnsaved}
        handleGetContent={handleGetContent}
        currentFile={currentFile}
        hasEditPermissions={hasEditPermissions}
        handleEditorContent={handleEditorContent}
        handleOpenUnsavedDialog={handleOpenUnsavedDialog}
        editorContent={editorContent}
      />
      <UnsavedDialog
        isOpen={openUnsavedDialog}
        handleClose={() => setOpenUnsavedDialog(false)}
        currentIsUnsaved={isUnsaved}
        data={unsavedData}
      />
      <PasteList
        handleCloseEditor={handleCloseEditor}
        handleReloadList={handleReloadList}
        reloadList={reloadList}
        handleGetContent={handleGetContent}
        isActive={isActive}
        isAutocompleteOpen={isAutocompleteOpen}
      />
      {!isSmallScreen && (
        <Preview
          currentContent={currentContent}
          disabled={disabled}
          handleSave={handleSave}
          handleChangeGlobalLanguage={handleChangeGlobalLanguage}
          currentLanguage={currentLanguage}
          fileName={fileName}
          isUnsaved={isUnsaved}
          handleUnsaved={handleUnsaved}
          handleGetContent={handleGetContent}
          currentFile={currentFile}
          hasEditPermissions={hasEditPermissions}
          handleEditorContent={handleEditorContent}
          handleAutocompleteOpen={handleAutocompleteOpen}
          handleAutocompleteClose={handleAutocompleteClose}
        />
      )}
    </Box>
  );
}
