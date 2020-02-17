class Planning {

    constructor(){
        this.binome = new Binome();
        this.visite = new Visite();
    }

    genererPlanning() {
        this.createBinomes();
        this.createVisites();
    }

    createBinomes(){
        this.binome.create();

    }

    createVisites(){
        this.visite.create();
    }
}