start:
	@echo "Starting server"
	@yarn start --foreground

build:
	@echo "Executing build process"
	@cd client && yarn build && cd ../admin && yarn build

install:
	@echo "Installing dependencies"
	@yarn && cd client && yarn && cd ../admin && yarn

env:
	@echo "Copying environment file"
	@cp .env.example .env

init: env install build
	@echo "Initialization complete"