# Available services
- app
- api
- database
- phpmyadmin
# Available scripts
## Run dev environnement

````
docker-compose -f docker-compose-dev.yml up
````

It starts : 
- app on port 3000
- api on port 3002
- database on port 3306
- phpmyadmin on port 8080

## Run specific command in a running service
````
docker-compose -f docker-compose-dev.yml exec <service-name> <command>
docker-compose -f docker-compose-dev.yml exec api npm run db-seed 
````

Exemple with command to fill database with data 
````
.eslintrc.json f
````