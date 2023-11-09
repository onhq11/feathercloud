import { Box, Typography } from "@mui/material";
import DropzoneArea from "./DropzoneArea";
import FilesList from "./FilesList";
import { SnackbarProvider } from "notistack";

function App() {
  return (
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
        <Box
          sx={{
            width: "70%",
            height: "70%",
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
            sx={{ color: "#4dbc9d", fontWeight: "bold" }}
          >
            Upload files
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#a8a8a8", fontWeight: 600, mt: 1, mb: 4 }}
          >
            Upload files you want to share on nginx autoindex
          </Typography>
          <Box sx={{ display: "flex", flex: 1, gap: 5, height: "80%" }}>
            <DropzoneArea />
            <FilesList />
          </Box>
        </Box>
      </Box>
    </SnackbarProvider>
  );
}

export default App;
