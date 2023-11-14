start:
	@echo "Starting server"
	@yarn start

build:
	@echo "Executing build process"
	@cd client && yarn build && cd ../admin && yarn build

install:
	@echo "Installing dependencies"
	@yarn && cd client && yarn && cd ../admin && yarn

init: install build
	@echo "Initialization complete"