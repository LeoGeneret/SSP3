const utils = {
  fetchReadyData(uri, options = {}) {
    return fetch("http://localhost:3002" + uri, options)
      .then(res => res.json())
  }
};

// function handleErrors(res) {

//   if (!res.ok) { 
//     throw res.json();
//   } else {
//     try {
//       let response = res.json();
//       return response;
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }

// function catchErrors(err) {
//   try {
//     let response = err.json();
//     if (response && response.error) console.log(response.error);
//     throw err;
//   } catch (e) {
//     throw err;
//   }
// }


export default utils;
