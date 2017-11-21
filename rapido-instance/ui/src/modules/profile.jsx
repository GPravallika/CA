import React from 'react';
import AlertContainer from 'react-alert'
import RegistrationService from './register/RegistrationServices'
import PasswordConfig from './passwordConfig.js'
import {showAlert, AlertOptions} from './utils/AlertActions'
import { Tabs } from './components/tabs'
import { Tab } from './components/tab'
import Button from 'mineral-ui/Button';
import Card, { CardBlock, CardTitle } from 'mineral-ui/Card';
import { createStyledComponent } from 'mineral-ui/styles';
import AddTeamModal from './team/addTeamModal';
import AddMemberModal from './team/addMemberModal';
import teamService from './team/teamServices'

export default class extends React.Component{
  
  constructor(props) {
      super(props);
      this.state = {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
        oldPassword: '',
        passwordConfig: PasswordConfig,
        addTeamModalIsOpen: false,
        addMemberModalIsOpen: false,
        teamList: []
      };
      this.alertOptions = AlertOptions;
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.addTeamSuccess = this.addTeamSuccess.bind(this);
  }
  
  /* Component Initialisation */
  componentDidMount() {
    this.refs["password"].pattern = this.state.passwordConfig.passwordFields.pattern;
    this.refs["password"].minLength = this.state.passwordConfig.passwordFields.minLength;
    this.refs["password"].maxLength = this.state.passwordConfig.passwordFields.maxLength;
    let userObj = JSON.parse(sessionStorage.getItem('user'));
    if(userObj) {
      this.setState({
        "id": userObj.id,
        "firstName": userObj.firstname,
        "lastName": userObj.lastname,
        "email": userObj.email,
        "password": "",
        passwordConfirm: "",
        oldPassword: "",
      })
    }
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

  /* Method to toggle modal */
  toggleModal(type) {
    if(type == "addTeam") {
      this.setState({
        addTeamModalIsOpen: !this.state.addTeamModalIsOpen
      });
    }
    if(type == "addMember") {
      this.setState({
        addMemberModalIsOpen: !this.state.addMemberModalIsOpen
      });
    }
  }

  /* Method to add team success */
  addTeamSuccess(team) {
    var tempTeamList = this.state.teamList;
    tempTeamList.push(team);
    this.setState({
      teamList: tempTeamList
    });
  }

  
  /* Method to handle input change */
  handleChange(e) {
    e.target.classList.add('active');
    
    this.setState({
      [e.target.name]: e.target.value
    });
    
    this.showInputError(e.target.name);
  }

  /* Method to submit user Details */
  handleSubmit(event) {
    event.preventDefault();
    if (this.showFormErrors()) {
      let regSrvUpdUsrDetails = null;
      let userObj = {
        "id": this.state.id,
        "password": this.state.password,
        "email": this.state.email,
        "firstname": this.state.firstName,
        "lastname": this.state.lastName,
        "oldPassword": this.state.oldPassword,
      };
      RegistrationService.updateUserDetails(userObj)
      .then((response) => {
        regSrvUpdUsrDetails = response.clone();
        return response.json();
      })
      .then((responseData) => {
        if(regSrvUpdUsrDetails.ok) {
          showAlert(this, "Profile updated");
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          if(regSrvUpdUsrDetails.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  /* Method to show Form Errors */
  showFormErrors() {
    const inputs = document.querySelectorAll('input');
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
  
  /* Method to show Input Errors */
  showInputError(refName) {
    const validity = this.refs[refName].validity;

    var label = "";
    if(refName == "firstName") {
      label = "First Name";
    } else if (refName == "lastName") {
      label = "Last Name";
    } else if (refName == "email") {
      label = "Email";
    } else if (refName == "password") {
      label = "Password";
    } else if (refName == "passwordConfirm") {
      label = "Confirm Password";
    } else if (refName == "oldPassword") {
      label = "Old Password";
    }

    const error = document.getElementById(`${refName}Error`);
    const isPassword = refName.indexOf('password') !== -1;
    const isPasswordConfirm = refName === 'passwordConfirm';
    
    if (isPasswordConfirm) {
      if (this.refs.password.value !== this.refs.passwordConfirm.value) {
        this.refs.passwordConfirm.setCustomValidity('Passwords do not match');
      } else {
        this.refs.passwordConfirm.setCustomValidity('');
      }
    }

    if (!validity.valid) {
      if (validity.valueMissing) {
        error.textContent = `${label} is a required field`; 
      } else if (validity.typeMismatch) {
        error.textContent = `${label} should be a valid email address`; 
      } else if (isPassword && validity.patternMismatch) {
        error.textContent = `${label} should be between ${this.refs.password.minLength}-${this.refs.password.maxLength} characters`; 
      } else if (isPassword && (validity.tooShort || validity.tooLong)) {
        error.textContent = `${label} should be between ${this.refs.password.minLength}-${this.refs.password.maxLength} characters`; 
      } else if (isPasswordConfirm && validity.customError) {
        error.textContent = 'Passwords do not match';
      }
      return false;
    }
    
    error.textContent = '';
    return true;
  }

  /* Render Method */
  render() {
    let creationLabel;
    if (!this.props.fromDashboard) {
      creationLabel = <h3>Create an account</h3>
    }

    const CustomContent = createStyledComponent('div', ({ theme }) => ({
      backgroundColor: theme.color_gray_20,
      margin: `${theme.space_stack_md} 0`,
      padding: theme.space_inset_lg,

      '&:last-child': {
        borderRadius: `0 0 ${theme.borderRadius_1} ${theme.borderRadius_1}`,
        marginBottom: `-${theme.space_stack_md}`
      }
    }));

    const teamCards = this.state.teamList.map(function (team) {
      return (
        <Card key={team.teamid}>
          <CardTitle>{team.name}</CardTitle>
          <CardBlock>{team.description}</CardBlock>
          <CustomContent>
            <Button onClick={this.toggleModal.bind(this,"addMember")}>Add Member</Button>
            <Button className="cardButtonSepMargin">Edit</Button>
            <Button className="cardButtonSepMargin">Delete</Button>
          </CustomContent>
        </Card>
      );
    }, this);

    const cardLayout = createStyledComponent('div');

    return(
      <div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <div className="col-md-12 profile-section">
          <Tabs>
            <Tab label={'Profile'}>
                <form className="col-md-4" noValidate onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input className="form-control"
                      type="text"
                      name="firstName"
                      ref="firstName"
                      placeholder="First Name *"
                      value={ this.state.firstName } 
                      onChange={ this.handleChange }
                      required />
                    <div className="error" id="firstNameError"></div>
                  </div>
                  <div className="form-group">
                    <input className="form-control"
                      type="text"
                      name="lastName"
                      ref="lastName"
                      placeholder="Last Name *"
                      value={ this.state.lastName } 
                      onChange={ this.handleChange }
                      required />
                    <div className="error" id="lastNameError"></div>
                  </div>
                  <div className="form-group">
                    <input className="form-control"
                      type="email"
                      name="email"
                      ref="email"
                      placeholder="Email *"
                      value={ this.state.email } 
                      onChange={ this.handleChange }
                      required />
                    <div className="error" id="emailError" />
                  </div>
                  <div className="form-group">
                    <input className="form-control"
                      type="password" 
                      name="oldPassword"
                      ref="oldPassword"
                      placeholder="Old Password *"
                      value={ this.state.oldPassword } 
                      onChange={ this.handleChange }
                      required />
                    <div className="error" id="oldPasswordError" />
                  </div>
                  <div className="form-group">
                    <input className="form-control"
                      type="password" 
                      name="password"
                      ref="password"
                      placeholder="New Password *"
                      value={ this.state.password } 
                      onChange={ this.handleChange }
                      required />
                    <div className="error" id="passwordError" />
                  </div>
                  <div className="form-group">
                    <input className="form-control"
                      type="password" 
                      name="passwordConfirm"
                      ref="passwordConfirm"
                      placeholder="New Password Confirm *"
                      value={ this.state.passwordConfirm } 
                      onChange={ this.handleChange }
                      required />
                    <div className="error" id="passwordConfirmError" />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-default form-control" onClick={ this.handleSubmit }>Update</button>
                  </div>
                </form>
            </Tab>
            <Tab label={'Teams'}>
              <Button className="pull-right" onClick={this.toggleModal.bind(this,"addTeam")}>+ ADD TEAM</Button>
              <cardLayout className="cardLayout">
                {teamCards}
              </cardLayout>
            </Tab>
          </Tabs>
        </div>
        <AddTeamModal show={this.state.addTeamModalIsOpen}
          onClose={this.toggleModal.bind(this,"addTeam")}
          onConfirm={this.addTeamSuccess}>
        </AddTeamModal>
        <AddMemberModal show={this.state.addMemberModalIsOpen}
          onClose={this.toggleModal.bind(this,"addMember")}
          onConfirm={this.toggleModal.bind(this,"addMember")}>
        </AddMemberModal>
      </div>
    )
  }
}
