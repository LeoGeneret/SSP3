# [GR3] SAMU SOCIAL DE PARIS - Partie Back

👋🏼Bonjour et bienvenue sur le Readme de la partie Back du groupe 3 !
Les dev back sont Keny Zachelin et Paul Troadec.

Le service docker lié au back-end est "api"


## Lien vers API déployée : 
http://ec2-52-47-84-55.eu-west-3.compute.amazonaws.com:3002/

<em></em>


## Lien vers API doc déployé :
http://ec2-52-47-84-55.eu-west-3.compute.amazonaws.com:3002/apidoc/

# Technos & dépendances

## NodeJS


Nous avons choisi d'utiliser NodeJS pour rester dans l'environnement JavaScript, contrairement à si nous avions utilisé du PHP. Cela améliore la capacité de réutilisation du code et facilite la maintenabilité.

## Express

Express est une librairie qui apporte des fonctionnalités robuste pour notre API notamment ce qui concerne le routage.

## Sequelize

Nous utilisons l'ORM Sequelize pour faciliter la construction de requêtes vers la base, ainsi que la relation entre les modèles.

## BCrypt

BCrypt est utilisé pour hasher les mots de passes. C'est une librairie de hashage réputée solide et plus pertinant qu'un simple cryptage.

## jsonwebtoken

Nous utilisons JSON WebToken pour la création de jeton d'authentification.

## MySQL

<img src="database.jpg"   
style="float: left; margin-right: 10px;" />



# Fonctionnement de l'api

Nous avons un ensemble de route séparé par type de resource délivrée : Hotel, Visite, Visiteur, Secteur, Planning, Auth.

### 1. Ressources séparées par routes
Chacune de ces ressources possède des routes suivant un standard régulier.

Tous d'abords l'utilisation de mot clé HTTP :
- le GET pour l'envoie de d'information
- le PUT pour la création d'information (accompagné d'un :id/create dans la route)
- le PATCH pour la création d'information (accompagné d'un :id/update dans la route)
- le DELETE pour la suppression d'information (accompagné d'un :id/delete dans la route)

Toutes ces routes renvoie une reponse contenant systeme: un message d'erreur (si erreur il y a eu), les donnée demandé ainsi que le status de la réponse.

Ce retour de réponse permet à l'application web de pouvoir librement interpreter le retour API.

### 2. Classes de model
Chaque ressource possède une classe dans laquelle est défini un ensemble de fonction permettant de créer les requêtes SQL. Ces classes se situe dans /database/models

### 3. Génération de fausse donnée

Afin de faire fonctionner l'application et de travailler dans les conditions les plus réelle nous avons mis au point un script (database/database.seeder.js accessible par la commande `npm run db-seed`). Ce script permet de générer un ensemble cohérent de données, cela nous permet donc d'avoir en base de donnée des hotels, des visiteurs ainsi que des visites.

### 4. Authentification

Pour tester les routes de connexion `/auth/signin`, `/auth/forgot_password`
```
email: planner@spp3.email
password: 0000
role: "planner"
```

<em>Pour le moment l'authentification n'est pas reliée à l'application c'est pourquoi toute les routes sont accéssible sans besoin d'authentification.</em>

Le système de d'authentification est effectué par jwt token.
Lorsque qu'un utilisateur enregistré en base appèle la route `/auth/signin` en passant ses informations personnels il recoit un token d'accès (s'il est bien authentifié). Ce token valide pendant 24 heures lui permettera d'accéder au back office et d'appeler les routes de l'API.

Lorsque qu'un utilisateur a oublié son mot de passe il peut le réinitialiser en appelant la route `/auth/forgot_password` en passant en paramètre son adresse email. Il recevra un mail contenant un lien éphémère pour reinitialiser son mot de passe.
Ce lien est éphémère car il contient dans son url un toke_reset_password valide pendant 24h ou jusqu'à la réinitialisation du mot de passe en question.
Finalement en appelant la route `/auth/reset_password` et en passant son email et son token_reset_password il pourra changer son mot de passe. (Après cette action le token_reset_password est invalidé)