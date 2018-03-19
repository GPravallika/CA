import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions';
import Dropdown from 'mineral-ui/Dropdown';
import Button from 'mineral-ui/Button';
import { ThemeProvider } from 'mineral-ui/themes';
import Select from 'react-select';
import TextInput from 'mineral-ui/TextInput';

export class SketchesSortComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.alertOptions = AlertOptions;
  }
  openCloseSearch() {
    this.setState({
      isSearchOpen: !this.state.isSearchOpen
    })
  }
  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId', 'null');
    sessionStorage.setItem('sketchName', 'null');
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }

  render() {

    return (
      <div className="col-md-12">

        <div className="col-md-6 pull-left">
          <ul className="button-inline">
          <li  onClick={this.addNewSketch.bind(this)}><Button className="new-sketch-text"  variant="regular" primary>New Sketch</Button></li>
            <li className="xs-pl-10"><TextInput type="text" className=" visible search-textbox" onChange={this.props.onChange} size="small"
             placeholder="Search Sketches..." /></li>
          </ul>
        </div>
        <div className=" pull-right">
          <label className="view-text">View&nbsp;&nbsp;:&nbsp;&nbsp;</label>
          <select
            name="form-field-name"
            className="custom-select">
            <option className="custom-select-option">All</option>
            <option className="custom-select-option">Personal</option>
            <option className="custom-select-option">Shared</option>
          </select>
        <span className="xs-pl-10">
          <label className="view-text">Filter&nbsp;&nbsp;:&nbsp;&nbsp;</label>
          <select
            name="form-field-name"
            className="custom-select">
            <option className="custom-select-option">Apps Team</option>
            <option className="custom-select-option">Dev Team</option>
            <option className="custom-select-option">API Experts</option>
          </select>
          <span className="anchor-tag"><a>&nbsp;&nbsp;Clear</a></span>
    </span> 
      <span className="xs-pl-10 xs-pr-15">
          <label className="view-text">Sort By&nbsp;:&nbsp;</label>
          <span className="xs-pl-5"><Button className="activeButton" size="small" primary>Created</Button></span>
          <span className="xs-pl-5"><Button size="small" className="inactiveButton" disabled>Updated</Button></span>
          <span className="xs-pl-5"><Button size="small" className="inactiveButton" disabled>Name</Button></span>
          </span>
        </div>
    
      </div>

    )
  }

}