import DropzoneArea from "./Components/DropzoneArea";
import FilesList from "./Components/FilesList";
import { Box } from "@mui/material";
import { useState } from "react";
import PreviewDialog from "../../Dialogs/Files/PreviewDialog";

export default function Files({ handleReloadList, reloadList, isActive }) {
  const [path, setPath] = useState("");
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("");
  const [isDirectory, setIsDirectory] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

  const handleChangePath = (path) => {
    setPath(path);
  };

  const handleChangeInProgress = (value) => {
    setUploadInProgress(value);
  };

  const handleOpenPreview = (url, format, isDirectory) => {
    setUrl(url);
    setFormat(format);
    setOpenPreview(true);
    setIsDirectory(isDirectory);
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 5,
        justifyContent: "space-between",
        flexDirection: { xs: "column", lg: "row" },
        height: "90%",
      }}
    >
      <PreviewDialog
        isOpen={openPreview}
        handleClose={() => setOpenPreview(false)}
        url={url}
        format={format}
        isDirectory={isDirectory}
      />
      <DropzoneArea
        key={path}
        path={path}
        handleUpdateGlobalInProgress={handleChangeInProgress}
      />
      <FilesList
        handleOpenPreview={handleOpenPreview}
        handleChangeGlobalPath={handleChangePath}
        uploadInProgress={uploadInProgress}
        handleReloadList={handleReloadList}
        reloadList={reloadList}
        isActive={isActive}
      />
    </Box>
  );
}
