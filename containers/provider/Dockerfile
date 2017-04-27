FROM alpine:3.5

MAINTAINER Team EOLE <eole@ac-dijon.fr>

ARG HTTP_PROXY=
ARG HTTPS_PROXY=
ARG http_proxy=
ARG https_proxy=

RUN apk --no-cache add nodejs bash

ADD container-entrypoint.sh /root/container-entrypoint.sh
RUN chmod +x /root/container-entrypoint.sh

WORKDIR /app

CMD ["/root/container-entrypoint.sh"]
