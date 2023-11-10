import {Box, createTheme, ThemeProvider, Typography} from "@mui/material";
import DropzoneArea from "./DropzoneArea";
import FilesList from "./FilesList";
import { SnackbarProvider } from "notistack";
import { useState } from "react";
import PreviewDialog from "./PreviewDialog";

function App() {
  const [reloadList, setReloadList] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("")

  const handleOpenPreview = (url, format) => {
    setUrl(url);
    setFormat(format)
    setOpenPreview(true);
  };

  const handleReloadList = () => {
    setReloadList(!reloadList);
  };

  const theme = createTheme({
    palette: {
      success: {
        main: '#4cbd8b',
        contrastText: "#fff"
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
          />
          <Box
            sx={{
              width: "70%",
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
            <Typography
              variant="h4"
              sx={{ color: "#4dbc9d", fontWeight: "bold", fontSize: 30 }}
            >
              Upload files
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "#a8a8a8", fontWeight: 600, mt: 1, mb: 4, fontSize: 18 }}
            >
              Upload files you want to share to server autoindex
            </Typography>
            <Box sx={{ display: "flex", flex: 1, gap: 5, height: "80%", flexWrap: "wrap", flexDirection: {xs: "column", lg: "row"} }}>
              <DropzoneArea handleReloadList={handleReloadList} />
              <FilesList key={reloadList} handleOpenPreview={handleOpenPreview} />
            </Box>
          </Box>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
