# [GR3] SAMU SOCIAL DE PARIS - Partie Tech

👋🏼Bonjour et bienvenue sur le Readme de la partie Tech du groupe 3 ! 
Keny Zachelin s'est occupé de la partie infrastructure

# Comment déployer l'application SSP3

## #1 Déployer les serveurs sur Amazon EC2

- Configurer une paire de clé privée/publique sur son compte Amazon EC2 afin de pouvoir déployer des instances.
- Se placer sur la branche <em>prod</em> du repository et a la racine du dossier
- Renommer le fichier variables.copy en variables et renseigner les variables demandées :
    * public_key
    * private_key
- Lancer la commande `terraform apply` et confirmer le deploiement

## #2 Provisionner les serveurs
- Récupérer les addresse IP publique des serveurs créés sur le dashboard Amazon ou dans le fichiers généré à la racine `terraform.tfstate``
- Renseigner les adresses des serveurs dans le fichier `/ansible/hosts.yml` en les placant dans le groupe correspondant.
- En étant dans le dossier `/ansible`, lancer le playbook avec la commande ``ansible-playbook -i hosts.yml -u ubuntu --key-file {path_to_ssh_key} playbook.yml``

# Infrastructure

L'infrastructure du projet SSP3 est constitué de 4 machines serveur :
- un serveur hébergant l'API
- un serveur hébergant la base de donnée MySQL
- un serveur hébergant l'application de back-office
- Ainsi qu'un serveur hébergant le haproxy répartissant la charge sur les différentes machine API






