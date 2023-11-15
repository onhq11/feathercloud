import { Box, IconButton, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

export default function Files({ data, handleOpenPreview, handleReloadList }) {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid lightgray",
        p: 1,
        borderRadius: "4px",
      }}
    >
      <Box sx={{ px: 3, py: 1.5 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
        >
          <g fill="#b1b1b1">
            <path
              fillRule="evenodd"
              d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828C4.343 2 6.239 2 10.03 2c.606 0 1.091 0 1.5.017c-.013.08-.02.161-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22Z"
              clipRule="evenodd"
            />
            <path d="m19.352 7.617l-3.96-3.563c-1.127-1.015-1.69-1.523-2.383-1.788L13 5c0 2.357 0 3.536.732 4.268C14.464 10 15.643 10 18 10h3.58c-.362-.704-1.012-1.288-2.228-2.383Z" />
          </g>
        </svg>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ color: "#919191" }}>{data.name}</Typography>
          <Typography sx={{ color: "#c1c1c1", fontSize: 12, mt: 1 }}>
            {data.last_modified}
          </Typography>
        </Box>
        <Box sx={{ minWidth: "120px" }}>
          <IconButton
            onClick={() => {
              fetch("/api/remove", {
                method: "DELETE",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  Authorization: localStorage.getItem("key"),
                },
                body: JSON.stringify({ filename: data.name }),
              })
                .then((res) => {
                  if (res.status !== 200) {
                    return res.json().then((error) => {
                      handleReloadList();
                      throw new Error(error.message);
                    });
                  }

                  return res.json();
                })
                .then((res) => {
                  enqueueSnackbar(res.message, {
                    variant: "success",
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    autoHideDuration: 2000,
                    style: {
                      backgroundColor: "#4cbd8b",
                      color: "white",
                    },
                  });
                  handleReloadList();
                })
                .catch((err) => {
                  console.error(err);
                  enqueueSnackbar(err.message, {
                    variant: "error",
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    autoHideDuration: 2000,
                    style: {
                      backgroundColor: "#dc4d5e",
                      color: "white",
                    },
                  });
                  handleReloadList();
                });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 256 256"
            >
              <path
                fill="#dc4d5e"
                d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z"
              />
            </svg>
          </IconButton>
          <IconButton
            onClick={() => {
              handleOpenPreview(
                "/files/" + data.name,
                "." + data.name.split(".")[data.name.split(".").length - 1],
                data.is_directory,
              );
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 256 256"
            >
              <path
                fill="#4cbd8b"
                d="M247.31 124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57 61.26 162.88 48 128 48S61.43 61.26 36.34 86.35C17.51 105.18 9 124 8.69 124.76a8 8 0 0 0 0 6.5c.35.79 8.82 19.57 27.65 38.4C61.43 194.74 93.12 208 128 208s66.57-13.26 91.66-38.34c18.83-18.83 27.3-37.61 27.65-38.4a8 8 0 0 0 0-6.5ZM128 192c-30.78 0-57.67-11.19-79.93-33.25A133.47 133.47 0 0 1 25 128a133.33 133.33 0 0 1 23.07-30.75C70.33 75.19 97.22 64 128 64s57.67 11.19 79.93 33.25A133.46 133.46 0 0 1 231.05 128c-7.21 13.46-38.62 64-103.05 64Zm0-112a48 48 0 1 0 48 48a48.05 48.05 0 0 0-48-48Zm0 80a32 32 0 1 1 32-32a32 32 0 0 1-32 32Z"
              />
            </svg>
          </IconButton>
          <IconButton
            onClick={() => {
              window.open("/files/" + data.name);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 256 256"
            >
              <path
                fill="#b1b1b1"
                d="m141.66 133.66l-40 40a8 8 0 0 1-11.32-11.32L116.69 136H24a8 8 0 0 1 0-16h92.69L90.34 93.66a8 8 0 0 1 11.32-11.32l40 40a8 8 0 0 1 0 11.32ZM192 32h-56a8 8 0 0 0 0 16h56v160h-56a8 8 0 0 0 0 16h56a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16Z"
              />
            </svg>
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}
