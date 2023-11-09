import { Box, Button, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { useCallback } from "react";
import { useSnackbar } from "notistack";

export default function DropzoneArea() {
  const { enqueueSnackbar } = useSnackbar();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length <= 0) return;

    acceptedFiles.map((item) => {
      const formData = new FormData();
      formData.append("file", item);

      fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          enqueueSnackbar(data.message, {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            autoHideDuration: 1000,
          });
        })
        .catch((error) => {
          enqueueSnackbar(error.message, {
            variant: "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left",
            },
            autoHideDuration: 1000,
          });
        });
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        border: "3px dashed #c4e9dd",
        textAlign: "center",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        color: "#64c4a8",
      }}
      {...getRootProps()}
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
      {isDragActive ? (
        <Typography sx={{ fontWeight: 400, fontSize: 25 }}>
          Drop your file here...
        </Typography>
      ) : (
        <>
          <Typography sx={{ fontWeight: 400, fontSize: 25 }}>
            Drag and drop files here
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: 25 }}>- OR -</Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4cbd9d",
              mt: 2,
              textTransform: "capitalize",
              fontSize: 18,
              py: 1,
              px: 6,
              "&:hover": { backgroundColor: "#3cad8d" },
            }}
          >
            Browse Files
          </Button>
        </>
      )}
      <input {...getInputProps()} />
    </Box>
  );
}
