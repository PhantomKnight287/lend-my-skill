FROM node:16.18.0-bullseye
RUN corepack enable
RUN apt install build-essential
WORKDIR /app
COPY . .
EXPOSE 5000
RUN pnpm i
RUN pnpm build
CMD [ "pnpm" ,"start"]