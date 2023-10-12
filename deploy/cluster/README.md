# Steedos Enterprise Edition

## Getting Started

### Setup environment variables 

```
cp .env.sample .env 
```

### Start Services

```
docker-compose up
```

### Stop Services

```
docker-compose down
```

## Data Backup

https://docs.docker.com/storage/volumes/#backup-restore-or-migrate-data-volumes

## Data Clean

Clean all data.

```
docker-compose down
docker volume rm steedos-enterprise_steedos-minio-data
docker volume rm steedos-enterprise_steedos-mongodb-data
```

## Connect to MongoDB Cluster

vi /etc/hosts

```
127.0.0.1  mongodb-primary mongodb-secondary mongodb-arbiter
```
