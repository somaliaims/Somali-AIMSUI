# ----------- Build Stage -----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production


# ----------- Runtime Stage -----------
FROM nginx:1.25-alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy custom nginx config
COPY ./dev/nginx.conf /etc/nginx/nginx.conf

# Copy Angular build output
COPY --from=build /app/dist/aims-ui/browser/ /usr/share/nginx/html

# Replace environment variable inside built JS
RUN apk add --no-cache gettext

CMD sh -c "for file in /usr/share/nginx/html/main*.js; do \
  envsubst '\$BACKEND_API_URL' < \$file > tmp.js && mv tmp.js \$file; \
done && nginx -g 'daemon off;'"