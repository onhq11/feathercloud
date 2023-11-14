import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Files from "./Files";

export default function FilesList({ handleOpenPreview, handleReloadList }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3002/api/files", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setFiles(res);
      });
  }, []);

  return (
    <Box
      sx={{
        flex: 1,
        gap: 2,
        display: "flex",
        flexDirection: "column",
        maxHeight: { xs: "", lg: "60vh" },
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: "#a8a8a8" }}>
        Files list
      </Typography>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100px",
          overflow: "auto",
        }}
      >
        {files.map((item, index) => (
          <Files
            key={index}
            data={item}
            handleOpenPreview={handleOpenPreview}
            handleReloadList={handleReloadList}
          />
        ))}
      </Box>
    </Box>
  );
}
