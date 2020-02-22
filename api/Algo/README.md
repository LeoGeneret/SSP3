<!--#########################
#### Algo 
##############################-->
# Algorithme de génération de planning
## Mise en contexte

Le but de cet algorithme est de générer un planning à partir d'une liste d'hotels renseignée.
L'Algorithme établit le planning par ordre de priorité de visites des hotels.
Pour prioriser ainsi, l'algorithme se base sur les derniers rapports existants (dans la mesure où ceux-ci sont renseignés).


## Structure de l'algorithme :

L'algorithme est strucuré en deux phases :
- Une **1ère phase** d'appel à la fonction de création d'une liste priorisée d'hotels
- Une **2ème phase** d'appel à la fonction de création des visites *(permettant la génération d'un planning)*


## Appel aux fonctions :
    creerListePriorisee()
    creerVisites()


## Fonctionnement de l'algorithme :

- L'algorithme établit un planning pour chaque binome de chaque secteur en prenant en compte qu'un binome ne visite que les hotels de son secteur. Ce même binoma à 4 jours de visites par semaine et réalise les visites sur la plage définie (ici 4 hotels par jour avec une visite à 8h, une à 10h, une à 14h et une autre à 16h).

- Le planning correspond aux visites programmées sur 4 jours.

- Les visites sont enregistrées par ordre de priorité à partir d'une liste d'hotels triée par anomalies.

- Cette liste est déterminée à partir de la note du dernier rapport et la date de dernière visite de l'hotel.











<br><br><br><br>

<!--##########################################################
#### LISTE PRIORISEE
##############################################################-->



<!--#########################
#### Fonction creerListePriorisee()
##############################-->
# Liste priorisée
    
    creerListePriorisee()

## Description de la fonction

Le but de cette fonction est d'ajouter tous les hotels à la liste d'hotels par ordre de priorité.
Dans cette fonction sont ajoutés les hotels de haute importance, les hautels de moyenne importance ainsi que le reste des hotels à visiter.




## Structure de la fonction :

La fonction est strucuré en trois phases :
- Une **1ère phase** d'appel à la fonction d'ajout des *hotels à visiter en haute priorité*.
- Une **2ème phase** d'appel à la fonction d'ajout des *hotels à visiter en seconde priorité*.
- Une **3ème phase** d'appel à la fonction d'ajout des *tous les autre hotels*.


## Appel aux fonctions :

    ajoutHotels(listePrio, listeHotelsParNote, listeHotelsParDate)
    
    prioriteSelonDate()
    prioriteSelonNote(listeHotels)






<!--#########################
#### Fonction ajoutHotels(listePrio, listeHotelsParNote, listeHotelsParDate)
##############################-->
# Ajout des hotels par ordre de priorité
    
    ajoutHotels(listePrio, listeHotelsParNote, listeHotelsParDate)

## Description de la fonction

Le but de cette fonction est de créer une liste priorisée d'hotels.
Dans cette fonction sont ajoutés les hotels de haute importance, les hautels de moyenne importance ainsi que le reste des hotels à visiter.




## Structure de la fonction :

La fonction est strucuré en trois phases :
- Une **1ère phase** d'appel à la fonction d'ajout des *hotels à visiter en haute priorité*
- Une **2ème phase** d'appel à la fonction d'ajout des *hotels à visiter en seconde priorité*
- Une **3ème phase** d'appel à la fonction d'ajout de *tous les autre hotels*.


## Appel aux fonctions :

    ajoutHotelsHauteImportance(listePrio, listeHotelsParNote, listeHotelsParDate)
    ajoutHotelsMoyenneImportance(listePrio, listeHotelsParNote, listeHotelsParDate)
    ajoutAutresHotels(listePrio, listeHotelsParNote, listeHotelsParDate)





<!--#########################
#### Fonction prioriteSelonDate()
##############################-->
# Liste des hotels par date les plus anciennes

    prioriteSelonDate()

## Description de la fonction

Cette fonction effectue une requete récupérant les hotels ordonnés par date de dernière visite.
La fonction retourne les différents hotels ordonés selon la date de visite la plus ancienne.





<!--#########################
#### Fonction prioriteSelonNote(listeHotels)
##############################-->
# Liste des hotels par notes les plus faibles

    prioriteSelonNote(listeHotels)

## Description de la fonction

Cette fonction compare les notes des hotels d'une liste donnée et retourne les différents hotels ordonées selon la note la plus faible.

## Structure de la fonction :

La fonction est strucuré en deux temps :
- Dans un **1er temps**, la fonction supprime les note des anciens rapport pour n'avoir que celle du dernier rapport.
- Dans un **2nd temps**, la fonction trie les notes en les comparant entre elles.






