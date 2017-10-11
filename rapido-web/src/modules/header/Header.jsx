import React from 'react'
import { browserHistory, Link } from 'react-router'
import cx from 'classnames'
import NavMenu from './NavigationMenu'
import EditObserver from '../EditObserver'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'
export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      exportStatus: this.props.exportStatus,
      selectExport: this.props.exportSelection
    };
    this.alertOptions = AlertOptions
  }

  /* Component Initialisation */
  componentDidMount() {
    document.body.addEventListener('click', this.handleBodyClick.bind(this));
  }

  componentWillUnmount() {
    document.body.removeEventListener('click', this.handleBodyClick.bind(this));
    if(this.props.authenticated) {
      this.setState({
        navStatus: this.props.location
      })  
    }
  }
  
  /* Method to handle header Click event */
  handleClick(e) {
    e.preventDefault();
    this.setState({isOpen: !this.state.isOpen});
  }

  /* Method to handle logout */
  handleLogout() {
    sessionStorage.clear();
    browserHistory.push('/home');
  }

  /* Method to navigate to tree Node details */
  getNodeDetails() {
    let sketchId = sessionStorage.getItem('sketchId')
    if(sketchId !== 'null') {
      browserHistory.push('/nodes/edit');
    } else {
      let sketchMode = JSON.parse(sessionStorage.getItem('updateMode'));
      if(sketchMode) {
        browserHistory.push('/nodes/edit');
      } else {
        browserHistory.push('/nodes/add');
      }
    }
  }

  /* Method to export design */
  exportDesign(e){
    let sketchId = sessionStorage.getItem('sketchId')
    if(sketchId !== 'null') {
      let observer = new EditObserver();
      observer.notify({id: 'export'});
      this.setState({
        selectExport: true
      })
    } else {
      showAlert(this, "Please save the Project to export")
      setTimeout(function(){
        this.msg.removeAll()
      }.bind(this), 3000);
    }
  }

  /* Method to handle body click */
  handleBodyClick(e) {
    if(e.target.id === 'option-logout') {
      this.handleLogout();
    }
    else {
      this.setState({isOpen: false});
    }
  }

  /* Render Method */
  render() {
    let loggedIn = this.props.authenticated;
    let headerSection, navOptions;
    let navigationPath, loginAndRegisterSection;
    let sketchId = sessionStorage.getItem('sketchId');
    const logoImg = <img src="data:image/png;base64,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" width="44px" height="40px" />

    if(loggedIn) {
      
      headerSection = <div className="row rapido-header-wrapper">
        <div className="col-md-4 col-sm-3 pull-left">
          <Link className="header-logo-section" to="/sketches">
            {logoImg}
            <span className="logo-text">Live API Design</span>
          </Link>
        </div>
        <div className="col-md-8 col-sm-9">
          <div className="col-md-12 col-sm-12">
            <div className="pull-right user-dropdown-options">
              <div className="user-dropdown-options-arrow" onClick={this.handleClick.bind(this)}>▾</div>
              <NavMenu isOpen={this.state.isOpen}/>
            </div>
            <div className="text-right pull-right user-name"><span>{this.props.userInfo.firstname}</span></div>
          </div>
        </div>
      </div>

      if(this.props.location.pathname == '/login' || this.props.location.pathname == '/mailVerification' || this.props.location.pathname == '/register' || this.props.location.pathname == '/resetPassword'){
        headerSection = null;
      }

    } else {
      if(this.props.location.pathname !== ('/login' && '/register')){
        loginAndRegisterSection = <div className="col-sm-8">
          <Link to="/login" className="login-button">
            <button className="btn btn-default pull-right">Log In</button>
          </Link>
          <Link to="/register" className="register-button">
            <button className="btn btn-default pull-right">Register</button>
          </Link>
        </div>
      }
      
      headerSection = <div className="row header-login">
        <div className="col-sm-4 pull-left home-logo-section">
          {logoImg}
        </div>
        {loginAndRegisterSection}
      </div>

      if(this.props.location.pathname == '/login'){
        headerSection = null;
      }
      if(this.props.location.pathname == '/register'){
        headerSection = null;
      }

    }
    return (
      <div >
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        {headerSection}
      </div>
    )
  }
}
