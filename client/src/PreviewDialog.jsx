import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function PreviewDialog({
  url,
  format,
  isOpen,
  handleClose,
  isDirectory,
}) {
  const previewableArray = [
    // Images
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",

    // Documents
    ".pdf",

    // Text
    ".txt",
    ".md",

    // Audio
    ".mp3",
    ".ogg",

    // Video
    ".mp4",
    ".webm",
    ".ogv",

    // Web
    ".html",
    ".htm",
    ".css",
  ];

  return (
    <Dialog open={isOpen} maxWidth="xl">
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold", p: 1 }}>
          Preview
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          overflow: !(previewableArray.includes(format) || isDirectory)
            ? "hidden"
            : "",
          position: "relative",
        }}
      >
        {previewableArray.includes(format) || isDirectory ? (
          <iframe
            title="Preview"
            src={url}
            style={{
              outline: "none",
              border: "none",
              height: "80vh",
              width: "80vw",
            }}
          />
        ) : (
          <Box
            sx={{
              height: "80vh",
              width: "80vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="128"
                height="128"
                viewBox="0 0 24 24"
              >
                <g fill="#b1b1b1">
                  <path
                    fill-rule="evenodd"
                    d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828C4.343 2 6.239 2 10.03 2c.606 0 1.091 0 1.5.017c-.013.08-.02.161-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22Z"
                    clip-rule="evenodd"
                  />
                  <path d="m19.352 7.617l-3.96-3.563c-1.127-1.015-1.69-1.523-2.383-1.788L13 5c0 2.357 0 3.536.732 4.268C14.464 10 15.643 10 18 10h3.58c-.362-.704-1.012-1.288-2.228-2.383Z" />
                </g>
              </svg>
              <Typography
                variant="h6"
                sx={{ color: "#b1b1b1", marginTop: "50px", fontSize: 24 }}
              >
                Format is not supported to preview, you can{" "}
                <a href={url} style={{ color: "#4cbd8b" }}>
                  download it here
                </a>
              </Typography>
            </Box>
          </Box>
        )}
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
          onClick={handleClose}
        >
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
}
