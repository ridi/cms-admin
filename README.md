# CMS-Admin
Ridibooks CMS 관리자 서비스입니다.

[![Build Status](https://travis-ci.org/ridi/cms-admin.svg?branch=master)](https://travis-ci.org/ridi/cms-admin?branch=master)
[![](https://images.microbadger.com/badges/version/ridibooks/cms-admin.svg)](https://microbadger.com/images/ridibooks/cms-admin "Get your own version badge on microbadger.com")
[![](https://images.microbadger.com/badges/image/ridibooks/cms-admin.svg)](https://microbadger.com/images/ridibooks/cms-admin "Get your own image badge on microbadger.com")

## Requirements
- [Ridibooks CMS](https://github.com/ridi/cms)  
사용자 인증을 하려면 CMS 인증 서버와 RPC연결을 해야 합니다. 전반적인 연동 방법을 보려면 [cms-bootstrap-php](https://github.com/ridibooks/cms-bootstrap-php) 프로젝트를 참고합니다.

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
```

2. Apache에서 CMS 인증 서버 프로젝트를 Document root로 설정합니다.  
그리고 다음 Alias 설정을 추가합니다.
```
Alias /super /path/to/cms-admin/
```
