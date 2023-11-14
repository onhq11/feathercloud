start:
	@echo "Starting server"
	@yarn start

build:
	@echo "Executing build process"
	@cd client && yarn build && cd ../admin && yarn build

install:
	@echo "Installing dependencies"
	@yarn install && cd client && yarn install && cd ../admin && yarn install

init: install build
	@echo "Initialization complete"