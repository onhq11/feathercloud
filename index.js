const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const autoindex = require("express-autoindex");

const FILE_UPLOAD = "file.upload";
const FILE_DELETE = "file.delete";
const PASTE_CREATE = "paste.create";
const PASTE_DELETE = "paste.delete";

const STATUS_WAITING = "waiting";
const STATUS_APPROVE = "approve";
const STATUS_OK = "ok";
const STATUS_ERROR = "internal_server_error";
const STATUS_FORBIDDEN = "forbidden";
const STATUS_IDLE = "idle";
const STATUS_INSPECT = "inspect";
const STATUS_INSPECT_ABORT = "inspect_abort";
const STATUS_DELETE = "delete";
const STATUS_UPDATE_FILE = "update_file";

const ERROR_FILE_UPLOAD = "There was an error uploading file";
const ERROR_FILE_REMOVE = "There was an error removing file";
const ERROR_FORBIDDEN = "You do not have permissions";
const ERROR_INTERNAL_SERVER = "Internal server error";
const ERROR_CREATE_FOLDER = "There was an error creating folder";
const ERROR_PASTE_SAVE = "There was an error saving paste";
const ERROR_PASTE_READ = "There was an error reading paste";
const ERROR_PASTE_REMOVE = "There was an error removing paste";

const SUCCESS_FILE_UPLOAD = "File uploaded successfully";
const SUCCESS_FILE_REMOVE = "File removed successfully";
const SUCCESS_CREATE_FOLDER = "Folder created successfully";
const SUCCESS_PASTE_SAVE = "Paste saved successfully";
const SUCCESS_PASTE_READ = "Paste read successfully";
const SUCCESS_PASTE_REMOVE = "Paste removed successfully";

const WS_SUCCESS_FILE_ADDED = "New file added";
const WS_SUCCESS_FILE_REMOVED = "File removed";
const WS_SUCCESS_FOLDER_CREATED = "Folder created";
const WS_SUCCESS_GENERATED_KEY = "Successfully generated key";
const WS_SUCCESS_PASTE_REMOVED = "Paste removed";
const WS_SUCCESS_PASTE_CREATED = "Paste created";

const IN_QUEUE = 1;
const AUTHORIZED = 2;

const generateResponse = (status, message, other) => {
  const out = {
    status,
    message,
    ...other,
  };
  return JSON.stringify(out);
};

const returnDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year > 9 ? year : "0" + year}-${month > 9 ? month : "0" + month}-${
    day > 9 ? day : "0" + day
  } ${hours > 9 ? hours : "0" + hours}:${
    minutes > 9 ? minutes : "0" + minutes
  }:${seconds > 9 ? seconds : "0" + seconds}`;
};

const sendLog = (value, ...other) => {
  console.log(
    `[\x1b[35m${returnDate()}\x1b[0m] [\x1b[32mOK\x1b[0m] ${value}`,
    ...other,
  );
};

const sendError = (value, ...other) => {
  const date = new Date();
  console.log(
    `[\x1b[35m${returnDate()}\x1b[0m] [\x1b[31mERROR\x1b[0m] ${value}`,
    ...other,
  );
};

const sendInfo = (value, ...other) => {
  const date = new Date();
  console.log(
    `[\x1b[35m${returnDate()}\x1b[0m] [\x1b[34mINFO\x1b[0m] ${value}`,
    ...other,
  );
};

dotenv.config();
const autoindexPath = process.env.AUTOINDEX_PATH;
const pastesPath = process.env.PASTES_PATH;
const port = process.env.WEBSERVER_PORT;
const adminPort = process.env.ADMIN_PANEL_PORT;

let clients = {};
let waitingClients = {};
let admins = {};
let users = { users: [] };

fs.readFile("users.json", (err, file) => {
  if (err) {
    sendError(err.message || err);
    return;
  }

  users = JSON.parse(file.toString());
});

const createDirectoryIfNotExists = async (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

const app = express();

let adminApp;
if (process.env.WEBSERVER_PORT === process.env.ADMIN_PANEL_PORT) {
  adminApp = app;
} else {
  adminApp = express();
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path
      .join(autoindexPath, req.params[0].replace(/\.\.\//g, ""))
      .replace(/~/g, "");

    createDirectoryIfNotExists(uploadPath);

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = file.originalname;
    cb(null, uniqueFileName);
  },
});

require("express-ws")(app);
require("express-ws")(adminApp);
const upload = multer({ storage });
const fileUpload = upload.single("file");

app.use("/f", autoindex("uploads"));
app.use("/p", autoindex("pastes"));
app.use(express.json());
app.use(express.static("client/build"));
adminApp.use(express.static("admin/build"));
app.use(cors());

app.post("/api/file/upload/*", (req, res) => {
  const user = users.users.find(
    (item) => item.key === req.headers.authorization,
  );
  if (!!user && user.permissions.includes(FILE_UPLOAD)) {
    fileUpload(req, res, (err) => {
      if (err) {
        sendError(err.message || err);
        return res
          .status(500)
          .send(generateResponse(STATUS_ERROR, ERROR_FILE_UPLOAD));
      }

      Object.values(clients).map((item) => {
        item.send(generateResponse(STATUS_UPDATE_FILE, WS_SUCCESS_FILE_ADDED));
      });

      return res
        .status(200)
        .send(generateResponse(STATUS_OK, SUCCESS_FILE_UPLOAD));
    });
  } else {
    return res
      .status(403)
      .send(generateResponse(STATUS_FORBIDDEN, ERROR_FORBIDDEN));
  }
});

app.post("/api/paste/edit/*", (req, res) => {
  const user = users.users.find(
    (item) => item.key === req.headers.authorization,
  );
  if (!!user && user.permissions.includes(PASTE_CREATE)) {
    const requestedPath = req.params[0].replace(/\.\.\//g, "");
    const writePath = path.join(pastesPath, requestedPath).replace(/~/g, "");

    fs.writeFile(
      writePath,
      "-_- LANGUAGE=" +
        (req.body?.language || "text") +
        " -_-\n" +
        req.body.content,
      (err) => {
        if (err) {
          sendError(err.message || err);
          return res
            .status(500)
            .send(generateResponse(STATUS_ERROR, ERROR_PASTE_SAVE));
        }

        if (
          !(req.body.content?.length > 0) &&
          !(req.body.language?.length > 0)
        ) {
          Object.values(clients).map((item) => {
            item.send(
              generateResponse(STATUS_UPDATE_FILE, WS_SUCCESS_PASTE_CREATED),
            );
          });
        }

        return res
          .status(200)
          .send(generateResponse(STATUS_OK, SUCCESS_PASTE_SAVE));
      },
    );
  } else {
    return res
      .status(403)
      .send(generateResponse(STATUS_FORBIDDEN, ERROR_FORBIDDEN));
  }
});

app.get("/api/paste/read/*", (req, res) => {
  const requestedPath = req.params[0].replace(/\.\.\//g, "");
  const readPath = path.join(pastesPath, requestedPath).replace(/~/g, "");

  const user = users.users.find(
    (item) => item.key === req.headers.authorization,
  );

  fs.readFile(readPath, (err, data) => {
    if (err) {
      sendError(err.message || err);
      return res
        .status(500)
        .send(generateResponse(STATUS_ERROR, ERROR_PASTE_READ));
    }

    return res.status(200).send(
      generateResponse(STATUS_OK, SUCCESS_PASTE_READ, {
        content: data,
        hasEditPermission: user?.permissions?.includes(PASTE_CREATE),
      }),
    );
  });
});

app.delete("/api/file/remove/*", (req, res) => {
  const user = users.users.find(
    (item) => item.key === req.headers.authorization,
  );
  if (!!user && user.permissions.includes(FILE_DELETE)) {
    const requestedPath = req.params[0].replace(/\.\.\//g, "");
    const removePath = path
      .join(autoindexPath, requestedPath)
      .replace(/~/g, "");

    fs.rm(removePath, { recursive: true }, (err) => {
      if (err) {
        sendError(err.message || err);
        return res
          .status(500)
          .send(generateResponse(STATUS_ERROR, ERROR_FILE_REMOVE));
      }

      Object.values(clients).map((item) => {
        item.send(
          generateResponse(STATUS_UPDATE_FILE, WS_SUCCESS_FILE_REMOVED),
        );
      });

      return res
        .status(200)
        .send(generateResponse(STATUS_OK, SUCCESS_FILE_REMOVE));
    });
  } else {
    return res
      .status(403)
      .send(generateResponse(STATUS_FORBIDDEN, ERROR_FORBIDDEN));
  }
});

app.delete("/api/paste/remove/*", (req, res) => {
  const user = users.users.find(
    (item) => item.key === req.headers.authorization,
  );
  if (!!user && user.permissions.includes(PASTE_DELETE)) {
    const requestedPath = req.params[0].replace(/\.\.\//g, "");
    const removePath = path.join(pastesPath, requestedPath).replace(/~/g, "");

    fs.rm(removePath, { recursive: true }, (err) => {
      if (err) {
        sendError(err.message || err);
        return res
          .status(500)
          .send(generateResponse(STATUS_ERROR, ERROR_PASTE_REMOVE));
      }

      Object.values(clients).map((item) => {
        item.send(
          generateResponse(STATUS_UPDATE_FILE, WS_SUCCESS_PASTE_REMOVED),
        );
      });

      return res
        .status(200)
        .send(generateResponse(STATUS_OK, SUCCESS_PASTE_REMOVE));
    });
  } else {
    return res
      .status(403)
      .send(generateResponse(STATUS_FORBIDDEN, ERROR_FORBIDDEN));
  }
});

app.get("/api/files/*", (req, res) => {
  let out = [];

  const requestedDirectory = req.params[0].replace(/\.\.\//g, "");
  const directoryToRead = path
    .join(autoindexPath, requestedDirectory)
    .replace(/~/g, "");

  fs.readdir(directoryToRead, (err, files) => {
    if (err) {
      sendError("Error reading directory:", err.message || err);
      return;
    }

    Promise.all(
      files.map((file) => {
        const filePath = path.join(directoryToRead, file);

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
            sendError("Error getting file stats:", err.message || err);
          });
      }),
    )
      .then(() => {
        res.status(200).send(JSON.stringify(out));
      })
      .catch((err) => {
        sendError("Error processing files:", err.message || err);
        res
          .status(500)
          .send(generateResponse(STATUS_ERROR, ERROR_INTERNAL_SERVER));
      });
  });
});

app.get("/api/pastes/*", (req, res) => {
  let out = [];

  const requestedDirectory = req.params[0].replace(/\.\.\//g, "");
  const directoryToRead = path
    .join(pastesPath, requestedDirectory)
    .replace(/~/g, "");

  fs.readdir(directoryToRead, (err, files) => {
    if (err) {
      sendError("Error reading directory:", err.message || err);
      return;
    }

    Promise.all(
      files.map((file) => {
        const filePath = path.join(directoryToRead, file);

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
            sendError("Error getting file stats:", err.message || err);
          });
      }),
    )
      .then(() => {
        res.status(200).send(JSON.stringify(out));
      })
      .catch((err) => {
        sendError("Error processing files:", err.message || err);
        res
          .status(500)
          .send(generateResponse(STATUS_ERROR, ERROR_INTERNAL_SERVER));
      });
  });
});

app.get("/api/file/create/*", (req, res) => {
  const user = users.users.find(
    (item) => item.key === req.headers.authorization,
  );
  if (!!user && user.permissions.includes(FILE_UPLOAD)) {
    fs.mkdir(
      `${autoindexPath}/${req.params[0].replace(/\.\.\//g, "")}`,
      { recursive: true },
      (err) => {
        if (err) {
          sendError(err.message || err);
          return res
            .status(500)
            .send(generateResponse(STATUS_ERROR, ERROR_CREATE_FOLDER));
        }

        Object.values(clients).map((item) => {
          item.send(
            generateResponse(STATUS_UPDATE_FILE, WS_SUCCESS_FOLDER_CREATED),
          );
        });

        return res
          .status(200)
          .send(generateResponse(STATUS_OK, SUCCESS_CREATE_FOLDER));
      },
    );
  } else {
    return res
      .status(403)
      .send(generateResponse(STATUS_FORBIDDEN, ERROR_FORBIDDEN));
  }
});

app.get("/api/paste/create/*", (req, res) => {
  const user = users.users.find(
    (item) => item.key === req.headers.authorization,
  );
  if (!!user && user.permissions.includes(PASTE_CREATE)) {
    fs.mkdir(
      `${pastesPath}/${req.params[0].replace(/\.\.\//g, "")}`,
      { recursive: true },
      (err) => {
        if (err) {
          sendError(err.message || err);
          return res
            .status(500)
            .send(generateResponse(STATUS_ERROR, ERROR_CREATE_FOLDER));
        }

        Object.values(clients).map((item) => {
          item.send(
            generateResponse(STATUS_UPDATE_FILE, WS_SUCCESS_FOLDER_CREATED),
          );
        });

        return res
          .status(200)
          .send(generateResponse(STATUS_OK, SUCCESS_CREATE_FOLDER));
      },
    );
  } else {
    return res
      .status(403)
      .send(generateResponse(STATUS_FORBIDDEN, ERROR_FORBIDDEN));
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

adminApp.get(
  process.env.WEBSERVER_PORT === process.env.ADMIN_PANEL_PORT ? "/panel" : "/",
  (req, res) => {
    res.sendFile(path.resolve(__dirname, "admin", "build", "index.html"));
  },
);

adminApp.ws("/admin", (ws, req) => {
  let admin = "";

  ws.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.status) {
      case STATUS_APPROVE:
        if (!!waitingClients?.[message.userId]) {
          waitingClients[message.userId].send(
            JSON.stringify({
              status: STATUS_OK,
              message: WS_SUCCESS_GENERATED_KEY,
              key: message.key,
              friendlyName: message.friendlyName,
            }),
          );
        }
        sendInfo(message.userId, "key was sent");

        fs.readFile("users.json", (err, file) => {
          let content = {};
          if (!!err && err?.code !== "ENOENT") {
            sendError(err.message || err);
            return;
          }

          if (err?.code !== "ENOENT") {
            content = JSON.parse(file.toString());
          }

          if (!(content.users?.length > 0)) {
            content.users = [];
          }

          const existsIndex = content.users.findIndex(
            (item) => item.userId === message.userId,
          );
          if (existsIndex === -1) {
            content.users.push({
              key: message.key,
              permissions: message.permissions,
              userId: message.userId,
              friendlyName: message.friendlyName,
            });
          } else {
            content.users[existsIndex] = {
              key: message.key,
              permissions: message.permissions,
              userId: message.userId,
              friendlyName: message.friendlyName,
            };
          }

          users = { ...content };
          refreshClients();

          fs.writeFile("users.json", JSON.stringify(content), (err) => {
            if (err) {
              sendError(err.message || err);
              return;
            }

            sendInfo("Updated users.json config");
          });
        });
        break;

      case STATUS_WAITING:
        admin = message.userId;
        sendInfo("Administrator", admin, "connected");
        admins[admin] = ws;
        refreshClients();
        break;

      case STATUS_INSPECT:
      case STATUS_INSPECT_ABORT:
        if (!!waitingClients?.[message.userId]) {
          waitingClients[message.userId].send(
            JSON.stringify({
              status: message.status,
            }),
          );
        }
        break;

      case STATUS_DELETE:
        fs.readFile("users.json", (err, file) => {
          let content = {};
          if (!!err && err?.code !== "ENOENT") {
            sendError(err.message || err);
            return;
          }

          if (err?.code !== "ENOENT") {
            content = JSON.parse(file.toString());
          }

          if (!(content.users?.length > 0)) {
            content.users = [];
          }

          const existsIndex = content.users.findIndex(
            (item) => item.userId === message.userId,
          );
          if (existsIndex !== -1) {
            content.users.splice(existsIndex, 1);
          }

          users = { ...content };
          refreshClients();

          fs.writeFile("users.json", JSON.stringify(content), (err) => {
            if (err) {
              sendError(err.message || err);
              return;
            }

            sendInfo("Updated users.json config");
          });
        });
        break;
    }
  });

  ws.on("close", () => {
    Reflect.deleteProperty(admins, admin);
    sendInfo("Administrator", admin, "disconnected");
    refreshClients();
  });
});

app.ws("/login", (ws, req) => {
  let client = "",
    lastStatus = "";

  const identifyClient = (message) => {
    client = message.userId;
    lastStatus = message.status;

    if (message.status === STATUS_WAITING) {
      waitingClients[client] = ws;
    } else {
      Reflect.deleteProperty(waitingClients, client);
    }
    refreshClients();
  };

  ws.on("message", (msg) => {
    const message = JSON.parse(msg);
    lastStatus = message.status;

    switch (message.status) {
      case STATUS_WAITING:
        if (
          !Object.keys(waitingClients).find((item) => message.userId === item)
        ) {
          sendInfo("Client", message.userId, "is waiting for approve");
          identifyClient(message);
        }
        break;

      case STATUS_IDLE:
        sendInfo("Client", message.userId, "canceled permission request");
        identifyClient(message);
        break;
    }
  });

  ws.on("close", () => {
    Reflect.deleteProperty(waitingClients, client);
    if (lastStatus !== STATUS_OK) {
      sendInfo("Client", client, "canceled permission request");
    }
    refreshClients();
  });
});

app.ws("/update", (ws, req) => {
  let client = "";

  const identifyClient = (message) => {
    client = message.userId;
    sendInfo("Client", client, "connected");
    clients[client] = ws;
  };

  ws.on("message", (msg) => {
    const message = JSON.parse(msg);
    identifyClient(message);
  });

  ws.on("close", () => {
    Reflect.deleteProperty(waitingClients, client);
    sendInfo("Client", client, "disconnected");
  });
});

const refreshClients = () => {
  Object.values(admins).map((item) => {
    item.send(
      generateResponse(STATUS_OK, null, {
        type: IN_QUEUE,
        list: Object.keys(waitingClients).map((client) => {
          const currentUser = users.users?.find(
            (item) => item.userId === client,
          );
          return {
            userId: client,
            currentKey: currentUser?.key,
            currentPermissions: currentUser?.permissions,
            friendlyName: currentUser?.friendlyName,
          };
        }),
      }),
    );

    item.send(
      generateResponse(STATUS_OK, null, {
        type: AUTHORIZED,
        list:
          users.users?.length > 0
            ? users.users.map((client) => {
                return {
                  userId: client.userId,
                  currentKey: client.key,
                  currentPermissions: client.permissions,
                  friendlyName: client.friendlyName,
                };
              })
            : [],
      }),
    );
  });
};

app.listen(port, () => {
  sendLog(`Server is running on http://localhost:${port}`);
});

if (!(process.env.WEBSERVER_PORT === process.env.ADMIN_PANEL_PORT)) {
  adminApp.listen(adminPort, () => {
    sendLog(`Admin Server is running on http://localhost:${adminPort}`);
  });
}