<!--#########################
#### Fonction ajoutHotelsHauteImportance(listePrio, listeHotelsParNote, listeHotelsParDate)
##############################-->
# Ajout hotels à visiter en haute priorité : 

    ajoutHotelsHauteImportance(listePrio, listeHotelsParNote, listeHotelsParDate)

## Description de la fonction

Le but de cette fonction est d'ajouter tous les hotels à visiter en haute priorité selon leur note et leur date de dernière visite.
Dans cette fonction sont ajoutés les hotels ayant une note mediocre (note inférieure à 30) puis les hotels dont le délai de dernière visite est important (dernière visite il y a plus d'un an)




## Structure de la fonction :

La fonction est strucuré en deux phases :
- Une **1ère phase** d'appel à la fonction d'ajout des *hotels ayant une note mediocre*
- Une **2ème phase** d'appel à la fonction d'ajout des *hautels dont le délai de dernière visite est important*.


## Appel aux fonctions :

    ajoutHotelsParNote(listePrio, listeHotelsParNote, this.noteMediocre)
    ajoutHotelsParDate(listePrio, listeHotelsParDate, this.delaiImportant)







<!--#########################
#### Fonction ajoutHotelsMoyenneImportance(listePrio, listeHotelsParNote, listeHotelsParDate)
##############################-->
# Ajout hotels à visiter en seconde priorité
    
    ajoutHotelsMoyenneImportance(listePrio, listeHotelsParNote, listeHotelsParDate)

## Description de la fonction

Le but de cette fonction est d'ajouter tous les hotels à visiter en seconde priorité selon leur note et leur date de dernière visite.
Dans cette fonction sont ajoutés les hotels ayant une note moyenne (note inférieure à 40) puis les hotels dont le délai de dernière visite est moyennement important (dernière visite il y a plus de 6 mois)




## Structure de la fonction :

La fonction est strucuré en deux phases :
- Une **1ère phase** d'appel à la fonction d'ajout des *hotels ayant une note moyenne*
- Une **2ème phase** d'appel à la fonction d'ajout des *hautels dont le délai de dernière visite est moyennement important*.


## Appel aux fonctions :

    ajoutHotelsParNote(listePrio, listeHotelsParNote, this.noteMoyenne)
    ajoutHotelsParDate(listePrio, listeHotelsParDate, this.delaiMoyen)






<!--#########################
#### Fonction ajoutAutresHotels(listePrio, listeHotelsParNote, listeHotelsParDate)
##############################-->
# Ajout autres hotels à visiter

    ajoutAutresHotels(listePrio, listeHotelsParNote, listeHotelsParDate)

## Description de la fonction

Le but de cette fonction est d'ajouter tous les autres hotels à visiter (étant en dernière position de priorité selon leur note et leur date de dernière visite).
Dans cette fonction sont ajoutés les autres hotels à visiter ayant une dernière note correcte (note supérieure à 40) puis les autres hotels à visiter dont le délai de dernière visite est correcte (dernière visite il y a moins de 6 mois)




## Structure de la fonction :

La fonction est strucuré en deux phases :
- Une **1ère phase** d'ajout des *hotels restant dans la liste des hotels triés par note* à la liste des hotels à visiter (listePrio)
- Une **2ème phase** d'appel à la fonction d'ajout des *hotels restant dans la liste des hautels triés par date* à la liste des hotels à visiter (listePrio) .










<!--#########################
#### Fonction ajoutHotelsParNote(listePrio, listeHotelsParNote, contrainte)
##############################-->
# Ajout hotels par note
    
    ajoutHotelsParNote(listePrio, listeHotelsParNote, contrainte)

## Description de la fonction

Dans cette fonction sont ajoutés à la liste des hotels à visiter tous les hotels de la liste des hotels triés par note dont la note du dernier rapport est inférieure à une note donnée (contrainte).
L'hotel ajouté est ensuite supprimé de la liste des hotels triés par note.







<!--#########################
#### Fonction ajoutHotelsParDate(listePrio, listeHotelsParDate, contrainte)
##############################-->
# Ajout hotels par date

    ajoutHotelsParDate(listePrio, listeHotelsParDate, contrainte)

## Description de la fonction

Dans cette fonction sont ajoutés à la liste des hotels à visiter tous les hotels de la liste des hotels triés par date dont la différence entre la date actuelle et la date du dernier rapport est supérieure à une différence donnée (contrainte).
L'hotel ajouté est ensuite supprimé de la liste des hotels triés par note.




























<br><br><br><br>

<!--##########################################################
#### CREATION DES VISITES
##############################################################-->



<!--#########################
#### Fonction creerVisites()
##############################-->
# Creation du planning
    
    creerVisites()

## Description de la fonction

Le but de cette fonction est de créer un planning pouvant être généré par la suite.
Dans cette fonction sont créées des visites par ordre d'importance pour chaque binome et dans chaque secteur.




## Structure de la fonction :

La fonction est strucuré en six phases :
- Une **1ère phase** où est récupérée la liste des visiteurs par secteur
- Une **2ème phase** où est récupérée la liste des binomes d'après la liste des visiteurs par secteur
- Une **3ème phase** où est récupérée la liste des binomes par secteur d'après la liste des binomes
- Une **4ème phase** où est récupérée la liste des hotels par secteur d'après la liste des hotels à visiter ordonnée par priorité d'après la liste récupérée en paramètre de la fonction
- Une **5ème phase** où est récupérée la liste des visites d'après la liste des binomes par secteur, la liste des hotels par secteur et la data actuelle passée en paramètre de la fonction
- Une **6ème phase** où sont créées chaques visites d'après la précédent liste des visites


## Appel aux fonctions :

    creerListeVisitesParSecteur(listeVisiteur)
    creerListeBinomes(ListeDesVisiteursParSecteur)
    creerBinomesParSecteurs(binomes)
    creerHotelsParSecteur(listeDesHotelsAvisiterOrdonnee)
    creerVisitesPlanning(binomesParSecteur, ListeDesHotelsParSecteur, jour)
    bulkCreate(visites)




<!--#########################
#### Fonction creerListeVisitesParSecteur(listeVisiteur)
##############################-->
# Creation d'une liste de visiteurs ordonnée par secteur
    
    creerListeVisitesParSecteur(listeVisiteur)

## Description de la fonction

Le but de cette fonction est de créer une liste de visiteurs ordonnée par secteur.
Dans cette fonction sont triés tous les visiteurs d'un même secteur.


## Structure de la fonction :

La fonction est strucuré en trois phases :

- Dans une **1ère phase**, on parcours une liste de visiteurs donnée en paramètre
- Dans une **2ème phase**, on récupère l'identifiant du secteur du visiteur
- Dans une **3ème phase**, on ajoute le visiteur à une nouvelle liste en fonction de son secteur (que l'on créé s'il n'existe pas encore)



<!--#########################
#### Fonction creerListeBinomes(ListeDesVisiteursParSecteur)
##############################-->
# Creation d'une liste de binomes
    
    creerListeBinomes(ListeDesVisiteursParSecteur)

## Description de la fonction

Le but de cette fonction est de créer une liste de binomes pour chaque visiteur d'un même secteur.
Cette fonction créé un binome de deux visiteurs et retire le dernier visiteur si la liste des visiteurs dans ce secteur est impaire.




<!--#########################
#### Fonction creerBinomesParSecteurs(binomes)
##############################-->
# Creation d'une liste de binomes par secteur
    
    creerBinomesParSecteurs(binomes)

## Description de la fonction

Le but de cette fonction est de créer une liste de binomes pour chaque secteur.


<!--#########################
#### Fonction creerHotelsParSecteur(listeDesHotelsAvisiterOrdonnee)
##############################-->
# Creation d'une liste d'hotels par secteur
    
    creerHotelsParSecteur(listeDesHotelsAvisiterOrdonnee)

## Description de la fonction

Le but de cette fonction est de créer une liste d'hotel pour chaque secteur.


<!--#########################
#### Fonction creerVisitesPlanning(binomesParSecteur, ListeDesHotelsParSecteur, jour)
##############################-->
# Creation des visites
    
    creerVisitesPlanning(binomesParSecteur, ListeDesHotelsParSecteur, jour)

## Description de la fonction

Le but de cette fonction est de créer les différents visites associées à la liste ordonnée par secteur passée en paramètre.
La fonction va ainsin créer une visite pour chaque hotel remontant de la liste priorisée.


## Structure de la fonction :

La fonction est strucuré en trois temps :

- Dans un **1er temps**, la fonction parcourt une liste de binomes ordonée par secteur donnée en paramètre
- Dans un **2ème temps**, la fonction parcourt chaque binomes dans le secteur correspondant
- Dans un **3ème temps**, la fonction recupère tous les hotels de ce même secteur
- Dans un **3ème temps**, pour chaque jour et pour chaque heure correspondant à un temps de travail défini, la fonction détermine :
    - La date de la visite selon le jour et l'heure selectionés
    - L'heure de début en fonction de la date de visite
    - La date de fin, avec une durée d'1 heure par défaut pour chaque rendez-vous
    - Les visiteurs dans le binome
    - La voiture passée par défaut
    - l'identifiant de l'hotel en question
- Dans un **dernier temps**, toutes ces données/valeurs sont stockées dans une variable qui sera retournée par la fonction



<br><br><br><br>
<br><br><br><br>






