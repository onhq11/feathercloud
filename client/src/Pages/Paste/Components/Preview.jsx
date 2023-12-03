import {
  Autocomplete,
  Box,
  Chip,
  Divider,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import { monacoLanguages } from "./monacoLanguages";
import { useDebounceEffect } from "../../../Utils/customHooks";

export default function Preview({
  currentContent,
  disabled,
  handleSave,
  handleChangeGlobalLanguage,
  currentLanguage,
  fileName,
  isUnsaved,
  handleUnsaved,
  handleGetContent,
  currentFile,
  hasEditPermissions,
}) {
  const [autosave, setAutosave] = useState(
    localStorage.getItem("autosave") !== "false",
  );
  const [editorContent, setEditorContent] = useState(currentContent || "");
  const debounceContent = useDebounceEffect(editorContent || "", 1000);
  const [language, setLanguage] = useState(monacoLanguages[0]);
  const theme = useTheme();
  const isXlScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [editPermissions, setEditPermissions] = useState(false);

  useEffect(() => {
    setEditPermissions(hasEditPermissions);
  }, [hasEditPermissions]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (
        !disabled &&
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.keyCode === 83
      ) {
        event.preventDefault();
        if (editPermissions) {
          handleSave(editorContent, false);
        }

        const lastSlashIndex = currentFile.lastIndexOf("/");
        const folderPath = currentFile.substring(0, lastSlashIndex);
        const filePath = currentFile.substring(lastSlashIndex + 1);

        handleGetContent(folderPath, filePath, true);
        return;
      }

      if (
        !disabled &&
        (event.ctrlKey || event.metaKey) &&
        event.keyCode === 83
      ) {
        event.preventDefault();
        if (editPermissions) {
          handleSave(editorContent, false);
        }
        return;
      }
    };

    if (!disabled) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [disabled, editorContent, autosave, currentFile]);

  useEffect(() => {
    setEditorContent(currentContent);
  }, [currentContent]);

  useEffect(() => {
    handleUnsaved(currentContent !== editorContent);
  }, [editorContent]);

  useEffect(() => {
    if (
      autosave &&
      !disabled &&
      debounceContent !== currentContent &&
      editPermissions
    ) {
      handleSave(debounceContent, autosave);
    }
  }, [debounceContent]);

  useEffect(() => {
    handleChangeGlobalLanguage(language.id);
  }, [language]);

  useEffect(() => {
    setLanguage(
      monacoLanguages.find((lang) => lang.id === currentLanguage) ||
        monacoLanguages[0],
    );
  }, [currentLanguage]);

  useEffect(() => {
    localStorage.setItem("autosave", autosave);
  }, [autosave]);

  return (
    <Box
      sx={{
        flex: { xs: 1, lg: 0.6 },
        gap: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {disabled ? (
        <Typography
          sx={{
            color: "#b1b1b1",
            textAlign: "center",
            mt: "30%",
            fontSize: 20,
          }}
        >
          Select paste on the left sidebar
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 4,
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Box>
                <Tooltip title={fileName}>
                  <Typography sx={{ color: "#b1b1b1", fontSize: 18 }}>
                    {fileName?.length >
                    (isXlScreen ? 30 : isSmallScreen ? 15 : 7)
                      ? fileName.substring(
                          0,
                          isXlScreen ? 30 : isSmallScreen ? 15 : 7,
                        ) + "..."
                      : fileName}
                  </Typography>
                </Tooltip>
              </Box>
              {!autosave && isUnsaved && (
                <Chip label="Edited" color="success" />
              )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip title="Save & Copy (Ctrl+Shift+S)">
                <IconButton
                  onClick={() => {
                    if (editPermissions) {
                      handleSave(editorContent, autosave);
                    }
                    const lastSlashIndex = currentFile.lastIndexOf("/");
                    const folderPath = currentFile.substring(0, lastSlashIndex);
                    const filePath = currentFile.substring(lastSlashIndex + 1);

                    handleGetContent(folderPath, filePath, true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="#4cbd8b"
                      d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8Zm-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z"
                    />
                  </svg>
                </IconButton>
              </Tooltip>
              <Tooltip title="Save (Ctrl+S)">
                <span>
                  <IconButton
                    size="small"
                    disabled={autosave}
                    onClick={() => {
                      if (editPermissions) {
                        handleSave(editorContent, autosave);
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill={autosave ? "#b1b1b1" : "#4cbd8b"}
                        d="M21 7v12q0 .825-.587 1.413T19 21H5q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h12l4 4Zm-9 11q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6v4Z"
                      />
                    </svg>
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
          <Editor
            theme={"light"}
            language={language.id}
            value={editorContent}
            loading={"Loading..."}
            placeholder={"Select paste on the left sidebar"}
            options={{
              wordWrap: "on",
              minimap: {
                enabled: false,
              },
              cursorBlinking: "smooth",
              readOnly: !editPermissions,
            }}
            onChange={(value) => {
              setEditorContent(value);
            }}
          />
          <Divider flexItem />
          <Box
            sx={{
              display: "flex",
              mx: 2,
              alignItems: "center",
              gap: 3,
              justifyContent: "space-between",
            }}
          >
            {!!editPermissions && (
              <>
                <Box>
                  <span
                    style={{
                      color: "#b1b1b1",
                      marginRight: "1px",
                      fontSize: 13,
                    }}
                  >
                    Autosave
                  </span>
                  <Switch
                    checked={autosave}
                    onChange={(event, value) => setAutosave(value)}
                    color="success"
                    size="small"
                  />
                </Box>
                <Autocomplete
                  value={language}
                  onChange={(event, value) => {
                    setLanguage(value);
                  }}
                  disabled={disabled}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField {...params} variant="outlined" color="success" />
                  )}
                  options={monacoLanguages}
                  groupBy={(option) => option.text}
                  size="small"
                  sx={{ flex: 1, maxWidth: "50%" }}
                  disableClearable
                />
              </>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
