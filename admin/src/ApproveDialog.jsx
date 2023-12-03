import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import {
  INFO_PERMISSIONS_GRANTED,
  STATUS_APPROVE,
  STATUS_INSPECT,
  STATUS_INSPECT_ABORT,
} from "./App";

export default function ApproveDialog({
  isOpen,
  handleClose,
  data,
  sendJsonMessage,
}) {
  const [friendlyName, setFriendlyName] = useState(data?.friendlyName ?? "");
  const [checkboxState, setCheckboxState] = useState({
    file_upload: data?.currentPermissions?.includes("file.upload") ?? false,
    file_delete: data?.currentPermissions?.includes("file.delete") ?? false,
    paste_create: data?.currentPermissions?.includes("paste.create") ?? false,
    paste_delete: data?.currentPermissions?.includes("paste.delete") ?? false,
  });
  const { enqueueSnackbar } = useSnackbar();
  const submitRef = useRef(null);

  useEffect(() => {
    setFriendlyName(data?.friendlyName || "");
    setCheckboxState({
      file_upload: data?.currentPermissions?.includes("file.upload") ?? false,
      file_delete: data?.currentPermissions?.includes("file.delete") ?? false,
      paste_create: data?.currentPermissions?.includes("paste.create") ?? false,
      paste_delete: data?.currentPermissions?.includes("paste.delete") ?? false,
    });

    if (!!data.userId) {
      if (isOpen) {
        sendJsonMessage({
          status: STATUS_INSPECT,
          userId: data.userId,
        });
      } else {
        sendJsonMessage({
          status: STATUS_INSPECT_ABORT,
          userId: data.userId,
        });
      }
    }

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
  }, [
    isOpen,
    data?.currentPermissions,
    data?.friendlyName,
    data.userId,
    sendJsonMessage,
  ]);

  const handleChangeCheckbox = (event, name) => {
    setCheckboxState({
      ...checkboxState,
      [name]: event.target.checked,
    });
  };

  const generateRandomString = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < 64; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  };

  const generatePermissions = () => {
    const permissions = [];
    Object.values(checkboxState).map((item, index) => {
      if (item) {
        permissions.push(Object.keys(checkboxState)[index].replace(/_/g, "."));
      }

      return null;
    });

    return permissions;
  };

  const handleApprove = () => {
    sendJsonMessage({
      status: STATUS_APPROVE,
      userId: data.userId,
      key: data.currentKey || generateRandomString(),
      permissions: generatePermissions(),
      friendlyName,
    });

    enqueueSnackbar(INFO_PERMISSIONS_GRANTED, {
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
  };

  return (
    <Dialog open={isOpen} maxWidth="xl" disableEscapeKeyDown>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", m: 1, mb: 0 }}>
          Approve user
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            mt: 1,
            justifyContent: "space-between",
            gap: 2,
            minWidth: "30vw",
          }}
        >
          <TextField
            label="User ID"
            value={data.userId}
            disabled
            color="success"
            sx={{ flex: 1 }}
          />
          <TextField
            label="Friendly Name"
            value={friendlyName}
            onChange={(event) => setFriendlyName(event.target.value)}
            color="success"
            sx={{ flex: 1 }}
          />
        </Box>
        <Typography variant="h6" sx={{ mt: 2 }}>
          File Permissions
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                color="success"
                checked={checkboxState.file_upload}
                onChange={(event) => handleChangeCheckbox(event, "file_upload")}
              />
            }
            label="File Upload"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="success"
                checked={checkboxState.file_delete}
                onChange={(event) => handleChangeCheckbox(event, "file_delete")}
              />
            }
            label="File Delete"
          />
        </FormGroup>
        <Typography variant="h6" sx={{ mt: 2 }}>
          Paste Permissions
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                color="success"
                checked={checkboxState.paste_create}
                onChange={(event) =>
                  handleChangeCheckbox(event, "paste_create")
                }
              />
            }
            label="Create paste"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="success"
                checked={checkboxState.paste_delete}
                onChange={(event) =>
                  handleChangeCheckbox(event, "paste_delete")
                }
              />
            }
            label="Delete paste"
          />
        </FormGroup>
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
          onClick={handleApprove}
          ref={submitRef}
        >
          APPROVE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
