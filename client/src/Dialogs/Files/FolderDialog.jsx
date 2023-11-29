import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { v4 } from "uuid";
import {
  ERROR_COMPLETE_FIELDS,
  ERROR_INTERNAL_SERVER,
  INFO_KEY_SAVED,
  STATUS_IDLE,
  STATUS_INSPECT,
  STATUS_INSPECT_ABORT,
  STATUS_OK,
  STATUS_WAITING,
} from "../../App";

export default function FolderDialog({ isOpen, handleClose, path }) {
  const [name, setName] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setName("");
  }, [isOpen]);

  const handleSubmit = () => {
    if (!(name.length > 0)) {
      enqueueSnackbar(ERROR_COMPLETE_FIELDS, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        style: {
          backgroundColor: "#dc4d5e",
          color: "white",
        },
        autoHideDuration: 1000,
      });
      return;
    }

    fetch(`/api/create/${path !== "~" ? path + "/" : ""}${name}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("key"),
      },
    })
      .then((res) => res.json())
      .then(() => {
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar(err.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          style: {
            backgroundColor: "#dc4d5e",
            color: "white",
          },
          autoHideDuration: 1000,
        });
      });
  };

  return (
    <Dialog open={isOpen} maxWidth="xl">
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", p: 1, pb: 0 }}>
          Create folder
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{ textAlign: "center", minWidth: "25vw", display: "flex" }}
      >
        <TextField
          sx={{ mt: 1, flex: 1, mx: 1 }}
          label={"Folder name"}
          value={name}
          onChange={(event) => setName(event.target.value)}
          variant="outlined"
          color="success"
          required
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          color="normal"
          variant="outlined"
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
          onClick={handleClose}
        >
          CANCEL
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
          onClick={handleSubmit}
        >
          CREATE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
