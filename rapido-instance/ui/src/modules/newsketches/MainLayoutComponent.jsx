import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import { showAlert, AlertOptions } from '../utils/AlertActions';
import { SketchesComponent } from "./SketchesComponent";
import { TeamComponent } from "./TeamComponent";
import SketchService from './SketchServices'

export default class extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
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
                if (sktGetPrjSrvRes.ok) {
                    this.setState({
                        "sketchesData": responseData.personal
                    });
                } else {
                    showAlert(this, (responseData.message) ? responseData.message : "Error occured");
                    if (sktGetPrjSrvRes.status == 401) {
                        sessionStorage.removeItem('user')
                        sessionStorage.removeItem('token')
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div className="col-md-12 main-content">
                <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                <div className="col-md-12">
                    <SketchesComponent sketches={this.state.sketchesData} />
                </div>
               {/* <div className="col-md-3">
                    <TeamComponent />
                </div>
            */} 

            </div>




        )
    }

}