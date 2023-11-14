<div align="center">

<img src="https://raw.githubusercontent.com/onhq11/FeatherCloud/main/img/banner.jpeg" style="border-radius: 20px"><br><br>

# FeatherCloud

Lightweight and easy-to-use file server with single-device permissions.<br>
**[Install now »](https://github.com/onhq11/FeatherCloud/releases)**<br><br><br>

</div><br><br>

## About

FeatherCloud is an lightweight open-source file server with ability to give permissions to every single device using websockets. Server is using autoindex in uploads folder 

## Requirements (without Docker)
- NodeJS
- Yarn

## How to use?
### Docker container
- Run docker ```docker compose up```

### Without Docker container
- Download server from [releases menu](https://github.com/onhq11/FeatherCloud/releases) (choose latest version)
- Unzip and enter to folder
- Init app ```make init```
- To start server use ```make start```

## Used technologies
- ExpressJS (backend)
- React + MUI (frontend)
- Express-WS (websockets)
- Makefile (easier server management)

## Features
- Upload, delete and download file
- Preview in browser
- Grant permission to every single device

## Roadmap
- Multiple files upload
- Add folders + Download as ZIP

## Authors
- [@onhq11](https://github.com/onhq11)
