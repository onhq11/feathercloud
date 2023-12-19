<div align="center">

<img src="https://raw.githubusercontent.com/onhq11/FeatherCloud/main/img/banner.jpeg" style="border-radius: 20px"><br><br>

# FeatherCloud

Lightweight and easy-to-use file and pastebin server with single-device permissions.<br>
**[Install now »](https://github.com/onhq11/FeatherCloud/releases)**<br><br><br>

</div><br><br>

## About

FeatherCloud is an lightweight open-source file and pastebin server with easy to use WebUI

## Features

- Multiple upload, delete, download file and paste
- Edit paste in monaco editor (VSCode based) in browser
- Grant permission to every single device

## Screenshots

### Files list:

<img src="https://raw.githubusercontent.com/onhq11/FeatherCloud/main/img/screenshots/ss1.png" style="border-radius: 20px">

### Paste list:

<img src="https://raw.githubusercontent.com/onhq11/FeatherCloud/main/img/screenshots/ss2.png" style="border-radius: 20px">

### Admin panel:

<img src="https://raw.githubusercontent.com/onhq11/FeatherCloud/main/img/screenshots/ss3.png" style="border-radius: 20px">

## Requirements (without Docker)

- NodeJS
- Yarn
- Make

## How to use?

### Docker container

- Download server from [releases menu](https://github.com/onhq11/FeatherCloud/releases) (choose latest version)
- Run docker `docker compose up`
- Configure .env using [configuration section](#configuration)

### Without Docker container

- Download server from [releases menu](https://github.com/onhq11/FeatherCloud/releases) (choose latest version)
- Unzip and enter to folder
- Init app `make init`
- Configure .env using [configuration section](#configuration)
- To start server use `make start`

## Configuration

- **AUTOINDEX_PATH** - path in server directory, where uploaded files are saved (without docker only in other scenarios
  leave default)
- **PASTES_PATH** - path in server directory where uploaded pastes are saved (without docker only in other scenarios
  leave default)
- **WEBSERVER_PORT** - webserver port
- **ADMIN_PANEL_PORT** - admin panel port (if you set same port for admin panel and webserver, admin panel will be
  available at /panel)
- **ADMIN_PANEL_PASSWORD** - admin panel password USERNAME="admin" (if you don't need this feature, just leave blank)
- **CONTAINER_VOLUME** - path on your host machine, where files will be saved (only for docker)

## Used technologies

- ExpressJS (backend)
- React + MUI (frontend)
- Monaco editor (paste editor)
- Express-WS (websockets)
- Express Basic Auth (admin panel auth)
- Multer (file upload)
- Makefile (easier server management)

## Authors

- [@onhq11](https://github.com/onhq11)
