import apiObj from '../utils/ApiServices'

const TeamApiCall = {

  createTeam(obj) {
    var token  = sessionStorage.getItem("token");
      return fetch(apiObj.endPoint + 'team', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(obj)
    });
  },

  getTeams() {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'team', { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },
}

export default TeamApiCall;