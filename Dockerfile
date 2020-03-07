FROM gmathieu/node-browsers:3.0.0 AS build

COPY package.json /usr/aims-ui/
WORKDIR /usr/aims-ui
RUN npm install

COPY ./ /usr/aims-ui
RUN npm run build

FROM nginx:1.15.8-alpine

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

COPY ./dev/nginx.conf /etc/nginx/nginx.conf

COPY --from=build  /usr/aims-ui/dist/aims-ui /usr/share/nginx/html

RUN echo "for mainFileName in /usr/share/nginx/html/main*.js ;\
            do \
              envsubst '\$BACKEND_API_URL' < \$mainFileName > main.tmp ;\
              mv main.tmp \${mainFileName} ;\
            done \
            && nginx -g 'daemon off;'" > run.sh

ENTRYPOINT ["sh", "run.sh"]
