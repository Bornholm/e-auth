FROM alpine:edge

MAINTAINER Team EOLE <eole@ac-dijon.fr>

ARG HTTP_PROXY=
ARG HTTPS_PROXY=
ARG http_proxy=
ARG https_proxy=

RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories

RUN apk --no-cache add mongodb

RUN mkdir -p /data/db

CMD ["mongod"]
