import DropzoneArea from "./Components/DropzoneArea";
import FilesList from "./Components/FilesList";
import { Box } from "@mui/material";
import { useState } from "react";

export default function Files({ handleReloadList, reloadList, isActive }) {
  const [path, setPath] = useState("");
  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleChangePath = (path) => {
    setPath(path);
  };

  const handleChangeInProgress = (value) => {
    setUploadInProgress(value);
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
      <DropzoneArea
        key={path}
        path={path}
        handleUpdateGlobalInProgress={handleChangeInProgress}
      />
      <FilesList
        handleChangeGlobalPath={handleChangePath}
        uploadInProgress={uploadInProgress}
        handleReloadList={handleReloadList}
        reloadList={reloadList}
        isActive={isActive}
      />
    </Box>
  );
}
