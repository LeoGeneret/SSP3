const utils = {
  fetchReadyData (uri, options = {}) {
    return fetch(process.env.REACT_APP_API_ENDPOINT + uri, options)
      .then(res => res.json())
  },

  handleErrors(res) {
    if (!res.ok) {
      throw res.json();
    } else {
      try {
        let response = res.json();
        return response;
      } catch (e) {
        console.log(e);
      }
    }
  },
  
  catchErrors(err) {
    try {
        let response = err.json();
        if (response && response.error) console.log(response.error);
        throw err;
    } catch (e) {
        throw err;
    }
  },


  formatSelectSecteur: secteurs => secteurs.map(s => ({
    id: s.id,
    label: s.label,
    value: s.id,
  }))
}

export default utils
