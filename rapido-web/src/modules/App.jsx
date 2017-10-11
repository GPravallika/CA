import React from 'react'
import AuthenticatedBody from './AuthenticatedBody'
import Header from './header/Header'
import Login from './login/LoginComponent'
import { browserHistory } from 'react-router'
import NavDetail from './header/NavigationDetailsComponent'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-select/dist/react-select.css'
import '../css/styles.scss'

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      designDetails: {
        enableExport: false,
        exportSelection: false,
        pathName: this.props.location.pathname
      }
    };
  }

  /* Render Method */
  render() {
    let header = <Header authenticated={false}/>
    let bodyContent, navDetails;
    let userObject = JSON.parse(sessionStorage.getItem('user'));
    if(userObject && userObject.id) {
      header = <Header authenticated={true} location={this.props.location} userInfo = {userObject} exportStatus={this.state.designDetails.enableExport} pathInfo= {this.state.designDetails.pathName}/>
    } else {
      header = <Header authenticated={false} location={this.props.location}/>
    }
    navDetails = <NavDetail pathInfo={this.props.location.pathname} />

    return (
      <div className ="container-fluid">
        {header}
        <div className="col-sm-12 main-content">
          {React.cloneElement(this.props.children, { designDetails: this.state.designDetails })}
        </div>
      </div>
    )
  }
}

