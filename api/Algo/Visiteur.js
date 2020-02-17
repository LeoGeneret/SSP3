class Visiteur {
    constructor(idVisiteur, nomVisiteur) {
        this.idVisiteur = idVisiteur;
        this.nomVisiteur = nomVisiteur;
    }

    get idVisiteur() {
        return this.idVisiteur;
    }
    
    get nomVisiteur(){
        return this.nomVisiteur;
    }
}