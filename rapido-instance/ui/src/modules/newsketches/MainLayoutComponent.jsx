import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions';
import {SketchesComponent} from "./SketchesComponent";
import {TeamComponent} from "./TeamComponent";

export default class extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.alertOptions = AlertOptions;
      }


      render() {

        return (
            <div className="col-md-12 new-sketch-containter main-content">
             <div className="col-md-9">

                 <SketchesComponent/>
             </div>
             <div className="col-md-3">
                  <TeamComponent/>
             </div>

                </div>
        
        
        
        
        )
      }

}