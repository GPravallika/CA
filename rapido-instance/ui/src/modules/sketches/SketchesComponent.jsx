import React from 'react'
import SketchesFound from './SketchesFoundComponent'
import SketchService from './SketchServices'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import AddTeamModal from '../team/addTeamModal';
import {showAlert, AlertOptions} from '../utils/AlertActions'

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      allSketchesData: [],
      filteredSketchesData: [],
      personalData: [],
      teamsData: [],
      sortType: '',
      query: '',
      addTeamModalIsOpen: false,
    };
    this.alertOptions = AlertOptions;
    this.handleChange = this.handleChange.bind(this);
    this.addTeamSuccess = this.addTeamSuccess.bind(this);
  }

  /* Method to handle search */
  handleChange(event) {
    var queryResult=[];
    this.state.allSketchesData.forEach(function(sketch){
      if(sketch.name.toLowerCase().indexOf(event.target.value)!=-1)
        queryResult.push(sketch);
      if(sketch.description.toLowerCase().indexOf(event.target.value)!=-1)
        queryResult.push(sketch);
    });
    queryResult = queryResult.filter((sketch, index, self) =>
      index === self.findIndex((s) => (
        s.id === sketch.id && s.name === sketch.name
      ))
    )
    this.setState({
      query: event.target.value,
      filteredSketchesData: queryResult
    });
  }

  addTeamToggleModal(type) {
      this.setState({
        addTeamModalIsOpen: !this.state.addTeamModalIsOpen
      });
  }

  addTeamSuccess(team) {
    console.log(team);
  }

  /* Method to handle search */
  sortSketchCardBy(event) {
  
    /*let lastActiveId = null;
    if(document.querySelector(".sortByBtn.active")) {
      lastActiveId = document.querySelector(".sortByBtn.active").id;
      document.querySelector(".sortByBtn.active").className = document.querySelector(".sortByBtn.active").className.replace(/\bactive\b/,'');
    }
    if(lastActiveId !== event.target.id)
      event.target.className = event.target.className + " active";

    let activeNow = null;
    let activeSort = null;
    if(document.querySelector(".sortByBtn.active"))
      activeNow = document.querySelector(".sortByBtn.active").id;

    var queryResult=[];

    if(activeNow == "sortByNameBtn") {
      activeSort = 'name';
      queryResult = this.state.sketches.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
    }

    if(activeNow == "sortByModifiedBtn") {
      activeSort = 'modified';
      queryResult = this.state.sketches.sort(function(a, b){
        if(a.modifiedat < b.modifiedat) return -1;
        if(a.modifiedat > b.modifiedat) return 1;
        return 0;
      });
    }

    if(activeNow == "sortByCreatedBtn") {
      activeSort = 'created';
      queryResult = this.state.sketches.sort(function(a, b){
        if(a.createdat < b.createdat) return -1;
        if(a.createdat > b.createdat) return 1;
        return 0;
      });
    }

    this.setState({
      sortType: (activeSort !== null) ? activeSort : '',
      filteredData: (activeSort !== null) ? queryResult : this.state.sketches
    })*/
  }

  /* Component Initialisation */
  componentDidMount() {
    let userDetails = JSON.parse(sessionStorage.getItem('user'));
    let sktGetPrjSrvRes = null;
    SketchService.getProjects(userDetails.id)
      .then((response) => {
        sktGetPrjSrvRes = response.clone();
        return response.json();
      })
      .then((responseData) => {
        if(sktGetPrjSrvRes.ok) {
          var allSketches = responseData.personal;
          var teamsDataArr = [];
          Object.keys(responseData.team).forEach(function(team) {
            responseData.team[team].forEach(function(teamSketchObj){
              teamSketchObj["teamname"] = "test"+teamSketchObj.name
              teamSketchObj["teamdesc"] = "test"+teamSketchObj.description
              allSketches.push(teamSketchObj);
              teamsDataArr.push(teamSketchObj);
            });
          });
          console.log(teamsDataArr);
          this.setState({
            "allSketchesData" : allSketches,
            "personalData": responseData.personal,
            "teamsData": teamsDataArr
          });
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          if(sktGetPrjSrvRes.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  navigateToMemmbers() {
    browserHistory.push('/team?teamId=13');
  }

  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId','null');
    sessionStorage.setItem('sketchName','null');
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }

  addNewSketchFromTeam() {
    sessionStorage.setItem('sketchId','null');
    sessionStorage.setItem('sketchName','null');
    sessionStorage.removeItem('vocabularyInfo');
    sessionStorage.setItem('teamId',"13");
    browserHistory.push('/nodes/add');
  }

  /* Render Method */
  render() {

    let content; 
    const personalImg = <img className="personalImg" src="data:image/png;base64,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" />;
    const teamImg = <img className="teamImg" src="data:image/png;base64,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" />;
    const userNotLoggedIn =  <div className="text-center loading-project-details">Loading...</div>
    const teamNotFound = <div className="teamSketchesCont">
      <div className="mainContainer">
        {teamImg}
        <span>Team Sketches</span>
        <button className="btn btn-default first-time-sketch-btn" onClick={this.addTeamToggleModal.bind(this)}>New Team</button>
      </div>
    </div>;
    const personalSketchesNotFound = <div className="personalSketchesCont">
      <div className="mainContainer">
        {personalImg}
        <span>Personal Sketches</span>
        <button onClick={this.addNewSketch.bind(this)} className="btn btn-default first-time-sketch-btn">New Sketch</button>
      </div>
    </div>;
    const sketchesNotFound = <div className="titleContainer firstTime">
      <h2>Welcome to CA Live API Design!</h2>
      <h3>Looks like you are getting started. Go ahead and start off with creating a new sketch or team below.</h3>
      {personalSketchesNotFound}
      {teamNotFound}
    </div>

    if(this.state && this.state.allSketchesData ) {
      var sketchesContent;

      if (this.state.allSketchesData && this.state.allSketchesData.length > 0 && this.state.filteredSketchesData.length == 0) {

        var personalSketchesList = null;
        var personalSection;

        if(this.state.personalData && this.state.personalData.length > 0) {
          personalSection = <div className="personalSketchesCont">
            <div className="mainContainer">
              {personalImg}
              <span>Personal Sketches</span>
              <button onClick={this.addNewSketchFromTeam.bind(this)} className="btn btn-default">New Sketch</button>
            </div>
              <SketchesFound sketches={this.state.personalData} />
            </div>;
        } else {
          personalSection = <div>{personalSketchesNotFound}</div>
        }

        var teamSketchesList = null;
        var teamSketches = [];
        var teamSection;

        if(this.state.teamsData && this.state.teamsData.length > 0) {
          teamSection = <div className="teamSketchesCont">
            <div className="mainContainer">
              {teamImg}
              <span>Team 1 Sketches</span>
              <button className="btn btn-default" onClick={this.addNewSketch.bind(this)}>New Sketch</button>
              <button className="btn btn-default" onClick={this.navigateToMemmbers.bind(this)}>Members</button>
              <button className="btn btn-default">Settings</button>
            </div>
            <SketchesFound sketches={this.state.teamsData} />
          </div>
        } else {
          teamSection = <div>{teamNotFound}</div>
        }

        sketchesContent = <div className="sketch-found-section">
          <div className="col-md-12 sketch-sort-section">
            <input className="search-sketch-input" placeholder="Search" type="text" value={this.state.query} onChange={this.handleChange} />
            <button id="sortByCreatedBtn" className={(this.state.sortType == 'created') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Created</button>
            <button id="sortByModifiedBtn" className={(this.state.sortType == 'modified') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Modified</button>
            <button id="sortByNameBtn" className={(this.state.sortType == 'name') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Name</button>
          </div>
          {personalSection}
          {teamSection}
        </div>
      } else if(this.state.allSketchesData && this.state.allSketchesData.length > 0 && this.state.filteredSketchesData.length > 0) {
        sketchesContent = <div>Search Results</div>
      } else {
        sketchesContent = <div>{sketchesNotFound}</div>
      }
      content = <div className="col-md-12 sketch-component-wrapper">
        {sketchesContent}
      </div>
    }else {
      content = <div>{userNotLoggedIn}</div>
    }
    
    return (
      <div>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        {content}
        <AddTeamModal show={this.state.addTeamModalIsOpen}
          onClose={this.addTeamToggleModal.bind(this)}
          onConfirm={this.addTeamSuccess}>
        </AddTeamModal>
      </div>
    )
  }
}
