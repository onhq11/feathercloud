import {
  Box,
  createTheme,
  IconButton,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import DropzoneArea from "./Pages/Files/Components/DropzoneArea";
import FilesList from "./Pages/Files/Components/FilesList";
import { SnackbarProvider } from "notistack";
import { useEffect, useState } from "react";
import PreviewDialog from "./Dialogs/Files/PreviewDialog";
import LoginDialog from "./Dialogs/LoginDialog";
import { useSwipeable } from "react-swipeable";
import Header from "./Pages/Files/Header";
import Files from "./Pages/Files/Files";
import Paste from "./Pages/Paste/Paste";
import Navigation from "./Navigation";

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
  const [currentTab, setCurrentTab] = useState(0);
  const [sliderLeft, setSliderLeft] = useState(0);
  const [sliderOpacity, setSliderOpacity] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleTabChange(1);
      } else if (event.key === "ArrowLeft") {
        handleTabChange(0);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      if (eventData.dir === "Left") {
        handleTabChange(1);
      } else if (eventData.dir === "Right") {
        handleTabChange(0);
      }
    },
  });

  const handleTabChange = (tab) => {
    switch (tab) {
      case 0:
        setCurrentTab(0);
        setSliderLeft(0);
        setSliderOpacity(1);
        break;

      case 1:
        setCurrentTab(1);
        setSliderLeft(-100);
        setSliderOpacity(0);
        break;
    }
  };

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
            height: { xs: "100%", sm: "80%" },
            display: "flex",

            flexDirection: "column",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "15px",
              boxShadow: "0px 0px 24px 22px rgba(216, 240, 234, 1)",
              py: 4,
              px: 4.5,
              flex: 1,
            }}
            {...handlers}
          >
            <Box
              sx={{
                display: "flex",
                flex: 1,
                position: "relative",
                overflowX: "hidden",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  transform: `translateX(${sliderLeft}%)`,
                  transition: "0.3s",
                  opacity: sliderOpacity,
                }}
              >
                <Header handleOpenLogin={handleOpenLogin} />
                <Files
                  handleChangeInProgress={handleChangeInProgress}
                  handleChangePath={handleChangePath}
                  handleOpenPreview={handleOpenPreview}
                  uploadInProgress={uploadInProgress}
                  path={path}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  left: "100%",
                  transform: `translateX(${sliderLeft}%)`,
                  transition: "0.3s",
                  opacity: +!sliderOpacity,
                }}
              >
                <Header handleOpenLogin={handleOpenLogin} />
                <Paste />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Navigation
              handleTabChange={handleTabChange}
              currentTab={currentTab}
              sliderLeft={sliderLeft}
            />
          </Box>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
