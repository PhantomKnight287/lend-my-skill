FROM node:16.18.0-alpine
RUN corepack enable
RUN apk add g++ make py3-pip libressl-dev
WORKDIR /app
COPY . .
EXPOSE 5000
RUN pnpm i
RUN pnpm build
CMD [ "pnpm" ,"start"]