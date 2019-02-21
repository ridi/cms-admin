FROM python:3.7.2
MAINTAINER Yeongjun Choi <yj.choi@ridi.com>
ARG DJANGO_SETTINGS_MODULE=settings

RUN apt-get update 

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE $DJANGO_SETTINGS_MODULE

# Install dependencies
RUN pip install --upgrade pip

# Set work directory
WORKDIR /app

ADD ./requirements.txt /app/
RUN pip install -r requirements.txt
