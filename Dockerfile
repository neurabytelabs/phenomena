FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json tsconfig.json vite.config.ts index.html Dockerfile nginx.conf ./
COPY public ./public
COPY scripts ./scripts
COPY src ./src

RUN npm ci
RUN npm run build
RUN npm run verify

FROM nginx:1.29-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
