import DropzoneArea from "./Components/DropzoneArea";
import FilesList from "./Components/FilesList";
import { Box } from "@mui/material";

export default function Files({
  handleChangeInProgress,
  handleOpenPreview,
  handleChangePath,
  uploadInProgress,
  path,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        gap: 5,
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
  );
}
