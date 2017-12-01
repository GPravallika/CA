import React from 'react'
import AceEditor from 'react-ace'
import { Link } from 'react-router'
import { browserHistory } from 'react-router'
import ExportService from './ExportServices'
import ProjectService from '../d3/ProjectServices'
import AlertContainer from 'react-alert'
import Select from 'react-select'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import 'brace/mode/json'
import 'brace/theme/github'
import apiObj from '../utils/ApiServices'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      options : [
        { exportType: 'Swagger', label: 'Swagger 2.0'},
        { exportType: 'Postman', label: 'Postman'},
      ],
      "exportType":"Swagger",
      projectDetailsData: {} 
    };
    this.alertOptions = AlertOptions;
    this.handleDownload = this.handleDownload.bind(this);
  }

  /* Component Initialisation */
  componentDidMount() {
    this.getSwaggerResponse(false);
    let sketchId = sessionStorage.getItem('sketchId');
    let prjSrvGetPrjDetRes = null;
    ProjectService.getProjectDetails(sketchId)
    .then((response) => {
      prjSrvGetPrjDetRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvGetPrjDetRes.ok) {
        this.setState({
          projectDetailsData: responseData
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvGetPrjDetRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Method to get Swagger Response */
  getSwaggerResponse (download) {
    let expSrvgetSwaggerRes = null;
    let sketchId = JSON.parse(sessionStorage.getItem('sketchId'));
    ExportService.getSwaggerJSON(sketchId,download)
      .then((response) => {
        expSrvgetSwaggerRes = response.clone();
        return response.json();
      })
      .then((responseData) => {
        if(expSrvgetSwaggerRes.ok) {
          if(!download) {
            this.setState({
              "apiData" : JSON.stringify(responseData, null, 2),
              "downloadType": "swagger"
            });
          }
          if(download) {
            var a = document.createElement('a');
            a.href = 'data:attachment/json,' + encodeURI(JSON.stringify(responseData, null, 2));
            a.target = '_blank';
            a.download = 'swagger.json';
            a.click();
          }
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          if(expSrvgetSwaggerRes.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  /* Method to get PostMan Response */
  getPostManResponse(download) {
    let expSrvgetPostmanRes = null;
    let sketchId = JSON.parse(sessionStorage.getItem('sketchId'));
    ExportService.getPostmanJSON(sketchId,download)
    .then((response) => {
      expSrvgetPostmanRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(expSrvgetPostmanRes.ok) {
        if(!download) {
          this.setState({
            "apiData" : JSON.stringify(responseData, null, 2),
            "downloadType": "postman"
          });
        }
        if(download) {
          var a = document.createElement('a');
          a.href = 'data:attachment/json,' + encodeURI(JSON.stringify(responseData, null, 2));
          a.target = '_blank';
          a.download = 'postman.json';
          a.click();
        }
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(expSrvgetPostmanRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Method to handle download swagger or postman*/
  handleDownload() {
    if(this.state.downloadType === 'postman') {
      this.getPostManResponse(true);
    } else {
      this.getSwaggerResponse(true);
    }
  }

  /* Method to select export type */
  changeExportType(val) {
    this.setState({
      exportType: val.exportType
    });
    if(val.exportType === 'Postman') {
      this.getPostManResponse(false);
    } else {
      this.getSwaggerResponse(false);
    }
  }

  /* Render Method */
  render() {
    let exportComponent;
    var selectedSketch = JSON.parse(sessionStorage.getItem('selectedSketch'));
    var projectHeader = (selectedSketch) ? <div>
      <h2>{selectedSketch["name"]}</h2>
      <h3>{selectedSketch["description"]}</h3>
      </div> : null;

    if(this.state && this.state.apiData ) {
      exportComponent = 
        <div>
          <div className="col-md-12 download-option">
            <div className="col-md-2 col-md-offset-8">
              <Select
                name="form-field-name"
                value={this.state.exportType}
                valueKey='exportType'
                options={this.state.options}
                onChange={this.changeExportType.bind(this)}
              />
              </div>
            <div className="col-md-2">
              <button onClick={ this.handleDownload } className="btn btn-default">Download JSON</button>
            </div>
          </div>
          <div className="col-md-12 ace-editor">
            <div className="col-md-offset-1 col-md-8">
              <AceEditor
                mode="json"
                theme="github"
                width="100%"
                height="100%"
                setOptions={{
                  tabSize: 2,
                  fontSize: 14,
                  showGutter: true,
                  showPrintMargin: false,
                  maxLines: 30
                }}
                readOnly = {true}
                value={this.state.apiData}
                name="other-request"
                editorProps={{$blockScrolling: 'INFINITY'}}
              />
            </div>
          </div>
        </div>
    } else {
      exportComponent = <div className="text-center loading-project-details">Loading...</div>
    }
    return (<div>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      <div className="titleContainer sketchPage">
        {projectHeader}
      </div>
      <div className="tabsContainer">
        <ul className="tabs">
          <li className={this.props.location.pathname === '/vocabulary' ? 'tab active-tab': 'tab'}><Link to="/vocabulary">VOCABULARY</Link></li>
          <li className={this.props.location.pathname === '/nodes/edit' ? 'tab active-tab': 'tab'}><Link to="/nodes/edit">SKETCH</Link></li>
          <li className={this.props.location.pathname === '/share' ? 'tab active-tab': 'tab'}><Link to="/share">TEAMS</Link></li>
          <li className={this.props.location.pathname === '/export' ? 'tab active-tab': 'tab'}><Link to="/export">EXPORT</Link></li>
        </ul>
      </div>
      <div className="col-md-12 sketch-list-wrapper">
        {exportComponent}
      </div>
    </div>)
  }
}
