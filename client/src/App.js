import {
  Box,
  createTheme,
  IconButton,
  ThemeProvider,
  Typography,
} from "@mui/material";
import DropzoneArea from "./DropzoneArea";
import FilesList from "./FilesList";
import { SnackbarProvider } from "notistack";
import { useState } from "react";
import PreviewDialog from "./PreviewDialog";
import LoginDialog from "./LoginDialog";

export const STATUS_OK = "ok";
export const STATUS_INSPECT = "inspect";
export const STATUS_INSPECT_ABORT = "inspect_abort";
export const STATUS_WAITING = "waiting";
export const STATUS_IDLE = "idle";
export const STATUS_UPDATE_FILE = "update_file";

export const ERROR_INTERNAL_SERVER =
  "Error occurred, contact with administrator";
export const ERROR_COMPLETE_FIELDS = "Complete required fields";

export const INFO_KEY_SAVED = "Successfully saved user key";
export const INFO_URL_COPIED = "Successfully copied URL";

export default function App() {
  const [openPreview, setOpenPreview] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("");
  const [isDirectory, setIsDirectory] = useState(false);
  const [path, setPath] = useState("");
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleChangeInProgress = (value) => {
    setUploadInProgress(value);
  };

  const handleChangePath = (path) => {
    setPath(path);
  };

  const handleOpenPreview = (url, format, isDirectory) => {
    setUrl(url);
    setFormat(format);
    setOpenPreview(true);
    setIsDirectory(isDirectory);
  };

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  const theme = createTheme({
    palette: {
      success: {
        main: "#4cbd8b",
        contrastText: "#fff",
      },
      normal: {
        main: "#444",
        contrastText: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={5}
        autoHideDuration={2000}
        style={{ paddingRight: "50px" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <PreviewDialog
            isOpen={openPreview}
            handleClose={() => setOpenPreview(false)}
            url={url}
            format={format}
            isDirectory={isDirectory}
          />
          <LoginDialog
            isOpen={openLogin}
            handleClose={() => setOpenLogin(false)}
          />
          <Box
            sx={{
              width: { xs: "100%", sm: "70%" },
              minHeight: "70%",
              backgroundColor: "white",
              margin: "auto",
              borderRadius: "15px",
              boxShadow: "0px 0px 24px 22px rgba(216, 240, 234, 1)",
              py: 4,
              px: 4.5,
              flexDirection: "column",
              display: "flex",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h4"
                sx={{ color: "#4dbc9d", fontWeight: "bold", fontSize: 30 }}
              >
                Upload files
              </Typography>
              <IconButton size="small" onClick={handleOpenLogin}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4cbd8b"
                    d="M12 12q-1.65 0-2.825-1.175T8 8q0-1.65 1.175-2.825T12 4q1.65 0 2.825 1.175T16 8q0 1.65-1.175 2.825T12 12Zm-8 8v-2.8q0-.85.438-1.563T5.6 14.55q1.55-.775 3.15-1.163T12 13q1.65 0 3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20H4Z"
                  />
                </svg>
              </IconButton>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: "#a8a8a8",
                fontWeight: 600,
                mt: 1,
                mb: 4,
                fontSize: 18,
              }}
            >
              Upload files you want to share to server
            </Typography>
            <Box
              sx={{
                display: "flex",
                flex: 1,
                gap: 5,
                height: "80%",
                flexWrap: "wrap",
                flexDirection: { xs: "column", lg: "row" },
              }}
            >
              <DropzoneArea
                key={path}
                path={path}
                handleUpdateGlobalInProgress={handleChangeInProgress}
              />
              <FilesList
                handleOpenPreview={handleOpenPreview}
                handleChangeGlobalPath={handleChangePath}
                uploadInProgress={uploadInProgress}
              />
            </Box>
          </Box>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
