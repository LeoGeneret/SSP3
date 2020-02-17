class Binome {

    constructor(){ 
        //create array of visiteurs
        this.binomes = [];
        this.visiteur1 = new Visiteur(1, 'visiteur1');
        this.visiteur2 = new Visiteur(2, 'visiteur2');
        this.visiteur3 = new Visiteur(3, 'visiteur3');
        var visiteursSecteurUn = [this.visiteur1, this.visiteur2, this.visiteur4];
        var visiteursSecteurDeux = [this.visiteur1, this.visiteur2, this.visiteur4];
    }


    create(){
        let binome = [];
        
        for (var i = visiteursSecteurUn.length; i>1; i++) {

            binome.push(visiteursSecteurUn[i]);
            binome.push(visiteursSecteurUn[i+1]);
            this.binomes.push(binome);
            binome=[];
        }
    }

    



    

}