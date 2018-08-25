#!/bin/bash

PG_PORT=15432
# IS_RUNNING=$(docker inspect -f {{.State.Running}} pg_doc)
IS_RUNNING=$(docker ps -a --filter name=pg_doc | wc -l)
if [ $IS_RUNNING == 1 ]
then
echo "Container not running, starting a new one..."
docker pull iots27/api-services-dev

docker run -d --name pg_doc -p $PG_PORT:5432 iots27/api-services-dev
else
  docker start pg_doc
  echo "Container already running..."
fi

#$(docker ps --filter name=pg_doc | awk -F" {2,}" '{match($6, /:(.+)->/, r)} END{print r[1]}')

cd $(dirname "$(readlink -f "$0")")

SEQ_CFG="../config/sequelizeConfig.json"
JWT_CFG="../config/authConfig.js"

if [ ! -f $SEQ_CFG ]
then
  printf '{  "development": {    "username": "doctual",    "password": "doctual",    "database": "doctual-dev",    "host": "127.0.0.1",    "port": '"$PG_PORT"', "dialect": "postgres"  },  "test": {    "username": "root",    "password": null,    "database": "doctual-test",    "host": "128.0.0.1",    "dialect": "postgres"  },  "production": {    "username": "root",    "password": null,    "database": "doctual",    "host": "128.0.0.1",    "dialect": "postgres"  }}' > $SEQ_CFG
fi

if [ ! -f $JWT_CFG ]
then
  printf "module.exports = {
    'secret': 'devkey'
  }" > $JWT_CFG
fi
