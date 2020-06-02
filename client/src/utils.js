
import jwtDecode from 'jwt-decode'
import params from './app.params'

/**
 * 
 * @param {string} url api route
 * @param {object} parameters request parameters (headers, body, etc...)
 */
function fetchJson(url, parameters = {}){

  return fetch(process.env.REACT_APP_API_ENDPOINT + url, {
    method: parameters.method || "GET" ,
    headers: parameters.headers || {
      "Content-Type": "application/json",
      "x-access-token": localStorage.getItem(params.LOCAL_STORAGE_ACCESS_TOKEN) || ""
    },
    body: parameters.body
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

function getPayloadToken(){
  let tokenValue = localStorage.getItem(params.LOCAL_STORAGE_ACCESS_TOKEN)
  if(tokenValue){
    try {
      let payload = jwtDecode(tokenValue)
      return payload
    } catch (error) {
      console.error(error)
      return null
    }
  }
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
    let tokenValue = localStorage.getItem(params.LOCAL_STORAGE_ACCESS_TOKEN)


    console.log({tokenValue})
      // if invalid or expired => reject
    if (!tokenValue || (tokenValue && tokenIsExpired(tokenValue))) {
      reject(false)
    } else {
      resolve(true)
    }
  })
}

export default {
  fetchReadyData: fetchJson,
  fetchJson,
  fetchForm,
  checkToken,
  getPayloadToken,
  formatSelectSecteur: secteurs => secteurs.map(s => ({
    id: s.id,
    label: s.label,
    value: s.id,
  }))
}
