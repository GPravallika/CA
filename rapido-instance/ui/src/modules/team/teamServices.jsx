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

  getTeam(teamId) {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'team/'+ teamId, { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  deleteTeam(teamId) {
    var token  = sessionStorage.getItem("token");
    
    return fetch(apiObj.endPoint + 'team/'+ teamId, { 
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  },

  addTeamMember(teamId, member) {
    var token  = sessionStorage.getItem("token");
      return fetch(apiObj.endPoint + 'team/'+ teamId + '/member', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(member)
    });
  },
}

export default TeamApiCall;