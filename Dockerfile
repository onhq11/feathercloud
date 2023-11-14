FROM node:latest
WORKDIR /app
COPY ../../feathercloud /app

RUN make init

CMD ["make", "start"]