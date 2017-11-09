import React from 'react'
import SketchesFound from './SketchesFoundComponent'
import SketchService from './SketchServices'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {};
    sessionStorage.removeItem('projectInfo');
    this.alertOptions = AlertOptions;
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
            "sketchesData" : responseData
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
      <h2>Looks like, there are no sketch projects saved. <br/> Please add a sketch project to see it here.</h2>
      <button onClick={this.addNewSketch.bind(this)} className="btn btn-default first-time-sketch-btn">+ Create Your First Project</button>
    </div>

     
    if(this.state && this.state.sketchesData ) {
      var sketchesContent;
      if (this.state.sketchesData && this.state.sketchesData.length > 0) {
        sketchesContent = <div className="sketch-found-section">
          <div className="titleContainer">
            <h2>Welcome back!</h2>
          </div>
          <SketchesFound sketches={this.state.sketchesData} />
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
