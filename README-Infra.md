# [GR3] SAMU SOCIAL DE PARIS - Partie Tech

Bonjour et bienvenue sur le Readme de la partie Tech du groupe 3 ! 
Keny Zachelin s'est occupé de la partie infrastructure

# Infrastructure

L'infrastructure du projet SSP3 est constitué de 4 machines serveur :
- un serveur hébergant l'API
- un serveur hébergant la base de donnée MySQL
- un serveur hébergant l'application de back-office
- Ainsi qu'un serveur hébergant le haproxy répartissant la charge sur les différentes machine API

# Comment déployer l'application SSP3

## #1 Déployer les serveurs sur Amazon EC2

- Configurer une paire de clé privée/publique sur son compte Amazon EC2 afin de pouvoir déployer des instances.
- Configurer Terraform pour le lier à votre compte Amazon EC2
- Coper et renommer le fichier ``variables.copy`` en ``variables.tf`` et renseigner les variables demandées :
    * public_key
    * private_key
    * LOCAL_MACHINE_IP
- Lancer la commande `terraform apply` et confirmer la création des serveurs

5 machines vont alors être déployées.

## #2 Provisionner les serveurs
- Récupérer les addresse IP publique des serveurs créés sur le dashboard Amazon ou dans le fichiers généré à la racine ``terraform.tfstate``
- Renseigner les adresses des serveurs dans le fichier `/ansible/hosts.yml` en les placant dans le groupe correspondant (api, database, dbmysql, backoffice, haproxy_api).
- Le fichier ``/ansible/roles/api/templates/container-api-env.j2`` vous permet de renseigner les variables d'environnement de l'api :
    - DB_NAME = Nom de la base de donnée
    - DB_USER = Nom l'utilisateur de la base
    - DB_PASSWORD = Mot de passe de l'utilisateur de la base de donnée
    - API_SECRET = la clé secrete permettant  de valider les token d'accès 
- En étant dans le dossier `/ansible`, lancer le playbook avec la commande ``ansible-playbook -i hosts.yml -u ubuntu --key-file {path_to_your_private_ssh_key} playbook.yml``

# Comment lancer l'application en local
- Dans le fichier docker-compose-dev.yml renseigner les variables d'environnement des différent services afin de paramétrer la base de donnée, son utilisateur et mot de passe, l'accès à l'interface de base de donnée (phpmyadmin), ainsi que le chemin vers l'api
- La variable d'environnement `REACT_APP_API_ENDPOINT` vaut toujours `http://localhost:3002` en local
- Lancer la commande ``docker-compose -f docker-compose-dev.yml up``