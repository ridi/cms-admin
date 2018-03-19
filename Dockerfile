FROM ridibooks/performance-apache-base:7.1
MAINTAINER Kang Ki Tae <kt.kang@ridi.com>

ENV DEBUG=0
ENV SENTRY_KEY=""
ENV SESSION_DOMAIN=localhost
ENV CMS_RPC_URL=localhost
ENV MYSQL_HOST=localhost
ENV MYSQL_USER=root
ENV MYSQL_PASSWORD=""
ENV MYSQL_DATABASE=cms

RUN sed -i "/DocumentRoot \/var\/www\/html/a Alias \/super \/var\/www\/html/" /etc/apache2/sites-available/000-default.conf

ADD . /var/www/html
WORKDIR /var/www/html
RUN make
