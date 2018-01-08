import React from 'react'
import SketchesFound from './SketchesFoundComponent'
import SketchService from './SketchServices'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      filteredData: {},
      sketchesData: {},
      sortType: '',
      query: ''
    };
    sessionStorage.removeItem('projectInfo');
    this.alertOptions = AlertOptions;
    this.handleChange = this.handleChange.bind(this);
  }

  /* Method to handle search */
  handleChange(event) {
    var queryResult=[];
    this.props.sketchesData.forEach(function(sketch){
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
      filteredData: queryResult
    });
  }

  /* Method to handle search */
  sortSketchCardBy(event) {
  
    let lastActiveId = null;
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
      queryResult = this.props.sketches.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
    }

    if(activeNow == "sortByModifiedBtn") {
      activeSort = 'modified';
      queryResult = this.props.sketches.sort(function(a, b){
        if(a.modifiedat < b.modifiedat) return -1;
        if(a.modifiedat > b.modifiedat) return 1;
        return 0;
      });
    }

    if(activeNow == "sortByCreatedBtn") {
      activeSort = 'created';
      queryResult = this.props.sketches.sort(function(a, b){
        if(a.createdat < b.createdat) return -1;
        if(a.createdat > b.createdat) return 1;
        return 0;
      });
    }

    this.setState({
      sortType: (activeSort !== null) ? activeSort : '',
      filteredData: (activeSort !== null) ? queryResult : this.state.sketches
    })
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
          this.setState({
            "sketchesData" : responseData,
            "filteredData" : responseData
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

  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId','null');
    sessionStorage.setItem('sketchName','null');
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }

  /* Render Method */
  render() {

    let content; 
    const userNotLoggedIn =  <div className="text-center loading-project-details">Loading...</div>
    const sketchesNotFound = <div className="titleContainer firstTime">
      <h2>Welcome to CA Live API Design!</h2>
      <h3>Looks like you are getting started. Go ahead and start off with creating a new sketch or team below.</h3>
      <div className="personalSketchesCont">
        <div className="mainContainer">
          <img className="personalImg" src="data:image/png;base64,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" />
          <span>Personal Sketches</span>
          <button onClick={this.addNewSketch.bind(this)} className="btn btn-default first-time-sketch-btn">New Sketch</button>
        </div>
      </div>
      <div className="teamSketchesCont">
        <div className="mainContainer">
          <img className="teamImg" src="data:image/png;base64,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" />
          <span>Team Sketches</span>
          <button className="btn btn-default first-time-sketch-btn">New Team</button>
        </div>
      </div>
    </div>

    if(this.state && this.state.sketchesData ) {
      var sketchesContent;
      var team1Sketches = [{"id":16,"name":"test-team1","description":"test-team1","ownership":"OWN"},{"id":18,"name":"test-team1111","description":"test-team11111","ownership":"OWN"}];
      var team2Sketches = [{"id":17,"name":"test-team2","description":"test-team2","ownership":"OWN"}];
      if (this.state.sketchesData && this.state.sketchesData.length > 0) {
        sketchesContent = <div className="sketch-found-section">
          <div className="col-md-12 sketch-sort-section">
            <input className="search-sketch-input" placeholder="Search" type="text" value={this.state.query} onChange={this.handleChange} />
            <button id="sortByCreatedBtn" className={(this.state.sortType == 'created') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Created</button>
            <button id="sortByModifiedBtn" className={(this.state.sortType == 'modified') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Modified</button>
            <button id="sortByNameBtn" className={(this.state.sortType == 'name') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Name</button>
          </div>
          <div className="personalSketchesCont">
            <div className="mainContainer">
              <img className="personalImg" src="data:image/png;base64,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" />
              <span>Personal Sketches</span>
              <button onClick={this.addNewSketch.bind(this)} className="btn btn-default">New Sketch</button>
            </div>
            <SketchesFound sketches={this.state.filteredData} />
          </div>
          <div className="teamSketchesCont">
            <div className="mainContainer">
              <img className="teamImg" src="data:image/png;base64,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" />
              <span>Team 1 Sketches</span>
              <button className="btn btn-default">New Sketch</button>
              <button className="btn btn-default">Members</button>
              <button className="btn btn-default">Settings</button>
            </div>
            <SketchesFound sketches={team1Sketches} />
          </div>
          <div className="teamSketchesCont">
            <div className="mainContainer">
              <img className="teamImg" src="data:image/png;base64,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" />
              <span>Team 2 Sketches</span>
              <button className="btn btn-default">New Sketch</button>
              <button className="btn btn-default">Members</button>
              <button className="btn btn-default">Settings</button>
            </div>
            <SketchesFound sketches={team2Sketches} />
          </div>
        </div>
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
      </div>
    )
  }
}
