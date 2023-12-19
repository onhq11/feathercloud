import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Preview from "../../Pages/Paste/Components/Preview";

export default function PreviewDialog({
  isOpen,
  handleClose,
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
  handleEditorContent,
  handleOpenUnsavedDialog,
  editorContent,
  handleAutocompleteClose,
  handleAutocompleteOpen,
}) {
  const handleCloseModal = () => {
    if (isUnsaved) {
      handleOpenUnsavedDialog({
        saveCallback: () => {
          handleSave(editorContent, false);
          handleClose();
        },
        cancelCallback: () => {
          handleClose();
        },
      });
      return;
    }

    handleClose();
  };

  return (
    <Dialog open={isOpen} fullScreen>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", p: 1 }}>
          Preview
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mx: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "80vh",
            gap: 4,
            flexDirection: "column",
          }}
        >
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
          onClick={handleCloseModal}
        >
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
}
