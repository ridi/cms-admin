# CMS-Admin
Ridibooks CMS 관리자 서비스입니다.

[![Build Status](https://travis-ci.org/ridi/cms-admin.svg?branch=master)](https://travis-ci.org/ridi/cms-admin?branch=master)
[![](https://images.microbadger.com/badges/version/ridibooks/cms-admin.svg)](https://microbadger.com/images/ridibooks/cms-admin "Get your own version badge on microbadger.com")
[![](https://images.microbadger.com/badges/image/ridibooks/cms-admin.svg)](https://microbadger.com/images/ridibooks/cms-admin "Get your own image badge on microbadger.com")

## Requirements
- [Ridibooks CMS](https://github.com/ridi/cms)  
사용자 인증을 하려면 CMS 인증 서버와 RPC연결을 해야 합니다.  
전반적인 연동 방법을 보려면 [cms-bootstrap-php](https://github.com/ridi/cms-bootstrap-php) 프로젝트를 참고합니다.

## Getting started
1. `.env`를 작성합니다:
```bash
cp .env.template .env
vim .env

------
DEBUG=${0 or 1}
SENTRY_KEY=${Sentry 서비스 key 값}
CMS_RPC_URL=${CMS 인증 서버 url}

# 사용자 DB 설정
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=

# Docker 실행 시 XDEBUG 설정이 필요한 경우
XDEBUG_ENABLE=${0 or 1}
XDEBUG_HOST=${remove host} # ex) docker.for.mac.localhost 
```

2. Docker로 이미지를 실행합니다.
```bash
# 시작 (docker run)
make docker-up

# 종료 (docker stop && docker rm)
make docker-down
```
