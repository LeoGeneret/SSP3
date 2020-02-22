# [GR3] SAMU SOCIAL DE PARIS - Partie Tech

👋🏼Bonjour et bienvenue sur le Readme de la partie Tech du groupe 3 ! 
Keny Zachelin s'est occupé de la partie infrastructure

# Pour déployer le serveur

- Se placer sur la branche <em>prod</em> du repository et a la racine du dossier
- Renommer le fichier variables.copy en variables et renseigner les variables demandées :
    * public_key
    * private_key
    * self_machine_ip
- Lancer la commande `terraform apply` et confirmer le deploiement


# Fonctionnement du déploiement

- Une fois l'instance AWS créer par le script terraform (main.tf) va copier un fichier de script shell sur la machine. Ce script permet d'installer pour Ubuntu les outils docker et docker-compose
- On vient écrier dans un fichier l'ip publique de notre machine (afin qu'elle soit communiquer à notre application via docker)
- Puis un second fichier de script shell est copier et lancer sur la machine afin de récupère le répo du projet SSP3
- Ce script va également lancer le docker-compose afin de lancer les containers d'application du projet 

# Infrastructure

Notre projet fonctionne sous docker en environnement de dev et de prod.
Il contient 4 containers :
- Un container mysql <em>database</em> (sous le port 3306)
- Un container phpmyadmin <em>phpmyadmin</em> - afin d'administrer la base de donnée en environnement de développement (sous le port 8080)
- Un container node:alpine <em>app</em> - Contenant le front du back-office (sous le port 3000 en dev et 80 en prod)
- Un container node:alpine <em>api</em> - Contenant l'api de notre back-office (sous le port 3002)

Ces quatre containers communique sous le même network <em>network_database</em>






