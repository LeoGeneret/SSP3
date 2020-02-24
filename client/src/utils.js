
import jwtDecode from 'jwt-decode'

/**
 * 
 * @param {string} url api route
 * @param {object} parameters request parameters (headers, body, etc...)
 */
function fetchJson(url, {headers, method, body}){
  return fetch(process.env.REACT_APP_API_ENDPOINT + url, {
    method: method || "GET",
    headers: headers || {
      "Content-Type": "application/json",
    },
    body: body
  })
  .then(res => res.json())
}

/**
 * 
 * @param {string} url api route
 * @param {object} data data form
 */
function fetchForm(url, data = {}){

  const urlencoded = new URLSearchParams()
  
  for(let key in data){
    urlencoded.append(key, data[key])
  }
  
  return fetchJson(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: urlencoded.toString()
  })
}


function tokenIsExpired(token) {

  let tokenDecoded = null

  try {
    tokenDecoded = jwtDecode(token)
    let now = Date.now() / 1000
    return (tokenDecoded.exp <= now)
  } catch (err) {
    return false
  }
}

function checkToken(){

  return new Promise((resolve, reject) => {
    let tokenValue = localStorage.getItem('access_token')
      // if invalid or expired => reject
    if (!tokenValue || (tokenValue && tokenIsExpired(tokenValue))) {
      reject(false)
    } else {
      resolve(true)
    }
  })
}

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

export default {
  fetchReadyData: fetchJson,
  fetchJson,
  fetchForm,
  checkToken
}
