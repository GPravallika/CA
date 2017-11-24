import React from 'react'
import CRUDTree from './d3/CRUDTreeComponent'
import NodeDetails from './d3/NodeDetailsComponent'
import ProjectService from './d3/ProjectServices'
import EditObserver from './EditObserver'
import { browserHistory, Link } from 'react-router'
import AlertContainer from 'react-alert'
import {AlertOptions, showAlert} from './utils/AlertActions'
import {showDetails, addNode, deleteNode, updateTreeData, updateProjectHeaders, addEmptySketch, loadProjectDetails, createSketch, updateSketch, updatePath, exportDesign, importDesign} from './utils/TreeActions';
import teamService from './team/teamServices'

var component;

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      projectDetailsData: {} ,
      teamList: [],
      selectedTeamId: "",
      selectedTeamAccess: ""
    };
    this.alertOptions = AlertOptions;
    this.shareTeam = this.shareTeam.bind(this);
    this.updateTeam = this.updateTeam.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
    this.handleTeamDropDownChange = this.handleTeamDropDownChange.bind(this);
    this.handleTeamAccessDropDownChange = this.handleTeamAccessDropDownChange.bind(this);
  }

  /* Component Initialisation */
  componentWillMount() {
    let sketchId = sessionStorage.getItem('sketchId');
    let prjSrvGetPrjDetRes = null;
    ProjectService.getProjectDetails(sketchId)
    .then((response) => {
      prjSrvGetPrjDetRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvGetPrjDetRes.ok) {
        this.setState({
          projectDetailsData: responseData
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvGetPrjDetRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
    let teamSrvGetTeamsRes = null;
    teamService.getTeams()
    .then((response) => {
      teamSrvGetTeamsRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(teamSrvGetTeamsRes.ok) {
        this.setState({
          teamList: responseData
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(teamSrvGetTeamsRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  handleTeamDropDownChange(e) {
    this.setState({
      selectedTeamId: e.target.value
    });
  }

  handleTeamAccessDropDownChange(e) {
    this.setState({
      selectedTeamAccess: e.target.value
    });
  }

  updateTeam(event, selectedTeam) {
    let team = {
      "id": selectedTeam.team.id,
      "access": event.target.parentElement.children[3].value
    }
    let prjSrvUpdTeamRes = null;
    ProjectService.updateTeamToProject(team,this.state.projectDetailsData.id)
    .then((response) => {
      prjSrvUpdTeamRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvUpdTeamRes.ok) {
        /* Need to handle TODO */
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvUpdTeamRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  deleteTeam(event, team) {
    team = team.team;
    let prjSrvDelTeamRes = null;
    ProjectService.deleteTeamFromProject(team,this.state.projectDetailsData.id)
    .then((response) => {
      prjSrvDelTeamRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvDelTeamRes.ok) {
        var tempTeamsList = this.state.projectDetailsData.teams;
        tempTeamsList = tempTeamsList.filter(function(team){
          return team.id != responseData.id;
        });
        this.setState({
          projectDetailsData: {
            teams: tempTeamsList
          }
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvDelTeamRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  shareTeam() {
    let team = {
      "id": this.state.selectedTeamId,
      "access": this.state.selectedTeamAccess
    }
    let prjSrvAddTeamRes = null;
    ProjectService.addTeamToProject(team,this.state.projectDetailsData.id)
    .then((response) => {
      prjSrvAddTeamRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvAddTeamRes.ok) {
        var tempTeamList = this.state.projectDetailsData.teams;
        var seletedTeamFromList = this.state.teamList.filter(function(teamObj) {
            return teamObj.id == team.id;
        });
        tempTeamList.push(seletedTeamFromList[0]);
        this.setState({
          projectDetailsData: {
            teams: tempTeamList
          }
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvAddTeamRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Render Method */
  render() {

    var projectDetailsData = this.state.projectDetailsData;

    var projectHeader = (projectDetailsData) ? <div>
      <h2>{projectDetailsData["name"]}</h2>
      <h3>{projectDetailsData["description"]}</h3>
      </div> : null;

    var allTeamOptions = this.state.teamList.map(function (team) {
      return (
        <option value={team.id} key={team.id}>{team.name}</option>
      );
    }, this);

    if(this.state.projectDetailsData.teams) {

    var projectTeams = this.state.projectDetailsData.teams.map(function (team) {
      return (
        <div className="projectTeamRow" key={team.id}>
          <span>{team.name}</span>
          <button onClick={(e) => this.deleteTeam(e, {team})}>Delete</button>
          <button onClick={(e) => this.updateTeam(e, {team})}>Update</button>
          <select defaultValue={team.access} data-teamId={team.id} onChange={this.handleTeamAccessDropDownChange}>
            <option value="READ">READ</option>
            <option value="WRITE">WRITE</option>
          </select>
        </div>
      );
    }, this); 

    }

    return (<div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div className="titleContainer sketchPage">
        {projectHeader}
      </div>
      <div className="tabsContainer">
        <ul className="tabs">
          <li className={this.props.location.pathname === '/vocabulary' ? 'tab active-tab': 'tab'}><Link to="/vocabulary">VOCABULARY</Link></li>
          <li className={this.props.location.pathname === '/nodes/edit' ? 'tab active-tab': 'tab'}><Link to="/nodes/edit">SKETCH</Link></li>
          <li className={this.props.location.pathname === '/share' ? 'tab active-tab': 'tab'}><Link to="/share">SHARE</Link></li>
          <li className={this.props.location.pathname === '/export' ? 'tab active-tab': 'tab'}><Link to="/export">EXPORT</Link></li>
        </ul>
      </div>
      <div className="col-md-12 sketch-list-wrapper">
        <div>
          <div className="col-md-4">
            <select defaultValue={this.state.selectedTeamId} name="selectedTeamId" onChange={this.handleTeamDropDownChange}>
              <option value="">Select Team</option>
              {allTeamOptions}
            </select>
          </div>
          <div className="col-md-4">
            <select defaultValue={this.state.selectedTeamAccess} onChange={this.handleTeamAccessDropDownChange}>
              <option value="READ">READ</option>
              <option value="WRITE">WRITE</option>
            </select>
          </div>
          <div className="col-md-4">
            <button onClick={this.shareTeam}>SHARE</button>
          </div>
        </div>
        <div className="projectTeamsList">
          {projectTeams}
        </div>
      </div>
      </div>)
  }
}