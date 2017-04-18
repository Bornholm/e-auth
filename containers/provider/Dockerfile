FROM alpine:3.3

MAINTAINER Team EOLE <eole@ac-dijon.fr>

ARG HTTP_PROXY=
ARG HTTPS_PROXY=
ARG http_proxy=
ARG https_proxy=

RUN apk --no-cache add nodejs

WORKDIR /app

CMD ["npm", "run", "start:dev"]
