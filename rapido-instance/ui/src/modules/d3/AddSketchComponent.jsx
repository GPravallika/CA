import React from 'react'
import { browserHistory } from 'react-router'
import { addEmptySketch, createSketch, exportDesign } from '../utils/TreeActions';
import ProjectService from '../d3/ProjectServices'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'

var component;


export default class extends React.Component{
  
  constructor(props) {
    super(props);
    component = this;
    this.state = {
      projectInfo: {
        projectName: '',
        projectDesc: ''
      }
    };
    this.alertOptions = AlertOptions;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
   let projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'));
   let teamId = JSON.parse(sessionStorage.getItem('teamId'));
    if(teamId) {
      this.setState({
          teamId: teamId
      })
    }
    if(projectInfo) {
      this.setState({
        projectInfo: {
          projectName: projectInfo.projectName,
          projectDesc: projectInfo.projectDesc
        }
      })
    }
    sessionStorage.setItem('updateMode', false)
  }

  /* Method to fetch child upon tree selection */
  fetchChild(parent, fetch, childrenFn) {
    if (!parent) return;
    fetch(parent);
    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        component.fetchChild(children[i], fetch, childrenFn);
      }
    }
  }

  /* Method to update Active state for Tree */
  setActiveStatus(activeObj) {
    component.fetchChild(activeObj, function(d) {
      d.active = false;
      if (d.children) {
        d.children.forEach((item, index) => {
          item.pId = d.pId + (index+1);
          item.active = false;
        })
      }
    },
    function(d) {
       return d.children && d.children.length > 0 ? d.children : null;
    });
  }

  /* Method to Export Sketch Data */
  exportSketchInfo() {
    exportDesign(component.state);
  }

  /* Method to Show Alert Message */
  showAlert(message){
    showAlert(this, message)
    setTimeout(function(){
      this.msg.removeAll()
    }.bind(this), 3000);
  }

  /* Method to submit project Details */
  handleSubmit(event) {
    event.preventDefault();
    if (this.showFormErrors()) {
      var projectInfo = this.state.projectInfo;
      addEmptySketch(this, []);
      component.setActiveStatus(component.state.treedata);
      component.state.projectDetails.projectName = projectInfo.projectName;
      component.state.projectDetails.projectDesc = projectInfo.projectDesc;
      /* TODO Promise */
      createSketch(component, [], ProjectService, browserHistory)
    }
  }


  /* Method to handle Form Input change */
  handleChange(field, event) {
    event.target.classList.add('active');
    if(event.target.name === 'projectName') {
      this.setState({
        projectInfo: {
          projectName: event.target.value,
          projectDesc: this.state.projectInfo.projectDesc
        }
      });
      this.showInputError(event.target.name);
    } else if (event.target.name === 'projectDesc') {
      this.setState({
        projectInfo: {
          projectName: this.state.projectInfo.projectName,
          projectDesc: event.target.value
        }       
      });
    }
  }

  /* Method to show form submission validation errors */
  showFormErrors() {
    const inputs = document.getElementById('projectDetailsNode').querySelectorAll('#InputprojectName');
    let isFormValid = true;
    
    inputs.forEach(input => {
      input.classList.add('active');
      
      const isInputValid = this.showInputError(input.name);
      
      if (!isInputValid) {
        isFormValid = false;
      }
    });
    
    return isFormValid;
  }

  /* Method to handle input field change errors*/
  showInputError(refName) {
    const validity = this.refs[refName].validity;
    const label = document.getElementById(`${refName}Label`).textContent;
    const error = document.getElementById(`${refName}Error`);
    const isPassword = refName.indexOf('password') !== -1;
    const isProjectName = refName === 'projectName';

    if(isProjectName) {
      if (this.refs.projectName.value.length > 35) {
        this.refs.projectName.setCustomValidity('projectName Field exceeded 35 characters limit');
      } else {
        this.refs.projectName.setCustomValidity('');
      }
    }

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = `${label} is a required field`; 
      } else if (isProjectName && validity.customError) {
        error.textContent = 'projectName Field exceeded 35 characters limit';
      }
      return false;
    }
    
    error.textContent = '';
    return true;
  }

  /* Render Method */
  render() {
    return(
      <div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div className="col-md-8 create-project-section" id="projectDetailsNode">
        <form className="col-md-6" noValidate onSubmit={this.handleSubmit}>
          <div className="col-md-12">
            <div className="form-group">
              <label htmlFor="InputprojectName" id="projectNameLabel">Project Name</label>
              <input
                type="text"
                value={this.state.projectInfo.projectName}
                className="form-control"
                id="InputprojectName"
                name="projectName"
                ref="projectName"
                onChange={this.handleChange.bind(this, 'projectName')}
                placeholder="Project Name" required/>
                <div className="error" id="projectNameError" ></div>
            </div>
            <div className="form-group">
              <label htmlFor="InputProjectDesc" id="projectDescLabel">Description</label>
              <input
                type="text"
                value={this.state.projectInfo.projectDesc}
                className="form-control"
                id="InputProjectDesc"
                name="projectDesc"
                onChange={this.handleChange.bind(this, 'projectDesc')}
                placeholder="project description" />
            </div>
          </div>
          <div className="col-md-12 next-section">
            <button type="submit" className="btn btn-default pull-right">Next</button>
          </div>
        </form>
      </div>
      </div>
    )
  }
}

