# [GR3] SAMU SOCIAL DE PARIS - Partie Tech

👋🏼Bonjour et bienvenue sur le Readme de la partie Tech du groupe 3 ! 
Les dev front sont Adrien Bannwarth et Léo Generet.


# Technos, dépendances & librairies 

## React ⚛

Nous avons choisi d'utiliser React car après concertation, c'est le framework JS où nous nous sentons le plus à l'aise. Il est simple d'utilisation et léger et nous permettra de séparer en différents composants les parties communes à certaines pages. Nous avons également décidé d'utiliser les Hooks entièrement.
Dans une optique future, nous souhaitons développer l'app companion en React Native, c'est donc tout naturellement que notre choix s'est porté sur React pour le back-office.

## React Router 
React Router apporte un système de routage dynamique simple qui permet de naviguer entre les différentes vues. Il est pour nous le système de routage le plus stable avec React JS.

## FullCalendar
[FullCalendar](https://fullcalendar.io/) est une librairie que nous utilisons déjà sur notre lieu de travail. Elle est complète et permet l'affichage d'un planning de différentes façons (par jour, par semaine...).Il permet, de façon intuitive, de modifier des événements à la volée avec un système de drag&drop.

## NodeSass
Notre projet utilise comme pré-processeur CSS [NodeSass](https://github.com/sass/node-sass) car il facilite l'intégration en permettant l'utilisation de variables, de fonctions mathématiques, des fonction ou encore des boucles, permettant une meilleure maintenabilité.

##  ESLint
Pour veiller à une qualité de code optimale et respectueux d'une convention globale, nous avons installé ESLint avec [une configuration "standard".](https://standardjs.com/rules.html)
Pour vérifier la structure de la vue Planning (par exemple) avec ESLint, il faudra taper la commande :

    docker-compose -f docker-compose-dev.yml exec app eslint src/pages/Planning.js











