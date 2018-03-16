import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions'
import TextInput from 'mineral-ui/TextInput';
import Button from 'mineral-ui/Button';

export class HeaderComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isSearchOpen: false };
    this.alertOptions = AlertOptions;
  }
  openCloseSearch() {
    this.setState({
      isSearchOpen: !this.state.isSearchOpen
    })
  }
  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId','null');
    sessionStorage.setItem('sketchName','null');
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }
  render() {

    return (

      <div className="sketches-rectangle col-md-12">
        <div className="sketches-search-text col-md-7">Sketches</div>
        <div className="col-md-5">

          <ul className="button-inline">
            {this.state.isSearchOpen == true ? <li ><TextInput type="text" className=" visible search-textbox" onChange={this.props.onChange} size="small" placeholder="Search Sketches..." /></li> : <li id="searchButton"><TextInput type="text" className="hidden search-textbox" onChange={this.props.onChange} size="small" placeholder="Search Sketches..." /></li>}

            <li className="xs-pl-10 xs-pt-5 cursor" onClick={this.openCloseSearch.bind(this)}><img src="/ui/src/images/shape.png" /></li>
            <li className="xs-pl-10" onClick={this.addNewSketch.bind(this)}><Button className="new-sketch-text">New Sketch</Button></li>
          </ul>
        </div>

      </div>

    )
  }

}