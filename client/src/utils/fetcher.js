// Utils
import utils from '../utils'

export default {
    
    getSecteurs: () => {
        return utils.fetchReadyData('/secteur')
    },
}