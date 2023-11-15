FROM node:latest
COPY . /app
WORKDIR /app

RUN make init

CMD ["make", "start"]