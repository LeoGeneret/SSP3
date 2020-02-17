class Visite {
    constructor(){
        this.visites = [];
        this.hotel1 = new Hotel(1, 'hotel1', 30);
        this.hotel2 = new Hotel(2, 'hotel2', 20);
        this.hotel3 = new Hotel(3, 'hotel3', 70);
        var hotelsSecteurUn = [this.hotel1, this.hotel2, this.hotel3];
    }

    create (){
        //let visiteHotel = [];
        const nombreHotelsVisitesMax = 60;
        var nombreHotelsVisites = 1;
        
        for (var i = 0; i>hotelsSecteurUn.length; i++) {
            while (nombreHotelsVisites < nombreHotelsVisitesMax) {
                //visiteHotel.push(hotelsSecteurUn[i]);
                //this.visites.push(visiteHotel);
                this.visites.push(hotelsSecteurUn[i]);
                //visiteHotel=[];
            }
        }
        nombreHotelsVisites ++;
        
            

    }
}