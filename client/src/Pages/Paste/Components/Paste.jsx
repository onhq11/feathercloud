import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { formatDate } from "../../../Utils/formattingUtils";
import { useSnackbar } from "notistack";
import { INFO_URL_COPIED } from "../../../App";

export default function Paste({
  data,
  handleReloadList,
  path,
  handleChangePath,
  handleGetContent,
  handleCloseEditor,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isXlScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  const generateUrl = (name) => {
    return "/p/" + name;
  };

  const handleOpen = () => {
    if (data.is_directory) {
      handleChangePath(data.name);
    } else {
      handleGetContent(data.name, false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid lightgray",
        p: 1,
        borderRadius: "9px",
        position: "relative",
        overflow: "hidden",
        minHeight: "60px",
        cursor: "pointer",
        transition: "0.2s",
        "&:hover": {
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        },
      }}
      onClick={handleOpen}
    >
      <Box sx={{ px: 2.5, py: 1.5 }}>
        {data.is_directory ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
          >
            <g
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            >
              <path d="M0 0h24v24H0z" />
              <path
                fill="#b1b1b1"
                d="M9 3a1 1 0 0 1 .608.206l.1.087L12.414 6H19a3 3 0 0 1 2.995 2.824L22 9v8a3 3 0 0 1-2.824 2.995L19 20H5a3 3 0 0 1-2.995-2.824L2 17V6a3 3 0 0 1 2.824-2.995L5 3h4z"
              />
            </g>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
          >
            <path
              fill="#b1b1b1"
              d="M16.25 2a.75.75 0 0 1 .743.648L17 2.75v.749h.749a2.25 2.25 0 0 1 2.25 2.25V16h-3.754l-.154.005a2.25 2.25 0 0 0-2.09 2.084l-.006.161v3.755H5.754a2.25 2.25 0 0 1-2.25-2.25L3.502 5.75a2.25 2.25 0 0 1 2.25-2.25l.747-.001l.001-.749a.75.75 0 0 1 1.493-.102L8 2.75v.749h3V2.75a.75.75 0 0 1 1.494-.102l.007.102v.749h2.997l.001-.749a.75.75 0 0 1 .75-.75Zm3.31 15.5l-4.066 4.065l.001-3.315l.007-.102a.75.75 0 0 1 .641-.641l.102-.007h3.314ZM11.247 16H7.25l-.102.007a.75.75 0 0 0 0 1.486l.102.007h3.998l.102-.007a.75.75 0 0 0 0-1.486L11.248 16Zm5-4H7.25l-.102.007a.75.75 0 0 0 0 1.486l.102.007h8.998l.102-.007a.75.75 0 0 0 0-1.486L16.248 12Zm0-4H7.25l-.102.007a.75.75 0 0 0 0 1.486l.102.007h8.998l.102-.007a.75.75 0 0 0 0-1.486L16.248 8Z"
            />
          </svg>
        )}
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box>
          <Tooltip title={data.name}>
            <Typography
              sx={{ color: "#919191", cursor: "pointer" }}
              onClick={(event) => {
                event.stopPropagation();
                window.navigator.clipboard
                  .writeText(
                    window.location.href.substring(
                      0,
                      window.location.href.length - 1,
                    ) + generateUrl(data.name),
                  )
                  .then(() => {
                    enqueueSnackbar(INFO_URL_COPIED, {
                      variant: "success",
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      autoHideDuration: 1000,
                      style: {
                        backgroundColor: "#4cbd8b",
                        color: "white",
                      },
                    });
                  });
              }}
            >
              {data.name.length > (isXlScreen ? 30 : isSmallScreen ? 15 : 7)
                ? data.name.substring(
                    0,
                    isXlScreen ? 30 : isSmallScreen ? 15 : 7,
                  ) + "..."
                : data.name}
            </Typography>
          </Tooltip>
          <Typography sx={{ color: "#c1c1c1", fontSize: 12, mt: 1 }}>
            {formatDate(data.last_modified)}
          </Typography>
        </Box>
        <Box sx={{ minWidth: "120px", justifyContent: "end", display: "flex" }}>
          <Tooltip title="Remove">
            <IconButton
              onClick={(event) => {
                event.stopPropagation();

                fetch(
                  "/api/paste/remove/" +
                    (path !== "~" ? path + "/" + data.name : data.name),
                  {
                    method: "DELETE",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                      Authorization: localStorage.getItem("key"),
                    },
                  },
                )
                  .then((res) => {
                    if (res.status !== 200) {
                      return res.json().then((error) => {
                        throw new Error(error.message);
                      });
                    }

                    return res.json();
                  })
                  .then(() => {
                    handleReloadList();
                    handleCloseEditor();
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
          </Tooltip>
          {!data.is_directory && (
            <Tooltip title="Copy">
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  handleGetContent(data.name, true);
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
                    d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8Zm-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z"
                  />
                </svg>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Open">
            <IconButton>
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
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}
