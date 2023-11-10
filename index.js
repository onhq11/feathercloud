const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const autoindex = require("express-autoindex");

dotenv.config();
const autoindexPath = process.env.AUTOINDEX_PATH;
const port = process.env.WEBSERVER_PORT;

const app = express();
const storage = multer.diskStorage({
  destination: autoindexPath,
  filename: (req, file, cb) => {
    const uniqueFileName = file.originalname;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage });

app.use("/files", autoindex("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("client/build"));
app.use(cors());

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send(`{"message": "No file uploaded"}`);
  }

  return res.status(200).send(`{"message": "File uploaded successfully"}`);
});

app.get("/api/files", (req, res) => {
  let out = [];

  fs.readdir(autoindexPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    Promise.all(
      files.map((file) => {
        const filePath = path.join(autoindexPath, file);

        return fs.promises
          .stat(filePath)
          .then((stats) => {
            out.push({
              name: file,
              size: stats.size,
              is_directory: stats.isDirectory(),
              last_modified: stats.mtime,
            });
          })
          .catch((err) => {
            console.error("Error getting file stats:", err);
          });
      }),
    )
      .then(() => {
        res.status(200).send(JSON.stringify(out));
      })
      .catch((err) => {
        console.error("Error processing files:", err);
        res.status(500).send("Internal Server Error");
      });
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
