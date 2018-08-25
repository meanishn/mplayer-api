# Doctual-Back

This is the back-end part of the Doctual application.

## Installing locally

### Dependencies:

- Node 7.0+
- Docker
- Yarn

 Clone this repository and run setup services via docker: 

```
./bin/depImage.sh
```

 This should download the services image and start up the docker container including:

- Postgres outbound port 15432 

 Install dependencies from the root directory:

```
yarn install
```

## Migrate and seed the database(development by default):

```
yarn run sequelize db:migrate && node db/seeders/runner.js
```

## Accessing the database

Postgres has a user ```doctual``` with password ```doctual``` and is configured to be able to connect via password locally.

## Managing containers

To stop the container use ```docker stop pg_doc```, this will also delete the container(but not the database data).
To start the container you can run ```./bin/depImage.sh``` again.

## Testing

Testing database not yet setup...