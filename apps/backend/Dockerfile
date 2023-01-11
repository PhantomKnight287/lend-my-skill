FROM node:16.18.0-bullseye
RUN corepack enable
RUN apt update && apt upgrade -y && apt install build-essential -y
WORKDIR /app
COPY . .
EXPOSE 5000
RUN pnpm i
RUN pnpm build
CMD [ "pnpm" ,"start"]