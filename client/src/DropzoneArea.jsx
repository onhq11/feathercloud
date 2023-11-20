import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useCallback, useState } from "react";
import { useSnackbar } from "notistack";

export default function DropzoneArea() {
  const { enqueueSnackbar } = useSnackbar();
  const [progress, setProgress] = useState(0);
  const [downloadInProgress, setDownloadInProgress] = useState(false);
  const [fileName, setFileName] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length <= 0) return;

    acceptedFiles.map((item) => {
      const formData = new FormData();
      formData.append("file", item);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          setFileName(acceptedFiles[0]?.name);
          const percentage = (event.loaded / event.total) * 100;
          setProgress(Math.round(percentage));
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

        setDownloadInProgress(false);
        setProgress(0);
        setFileName("");
      };

      setDownloadInProgress(true);
      xhr.open("POST", "/api/upload", true);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Authorization", localStorage.getItem("key"));
      xhr.send(formData);
    });
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
        maxHeight: { xs: "", lg: "60vh" },
      }}
      {...(!downloadInProgress && getRootProps())}
    >
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
      {downloadInProgress ? (
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
