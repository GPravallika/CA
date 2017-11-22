import React from 'react'
import { browserHistory, Link } from 'react-router'
import cx from 'classnames'
import NavMenu from './NavigationMenu'
import Dropdown from 'mineral-ui/Dropdown';
import Button from 'mineral-ui/Button';
import EditObserver from '../EditObserver'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import Icon from 'mineral-ui/Icon';
import { createThemedComponent } from 'mineral-ui/themes';

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

  /* Method to handle profile page */
  handleEditProfile() {
    browserHistory.push('/profile');
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
    const logoImg = <Icon size="3.25em" color="#20465F" title="CA Technologies">
      <svg viewBox="0 0 16 16">
        <path
          className="trademark"
          d="M14.514 10.187c-0.256 0-0.419-0.186-0.419-0.442s0.186-0.442 0.419-0.442c0.256 0 0.419 0.186 0.419 0.442 0 0.279-0.163 0.442-0.419 0.442zM14.514 9.373c-0.209 0-0.372 0.14-0.372 0.395s0.163 0.372 0.372 0.372c0.209 0 0.372-0.14 0.372-0.372 0-0.256-0.163-0.395-0.372-0.395zM14.653 9.977l-0.14-0.209h-0.070v0.209h-0.093v-0.489h0.14c0.093 0 0.163 0.047 0.163 0.14 0 0.070-0.047 0.116-0.093 0.14l0.14 0.186-0.047 0.023zM14.514 9.582h-0.070v0.14h0.070c0.047 0 0.093-0.023 0.093-0.070s-0.023-0.070-0.093-0.070z"
        />
        <g className="technologies">
          <path d="M0.788 12.187v-0.465h0.349v0.465h0.279v0.279h-0.279v0.814c0 0.070 0.047 0.093 0.116 0.093 0.047 0 0.116-0.023 0.163-0.023v0.279c-0.093 0-0.186 0.023-0.279 0.023-0.256 0-0.349-0.116-0.349-0.326v-0.861h-0.186v-0.279h0.186z" />
          <path d="M1.905 12.955c0 0.302 0.14 0.419 0.302 0.419s0.233-0.070 0.326-0.163l0.256 0.163c-0.14 0.209-0.326 0.302-0.605 0.302-0.372 0-0.605-0.279-0.605-0.744s0.233-0.744 0.605-0.744c0.372 0 0.582 0.326 0.582 0.651v0.116h-0.861zM2.44 12.722c0-0.209-0.116-0.302-0.279-0.302s-0.279 0.116-0.279 0.302h0.558z" />
          <path d="M3.859 12.653c-0.047-0.116-0.116-0.209-0.279-0.209-0.186 0-0.279 0.14-0.279 0.465s0.093 0.465 0.279 0.465c0.14 0 0.233-0.093 0.302-0.233l0.256 0.14c-0.14 0.256-0.302 0.349-0.558 0.349-0.395 0-0.605-0.279-0.605-0.744s0.233-0.744 0.605-0.744c0.279 0 0.489 0.14 0.558 0.372l-0.279 0.14z" />
          <path d="M4.394 13.607v-1.977h0.349v0.698c0.093-0.093 0.233-0.186 0.419-0.186 0.279 0 0.419 0.186 0.419 0.489v0.977h-0.349v-0.931c0-0.186-0.070-0.256-0.186-0.256-0.14 0-0.256 0.093-0.326 0.163v1.024h-0.326z" />
          <path d="M5.906 13.607v-1.442h0.302v0.163c0.116-0.093 0.279-0.186 0.442-0.186 0.279 0 0.419 0.186 0.419 0.489v0.977h-0.349v-0.931c0-0.186-0.070-0.256-0.186-0.256-0.14 0-0.256 0.093-0.326 0.163v1.024h-0.302z" />
          <path d="M7.953 12.164c0.395 0 0.628 0.279 0.628 0.744s-0.233 0.744-0.628 0.744c-0.395 0-0.628-0.279-0.628-0.744s0.233-0.744 0.628-0.744zM7.953 12.443c-0.186 0-0.279 0.14-0.279 0.465s0.093 0.465 0.279 0.465c0.186 0 0.279-0.14 0.279-0.465s-0.093-0.465-0.279-0.465z" />
          <path d="M8.837 13.607v-1.977h0.349v1.977z" />
          <path d="M10.070 12.164c0.395 0 0.628 0.279 0.628 0.744s-0.233 0.744-0.628 0.744c-0.395 0-0.628-0.279-0.628-0.744s0.233-0.744 0.628-0.744zM10.070 12.443c-0.186 0-0.279 0.14-0.279 0.465s0.093 0.465 0.279 0.465c0.186 0 0.279-0.14 0.279-0.465s-0.093-0.465-0.279-0.465z" />
          <path d="M12.094 12.397c-0.070 0-0.163 0-0.209 0.023 0.047 0.070 0.070 0.14 0.070 0.256 0 0.279-0.186 0.465-0.535 0.465-0.14 0-0.256 0-0.256 0.093 0 0.233 0.931-0.093 0.931 0.489 0 0.209-0.209 0.419-0.651 0.419-0.372 0-0.628-0.116-0.628-0.349 0-0.186 0.14-0.256 0.256-0.256v0c-0.070-0.047-0.209-0.070-0.209-0.233 0-0.14 0.163-0.233 0.209-0.256-0.116-0.093-0.209-0.209-0.209-0.372 0-0.256 0.186-0.489 0.558-0.489 0.116 0 0.256 0.047 0.349 0.116 0.070-0.093 0.163-0.14 0.326-0.116v0.209zM11.094 13.746c0 0.116 0.093 0.163 0.372 0.163 0.209 0 0.302-0.116 0.302-0.163 0-0.070-0.093-0.163-0.419-0.163-0.209 0-0.256 0.116-0.256 0.163zM11.396 12.42c-0.14 0-0.256 0.093-0.256 0.233s0.093 0.233 0.256 0.233c0.14 0 0.233-0.116 0.233-0.233 0-0.14-0.093-0.233-0.233-0.233z" />
          <path d="M12.327 11.932v-0.326h0.349v0.326h-0.349zM12.676 13.188v0.419h-0.349v-1.442h0.349v1.024z" />
          <path d="M13.281 12.955c0 0.302 0.14 0.419 0.302 0.419s0.233-0.070 0.326-0.163l0.256 0.163c-0.14 0.209-0.326 0.302-0.605 0.302-0.372 0-0.605-0.279-0.605-0.744s0.233-0.744 0.628-0.744c0.372 0 0.582 0.326 0.582 0.651v0.116h-0.884zM13.816 12.722c0-0.209-0.116-0.302-0.279-0.302s-0.279 0.116-0.279 0.302h0.558z" />
          <path d="M15.119 12.56c-0.070-0.070-0.163-0.14-0.256-0.14-0.14 0-0.186 0.047-0.186 0.14 0 0.256 0.721 0.14 0.721 0.675 0 0.302-0.233 0.419-0.512 0.419-0.233 0-0.419-0.093-0.535-0.279l0.233-0.163c0.070 0.116 0.186 0.209 0.326 0.209 0.116 0 0.209-0.070 0.209-0.163 0-0.233-0.721-0.163-0.721-0.651 0-0.256 0.233-0.419 0.465-0.419 0.186 0 0.372 0.070 0.512 0.209l-0.256 0.163z" />
        </g>
        <g className="ca">
          <path d="M10.838 8.14c-0.279 0.419-0.698 0.675-1.186 0.675-0.651 0-1.21-0.302-1.21-1.024 0-1.047 1.535-1.419 2.722-1.489v0.302c0 0.698 0 1.047-0.326 1.535zM8.651 4.348c0.186-0.489 0.651-0.675 1.303-0.675 0.931 0 1.186 0.651 1.21 1.186v0.256c-2.559 0.116-4.955 0.605-4.909 2.931 0.023 1.628 1.512 2.303 2.536 2.303 1.186 0 1.838-0.326 2.489-1.117 0 0.349 0.047 0.698 0.116 0.954h2.28c-0.116-0.395-0.163-0.814-0.163-1.21v-4.257c0-1.024-0.186-1.605-0.744-2.117-0.535-0.489-1.373-0.744-2.536-0.744-1.070 0-1.977 0.233-2.652 0.698v0c0.558 0.465 0.931 1.070 1.070 1.791v0z" />
          <path d="M6.116 7.953c0 0.047 0 0.093 0 0.14 0 0.023 0 0.047 0 0.070 0.047 0.837 0.442 1.349 0.814 1.652-0.628 0.372-1.396 0.512-2.070 0.512-2.443 0.023-3.908-1.721-3.908-4.141 0-2.512 1.512-4.327 4.071-4.327 1.861 0 3.396 1 3.559 2.931h-2.233c0-0.744-0.512-1.117-1.233-1.117-1.163 0-1.512 0.814-1.512 2.326 0 1.535 0.326 2.419 1.512 2.419 0.442 0 0.791-0.14 1-0.465v0z" />
        </g>
      </svg>
    </Icon>

    const profileDropdownBtn = createThemedComponent(Button, {
      Button_backgroundColor: 'none',
      Button_color_text: '#ffffff'
    });

    const profileDropdownItems = [
      {
        items: [
          {
            text: 'Settings',
            onClick: event => { this.handleEditProfile(); }
          },
          {
            text: 'Logout',
            onClick: event => { this.handleLogout(); }
          }
        ]
      }
    ];

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
            <Dropdown placement="bottom-end" className="profileDropdown" data={profileDropdownItems}>
              <profileDropdownBtn>{this.props.userInfo.email} ▾</profileDropdownBtn>
            </Dropdown>
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
