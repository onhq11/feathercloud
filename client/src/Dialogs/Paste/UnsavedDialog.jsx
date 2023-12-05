import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";

export default function UnsavedDialog({
  isOpen,
  handleClose,
  currentIsUnsaved,
  data,
}) {
  const [isUnsaved, setIsUnsaved] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const submitRef = useRef(null);

  useEffect(() => {
    setIsUnsaved(currentIsUnsaved);
  }, [currentIsUnsaved]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isOpen && event.key === "Enter") {
        submitRef.current.click();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} maxWidth="xl">
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", p: 1, pb: 0 }}>
          Leave editor
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{ textAlign: "center", minWidth: "25vw", display: "flex", mx: 1 }}
      >
        <Typography>Are you sure you want to exit without saving?</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          color="error"
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
          onClick={() => {
            data.cancelCallback();
            handleClose();
          }}
        >
          DON'T SAVE
        </Button>
        <Button
          color="success"
          variant="contained"
          startIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
            >
              <g
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              >
                <path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25" />
                <path d="m5.75 7.75l2.5 2.5l6-6.5" />
              </g>
            </svg>
          }
          ref={submitRef}
          onClick={() => {
            data.saveCallback();
            handleClose();
          }}
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
