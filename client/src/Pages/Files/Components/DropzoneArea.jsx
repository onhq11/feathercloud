import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import UploadDialog from "../../../Dialogs/Files/UploadDialog";

export default function DropzoneArea({ path, handleUpdateGlobalInProgress }) {
  const { enqueueSnackbar } = useSnackbar();
  const [progress, setProgress] = useState([]);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [singleFile, setSingleFile] = useState(false);
  const [fileName, setFileName] = useState([]);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [currentPath, setCurrentPath] = useState(path);

  useEffect(() => {
    handleUpdateGlobalInProgress(downloadInProgress);
  }, [downloadInProgress]);

  const handleEmptyUploadObject = () => {
    setProgress([]);
    setFileName([]);
    setDownloadInProgress(false);
    setSingleFile(false);
  };

  useEffect(() => {
    setCurrentPath(path);
  }, [path]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length <= 0) return;
    if (downloadInProgress) return;

    const tempProgress = [];
    const tempFileName = [];

    acceptedFiles.map((item, index) => {
      const formData = new FormData();
      formData.append("file", item);

      const xhr = new XMLHttpRequest();
      tempFileName[index] = item?.name;

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentage = (event.loaded / event.total) * 100;

          setProgress((item) => {
            const newData = [...item];
            newData[index] = Math.round(percentage);
            return newData;
          });
        }
      });

      xhr.onload = () => {
        if (xhr.status !== 200) {
          enqueueSnackbar(JSON.parse(xhr.response).message, {
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
        }

        setProgress((item) => {
          const newData = [...item];
          newData[index] = 100;
          return newData;
        });
      };

      setProgress((item) => {
        const newData = [...item];
        newData[index] = 100;
        return newData;
      });

      xhr.open(
        "POST",
        "/api/upload/" + currentPath + item.path.replace(item.name + "/", ""),
        true,
      );
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Authorization", localStorage.getItem("key"));
      xhr.send(formData);
    });

    setFileName(tempFileName);
    setProgress(tempProgress);
    setDownloadInProgress(true);

    if (acceptedFiles.length > 1) {
      setOpenUploadModal(true);
    } else {
      setSingleFile(true);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <Box
      sx={{
        display: "flex",
        border: "3px dashed #c4e9dd",
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        color: "#64c4a8",
        py: { xs: 4, lg: 0 },
        maxHeight: { xs: "", lg: "55vh" },
      }}
      {...(!downloadInProgress && getRootProps())}
    >
      <UploadDialog
        isOpen={openUploadModal}
        handleClose={() => setOpenUploadModal(false)}
        progress={progress}
        fileName={fileName}
        handleEmptyUploadObject={handleEmptyUploadObject}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 16 16"
      >
        <path
          fill="#b1b1b1"
          d="M13.942 6.039a2.5 2.5 0 0 0-3.085-2.955a3 3 0 0 0-5.737.075A4 4 0 1 0 4 11h2v3h4v-3h3.5a2.5 2.5 0 0 0 .442-4.961zM9 10v3H7v-3H4.5L8 6.5l3.5 3.5H9z"
        />
      </svg>
      {singleFile ? (
        <>
          <Typography sx={{ fontWeight: 400, fontSize: 25 }}>
            Uploading...
          </Typography>
          <Typography sx={{ fontWeight: 100, fontSize: 15, opacity: 0.9 }}>
            {fileName}
          </Typography>
          <Box sx={{ width: "40%", mt: 2 }}>
            <LinearProgress
              color="inherit"
              variant="determinate"
              value={progress}
            />
          </Box>
        </>
      ) : (
        <>
          {isDragActive ? (
            <Typography sx={{ fontWeight: 400, fontSize: 25 }}>
              Drop your file here...
            </Typography>
          ) : (
            <>
              <Typography sx={{ fontWeight: 400, fontSize: 25 }}>
                Drag and drop files here
              </Typography>
              <Typography sx={{ fontWeight: 400, fontSize: 25 }}>
                - OR -
              </Typography>
              <Button
                variant="contained"
                color="success"
                sx={{
                  mt: 2,
                  textTransform: "capitalize",
                  fontSize: 18,
                  py: 1,
                  px: 6,
                }}
              >
                Browse Files
              </Button>
            </>
          )}
          <input {...getInputProps()} />
        </>
      )}
    </Box>
  );
}
