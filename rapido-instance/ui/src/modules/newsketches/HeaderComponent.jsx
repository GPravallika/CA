import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import TextInput from 'mineral-ui/TextInput';
import  Button from 'mineral-ui/Button';

export  class HeaderComponent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.alertOptions = AlertOptions;
      }


      render() {

        return (
            
             <div className="sketches-rectangle col-md-12">
                         <div className="sketches-search-text col-md-7">Sketches</div>
                        <div className="col-md-5">

                        <ul className="button-inline">
  <li ><TextInput type="text" className="search-textbox" size="small" placeholder="Search Sketches..." /></li>
  <li className="xs-pl-10 xs-pt-5"><img src="/ui/src/images/shape.png" /></li>
  <li className="xs-pl-10"><Button className="new-sketch-text">New Sketch</Button></li>
</ul>
                        {/* <TextInput type="text" className="search-textbox" size="small" defaultValue="Search Sketches..." />
                        <img src="/ui/src/images/shape.png" />
                       <span><Button className="new-sketch-text">New Sketch</Button> </span> */}
                        </div>

                          </div>
        
        )
      }

}