import { Box, Tooltip } from "@mui/material";

export default function Navigation({
  handleTabChange,
  currentTab,
  sliderLeft,
}) {
  return (
    <Box
      sx={{
        borderRadius: "25px",
        display: "flex",
        position: "relative",
        width: "110px",
        alignItems: "center",
        height: "36px",
        m: 2,
        backgroundColor: "white",
        boxShadow: "0px 0px 14px 12px rgba(216, 240, 234, 1)",
      }}
    >
      <Tooltip title="Upload files">
        <Box
          sx={{ px: 2, py: 0.5, cursor: "pointer", zIndex: 2 }}
          onClick={() => handleTabChange(0)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g fill={currentTab === 0 ? "white" : "#b1b1b1"}>
              <path
                fillRule="evenodd"
                d="M14 22h-4c-3.771 0-5.657 0-6.828-1.172C2 19.657 2 17.771 2 14v-4c0-3.771 0-5.657 1.172-6.828C4.343 2 6.239 2 10.03 2c.606 0 1.091 0 1.5.017c-.013.08-.02.161-.02.244l-.01 2.834c0 1.097 0 2.067.105 2.848c.114.847.375 1.694 1.067 2.386c.69.69 1.538.952 2.385 1.066c.781.105 1.751.105 2.848.105h4.052c.043.534.043 1.19.043 2.063V14c0 3.771 0 5.657-1.172 6.828C19.657 22 17.771 22 14 22Z"
                clipRule="evenodd"
              />
              <path d="m19.352 7.617l-3.96-3.563c-1.127-1.015-1.69-1.523-2.383-1.788L13 5c0 2.357 0 3.536.732 4.268C14.464 10 15.643 10 18 10h3.58c-.362-.704-1.012-1.288-2.228-2.383Z" />
            </g>
          </svg>
        </Box>
      </Tooltip>
      <Tooltip title="Paste content">
        <Box
          sx={{ px: 2, py: 0.5, cursor: "pointer", zIndex: 2 }}
          onClick={() => handleTabChange(1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 16 16"
          >
            <path
              fill={currentTab === 1 ? "white" : "#b1b1b1"}
              fillRule="evenodd"
              d="M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2"
            />
          </svg>
        </Box>
      </Tooltip>
      <Box
        sx={{
          backgroundColor: "#4cbd8b",
          width: "50%",
          height: "100%",
          position: "absolute",
          borderRadius: "25px",
          transform: `translateX(${sliderLeft * -1}%)`,
          transition: "0.3s",
        }}
      />
    </Box>
  );
}
