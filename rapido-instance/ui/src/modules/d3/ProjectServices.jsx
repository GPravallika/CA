import apiObj from '../utils/ApiServices'

const ProjectApiCall = {
  createProject(obj) {
    var token  = sessionStorage.getItem("token");
      return fetch(apiObj.endPoint + 'project', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(obj)
    });
  },

  updateProject(obj) {
    var token  = sessionStorage.getItem("token");
    return fetch(apiObj.endPoint + 'project/'+obj.id, { 
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(obj)
    });
  },

  updateProjectHeaders(obj) {
    var token  = sessionStorage.getItem("token");
    return fetch(apiObj.endPoint + 'projects/updateproject', { 
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify(obj)
    });
  },

  getProjectDetails(pId) {
    var token  = sessionStorage.getItem("token");
    return fetch(apiObj.endPoint + 'project/'+pId, { 
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
  } 
}

export default ProjectApiCall;